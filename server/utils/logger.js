/**
 * Enhanced Logger Utility for SkillTrade Server
 * Provides structured logging with timestamps and log levels
 */

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.logLevel];
  }

  writeLog(level, message, meta = {}) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Console output
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      case 'INFO':
        console.log(formattedMessage);
        break;
      case 'DEBUG':
        console.debug(formattedMessage);
        break;
    }

    // File output (if enabled)
    if (this.logToFile) {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    }
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? { 
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      ...meta 
    } : meta;
    this.writeLog('ERROR', message, errorMeta);
  }

  warn(message, meta = {}) {
    this.writeLog('WARN', message, meta);
  }

  info(message, meta = {}) {
    this.writeLog('INFO', message, meta);
  }

  debug(message, meta = {}) {
    this.writeLog('DEBUG', message, meta);
  }

  // HTTP request logging middleware
  httpLogger() {
    return (req, res, next) => {
      const start = Date.now();
      const { method, url, ip } = req;
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        
        this.info('HTTP Request', {
          method,
          url,
          statusCode,
          ip,
          duration: `${duration}ms`,
          userAgent: req.get('User-Agent')
        });
      });
      
      next();
    };
  }

  // Database operation logging
  dbLog(operation, collection, result, error = null) {
    if (error) {
      this.error(`Database ${operation} failed`, error, { 
        operation, 
        collection 
      });
    } else {
      this.info(`Database ${operation} successful`, { 
        operation, 
        collection,
        resultCount: Array.isArray(result) ? result.length : 1
      });
    }
  }

  // Authentication logging
  authLog(action, userId, success, details = {}) {
    this.info(`Authentication ${action}`, {
      userId,
      success,
      action,
      ...details
    });
  }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectDb = require("./dbconfig");
const UserRoutes = require("./routes/UserRoutes");
const WorkerRoutes = require("./routes/WorkerRoutes");
const RequestRoutes = require("./routes/RequestRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const ServiceRoutes = require("./routes/ServiceRouter");
const cron = require("node-cron");
const https = require("https");
const logger = require("./utils/logger");

// Config dotenv before other imports
dotenv.config();

const app = express();

// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
app.use(logger.httpLogger());

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://skill-trade-next-15.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);  
    } else {
      logger.warn('CORS blocked origin:', origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Connect to database
ConnectDb().catch((error) => {
  logger.error('Failed to initialize database connection:', error);
  process.exit(1);
});

// API Routes
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/workers", WorkerRoutes);
app.use("/api/v1/request", RequestRoutes);
app.use("/api/v1/services", ServiceRoutes);
app.use("/api/v1/admin", AdminRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SkillTrade API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Health check with database status
app.get("/health", async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
      success: true,
      status: "healthy",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      status: "unhealthy",
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('404 Not Found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error('Express error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Keep-alive ping (only in production)
if (process.env.RENDER_URL && process.env.NODE_ENV === 'production') {
  cron.schedule("*/14 * * * *", () => { // Every 14 minutes
    https.get(process.env.RENDER_URL, (res) => {
      logger.info('Keep-alive ping successful', { statusCode: res.statusCode });
    }).on("error", (err) => {
      logger.error('Keep-alive ping failed:', err);
    });
  });
}

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  logger.info(`SkillTrade server running on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = app;

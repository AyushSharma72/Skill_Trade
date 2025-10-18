const mongoose = require("mongoose");
const logger = require("./utils/logger");

async function ConnectDb() {
  try {
    if (!process.env.DB_CONNECT) {
      throw new Error("DB_CONNECT environment variable is not defined");
    }

    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info("Successfully connected to MongoDB database");
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });
    
  } catch (error) {
    logger.error("Failed to connect to database:", error);
    // Don't exit the process in production, let the app handle gracefully
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
}

module.exports = ConnectDb;

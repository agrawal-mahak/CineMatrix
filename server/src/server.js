const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const initExpiredHoldsCron = require('./cron/releaseExpiredHolds');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Initialize Cron Job for releasing expired seat holds
initExpiredHoldsCron();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  CineMatrix Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`  Listening on Port: ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

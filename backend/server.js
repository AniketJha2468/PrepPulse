const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`PrepPulse Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => process.exit(0));
  });
};

startServer();

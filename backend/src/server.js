const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

// Starts HTTP server without blocking on database initialization.
const startServer = async () => {
  try {
    app.listen(env.port, () => {
      console.log(`Backend server listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Closes DB pool on termination signals to avoid dangling connections.
const shutdown = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Failed to close DB pool:', error.message);
  } finally {
    process.exit(0);
  }
};

// Graceful shutdown hooks for local stop and process managers.
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();

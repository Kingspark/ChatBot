const app = require('./app');
const env = require('./config/env');
const { ensureSchema, pool } = require('./config/database');
const { runMigrations } = require('../scripts/migrationRunner');

// Bootstraps DB schema then starts HTTP server.
const startServer = async () => {
  try {
    if (env.runMigrationsOnBoot) {
      await runMigrations({
        host: env.mysqlHost,
        port: env.mysqlPort,
        user: env.mysqlUser,
        password: env.mysqlPassword,
        database: env.mysqlDatabase,
      });
      console.log('Database migrations applied on startup.');
    }

    try {
      await ensureSchema();
    } catch (schemaError) {
      console.warn('ensureSchema warning (non-fatal):', schemaError.message);
    }

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

const mysql = require('mysql2/promise');
const env = require('./env');

// Shared MySQL connection pool used by repository/store modules.
const pool = mysql.createPool({
  host: env.mysqlHost,
  port: env.mysqlPort,
  user: env.mysqlUser,
  password: env.mysqlPassword,
  database: env.mysqlDatabase,
  waitForConnections: true,
  connectionLimit: env.mysqlConnectionLimit,
  queueLimit: 0,
});

// Ensures required tables exist at server startup.
const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      role ENUM('user', 'assistant') NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

module.exports = {
  pool,
  ensureSchema,
};
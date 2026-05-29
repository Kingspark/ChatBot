const dotenv = require('dotenv');

// Loads values from .env into process.env before creating config.
dotenv.config();

const parseBoolean = (value, fallback = false) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
};

// Centralized runtime configuration with safe local defaults.
const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3777),
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  runMigrationsOnBoot: parseBoolean(process.env.RUN_MIGRATIONS_ON_BOOT, false),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  geminiApiBaseUrl:
    process.env.GEMINI_API_BASE_URL ||
    'https://generativelanguage.googleapis.com/v1beta',
  mysqlHost: process.env.MYSQL_HOST || '127.0.0.1',
  mysqlPort: Number(process.env.MYSQL_PORT || 3306),
  mysqlUser: process.env.MYSQL_USER || 'root',
  mysqlPassword: process.env.MYSQL_PASSWORD || '',
  mysqlDatabase: process.env.MYSQL_DATABASE || 'chatbot_db',
  mysqlConnectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
};

module.exports = env;
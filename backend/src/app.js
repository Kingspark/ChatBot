const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const corsOrigins = [
  'https://chatgpt.antenehalemayehu.com',
  'https://royalblue-oryx-851126.hostingersite.com',
  ...env.corsOrigin
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean),
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  optionsSuccessStatus: 200,
};

// Global middleware for CORS and JSON parsing.
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Lightweight readiness endpoint for local/dev checks.
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

// Mounts chat API under configured prefix (default: /api/chat).
app.use(`${env.apiPrefix}/chat`, chatRoutes);

// Must be registered last to catch forwarded route/controller errors.
app.use(errorHandler);

module.exports = app;

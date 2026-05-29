const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

const corsOrigins = env.corsOrigin
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Global middleware for CORS and JSON parsing.
app.use(
  cors({
    origin: corsOrigins.includes('*') ? '*' : corsOrigins,
  })
);
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

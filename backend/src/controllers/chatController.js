const { listConversations, sendMessage } = require('../services/chatService');
const { HttpError } = require('../utils/httpError');

// Returns the full chat history used by the frontend message list.
const getConversations = async (req, res, next) => {
  try {
    const conversations = await listConversations();

    res.status(200).json({
      success: true,
      data: {
        conversations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Accepts a user prompt, validates it, and returns the persisted
// user+assistant pair after the service calls Gemini.
const postConversation = async (req, res, next) => {
  try {
    const { question } = req.body || {};

    // Guard clause: reject missing/blank prompt with a client error.
    if (!question || typeof question !== 'string' || !question.trim()) {
      throw new HttpError(400, 'question is required and must be a non-empty string.');
    }

    const result = await sendMessage(question.trim());

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Keep a clear server-side signal if API key configuration is missing.
    if (!error.status && error.message?.includes('GEMINI_API_KEY')) {
      error.status = 500;
    }
    next(error);
  }
};

module.exports = {
  getConversations,
  postConversation,
};

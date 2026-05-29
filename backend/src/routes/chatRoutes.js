const express = require('express');
const {
  getConversations,
  postConversation,
} = require('../controllers/chatController');

const router = express.Router();

// Chat history fetch and prompt submission endpoints.
router.get('/conversations', getConversations);
router.post('/conversations', postConversation);

module.exports = router;

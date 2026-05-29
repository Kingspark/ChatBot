const {
  getAllConversations,
  getRecentConversations,
  createConversation,
  getRecentUserMessages,
} = require('../store/conversationStore');
const { generateAssistantResponse } = require('./geminiService');

const namePatterns = [
  /\bmy name is\s+([a-z][a-z\s'-]{0,39})\b/i,
  /\bi am\s+([a-z][a-z\s'-]{0,39})\b/i,
  /\bi'm\s+([a-z][a-z\s'-]{0,39})\b/i,
  /\bcall me\s+([a-z][a-z\s'-]{0,39})\b/i,
];

const asksForName = question => {
  return /\b(what\s+is|what's|tell\s+me)\s+my\s+name\b/i.test(question);
};

const extractName = text => {
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim().replace(/[.!?,;:]+$/, '');
    }
  }

  return '';
};

const findLatestKnownName = async () => {
  const recentUserMessages = await getRecentUserMessages(200);

  for (const message of recentUserMessages) {
    const extracted = extractName(message.content || '');
    if (extracted) {
      return extracted;
    }
  }

  return '';
};

// Service read path for chat history endpoint.
const listConversations = async () => {
  const conversations = await getAllConversations();
  return conversations;
};

// Main write path: gather context, call LLM, then persist both messages.
const sendMessage = async question => {
  // Keep prompt context limited to recent history for lower latency/cost.
  const history = await getRecentConversations(20);
  let assistantText;

  if (asksForName(question)) {
    const knownName = await findLatestKnownName();
    assistantText = knownName
      ? `Your name is ${knownName}.`
      : "I don't know your name yet. Tell me by saying 'My name is ...'.";
  } else {
    assistantText = await generateAssistantResponse({
      history,
      question,
    });
  }

  // Save user and assistant messages as separate rows for retrieval.
  const userConversation = await createConversation({
    role: 'user',
    content: question,
  });

  const assistantConversation = await createConversation({
    role: 'assistant',
    content: assistantText,
  });

  return {
    userConversation,
    assistantConversation,
  };
};

module.exports = {
  listConversations,
  sendMessage,
};
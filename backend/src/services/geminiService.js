const axios = require('axios');
const env = require('../config/env');

// Gemini uses "model" for assistant replies and "user" for user messages.
const toGeminiRole = role => (role === 'assistant' ? 'model' : 'user');

// Builds Gemini REST payload from persisted history + latest user prompt.
const buildGeminiContents = (history, question) => {
  const historyItems = history.map(item => ({
    role: toGeminiRole(item.role),
    parts: [{ text: item.content }],
  }));

  return [
    ...historyItems,
    {
      role: 'user',
      parts: [{ text: question }],
    },
  ];
};

// Extracts plain text from the first Gemini candidate response.
const extractText = responseData => {
  return (
    responseData?.candidates?.[0]?.content?.parts
      ?.map(part => part.text)
      .filter(Boolean)
      .join('\n') || ''
  );
};

// Calls Gemini generateContent and returns assistant text.
const generateAssistantResponse = async ({ history, question }) => {
  if (!env.geminiApiKey) {
    throw new Error('Missing GEMINI_API_KEY in backend environment variables.');
  }

  const url = `${env.geminiApiBaseUrl}/models/${env.geminiModel}:generateContent`;

  const response = await axios.post(
    url,
    {
      contents: buildGeminiContents(history, question),
    },
    {
      params: { key: env.geminiApiKey },
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const text = extractText(response.data).trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
};

module.exports = {
  generateAssistantResponse,
};
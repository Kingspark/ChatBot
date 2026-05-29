const { pool } = require('../config/database');

// Normalizes DB rows to the API shape used by controllers/frontend.
const mapConversationRow = row => ({
  id: Number(row.id),
  role: row.role,
  content: row.content,
  createdAt: row.created_at,
});

// Returns the full conversation history in chronological order.
const getAllConversations = async () => {
  const [rows] = await pool.query(
    `SELECT id, role, content, created_at
     FROM conversations
     ORDER BY id ASC`
  );

  return rows.map(mapConversationRow);
};

// Returns recent messages for LLM context with a bounded safety limit.
const getRecentConversations = async (limit = 20) => {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 100)) : 20;

  const [rows] = await pool.query(
    `SELECT id, role, content, created_at
     FROM conversations
     ORDER BY id DESC
     LIMIT ?`,
    [safeLimit]
  );

  return rows.reverse().map(mapConversationRow);
};

// Persists one message and returns the inserted record.
const createConversation = async ({ role, content }) => {
  const [result] = await pool.query(
    `INSERT INTO conversations (role, content)
     VALUES (?, ?)`,
    [role, content]
  );

  const [rows] = await pool.query(
    `SELECT id, role, content, created_at
     FROM conversations
     WHERE id = ?
     LIMIT 1`,
    [result.insertId]
  );

  return mapConversationRow(rows[0]);
};

// Returns recent user-only messages to infer stable profile hints (for example, name).
const getRecentUserMessages = async (limit = 200) => {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(limit, 500)) : 200;

  const [rows] = await pool.query(
    `SELECT id, role, content, created_at
     FROM conversations
     WHERE role = 'user'
     ORDER BY id DESC
     LIMIT ?`,
    [safeLimit]
  );

  return rows.map(mapConversationRow);
};

module.exports = {
  getAllConversations,
  getRecentConversations,
  createConversation,
  getRecentUserMessages,
};
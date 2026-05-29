# Backend (Express + MySQL + Gemini)

## Architecture Mapping
- Frontend calls backend: `POST /api/chat/conversations`
- Backend loads recent history from MySQL
- Backend sends prompt + history to Gemini using Axios
- Backend saves both user + assistant messages in MySQL
- Backend returns response to frontend

## Setup
1. Copy `.env.example` to `.env` and set your values.
2. Create the database and table using `sql/schema.sql`.
3. Install packages:
   - `npm install`
4. Start the server:
   - `npm run dev`

## Endpoints
- `GET /health`
- `GET /api/chat/conversations`
- `POST /api/chat/conversations`
  - Body: `{ "question": "your prompt" }`

## Response Contract
- `GET` returns:
  - `{ success: true, data: { conversations: [...] } }`
- `POST` returns:
  - `{ success: true, data: { userConversation, assistantConversation } }`

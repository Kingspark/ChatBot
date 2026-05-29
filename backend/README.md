# Backend (Express + MySQL + Gemini)

## Overview
- Frontend calls backend: POST /api/chat/conversations
- Backend loads recent history from MySQL
- Backend sends prompt + history to Gemini using Axios
- Backend saves user + assistant messages in MySQL
- Backend returns the response to frontend

## Environment Setup
1. Copy .env.example to .env.
2. Set MySQL and Gemini values in .env.

Important production variables:
- NODE_ENV=production
- PORT=3777
- API_PREFIX=/api
- CORS_ORIGIN=https://your-frontend-domain.com
- RUN_MIGRATIONS_ON_BOOT=false

## Install
1. Run npm install

## Database Migrations
Migration files live in backend/sql/migrations.

Commands:
- npm run migrate
- npm run migrate:status

Notes:
- Migrations are tracked in the schema_migrations table.
- Do not edit an already-applied migration file. Add a new numbered migration instead.
- Optional: set RUN_MIGRATIONS_ON_BOOT=true to auto-run migrations when server starts.

## Start
- Development: npm run dev
- Production: npm start

## Endpoints
- GET /health
- GET /api/chat/conversations
- POST /api/chat/conversations
  - Body: { "question": "your prompt" }

## Response Contract
- GET returns: { success: true, data: { conversations: [...] } }
- POST returns: { success: true, data: { userConversation, assistantConversation } }

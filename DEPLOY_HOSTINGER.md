# Deploy to Hostinger (Backend + Frontend)

This guide prepares the current ChatBot project for deployment on Hostinger.

## 1. Requirements
- A Hostinger hosting plan that supports Node.js for backend runtime.
- A MySQL database provisioned in Hostinger.
- A domain or subdomain for frontend and backend.

Suggested split:
- Frontend: https://chat.your-domain.com
- Backend API: https://api.your-domain.com

## 2. Backend Deployment

### 2.1 Prepare Environment Variables
In backend/.env on the server, set values like:

NODE_ENV=production
PORT=3777
API_PREFIX=/api
CORS_ORIGIN=https://chat.your-domain.com
RUN_MIGRATIONS_ON_BOOT=false

MYSQL_HOST=your_hostinger_mysql_host
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=chatbot_db
MYSQL_CONNECTION_LIMIT=10

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta

### 2.2 Install and Migrate
From backend directory on the server:

npm install
npm run migrate
npm run migrate:status

Migrations are in backend/sql/migrations and tracked in schema_migrations.

### 2.3 Run Backend
Start app:

npm start

Use your Hostinger Node.js app settings or process manager to keep it running.

### 2.4 Verify Backend
Health check endpoint:

GET /health

## 3. Frontend Deployment

### 3.1 Set Production API URL
In frontend/.env.production:

VITE_API_BASE_URL=https://api.your-domain.com/api

### 3.2 Build
From frontend directory:

npm install
npm run build

### 3.3 Publish
Upload frontend/dist contents to your frontend host root (for example public_html if serving from shared hosting).

If using client-side routes later, add an .htaccess rewrite for SPA fallback.

## 4. Post-Deployment Checklist
- Frontend loads successfully.
- Frontend requests reach backend API domain.
- Backend returns 200 on /health.
- Chat can send and receive messages.
- New rows appear in conversations table.
- CORS only allows trusted frontend domain in production.

## 5. Ongoing Database Changes
For each schema change:
1. Add new migration file in backend/sql/migrations with next number prefix, for example 002_add_indexes.sql.
2. Deploy code.
3. Run npm run migrate on server.
4. Confirm with npm run migrate:status.

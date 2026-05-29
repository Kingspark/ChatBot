# Frontend (React + Vite)

## Setup
1. Copy .env.example to .env for local development.
2. Install packages with npm install.
3. Start development server with npm run dev.

## Environment Variables
- VITE_API_BASE_URL
	- Local example: http://localhost:3777/api
	- Production example: https://api.your-domain.com/api

## Build for Production
1. Set VITE_API_BASE_URL to your deployed backend API URL.
2. Run npm run build.
3. Upload the generated dist folder to your static host or Hostinger public_html.

## Useful Commands
- npm run dev
- npm run build
- npm run preview

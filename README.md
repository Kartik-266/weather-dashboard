# Live Weather Dashboard — Full Stack Project

Portfolio-ready weather app built by Kartik Bansal.

## Structure
- `/frontend` — single-file HTML app (Tailwind + Chart.js)
- `/backend` — Node.js Express proxy to hide API keys

## Features
- Auto GPS detection with high accuracy
- Live weather + 24h chart + 5-day forecast
- °C/°F toggle
- Search history
- Backend proxy for OpenWeatherMap

## Quick start
### Frontend only (no key needed)
```bash
cd frontend
# open index.html
```

### With backend
```bash
cd backend
npm install
cp .env.example .env
# add WEATHER_API_KEY
npm run dev
```

Then update frontend fetch URL to point to localhost:3001

## Deploy
- Frontend: Vercel / Netlify (drag frontend folder)
- Backend: Render / Railway (set WEATHER_API_KEY env)

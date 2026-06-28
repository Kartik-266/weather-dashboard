# Weather Dashboard Backend Proxy

Simple Express server to hide your OpenWeatherMap API key.

## Why you need this
Your frontend currently calls Open-Meteo directly (no key). For a portfolio, interviewers want to see you handle secrets properly. This proxy:
- Keeps API_KEY in .env (never shipped to browser)
- Adds CORS, error handling, rate-limit ready
- Normalizes data for your frontend

## Setup
1. cd weather-backend
2. npm install
3. cp .env.example .env
4. Add your key from https://openweathermap.org/api
5. npm run dev

## Endpoints
- GET /health
- GET /weather?city=Indore&units=metric
- GET /weather?lat=22.7&lon=75.8&units=imperial

## Frontend change
In your dashboard JS, replace:
```js
fetch(`https://api.open-meteo.com/...`)
```
with:
```js
fetch(`http://localhost:3001/weather?city=${encodeURIComponent(city)}&units=${unit==='f'?'imperial':'metric'}`)
```

Deploy backend to Render/Railway, set WEATHER_API_KEY in dashboard, update frontend URL.

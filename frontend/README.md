# Weather Dashboard Frontend

Clean, glassmorphism weather dashboard with:
- Auto GPS location on load
- °C/°F toggle (persists)
- 24-hour temperature chart (Chart.js)
- 5-day forecast
- Search history (localStorage)

## Run locally
Just open `index.html` in browser — it uses Open-Meteo (no key).

## Connect to backend
In `index.html`, find fetchWeather and replace with:
```js
fetch(`http://localhost:3001/weather?lat=${lat}&lon=${lon}&units=${unit}`)
```

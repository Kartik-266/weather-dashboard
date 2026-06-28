const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * GET /weather?city=Indore
 * Proxies to OpenWeatherMap to keep API key secret
 * Returns normalized data for your frontend
 */
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const units = req.query.units || 'metric'; // metric = °C, imperial = °F

  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server missing WEATHER_API_KEY' });
  }

  try {
    let latNum = lat, lonNum = lon, placeName = '';

    // If city provided, geocode first
    if (city && (!lat || !lon)) {
      const geoRes = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      const geo = await geoRes.json();
      if (!geo.length) return res.status(404).json({ error: 'City not found' });
      latNum = geo[0].lat;
      lonNum = geo[0].lon;
      placeName = `${geo[0].name}${geo[0].country ? ', ' + geo[0].country : ''}`;
    }

    if (!latNum || !lonNum) {
      return res.status(400).json({ error: 'Provide city or lat/lon' });
    }

    // One Call 3.0 (requires subscription) fallback to current + forecast
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&units=${units}&appid=${API_KEY}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latNum}&lon=${lonNum}&units=${units}&appid=${API_KEY}`)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Upstream weather API failed');
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // Normalize to match your frontend shape
    const normalized = {
      place: placeName || current.name,
      lat: latNum,
      lon: lonNum,
      current: {
        temp: Math.round(current.main.temp),
        feels_like: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        wind_speed: Math.round(current.wind.speed * (units === 'metric' ? 3.6 : 1)), // m/s to km/h or mph
        weather_code: current.weather[0].id,
        description: current.weather[0].description,
        icon: current.weather[0].icon
      },
      hourly: forecast.list.slice(0, 8).map(h => ({
        time: h.dt * 1000,
        temp: Math.round(h.main.temp)
      })),
      daily: (() => {
        // Group forecast by day, take max/min
        const days = {};
        forecast.list.forEach(item => {
          const d = new Date(item.dt * 1000).toDateString();
          if (!days[d]) days[d] = [];
          days[d].push(item.main.temp);
        });
        return Object.entries(days).slice(0, 5).map(([date, temps]) => ({
          date,
          max: Math.round(Math.max(...temps)),
          min: Math.round(Math.min(...temps))
        }));
      })(),
      units
    };

    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Weather proxy running on http://localhost:${PORT}`);
});

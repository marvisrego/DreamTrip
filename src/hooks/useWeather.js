import { useState, useEffect } from 'react'

export function useWeather(destination) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!destination) return

    async function fetchWeather() {
      setLoading(true)
      try {
        // 1. Get coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&format=json`)
        const geoData = await geoRes.json()

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error('Location not found')
        }

        const { latitude, longitude } = geoData.results[0]

        // 2. Get current weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        const weatherData = await weatherRes.json()

        if (weatherData.current_weather) {
          setWeather({
            temp: Math.round(weatherData.current_weather.temperature),
            windSpeed: weatherData.current_weather.windspeed,
            code: weatherData.current_weather.weathercode,
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [destination])

  // Simple WMO weather code mapping to lucid icons/names (simplified)
  let iconName = "sun"
  let conditionText = "Clear"
  if (weather) {
    if (weather.code <= 3) { conditionText = "Clear/Partly Cloudy"; iconName = "Sun"; }
    else if (weather.code <= 49) { conditionText = "Fog/Cloudy"; iconName = "Cloud"; }
    else if (weather.code <= 69) { conditionText = "Rain"; iconName = "CloudRain"; }
    else if (weather.code <= 79) { conditionText = "Snow"; iconName = "CloudSnow"; }
    else { conditionText = "Storm"; iconName = "CloudLightning"; }
  }

  return { weather, conditionText, iconName, loading, error }
}

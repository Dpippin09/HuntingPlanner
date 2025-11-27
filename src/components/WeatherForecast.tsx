import React, { useEffect, useState, useCallback } from 'react';
import { HuntingLocation, WeatherData } from '../types';
import './WeatherForecast.css';

interface WeatherForecastProps {
  location: HuntingLocation | null;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({
  location,
}) => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // First, get the grid point from the NWS API
      const pointResponse = await fetch(
        `https://api.weather.gov/points/${lat},${lng}`
      );
      
      if (!pointResponse.ok) {
        throw new Error('Unable to get weather data for this location');
      }
      
      const pointData = await pointResponse.json();
      const forecastUrl = pointData.properties.forecast;
      
      // Then, get the actual forecast
      const forecastResponse = await fetch(forecastUrl);
      
      if (!forecastResponse.ok) {
        throw new Error('Unable to get forecast data');
      }
      
      const forecastData = await forecastResponse.json();
      const periods = forecastData.properties.periods.slice(0, 7);
      
      const weatherData: WeatherData[] = periods.map((period: {
        name: string;
        temperature: number;
        temperatureUnit: string;
        shortForecast: string;
        windSpeed: string;
        icon: string;
      }) => ({
        date: period.name,
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        description: period.shortForecast,
        windSpeed: period.windSpeed,
        icon: period.icon,
      }));
      
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      setWeather([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location && location.latitude !== 0 && location.longitude !== 0) {
      fetchWeather(location.latitude, location.longitude);
    } else {
      setWeather([]);
    }
  }, [location, fetchWeather]);

  const getWeatherEmoji = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('sunny') || desc.includes('clear')) return '☀️';
    if (desc.includes('cloud') && desc.includes('partly')) return '⛅';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain') || desc.includes('shower')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
    if (desc.includes('fog') || desc.includes('mist')) return '🌫️';
    if (desc.includes('wind')) return '💨';
    return '🌤️';
  };

  return (
    <div className="weather-forecast">
      <h2>🌤️ Weather Forecast</h2>

      {!location && (
        <p className="no-location-message">
          Set a hunting location with coordinates to see the weather forecast.
        </p>
      )}

      {location && location.latitude === 0 && location.longitude === 0 && (
        <p className="no-location-message">
          Add latitude and longitude coordinates to see the weather forecast.
        </p>
      )}

      {loading && (
        <div className="loading">
          <span className="loading-spinner">⏳</span>
          <p>Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
          <p className="error-hint">
            Make sure your coordinates are within the United States.
          </p>
        </div>
      )}

      {!loading && !error && weather.length > 0 && (
        <div className="forecast-grid">
          {weather.map((day, index) => (
            <div key={index} className="forecast-card">
              <div className="forecast-day">{day.date}</div>
              <div className="forecast-icon">
                {getWeatherEmoji(day.description)}
              </div>
              <div className="forecast-temp">
                {day.temperature}°{day.temperatureUnit}
              </div>
              <div className="forecast-description">{day.description}</div>
              <div className="forecast-wind">💨 {day.windSpeed}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;

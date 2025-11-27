import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  CloudQueue,
  AcUnit,
  Grain,
  Air,
  Thermostat,
  Opacity,
  Refresh
} from '@mui/icons-material';
import { useHuntingTrip } from '../../context/HuntingTripContext';
import { WeatherData, WeatherForecast } from '../../types';

const WeatherMonitor: React.FC = () => {
  const { currentTrip, updateTrip } = useHuntingTrip();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Mock weather data for demonstration
  const mockWeatherData: WeatherData = {
    current: {
      temperature: 45,
      humidity: 65,
      windSpeed: 8,
      windDirection: 'NW',
      conditions: 'Partly Cloudy',
      icon: 'partly-cloudy'
    },
    forecast: [
      {
        date: new Date(),
        high: 52,
        low: 38,
        conditions: 'Partly Cloudy',
        icon: 'partly-cloudy',
        precipitation: 10,
        windSpeed: 8
      },
      {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        high: 48,
        low: 35,
        conditions: 'Cloudy',
        icon: 'cloudy',
        precipitation: 30,
        windSpeed: 12
      },
      {
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        high: 55,
        low: 42,
        conditions: 'Sunny',
        icon: 'sunny',
        precipitation: 0,
        windSpeed: 5
      },
      {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        high: 50,
        low: 40,
        conditions: 'Light Rain',
        icon: 'rain',
        precipitation: 70,
        windSpeed: 10
      },
      {
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        high: 46,
        low: 33,
        conditions: 'Partly Cloudy',
        icon: 'partly-cloudy',
        precipitation: 20,
        windSpeed: 7
      }
    ]
  };

  const fetchWeatherData = async () => {
    if (!currentTrip || !apiKey) {
      // Use mock data for demonstration
      if (currentTrip) {
        updateTrip(currentTrip.id, { weatherData: mockWeatherData });
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real application, you would call a weather API here
      // For now, we'll use the mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      updateTrip(currentTrip.id, { weatherData: mockWeatherData });
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sunny':
        return <WbSunny color="warning" />;
      case 'partly-cloudy':
        return <CloudQueue color="primary" />;
      case 'cloudy':
        return <Cloud color="action" />;
      case 'rain':
        return <Grain color="info" />;
      case 'snow':
        return <AcUnit color="info" />;
      default:
        return <WbSunny />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 70) return 'error';
    if (temp >= 50) return 'warning';
    if (temp >= 32) return 'success';
    return 'info';
  };

  const getHuntingConditions = (forecast: WeatherForecast[]) => {
    const avgTemp = forecast.reduce((sum, day) => sum + (day.high + day.low) / 2, 0) / forecast.length;
    const avgPrecip = forecast.reduce((sum, day) => sum + day.precipitation, 0) / forecast.length;
    const avgWind = forecast.reduce((sum, day) => sum + day.windSpeed, 0) / forecast.length;

    if (avgPrecip > 50) return { rating: 'Poor', color: 'error', reason: 'High precipitation expected' };
    if (avgWind > 15) return { rating: 'Fair', color: 'warning', reason: 'Strong winds expected' };
    if (avgTemp < 20 || avgTemp > 85) return { rating: 'Fair', color: 'warning', reason: 'Extreme temperatures' };
    if (avgPrecip < 20 && avgWind < 10) return { rating: 'Excellent', color: 'success', reason: 'Ideal conditions' };
    return { rating: 'Good', color: 'info', reason: 'Generally favorable conditions' };
  };

  useEffect(() => {
    if (currentTrip && !currentTrip.weatherData) {
      fetchWeatherData();
    }
  }, [currentTrip]);

  if (!currentTrip) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Please select or create a trip to view weather information.
        </Alert>
      </Box>
    );
  }

  const weather = currentTrip.weatherData;
  const huntingConditions = weather ? getHuntingConditions(weather.forecast) : null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Weather Monitor - {currentTrip.name}
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Location: {currentTrip.location.name}
      </Typography>

      {/* API Key Input */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather API Setup
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="OpenWeatherMap API Key (optional)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key for live weather data"
              size="small"
              sx={{ flexGrow: 1, minWidth: 250 }}
            />
            <Button
              variant="contained"
              onClick={fetchWeatherData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
            >
              {loading ? 'Loading...' : 'Refresh Weather'}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Without an API key, sample weather data will be displayed for demonstration.
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {weather && (
        <>
          {/* Current Weather */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Conditions
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Thermostat color="primary" />
                    <Box>
                      <Typography variant="h4">
                        {weather.current.temperature}°F
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {weather.current.conditions}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Opacity color="primary" />
                    <Typography variant="body1">
                      {weather.current.humidity}% Humidity
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Air color="primary" />
                    <Typography variant="body1">
                      {weather.current.windSpeed} mph {weather.current.windDirection}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Hunting Conditions Assessment */}
          {huntingConditions && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hunting Conditions Assessment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={huntingConditions.rating}
                    color={huntingConditions.color as any}
                    size="medium"
                  />
                  <Typography variant="body1">
                    {huntingConditions.reason}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  This assessment is based on average temperature, precipitation, and wind conditions over the forecast period.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* 5-Day Forecast */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                5-Day Forecast
              </Typography>
              <Grid container spacing={2}>
                {weather.forecast.map((day, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {index === 0 ? 'Today' : day.date.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                          {getWeatherIcon(day.icon)}
                        </Box>
                        <Typography variant="body2" align="center" gutterBottom>
                          {day.conditions}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {day.high}°
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {day.low}°
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="primary" align="center">
                          {day.precipitation}% rain
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          {day.windSpeed} mph
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {!weather && !loading && (
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" align="center">
              Weather data will appear here once loaded
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              Click "Refresh Weather" to load weather information for your trip location
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default WeatherMonitor;

/**
 * Weather API Service Layer
 * All requests now go through secure backend proxy
 */

import type { OpenWeatherResponse, OpenWeatherForecastResponse, WeatherData, ForecastData, DailyForecast } from '@/types/weather';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeCityName } from '@/lib/sanitize';

/**
 * Format Unix timestamp to local time string
 */
const formatTime = (timestamp: number, timezoneOffset: number = 0): string => {
  // Create a date object from the UTC timestamp
  const date = new Date(timestamp * 1000);
  
  // Add the timezone offset (in seconds) to get the local time
  const localTime = new Date(date.getTime() + timezoneOffset * 1000);
  
  return localTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC' // Use UTC since we already adjusted for timezone
  });
};

/**
 * Fetch current weather data by city name
 * Now fetches forecast data to get accurate min/max temperatures
 */
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const sanitizedCity = sanitizeCityName(city);
  if (!sanitizedCity) {
    throw new Error('Invalid city name');
  }

  // Fetch both current weather and forecast in parallel
  const [currentResult, forecastResult] = await Promise.all([
    supabase.functions.invoke('weather-proxy', {
      body: { type: 'weather-by-city', city: sanitizedCity }
    }),
    supabase.functions.invoke('weather-proxy', {
      body: { type: 'forecast', city: sanitizedCity }
    })
  ]);

  if (currentResult.error) {
    throw new Error(currentResult.error.message || 'Failed to fetch weather data');
  }

  const weatherData: OpenWeatherResponse = currentResult.data;
  
  // Get accurate min/max from forecast data (today's forecast)
  let minTemp = Math.round(weatherData.main.temp);
  let maxTemp = Math.round(weatherData.main.temp);
  
  if (!forecastResult.error && forecastResult.data) {
    const forecastData: OpenWeatherForecastResponse = forecastResult.data;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Filter forecast items for today
    const todayForecasts = forecastData.list.filter(item => {
      const itemDate = item.dt_txt.split(' ')[0];
      return itemDate === todayStr;
    });
    
    if (todayForecasts.length > 0) {
      const todayTemps = todayForecasts.map(f => f.main.temp);
      minTemp = Math.round(Math.min(...todayTemps));
      maxTemp = Math.round(Math.max(...todayTemps));
    }
  }

  // Calculate current local time in the city's timezone
  const now = Date.now() / 1000; // Current UTC time in seconds
  const currentLocalTime = Math.floor(now + weatherData.timezone);

  return {
    city: sanitizeCityName(weatherData.name),
    country: weatherData.sys.country,
    condition: weatherData.weather[0].main,
    temp: Math.round(weatherData.main.temp),
    minTemp,
    maxTemp,
    humidity: weatherData.main.humidity,
    windSpeed: Math.round(weatherData.wind.speed * 10) / 10,
    sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone),
    sunset: formatTime(weatherData.sys.sunset, weatherData.timezone),
    feelsLike: Math.round(weatherData.main.feels_like),
    pressure: weatherData.main.pressure,
    visibility: Math.round(weatherData.visibility / 1000), // Convert to km
    timezone: weatherData.timezone,
    currentLocalTime,
  };
};

/**
 * Fetch current weather data by coordinates
 * Now fetches forecast data to get accurate min/max temperatures
 */
export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  // Validate coordinates
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error('Invalid coordinates');
  }

  // Fetch both current weather and forecast in parallel
  const [currentResult, forecastResult] = await Promise.all([
    supabase.functions.invoke('weather-proxy', {
      body: { type: 'weather-by-coords', lat, lon }
    }),
    supabase.functions.invoke('weather-proxy', {
      body: { type: 'forecast-by-coords', lat, lon }
    })
  ]);

  if (currentResult.error) {
    throw new Error(currentResult.error.message || 'Failed to fetch weather data');
  }

  const weatherData: OpenWeatherResponse = currentResult.data;
  
  // Get accurate min/max from forecast data (today's forecast)
  let minTemp = Math.round(weatherData.main.temp);
  let maxTemp = Math.round(weatherData.main.temp);
  
  if (!forecastResult.error && forecastResult.data) {
    const forecastData: OpenWeatherForecastResponse = forecastResult.data;
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Filter forecast items for today
    const todayForecasts = forecastData.list.filter(item => {
      const itemDate = item.dt_txt.split(' ')[0];
      return itemDate === todayStr;
    });
    
    if (todayForecasts.length > 0) {
      const todayTemps = todayForecasts.map(f => f.main.temp);
      minTemp = Math.round(Math.min(...todayTemps));
      maxTemp = Math.round(Math.max(...todayTemps));
    }
  }

  // Calculate current local time in the city's timezone
  const now = Date.now() / 1000; // Current UTC time in seconds
  const currentLocalTime = Math.floor(now + weatherData.timezone);

  return {
    city: sanitizeCityName(weatherData.name),
    country: weatherData.sys.country,
    condition: weatherData.weather[0].main,
    temp: Math.round(weatherData.main.temp),
    minTemp,
    maxTemp,
    humidity: weatherData.main.humidity,
    windSpeed: Math.round(weatherData.wind.speed * 10) / 10,
    sunrise: formatTime(weatherData.sys.sunrise, weatherData.timezone),
    sunset: formatTime(weatherData.sys.sunset, weatherData.timezone),
    feelsLike: Math.round(weatherData.main.feels_like),
    pressure: weatherData.main.pressure,
    visibility: Math.round(weatherData.visibility / 1000),
    timezone: weatherData.timezone,
    currentLocalTime,
  };
};

/**
 * Fetch 5-day forecast with 3-hour intervals
 */
export const fetchForecastByCity = async (city: string): Promise<ForecastData> => {
  const sanitizedCity = sanitizeCityName(city);
  if (!sanitizedCity) {
    throw new Error('Invalid city name');
  }

  const { data, error } = await supabase.functions.invoke('weather-proxy', {
    body: { type: 'forecast', city: sanitizedCity }
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch forecast data');
  }

  const forecastData: OpenWeatherForecastResponse = data;
  
  // Group forecast by day
  const dailyMap = new Map<string, typeof forecastData.list>();
  
  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });

  const daily: DailyForecast[] = Array.from(dailyMap.entries()).map(([date, items]) => {
    const temps = items.map(i => i.main.temp);
    const minTemp = Math.round(Math.min(...temps));
    const maxTemp = Math.round(Math.max(...temps));
    const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
    
    // Use midday forecast for main condition
    const middayItem = items[Math.floor(items.length / 2)];
    
    return {
      date,
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      minTemp,
      maxTemp,
      avgTemp,
      condition: middayItem.weather[0].main,
      icon: middayItem.weather[0].icon,
      humidity: middayItem.main.humidity,
      windSpeed: Math.round(middayItem.wind.speed * 10) / 10,
      precipitation: Math.round(middayItem.pop * 100),
      hourly: items.map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
        precipitation: Math.round(item.pop * 100),
      })),
    };
  }).slice(0, 5); // Limit to 5 days

  return {
    city: sanitizeCityName(forecastData.city.name),
    country: forecastData.city.country,
    daily,
  };
};

/**
 * Fetch city suggestions for autocomplete
 */
export const fetchCitySuggestions = async (query: string): Promise<Array<{ name: string; country: string; state?: string; lat: number; lon: number }>> => {
  const sanitizedQuery = sanitizeCityName(query);
  if (!sanitizedQuery || sanitizedQuery.length < 2) return [];
  
  const { data, error } = await supabase.functions.invoke('weather-proxy', {
    body: { type: 'city-suggestions', query: sanitizedQuery }
  });

  if (error) return [];
  
  return data.map((item: any) => ({
    name: sanitizeCityName(item.name),
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon,
  }));
};

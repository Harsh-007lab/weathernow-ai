/**
 * Weather API Service Layer
 */

import type { OpenWeatherResponse, OpenWeatherForecastResponse, WeatherData, ForecastData, DailyForecast } from '@/types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "f395d91f1589f0b9aa6128ddb040fc14";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Format Unix timestamp to local time string
 */
const formatTime = (timestamp: number, timezoneOffset: number = 0): string => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: true 
  });
};

/**
 * Fetch current weather data by city name
 */
export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch weather data');
  }

  const data: OpenWeatherResponse = await response.json();
  
  return {
    city: data.name,
    country: data.sys.country,
    condition: data.weather[0].main,
    temp: Math.round(data.main.temp),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    sunrise: formatTime(data.sys.sunrise, data.timezone),
    sunset: formatTime(data.sys.sunset, data.timezone),
    feelsLike: Math.round(data.main.feels_like),
    pressure: data.main.pressure,
    visibility: Math.round(data.visibility / 1000), // Convert to km
  };
};

/**
 * Fetch current weather data by coordinates
 */
export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch weather data');
  }

  const data: OpenWeatherResponse = await response.json();
  
  return {
    city: data.name,
    country: data.sys.country,
    condition: data.weather[0].main,
    temp: Math.round(data.main.temp),
    minTemp: Math.round(data.main.temp_min),
    maxTemp: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    sunrise: formatTime(data.sys.sunrise, data.timezone),
    sunset: formatTime(data.sys.sunset, data.timezone),
    feelsLike: Math.round(data.main.feels_like),
    pressure: data.main.pressure,
    visibility: Math.round(data.visibility / 1000),
  };
};

/**
 * Fetch 5-day forecast with 3-hour intervals
 */
export const fetchForecastByCity = async (city: string): Promise<ForecastData> => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to fetch forecast data');
  }

  const data: OpenWeatherForecastResponse = await response.json();
  
  // Group forecast by day
  const dailyMap = new Map<string, typeof data.list>();
  
  data.list.forEach(item => {
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
    
    // Use midday forecast for main condition
    const middayItem = items[Math.floor(items.length / 2)];
    
    return {
      date,
      dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      minTemp,
      maxTemp,
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
    city: data.city.name,
    country: data.city.country,
    daily,
  };
};

/**
 * Fetch city suggestions for autocomplete
 */
export const fetchCitySuggestions = async (query: string): Promise<Array<{ name: string; country: string; state?: string; lat: number; lon: number }>> => {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  
  if (!response.ok) return [];
  
  const data = await response.json();
  return data.map((item: any) => ({
    name: item.name,
    country: item.country,
    state: item.state,
    lat: item.lat,
    lon: item.lon,
  }));
};

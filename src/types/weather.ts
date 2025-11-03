/**
 * Weather API Response Types
 */

export interface WeatherData {
  city: string;
  country: string;
  condition: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  timezone: number; // Timezone offset in seconds
  currentLocalTime: number; // Current time in city's timezone (Unix timestamp)
  uv?: number;
  airQuality?: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  hourly: HourlyForecast[];
}

export interface ForecastData {
  city: string;
  country: string;
  daily: DailyForecast[];
}

export interface OpenWeatherResponse {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
  timezone: number;
  cod: number;
}

export interface OpenWeatherForecastResponse {
  city: {
    name: string;
    country: string;
    timezone: number;
  };
  list: Array<{
    dt: number;
    dt_txt: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      feels_like: number;
      pressure: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    pop: number; // Probability of precipitation
  }>;
  cod: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export type Theme = 'light' | 'dark' | 'auto';

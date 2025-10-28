import { useQuery } from '@tanstack/react-query';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecastByCity } from '@/api/weatherApi';
import type { WeatherData, ForecastData } from '@/types/weather';

/**
 * Custom hook for fetching current weather data by city
 */
export const useWeather = (city: string | null, enabled: boolean = true) => {
  return useQuery<WeatherData>({
    queryKey: ['weather', city],
    queryFn: () => fetchWeatherByCity(city!),
    enabled: enabled && !!city,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 2,
  });
};

/**
 * Custom hook for fetching weather data by coordinates
 */
export const useWeatherByCoords = (lat: number | null, lon: number | null, enabled: boolean = true) => {
  return useQuery<WeatherData>({
    queryKey: ['weather-coords', lat, lon],
    queryFn: () => fetchWeatherByCoords(lat!, lon!),
    enabled: enabled && lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Custom hook for fetching 5-day forecast
 */
export const useForecast = (city: string | null, enabled: boolean = true) => {
  return useQuery<ForecastData>({
    queryKey: ['forecast', city],
    queryFn: () => fetchForecastByCity(city!),
    enabled: enabled && !!city,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
};

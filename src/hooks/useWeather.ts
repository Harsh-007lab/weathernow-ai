import { useQuery } from '@tanstack/react-query';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecastByCity } from '@/api/weatherApi';
import type { WeatherData, ForecastData } from '@/types/weather';

/**
 * Custom hook for fetching current weather data by city
 * Enhanced with better caching strategy for performance
 */
export const useWeather = (city: string | null, enabled: boolean = true) => {
  return useQuery<WeatherData>({
    queryKey: ['weather', city],
    queryFn: () => fetchWeatherByCity(city!),
    enabled: enabled && !!city,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 30 * 60 * 1000, // 30 minutes in cache
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    refetchOnReconnect: false, // Don't refetch on reconnect
  });
};

/**
 * Custom hook for fetching weather data by coordinates
 * Enhanced with better caching strategy
 */
export const useWeatherByCoords = (lat: number | null, lon: number | null, enabled: boolean = true) => {
  return useQuery<WeatherData>({
    queryKey: ['weather-coords', lat, lon],
    queryFn: () => fetchWeatherByCoords(lat!, lon!),
    enabled: enabled && lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

/**
 * Custom hook for fetching 5-day forecast
 * Enhanced with aggressive caching for better performance
 */
export const useForecast = (city: string | null, enabled: boolean = true) => {
  return useQuery<ForecastData>({
    queryKey: ['forecast', city],
    queryFn: () => fetchForecastByCity(city!),
    enabled: enabled && !!city,
    staleTime: 10 * 60 * 1000, // 10 minutes - forecasts change less frequently
    gcTime: 60 * 60 * 1000, // 1 hour in cache
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

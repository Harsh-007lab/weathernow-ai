import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for auto-refreshing weather data
 */
export const useAutoRefresh = (intervalMinutes: number = 15, enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = window.setInterval(() => {
      console.log('Auto-refreshing weather data...');
      queryClient.invalidateQueries({ queryKey: ['weather'] });
      queryClient.invalidateQueries({ queryKey: ['weather-coords'] });
      queryClient.invalidateQueries({ queryKey: ['forecast'] });
    }, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMinutes, enabled, queryClient]);

  const manualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['weather'] });
    queryClient.invalidateQueries({ queryKey: ['weather-coords'] });
    queryClient.invalidateQueries({ queryKey: ['forecast'] });
  };

  return { manualRefresh };
};

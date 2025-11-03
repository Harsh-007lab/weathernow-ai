import { useState, useEffect, useCallback } from 'react';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

const STORAGE_KEY = 'weathernow-temp-unit';

export const useTemperatureUnit = () => {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as TemperatureUnit;
    return stored || 'celsius';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, unit);
  }, [unit]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  }, []);

  const convertTemp = useCallback((temp: number): number => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  }, [unit]);

  const getUnitSymbol = useCallback((): string => {
    return unit === 'celsius' ? '°C' : '°F';
  }, [unit]);

  return {
    unit,
    setUnit,
    toggleUnit,
    convertTemp,
    getUnitSymbol,
  };
};

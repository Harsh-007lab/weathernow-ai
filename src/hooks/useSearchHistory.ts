import { useState, useEffect, useCallback } from 'react';

export interface SearchHistoryItem {
  city: string;
  timestamp: number;
}

const STORAGE_KEY = 'weathernow_search_history';
const MAX_HISTORY = 10;

/**
 * Hook to manage search history with localStorage persistence
 * Stores city name + timestamp for each search
 */
export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Add search to history
  const addSearch = useCallback((city: string) => {
    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((item) => item.city !== city);
      // Add new entry at the start
      const updated = [{ city, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Remove single entry
  const removeSearch = useCallback((city: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.city !== city);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    history,
    addSearch,
    clearHistory,
    removeSearch,
  };
};

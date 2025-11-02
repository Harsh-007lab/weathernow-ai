import { useState, useEffect, useCallback } from 'react';

export interface FavoriteCity {
  city: string;
  country?: string;
  addedAt: number;
}

const STORAGE_KEY = 'weathernow_favorites';
const MAX_FAVORITES = 8;

/**
 * Hook to manage favorite cities with localStorage persistence
 * Future: Can be extended to sync with Supabase for authenticated users
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Check if city is favorited
  const isFavorite = useCallback(
    (city: string) => {
      return favorites.some((fav) => fav.city.toLowerCase() === city.toLowerCase());
    },
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (city: string, country?: string) => {
      setFavorites((prev) => {
        const exists = prev.find((fav) => fav.city.toLowerCase() === city.toLowerCase());

        let updated: FavoriteCity[];
        if (exists) {
          // Remove from favorites
          updated = prev.filter((fav) => fav.city.toLowerCase() !== city.toLowerCase());
        } else {
          // Add to favorites (limit to MAX_FAVORITES)
          if (prev.length >= MAX_FAVORITES) {
            // Remove oldest favorite
            updated = [...prev.slice(1), { city, country, addedAt: Date.now() }];
          } else {
            updated = [...prev, { city, country, addedAt: Date.now() }];
          }
        }

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [favorites]
  );

  // Remove single favorite
  const removeFavorite = useCallback((city: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav.city.toLowerCase() !== city.toLowerCase());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
};

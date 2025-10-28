import { useState, useEffect } from 'react';
import type { GeoLocation } from '@/types/weather';

interface GeoLocationState {
  location: GeoLocation | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook for handling browser geolocation
 */
export const useGeoLocation = (autoFetch: boolean = false) => {
  const [state, setState] = useState<GeoLocationState>({
    location: null,
    error: null,
    loading: false,
  });

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setState({
          location: null,
          error: errorMessage,
          loading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLocation();
    }
  }, [autoFetch]);

  return {
    ...state,
    fetchLocation,
  };
};

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

    // Check if we're on HTTPS or localhost (required for geolocation on mobile)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setState({
        location: null,
        error: 'Geolocation requires HTTPS connection',
        loading: false,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    // Mobile-optimized geolocation with better timeout and accuracy settings
    const options = {
      enableHighAccuracy: false, // Faster on mobile, uses network location
      timeout: 15000, // Increased timeout for mobile networks
      maximumAge: 10 * 60 * 1000, // 10 minutes - more aggressive caching
    };

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
            errorMessage = 'Please allow location access in your browser settings';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please check your device settings';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again';
            break;
        }

        setState({
          location: null,
          error: errorMessage,
          loading: false,
        });
      },
      options
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

import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from "react";
import { z } from "zod";
import { WeatherBackground } from "@/components/WeatherBackground";
import { WeatherParticles } from "@/components/WeatherParticles";
import { SearchBar } from "@/components/SearchBar";
import { WeatherCard } from "@/components/WeatherCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { useTheme } from "@/context/ThemeContext";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { Footer } from "@/components/Footer";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { ContactForm } from "@/components/ContactForm";
import { useToast } from "@/hooks/use-toast";
import { useWeather, useForecast, useWeatherByCoords } from "@/hooks/useWeather";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useFavorites } from "@/hooks/useFavorites";
import { MapPin, Loader2, Navigation, RefreshCw, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeatherCardSkeleton, ForecastCardSkeleton, MetricsSkeleton, InsightsSkeleton } from "@/components/SkeletonLoader";
import { motion } from "framer-motion";
import { updateMetaTags, generateWeatherSchema, injectStructuredData } from "@/lib/seo";

// Lazy-load heavy components for better performance
const WeatherMetrics = lazy(() => import("@/components/WeatherMetrics").then(m => ({ default: m.WeatherMetrics })));
const ForecastCard = lazy(() => import("@/components/ForecastCard").then(m => ({ default: m.ForecastCard })));
const WeatherInsights = lazy(() => import("@/components/WeatherInsights").then(m => ({ default: m.WeatherInsights })));
const AIChat = lazy(() => import("@/components/AIChat").then(m => ({ default: m.AIChat })));

const citySchema = z
  .string()
  .trim()
  .min(1, "City name is required")
  .max(100, "City name is too long")
  .regex(/^[a-zA-Z\s\-,\.]+$/, "City name contains invalid characters");

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mode, setMode] = useState<"city" | "location">("city");
  const [showFavorites, setShowFavorites] = useState(false);
  const { toast } = useToast();
  const { setCityTime } = useTheme();
  const { convertTemp, getUnitSymbol } = useTemperatureUnit();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Geolocation hook
  const { location, loading: geoLoading, error: geoError, fetchLocation } =
    useGeoLocation(false);

  // Weather by city
  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError,
  } = useWeather(selectedCity, mode === "city" && !!selectedCity);

  // Forecast by city
  const { data: forecastData, isLoading: forecastLoading } = useForecast(
    selectedCity,
    mode === "city" && !!selectedCity
  );

  // Weather by coordinates
  const { data: weatherByCoords } = useWeatherByCoords(
    location?.latitude ?? null,
    location?.longitude ?? null,
    mode === "location" && !!location
  );

  // 👇 Use correct weather source based on mode
  const displayWeatherData =
    mode === "location" ? weatherByCoords : weatherData;

  // Auto-refresh every 15 minutes
  const { manualRefresh } = useAutoRefresh(15, !!displayWeatherData);

  // Handle city search (memoized)
  const handleSearch = useCallback(async (city: string) => {
    try {
      citySchema.parse(city);
      setMode("city");
      setSelectedCity(city);
      toast({
        title: "Loading weather...",
        description: `Fetching data for ${city}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid city name",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  // Handle location button (memoized)
  const handleLocationClick = useCallback(() => {
    setMode("location");
    fetchLocation();
  }, [fetchLocation]);

  // Show error toast when geo location fails
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Location Error",
        description: geoError,
        variant: "destructive",
      });
    }
  }, [geoError, toast]);

  // Show error toast when weather fetch fails
  useEffect(() => {
    if (weatherError) {
      toast({
        title: "Weather Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    }
  }, [weatherError, toast]);

  const isLoading = weatherLoading || forecastLoading || geoLoading;

  const isDaytime = useMemo(() => {
    if (!displayWeatherData) return true;
    
    // Calculate city's actual local time using timezone offset
    // currentLocalTime is already adjusted (UTC + timezone offset)
    const localDate = new Date(displayWeatherData.currentLocalTime * 1000);
    const currentHour = localDate.getUTCHours();
    
    // Consider it daytime from 6 AM to 8 PM local time
    return currentHour >= 6 && currentHour < 20;
  }, [displayWeatherData]);

  // Update theme context when city daytime status changes
  useEffect(() => {
    if (displayWeatherData) {
      setCityTime(isDaytime);
    }
  }, [isDaytime, displayWeatherData, setCityTime]);

  // Update SEO when weather data changes
  useEffect(() => {
    if (displayWeatherData && selectedCity) {
      updateMetaTags({
        title: `${selectedCity} Weather | WeatherNow - Real-Time Forecast`,
        description: `Current weather in ${selectedCity}: ${displayWeatherData.temp}°C, ${displayWeatherData.condition}. Get accurate forecasts and AI insights with WeatherNow.`,
        keywords: `${selectedCity} weather, ${selectedCity} forecast, weather ${selectedCity}, temperature ${selectedCity}`,
      });

      const schema = generateWeatherSchema(selectedCity, displayWeatherData.temp);
      injectStructuredData(schema);
    } else {
      // Default homepage SEO
      updateMetaTags({
        title: "WeatherNow | Live Forecasts, Smart Insights & AI Weather Assistant",
        description: "Stay ahead of the storm with WeatherNow — real-time forecasts, 5-day predictions, and AI-powered outfit & activity suggestions tailored for your day.",
        keywords: "WeatherNow, weather forecast, real-time weather, AI weather insights, 5-day forecast",
      });

      injectStructuredData(generateWeatherSchema());
    }
  }, [displayWeatherData, selectedCity]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      {/* Animated Background */}
      <WeatherBackground
        condition={displayWeatherData?.condition}
        isDaytime={isDaytime}
      />

      {/* Weather Particles */}
      {displayWeatherData && (
        <WeatherParticles condition={displayWeatherData.condition} />
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="absolute top-4 right-4 flex items-center gap-2" role="navigation" aria-label="Settings">
          <TemperatureToggle />
          <Button
            onClick={manualRefresh}
            variant="ghost"
            size="icon"
            className="glass hover:bg-white/20 border-0"
            disabled={!displayWeatherData}
            aria-label="Refresh weather data"
          >
            <RefreshCw className="h-5 w-5 text-white" aria-hidden="true" />
          </Button>
          <ThemeToggle />
        </div>

        {/* Favorites Toggle Button */}
        {favorites.length > 0 && (
          <div className="absolute top-4 left-4">
            <Button
              onClick={() => setShowFavorites(!showFavorites)}
              variant="ghost"
              className="glass hover:bg-white/20 border-0 gap-2"
              aria-label="Toggle favorites"
            >
              <Star className={`h-5 w-5 ${showFavorites ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
              <span className="text-white font-medium hidden sm:inline">Favorites</span>
              <span className="text-white/70 text-sm">({favorites.length})</span>
            </Button>
          </div>
        )}

        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 px-4"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 hover-scale">
            <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg animate-pulse" aria-hidden="true" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-shadow-strong">
              WeatherNow
            </h1>
          </div>
          <p className="text-white/80 text-base sm:text-lg md:text-xl text-shadow-soft px-4">
            AI-powered weather insights & forecasts
          </p>
        </motion.header>

        {/* Search and location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 w-full max-w-2xl mb-8"
          role="search"
          aria-label="Search for weather"
        >
          <div className="flex-1">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isLoading}
              currentCity={displayWeatherData?.city}
              currentCountry={displayWeatherData?.country}
            />
          </div>
          <Button
            onClick={handleLocationClick}
            disabled={geoLoading}
            className="glass hover:bg-white/20 border-0 h-14 px-4"
            size="icon"
            aria-label={geoLoading ? "Getting your location..." : "Use my current location"}
          >
            {geoLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" aria-hidden="true" />
            ) : (
              <Navigation className="w-5 h-5 text-white" aria-hidden="true" />
            )}
          </Button>
        </motion.div>

        {/* Favorites Panel */}
        {showFavorites && (
          <FavoritesPanel 
            onCityClick={(city) => {
              handleSearch(city);
              setShowFavorites(false);
            }} 
            currentCity={displayWeatherData?.city}
          />
        )}

        {/* Favorite Button - Show when viewing a city */}
        {displayWeatherData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-4"
          >
            <Button
              onClick={() => {
                if (displayWeatherData.city) {
                  toggleFavorite(displayWeatherData.city, displayWeatherData.country);
                  toast({
                    title: isFavorite(displayWeatherData.city) ? "Removed from favorites" : "Added to favorites ⭐",
                    description: isFavorite(displayWeatherData.city) 
                      ? `${displayWeatherData.city} removed` 
                      : `${displayWeatherData.city} saved to favorites`,
                  });
                }
              }}
              variant="ghost"
              className="glass hover:bg-white/20 border-0 gap-2"
            >
              <Heart 
                className={`h-5 w-5 transition-all ${
                  isFavorite(displayWeatherData.city || '') 
                    ? 'fill-red-400 text-red-400 animate-pulse' 
                    : 'text-white'
                }`} 
              />
              <span className="text-white font-medium">
                {isFavorite(displayWeatherData.city || '') ? 'Saved' : 'Save City'}
              </span>
            </Button>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            <WeatherCardSkeleton />
            <MetricsSkeleton />
            <ForecastCardSkeleton />
          </div>
        )}

        {/* Weather content */}
        {displayWeatherData && !isLoading && (
          <motion.main
            id="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl space-y-6"
            role="main"
            aria-label="Weather information"
          >
            <WeatherCard 
              data={{
                ...displayWeatherData,
                temp: convertTemp(displayWeatherData.temp),
                minTemp: convertTemp(displayWeatherData.minTemp),
                maxTemp: convertTemp(displayWeatherData.maxTemp),
              }}
              tempUnit={getUnitSymbol()}
            />
            
            <Suspense fallback={<MetricsSkeleton />}>
              <WeatherMetrics data={displayWeatherData} />
            </Suspense>
            
            {forecastData && (
              <Suspense fallback={<ForecastCardSkeleton />}>
                <ForecastCard forecast={forecastData.daily} />
              </Suspense>
            )}
            
            <Suspense fallback={<InsightsSkeleton />}>
              <WeatherInsights
                temp={displayWeatherData.temp}
                condition={displayWeatherData.condition}
                humidity={displayWeatherData.humidity}
                windSpeed={displayWeatherData.windSpeed}
              />
            </Suspense>
          </motion.main>
        )}

        {!displayWeatherData && !isLoading && (
          <div className="glass rounded-3xl p-6 sm:p-8 md:p-12 text-center animate-scale-in hover-scale max-w-2xl mx-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 px-2">
              Discover Weather Anywhere
            </h3>
            <p className="text-sm sm:text-base text-white/70 max-w-md px-4">
              Search for any city or use your current location to see weather
              conditions with AI-powered insights and 5-day forecasts
            </p>
          </div>
        )}
      </div>

      {/* Contact Form */}
      <div className="relative z-10 px-4 pb-8">
        <ContactForm />
      </div>

      {/* Footer */}
      <Footer />

      {/* AI Assistant - Lazy loaded */}
      <Suspense fallback={null}>
        <AIChat weatherData={displayWeatherData} />
      </Suspense>
    </div>
  );
};

export default Index;

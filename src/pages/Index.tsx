import { useState, useEffect } from "react";
import { z } from "zod";
import { WeatherBackground } from "@/components/WeatherBackground";
import { WeatherParticles } from "@/components/WeatherParticles";
import { SearchBar } from "@/components/SearchBar";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherInsights } from "@/components/WeatherInsights";
import { ForecastCard } from "@/components/ForecastCard";
import { WeatherMetrics } from "@/components/WeatherMetrics";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChat } from "@/components/AIChat";
import { useToast } from "@/hooks/use-toast";
import { useWeather, useForecast, useWeatherByCoords } from "@/hooks/useWeather";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { MapPin, Loader2, Navigation, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
const citySchema = z.string().trim().min(1, "City name is required").max(100, "City name is too long").regex(/^[a-zA-Z\s\-,\.]+$/, "City name contains invalid characters");
const Index = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const {
    toast
  } = useToast();

  // Geolocation hook
  const {
    location,
    loading: geoLoading,
    error: geoError,
    fetchLocation
  } = useGeoLocation(false);

  // Weather data hooks
  const {
    data: weatherData,
    isLoading: weatherLoading,
    error: weatherError
  } = useWeather(selectedCity, !!selectedCity);
  const {
    data: forecastData,
    isLoading: forecastLoading
  } = useForecast(selectedCity, !!selectedCity);

  // Weather by coordinates hook
  const { data: weatherByCoords } = useWeatherByCoords(
    location?.latitude ?? null,
    location?.longitude ?? null,
    !!location
  );

  // Use weatherByCoords if available, otherwise use city-based weather
  const displayWeatherData = weatherByCoords || weatherData;

  // Auto-refresh every 15 minutes
  const {
    manualRefresh
  } = useAutoRefresh(15, !!displayWeatherData);
  const handleSearch = async (city: string) => {
    try {
      citySchema.parse(city);
      setSelectedCity(city);
      toast({
        title: "Loading weather...",
        description: `Fetching data for ${city}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid city name",
          description: error.errors[0].message,
          variant: "destructive"
        });
      }
    }
  };
  const handleLocationClick = () => {
    fetchLocation();
  };

  // Show error toast when geo location fails
  useEffect(() => {
    if (geoError) {
      toast({
        title: "Location Error",
        description: geoError,
        variant: "destructive"
      });
    }
  }, [geoError, toast]);

  // Show error toast when weather fetch fails
  useEffect(() => {
    if (weatherError) {
      toast({
        title: "Weather Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive"
      });
    }
  }, [weatherError, toast]);

  const isLoading = weatherLoading || forecastLoading || geoLoading;
  const isDaytime = () => {
    if (!displayWeatherData) return true;
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 20;
  };
  return <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <WeatherBackground condition={displayWeatherData?.condition} isDaytime={isDaytime()} />
      
      {/* Weather Particles */}
      {displayWeatherData && <WeatherParticles condition={displayWeatherData.condition} />}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header with Theme Toggle and Refresh */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button onClick={manualRefresh} variant="ghost" size="icon" className="glass hover:bg-white/20 border-0" disabled={!displayWeatherData}>
            <RefreshCw className="h-5 w-5 text-white" />
          </Button>
          <ThemeToggle />
        </div>

        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4 hover-scale">
            <MapPin className="w-10 h-10 text-white drop-shadow-lg animate-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold text-white text-shadow-strong">
              WeatherNow
            </h1>
          </div>
          <p className="text-white/80 text-xl text-shadow-soft">
            AI-powered weather insights & forecasts
          </p>
        </motion.div>

        {/* Search with Location Button */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} className="flex items-center gap-3 w-full max-w-2xl mb-8">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
          <Button onClick={handleLocationClick} disabled={geoLoading} className="glass hover:bg-white/20 border-0 h-14 px-4" size="icon">
            {geoLoading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Navigation className="w-5 h-5 text-white" />}
          </Button>
        </motion.div>

        {/* Loading Skeletons */}
        {isLoading && <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            <Skeleton className="w-full h-64 rounded-3xl glass" />
            <Skeleton className="w-full h-48 rounded-3xl glass" />
            <Skeleton className="w-full h-96 rounded-3xl glass" />
          </div>}

        {/* Weather Display */}
        {displayWeatherData && !isLoading && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.6
      }} className="w-full max-w-4xl space-y-6">
            <WeatherCard data={displayWeatherData} />
            <WeatherMetrics data={displayWeatherData} />
            {forecastData && <ForecastCard forecast={forecastData.daily} />}
            <WeatherInsights temp={displayWeatherData.temp} condition={displayWeatherData.condition} humidity={displayWeatherData.humidity} windSpeed={displayWeatherData.windSpeed} />
          </motion.div>}

        {/* Initial State */}
        {!displayWeatherData && !isLoading && <div className="glass rounded-3xl p-12 text-center animate-scale-in hover-scale max-w-2xl">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Discover Weather Anywhere
            </h3>
            <p className="text-white/70 max-w-md">
              Search for any city or use your current location to see weather conditions with AI-powered insights and 5-day forecasts
            </p>
          </div>}
      </div>

      {/* AI Chat Assistant */}
      <AIChat weatherData={displayWeatherData} />

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        
      </div>
    </div>;
};
export default Index;
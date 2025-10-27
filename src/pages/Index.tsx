import { useState } from "react";
import { z } from "zod";
import { WeatherBackground } from "@/components/WeatherBackground";
import { WeatherParticles } from "@/components/WeatherParticles";
import { SearchBar } from "@/components/SearchBar";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherInsights } from "@/components/WeatherInsights";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";

const citySchema = z.string()
  .trim()
  .min(1, "City name is required")
  .max(100, "City name is too long")
  .regex(/^[a-zA-Z\s\-,\.]+$/, "City name contains invalid characters");

interface WeatherData {
  city: string;
  country: string;
  condition: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    
    try {
      // Validate city input
      const validatedCity = citySchema.parse(city);
      
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "f395d91f1589f0b9aa6128ddb040fc14";
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(validatedCity)}&appid=${API_KEY}&units=metric`
      );
      
      const data = await response.json();
      
      if (data.cod !== 200) {
        toast({
          title: "City not found",
          description: "Please check the city name and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Process the data
      const timezoneOffset = data.timezone || 0;
      const sunriseLocal = data.sys.sunrise + timezoneOffset;
      const sunsetLocal = data.sys.sunset + timezoneOffset;
      
      const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: true 
        });
      };

      setWeatherData({
        city: data.name,
        country: data.sys.country,
        condition: data.weather[0].main,
        temp: Math.round(data.main.temp),
        minTemp: Math.round(data.main.temp_min),
        maxTemp: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 10) / 10,
        sunrise: formatTime(sunriseLocal),
        sunset: formatTime(sunsetLocal),
      });

      toast({
        title: "Weather loaded!",
        description: `Showing weather for ${data.name}, ${data.sys.country}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid city name",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error('Weather fetch error:', error);
        toast({
          title: "Network error",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isDaytime = () => {
    if (!weatherData) return true;
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 20;
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <WeatherBackground 
        condition={weatherData?.condition} 
        isDaytime={isDaytime()}
      />
      
      {/* Weather Particles */}
      {weatherData && <WeatherParticles condition={weatherData.condition} />}
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4 hover-scale">
            <MapPin className="w-10 h-10 text-white drop-shadow-lg animate-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold text-white text-shadow-strong">
              WeatherNow
            </h1>
          </div>
          <p className="text-white/80 text-xl text-shadow-soft">
            Beautiful weather, beautiful design
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={fetchWeather} isLoading={isLoading} />

        {/* Weather Display */}
        {weatherData && !isLoading && (
          <div className="w-full max-w-4xl space-y-6 animate-fade-in">
            <WeatherCard data={weatherData} />
            <WeatherInsights 
              temp={weatherData.temp}
              condition={weatherData.condition}
              humidity={weatherData.humidity}
              windSpeed={weatherData.windSpeed}
            />
          </div>
        )}

        {/* Initial State */}
        {!weatherData && !isLoading && (
          <div className="glass rounded-3xl p-12 text-center animate-scale-in hover-scale">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Discover Weather Anywhere
            </h3>
            <p className="text-white/70 max-w-md">
              Enter any city name to see current weather conditions with stunning visuals and AI-powered insights
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-white/50 text-sm hover:text-white/70 transition-colors">
          Powered by OpenWeatherMap API & Lovable AI
        </p>
      </div>
    </div>
  );
};

export default Index;

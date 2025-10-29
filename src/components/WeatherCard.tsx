import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, Droplets } from "lucide-react";
import { SunTrajectory } from "./SunTrajectory";

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

interface WeatherCardProps {
  data: WeatherData;
}

export const WeatherCard = ({ data }: WeatherCardProps) => {
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
      return <Sun className="w-24 h-24 text-yellow-300 drop-shadow-lg" />;
    }
    if (conditionLower.includes("cloud")) {
      return <Cloud className="w-24 h-24 text-white/90 drop-shadow-lg" />;
    }
    if (conditionLower.includes("rain")) {
      return <CloudRain className="w-24 h-24 text-blue-200 drop-shadow-lg" />;
    }
    if (conditionLower.includes("drizzle")) {
      return <CloudDrizzle className="w-24 h-24 text-blue-200 drop-shadow-lg" />;
    }
    if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
      return <CloudLightning className="w-24 h-24 text-yellow-200 drop-shadow-lg" />;
    }
    if (conditionLower.includes("snow")) {
      return <CloudSnow className="w-24 h-24 text-white drop-shadow-lg" />;
    }
    
    return <Sun className="w-24 h-24 text-yellow-300 drop-shadow-lg" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-scale-in">
      {/* Main Weather Display */}
      <div className="glass-strong rounded-3xl p-4 sm:p-6 md:p-8 mb-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-shadow-strong">
            {data.city}, {data.country}
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8">{data.condition}</p>
          
          <div className="flex items-center justify-center mb-6 sm:mb-8 animate-float">
            {getWeatherIcon(data.condition)}
          </div>
          
          <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-4 text-shadow-strong">
            {data.temp}°
          </div>
          
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-white/90">
            <div className="text-center">
              <div className="text-xs sm:text-sm opacity-75">High</div>
              <div className="text-xl sm:text-2xl font-semibold">{data.maxTemp}°</div>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-xs sm:text-sm opacity-75">Low</div>
              <div className="text-xl sm:text-2xl font-semibold">{data.minTemp}°</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Humidity */}
        <div className="glass rounded-2xl p-4 sm:p-6 transition-transform hover:scale-105">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
            <span className="text-white/80 font-medium text-sm sm:text-base">Humidity</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{data.humidity}%</div>
          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${data.humidity}%` }}
            />
          </div>
        </div>

        {/* Wind Speed */}
        <div className="glass rounded-2xl p-4 sm:p-6 transition-transform hover:scale-105">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            <span className="text-white/80 font-medium text-sm sm:text-base">Wind</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{data.windSpeed} m/s</div>
          <div className="mt-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  i < Math.min(5, Math.floor(data.windSpeed / 2)) 
                    ? "bg-gradient-to-r from-cyan-400 to-cyan-600" 
                    : "bg-white/20"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Sun Trajectory - Spans 2 columns */}
        <SunTrajectory sunrise={data.sunrise} sunset={data.sunset} />
      </div>
    </div>
  );
};

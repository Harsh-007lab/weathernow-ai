import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, Droplets } from "lucide-react";
import { SunTrajectory } from "./SunTrajectory";
import { MetricInfoDialog, metricDescriptions } from "./MetricInfoDialog";

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
  currentLocalTime: number;
  timezone: number;
}

interface WeatherCardProps {
  data: WeatherData;
  tempUnit?: string;
}

export const WeatherCard = ({ data, tempUnit = '°C' }: WeatherCardProps) => {
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
      <div className="glass-strong rounded-3xl p-4 sm:p-6 md:p-8 mb-6 card-glow">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-shadow-strong animate-slide-down">
            {data.city}, {data.country}
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>{data.condition}</p>
          
          <div className="flex items-center justify-center mb-6 sm:mb-8 animate-float">
            {getWeatherIcon(data.condition)}
          </div>
          
          <div className="flex items-center justify-center gap-2 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-white text-shadow-strong">
              {data.temp}{tempUnit}
            </div>
            <MetricInfoDialog title="Temperature" description={metricDescriptions.temperature} preferredPlacement="bottom" />
          </div>
          
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-white/90 animate-slide-up mt-4" style={{animationDelay: '0.3s'}}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm opacity-75 mb-1">
                <span>High</span>
                <MetricInfoDialog title="Maximum Temperature" description={metricDescriptions.maxTemp} preferredPlacement="bottom" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold">{data.maxTemp}{tempUnit}</div>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/30" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm opacity-75 mb-1">
                <span>Low</span>
                <MetricInfoDialog title="Minimum Temperature" description={metricDescriptions.minTemp} preferredPlacement="bottom" />
              </div>
              <div className="text-xl sm:text-2xl font-semibold">{data.minTemp}{tempUnit}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 stagger-children">
        {/* Humidity */}
        <div className="glass rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl card-glow animate-slide-in-left" style={{'--stagger-delay': 1} as any}>
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
              <span className="text-white/80 font-medium text-sm sm:text-base">Humidity</span>
            </div>
            <MetricInfoDialog title="Humidity" description={metricDescriptions.humidity} preferredPlacement="left" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{data.humidity}%</div>
          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000 animate-gradient"
              style={{ width: `${data.humidity}%`, backgroundSize: '200% 100%' }}
            />
          </div>
        </div>

        {/* Wind Speed */}
        <div className="glass rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl card-glow animate-slide-in-right" style={{'--stagger-delay': 2} as any}>
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
              <span className="text-white/80 font-medium text-sm sm:text-base">Wind</span>
            </div>
            <MetricInfoDialog title="Wind Speed" description={metricDescriptions.windSpeed} preferredPlacement="right" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{data.windSpeed} m/s</div>
          <div className="mt-3 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-500 animate-scale-in ${
                  i < Math.min(5, Math.floor(data.windSpeed / 2)) 
                    ? "bg-gradient-to-r from-cyan-400 to-cyan-600" 
                    : "bg-white/20"
                }`}
                style={{ animationDelay: `${(i * 100) + 400}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Sun Trajectory - Spans 2 columns */}
        <SunTrajectory 
          sunrise={data.sunrise} 
          sunset={data.sunset} 
          currentLocalTime={data.currentLocalTime}
        />
      </div>
    </div>
  );
};

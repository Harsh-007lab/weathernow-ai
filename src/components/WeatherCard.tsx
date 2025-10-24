import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, Droplets, Gauge } from "lucide-react";

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
      <div className="glass-strong rounded-3xl p-8 mb-6">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2 text-shadow-strong">
            {data.city}, {data.country}
          </h2>
          <p className="text-white/80 text-lg mb-8">{data.condition}</p>
          
          <div className="flex items-center justify-center mb-8 animate-float">
            {getWeatherIcon(data.condition)}
          </div>
          
          <div className="text-8xl font-bold text-white mb-4 text-shadow-strong">
            {data.temp}°
          </div>
          
          <div className="flex items-center justify-center gap-8 text-white/90">
            <div className="text-center">
              <div className="text-sm opacity-75">High</div>
              <div className="text-2xl font-semibold">{data.maxTemp}°</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-sm opacity-75">Low</div>
              <div className="text-2xl font-semibold">{data.minTemp}°</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Humidity */}
        <div className="glass rounded-2xl p-6 transition-transform hover:scale-105">
          <div className="flex items-center gap-3 mb-3">
            <Droplets className="w-6 h-6 text-blue-300" />
            <span className="text-white/80 font-medium">Humidity</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.humidity}%</div>
          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${data.humidity}%` }}
            />
          </div>
        </div>

        {/* Wind Speed */}
        <div className="glass rounded-2xl p-6 transition-transform hover:scale-105">
          <div className="flex items-center gap-3 mb-3">
            <Wind className="w-6 h-6 text-cyan-300" />
            <span className="text-white/80 font-medium">Wind Speed</span>
          </div>
          <div className="text-3xl font-bold text-white">{data.windSpeed} m/s</div>
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

        {/* Sunrise */}
        <div className="glass rounded-2xl p-6 transition-transform hover:scale-105">
          <div className="flex items-center gap-3 mb-3">
            <Sun className="w-6 h-6 text-orange-300" />
            <span className="text-white/80 font-medium">Sunrise</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.sunrise}</div>
        </div>

        {/* Sunset */}
        <div className="glass rounded-2xl p-6 transition-transform hover:scale-105">
          <div className="flex items-center gap-3 mb-3">
            <Gauge className="w-6 h-6 text-purple-300" />
            <span className="text-white/80 font-medium">Sunset</span>
          </div>
          <div className="text-2xl font-bold text-white">{data.sunset}</div>
        </div>
      </div>
    </div>
  );
};

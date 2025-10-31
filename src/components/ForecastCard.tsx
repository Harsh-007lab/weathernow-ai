import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog } from 'lucide-react';
import type { DailyForecast } from '@/types/weather';
import { useState } from 'react';

interface ForecastCardProps {
  forecast: DailyForecast[];
}

const getWeatherIcon = (condition: string, small = false) => {
  const size = small ? "w-5 h-5" : "w-6 h-6";
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return <CloudRain className={size} />;
  if (cond.includes('cloud')) return <Cloud className={size} />;
  if (cond.includes('clear') || cond.includes('sun')) return <Sun className={size} />;
  if (cond.includes('snow')) return <CloudSnow className={size} />;
  if (cond.includes('drizzle')) return <CloudDrizzle className={size} />;
  if (cond.includes('mist') || cond.includes('fog')) return <CloudFog className={size} />;
  return <Cloud className={size} />;
};

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <Card className="glass p-4 sm:p-6 animate-scale-in hover-scale transition-all card-glow">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-shadow-soft animate-slide-down">
        5-Day Forecast
      </h3>
      
      <div className="space-y-3 stagger-children">
        {forecast.map((day, index) => (
          <div key={day.date} className="animate-slide-in-left" style={{'--stagger-delay': index + 1} as any}>
            <button
              onClick={() => setSelectedDay(selectedDay === index ? null : index)}
              className="w-full bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-102 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <span className="text-white font-medium text-sm sm:text-base w-12 sm:w-16 flex-shrink-0">
                    {index === 0 ? 'Today' : day.dayOfWeek}
                  </span>
                  <div className="text-white/80 hidden sm:block flex-shrink-0">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <span className="text-white/70 text-xs sm:text-sm flex-1 text-left truncate">
                    {day.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <span className="text-white/60 text-xs sm:text-sm">
                    {day.precipitation}%
                  </span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {day.maxTemp}°
                    </span>
                    <span className="text-white/50 text-xs sm:text-sm">
                      {day.minTemp}°
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Hourly breakdown */}
            {selectedDay === index && day.hourly.length > 0 && (
              <div className="mt-3 bg-white/5 rounded-xl p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
                <h4 className="text-white/80 text-xs sm:text-sm font-medium mb-3">Hourly Forecast</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
                  {day.hourly.map((hour, hourIndex) => (
                    <div 
                      key={hourIndex}
                      className="flex flex-col items-center gap-1 sm:gap-2 bg-white/5 rounded-lg p-2"
                    >
                      <span className="text-white/60 text-[10px] sm:text-xs">{hour.time}</span>
                      <div className="text-white/70">
                        {getWeatherIcon(hour.condition, true)}
                      </div>
                      <span className="text-white font-medium text-xs sm:text-sm">
                        {hour.temp}°
                      </span>
                      <span className="text-white/40 text-[10px] sm:text-xs">
                        {hour.precipitation}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

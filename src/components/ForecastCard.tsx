import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog } from 'lucide-react';
import type { DailyForecast } from '@/types/weather';
import { useState } from 'react';

interface ForecastCardProps {
  forecast: DailyForecast[];
}

const getWeatherIcon = (condition: string) => {
  const cond = condition.toLowerCase();
  if (cond.includes('rain')) return <CloudRain className="w-6 h-6" />;
  if (cond.includes('cloud')) return <Cloud className="w-6 h-6" />;
  if (cond.includes('clear') || cond.includes('sun')) return <Sun className="w-6 h-6" />;
  if (cond.includes('snow')) return <CloudSnow className="w-6 h-6" />;
  if (cond.includes('drizzle')) return <CloudDrizzle className="w-6 h-6" />;
  if (cond.includes('mist') || cond.includes('fog')) return <CloudFog className="w-6 h-6" />;
  return <Cloud className="w-6 h-6" />;
};

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <Card className="glass p-6 animate-scale-in hover-scale transition-all">
      <h3 className="text-2xl font-bold text-white mb-6 text-shadow-soft">
        5-Day Forecast
      </h3>
      
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div key={day.date}>
            <button
              onClick={() => setSelectedDay(selectedDay === index ? null : index)}
              className="w-full bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-white font-medium w-12">
                    {index === 0 ? 'Today' : day.dayOfWeek}
                  </span>
                  <div className="text-white/80">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <span className="text-white/70 text-sm flex-1 text-left">
                    {day.condition}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm">
                    {day.precipitation}%
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {day.maxTemp}°
                    </span>
                    <span className="text-white/50">
                      {day.minTemp}°
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Hourly breakdown */}
            {selectedDay === index && day.hourly.length > 0 && (
              <div className="mt-3 bg-white/5 rounded-xl p-4 backdrop-blur-sm animate-fade-in">
                <h4 className="text-white/80 text-sm font-medium mb-3">Hourly Forecast</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {day.hourly.map((hour, hourIndex) => (
                    <div 
                      key={hourIndex}
                      className="flex flex-col items-center gap-2 bg-white/5 rounded-lg p-2"
                    >
                      <span className="text-white/60 text-xs">{hour.time}</span>
                      <div className="text-white/70">
                        {getWeatherIcon(hour.condition)}
                      </div>
                      <span className="text-white font-medium text-sm">
                        {hour.temp}°
                      </span>
                      <span className="text-white/40 text-xs">
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

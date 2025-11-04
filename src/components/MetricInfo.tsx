import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricInfoProps {
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const METRIC_STORAGE_KEY = 'weathernow_metric_views';

export const MetricInfo = ({ title, description, position = 'top' }: MetricInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  useEffect(() => {
    // Check if this metric info has been viewed before
    const viewedMetrics = JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) || '{}');
    setHasBeenViewed(!!viewedMetrics[title]);
  }, [title]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark as viewed
      const viewedMetrics = JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) || '{}');
      viewedMetrics[title] = true;
      localStorage.setItem(METRIC_STORAGE_KEY, JSON.stringify(viewedMetrics));
      setHasBeenViewed(true);

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={`p-1 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          hasBeenViewed ? 'text-white/50' : 'text-white/70 animate-pulse'
        }`}
        aria-label={`Learn more about ${title}`}
        type="button"
      >
        <Info className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-50 ${
              position === 'top' ? 'bottom-full mb-2' : 
              position === 'bottom' ? 'top-full mt-2' : 
              position === 'left' ? 'right-full mr-2' : 
              'left-full ml-2'
            } ${position === 'left' || position === 'right' ? 'top-0' : 'left-1/2 -translate-x-1/2'} w-64 sm:w-72`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-xl p-4 shadow-2xl border border-white/20">
              <h4 className="text-white font-semibold text-sm mb-2">{title}</h4>
              <p className="text-white/80 text-xs leading-relaxed">{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const metricDescriptions = {
  temperature: "The actual air temperature measured in the shade. This is what thermometers show and what you'll feel in the shade.",
  feelsLike: "The perceived temperature considering wind chill and humidity. High humidity makes heat feel more intense, while wind makes cold feel sharper.",
  minTemp: "The lowest temperature expected for today. Typically occurs in the early morning hours just before sunrise.",
  maxTemp: "The highest temperature expected for today. Usually occurs in the mid-afternoon when the sun is strongest.",
  humidity: "The amount of moisture in the air. High humidity (>60%) makes the air feel sticky and heavy. Low humidity (<30%) can cause dry skin and static.",
  windSpeed: "How fast air is moving. Strong winds make temperatures feel colder (wind chill effect). Speeds above 20 m/s can affect outdoor activities.",
  pressure: "Atmospheric pressure affects weather stability. High pressure (>1013 hPa) usually brings clear skies. Low pressure often brings clouds and rain.",
  visibility: "How far you can see clearly. Poor visibility (<2 km) indicates fog, mist, or pollution. Good visibility (>10 km) means clear conditions.",
  sunrise: "The time when the sun appears above the horizon. This marks the beginning of daylight and affects the sun's trajectory throughout the day.",
  sunset: "The time when the sun disappears below the horizon. This marks the start of twilight and nighttime.",
  condition: "The current weather state (clear, cloudy, rainy, etc.). This determines what outdoor activities are suitable and what to wear.",
  precipitation: "The probability of rain or snow. Values above 50% mean precipitation is likely. This helps plan outdoor activities.",
};
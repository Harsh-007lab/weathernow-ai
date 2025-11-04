import { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnchoredDialog } from '@/hooks/useAnchoredDialog';

interface MetricInfoDialogProps {
  title: string;
  description: string;
  preferredPlacement?: 'bottom' | 'left' | 'right' | 'top';
}

const METRIC_STORAGE_KEY = 'weathernow_metric_views';

export const MetricInfoDialog = ({ 
  title, 
  description, 
  preferredPlacement = 'bottom' 
}: MetricInfoDialogProps) => {
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickDebounce, setClickDebounce] = useState(false);

  const { isOpen, position, dialogRef, toggle, close } = useAnchoredDialog({
    preferredPlacement,
    offset: 12,
    autoClose: true,
    autoCloseDelay: 4000,
  });

  useEffect(() => {
    // Check if this metric info has been viewed before
    const viewedMetrics = JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) || '{}');
    setHasBeenViewed(!!viewedMetrics[title]);
  }, [title]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (clickDebounce) return;
    setClickDebounce(true);
    setTimeout(() => setClickDebounce(false), 200);

    if (buttonRef.current) {
      toggle(buttonRef.current);
      
      if (!isOpen) {
        // Mark as viewed
        const viewedMetrics = JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) || '{}');
        viewedMetrics[title] = true;
        localStorage.setItem(METRIC_STORAGE_KEY, JSON.stringify(viewedMetrics));
        setHasBeenViewed(true);
      }
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    } else if (e.key === 'Escape' && isOpen) {
      close();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`p-1 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          hasBeenViewed ? 'text-white/50' : 'text-white/70 animate-pulse'
        }`}
        aria-label={`Learn more about ${title}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        <Info className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile - click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={close}
            />

            {/* Dialog Panel */}
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              role="dialog"
              aria-labelledby={`metric-title-${title}`}
              aria-describedby={`metric-desc-${title}`}
              aria-modal="false"
              className="fixed z-50 w-72 sm:w-80"
              style={
                position
                  ? {
                      top: `${position.top}px`,
                      left: `${position.left}px`,
                    }
                  : { opacity: 0, pointerEvents: 'none' }
              }
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 dark:border-slate-700/50">
                {/* Arrow indicator */}
                {position?.placement === 'bottom' && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 dark:bg-slate-900/95 border-l border-t border-white/20 dark:border-slate-700/50 rotate-45" />
                )}
                {position?.placement === 'top' && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 dark:bg-slate-900/95 border-r border-b border-white/20 dark:border-slate-700/50 rotate-45" />
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 
                    id={`metric-title-${title}`}
                    className="text-slate-900 dark:text-white font-semibold text-sm"
                  >
                    {title}
                  </h4>
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                <p 
                  id={`metric-desc-${title}`}
                  className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed"
                >
                  {description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
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

import { useEffect, useRef, useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricInfoPanelProps {
  label: string;
  description: string;
  icon?: React.ReactNode;
}

const METRIC_STORAGE_KEY = 'weathernow_metric_views';

export const MetricInfoPanel = ({ 
  label, 
  description,
  icon 
}: MetricInfoPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const clickDebounceRef = useRef(false);

  useEffect(() => {
    // Check if this metric has been viewed before
    const viewedMetrics = JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) || '{}');
    setHasBeenViewed(!!viewedMetrics[label]);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [label]);

  useEffect(() => {
    if (isOpen && !isMobile && buttonRef.current) {
      // Calculate position for desktop
      const calculatePosition = () => {
        const button = buttonRef.current;
        if (!button) return;

        // Find the parent metric card
        const metricCard = button.closest('[class*="bg-white/10"], [class*="glass"]') as HTMLElement;
        if (!metricCard) return;

        const cardRect = metricCard.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const panelWidth = 320; // Fixed width for consistency

        // Position below the metric card with spacing
        const top = cardRect.bottom + 16;
        
        // Center horizontally relative to the card, but clamp to viewport
        let left = cardRect.left + (cardRect.width / 2) - (panelWidth / 2);
        left = Math.max(16, Math.min(left, viewportWidth - panelWidth - 16));

        setPosition({ 
          top, 
          left, 
          width: panelWidth 
        });
      };

      calculatePosition();

      // Recalculate on scroll/resize
      const handleUpdate = () => calculatePosition();
      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 5000);

      // Click outside to close
      const handleClickOutside = (e: MouseEvent) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(e.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target as Node)
        ) {
          handleClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Debounce to prevent double-click issues
    if (clickDebounceRef.current) return;
    clickDebounceRef.current = true;
    setTimeout(() => {
      clickDebounceRef.current = false;
    }, 300);

    if (!isOpen) {
      // Mark as viewed
      const viewedMetrics = JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) || '{}');
      viewedMetrics[label] = true;
      localStorage.setItem(METRIC_STORAGE_KEY, JSON.stringify(viewedMetrics));
      setHasBeenViewed(true);
    }

    setIsOpen(prev => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(e as any);
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`flex-shrink-0 p-1.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 ${
          isOpen 
            ? 'bg-white/20 text-white' 
            : hasBeenViewed 
              ? 'text-white/50 hover:text-white/70' 
              : 'text-white/80 hover:text-white animate-pulse'
        }`}
        aria-label={`Learn more about ${label}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        type="button"
      >
        {icon || <Info className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
              onClick={handleClose}
            />

            {/* Info Panel */}
            {isMobile ? (
              // Mobile: Bottom Sheet
              <motion.div
                ref={panelRef}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                role="dialog"
                aria-labelledby={`metric-title-${label}`}
                aria-describedby={`metric-desc-${label}`}
                aria-modal="true"
                className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Handle bar */}
                  <div className="w-12 h-1 bg-gray-300 dark:bg-slate-600 rounded-full mx-auto mb-4" />
                  
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 
                      id={`metric-title-${label}`}
                      className="text-slate-900 dark:text-white font-bold text-lg"
                    >
                      {label}
                    </h4>
                    <button
                      onClick={handleClose}
                      className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                  
                  <p 
                    id={`metric-desc-${label}`}
                    className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                  >
                    {description}
                  </p>
                </div>
              </motion.div>
            ) : (
              // Desktop: Anchored Panel
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                role="dialog"
                aria-labelledby={`metric-title-${label}`}
                aria-describedby={`metric-desc-${label}`}
                aria-modal="false"
                className="fixed z-[70] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700"
                style={
                  position
                    ? {
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                      }
                    : { opacity: 0, pointerEvents: 'none' }
                }
                onClick={(e) => e.stopPropagation()}
              >
                {/* Arrow indicator pointing up to the metric */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-l border-t border-gray-200 dark:border-slate-700 rotate-45" />
                
                <div className="relative p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 
                      id={`metric-title-${label}`}
                      className="text-slate-900 dark:text-white font-bold text-base"
                    >
                      {label}
                    </h4>
                    <button
                      onClick={handleClose}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                  
                  <p 
                    id={`metric-desc-${label}`}
                    className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                  >
                    {description}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Predefined metric descriptions
export const metricDescriptions = {
  temperature: "The actual air temperature measured in the shade. This is what thermometers show and represents the true ambient temperature.",
  feelsLike: "The perceived temperature considering wind chill and humidity. High humidity makes heat feel more intense, while wind makes cold feel sharper.",
  minTemp: "The lowest temperature expected for today. Typically occurs in the early morning hours just before sunrise.",
  maxTemp: "The highest temperature expected for today. Usually occurs in the mid-afternoon when the sun's heating is strongest.",
  humidity: "The amount of moisture in the air as a percentage. High humidity (>60%) makes the air feel sticky. Low humidity (<30%) can cause dry skin.",
  windSpeed: "How fast air is moving in your area. Strong winds make temperatures feel colder through wind chill. Speeds above 20 m/s can affect outdoor activities.",
  pressure: "Atmospheric pressure affects weather stability. High pressure (>1013 hPa) usually brings clear skies and calm weather. Low pressure often brings clouds and precipitation.",
  visibility: "How far you can clearly see into the distance. Poor visibility (<2 km) indicates fog, mist, or pollution. Good visibility (>10 km) means clear atmospheric conditions.",
  sunrise: "The time when the sun appears above the horizon, marking the beginning of daylight. This determines the sun's trajectory throughout the day.",
  sunset: "The time when the sun disappears below the horizon, marking the start of evening twilight and the transition to nighttime.",
  condition: "The current weather state describing overall conditions. This helps determine appropriate clothing and suitability for outdoor activities.",
  precipitation: "The probability or amount of rain or snow. Higher percentages mean precipitation is more likely within the forecast period.",
};

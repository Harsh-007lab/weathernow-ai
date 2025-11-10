import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AdSenseProps {
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AdSense = ({
  adSlot = "auto",
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style = {},
}: AdSenseProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Detect PWA mode (standalone display mode)
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsPWA(isStandalone);
    };

    checkPWA();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWA);

    return () => mediaQuery.removeEventListener('change', checkPWA);
  }, []);

  useEffect(() => {
    // Don't load ads in PWA mode
    if (isPWA) return;

    // Push ad after component mounts
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && adRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("AdSense error:", error);
        setIsLoaded(true); // Hide skeleton even on error
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPWA]);

  // Don't render anything in PWA mode
  if (isPWA) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
      style={style}
    >
      {/* Loading skeleton - prevents layout shift */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 via-gray-300/50 to-gray-200/50 dark:from-gray-700/30 dark:via-gray-600/30 dark:to-gray-700/30 rounded-xl animate-pulse">
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-gray-500">Advertisement</span>
          </div>
        </div>
      )}

      {/* AdSense ad unit */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "120px",
          ...style,
        }}
        data-ad-client="ca-pub-9224504439081555"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </motion.div>
  );
};

// Declare global adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

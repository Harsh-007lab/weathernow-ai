import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
        >
          <div className="glass rounded-full px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shadow-2xl border border-white/30 backdrop-blur-xl">
            <p className="text-white text-xs sm:text-sm text-center sm:text-left flex-1 leading-relaxed">
              We use cookies to enhance your browsing experience and analyze site traffic. By continuing, you accept our{" "}
              <Link 
                to="/privacy" 
                className="underline hover:text-white/80 font-medium"
                onClick={() => setIsVisible(false)}
              >
                Cookie Policy
              </Link>.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={handleAccept}
                size="sm"
                className="bg-white text-primary hover:bg-white/90 font-medium px-4 sm:px-6 text-xs sm:text-sm rounded-full"
              >
                Accept
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 sm:h-9 sm:w-9"
                aria-label="Dismiss cookie notice"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { Heart, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface FavoritesPanelProps {
  onCityClick: (city: string) => void;
  currentCity?: string | null;
}

export const FavoritesPanel = ({ onCityClick, currentCity }: FavoritesPanelProps) => {
  const { favorites, removeFavorite } = useFavorites();

  const handleRemove = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(city);
    
    // Small confetti burst for feedback
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      },
      colors: ['#ef4444', '#dc2626'],
      startVelocity: 15,
      ticks: 60,
    });
  };

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mb-6"
    >
      <div className="glass-strong rounded-2xl p-4 sm:p-6 backdrop-blur-md border border-white/20 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-400 fill-red-400 animate-pulse" />
          <h3 className="text-base sm:text-lg font-semibold text-white">Favorite Cities</h3>
          <span className="text-xs sm:text-sm text-white/60">({favorites.length})</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {favorites.map((fav, index) => (
              <motion.div
                key={fav.city}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <Button
                  onClick={() => onCityClick(fav.city)}
                  variant="ghost"
                  className={`w-full h-auto py-2 sm:py-3 px-3 sm:px-4 flex flex-col items-start gap-1 hover:bg-white/20 transition-all rounded-xl hover:scale-105 active:scale-95 ${
                    currentCity === fav.city ? 'bg-white/25 ring-2 ring-white/50 shadow-lg' : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <MapPin className="w-3 h-3 text-white/60 flex-shrink-0" />
                    <span className="text-white font-medium text-xs sm:text-sm truncate text-left flex-1">
                      {fav.city}
                    </span>
                  </div>
                  {fav.country && (
                    <span className="text-white/60 text-[10px] sm:text-xs truncate w-full text-left pl-5">
                      {fav.country}
                    </span>
                  )}
                </Button>
                
                <button
                  onClick={(e) => handleRemove(fav.city, e)}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-90"
                  title="Remove from favorites"
                >
                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

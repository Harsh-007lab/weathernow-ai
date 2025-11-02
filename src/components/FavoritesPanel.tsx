import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { motion, AnimatePresence } from "framer-motion";

interface FavoritesPanelProps {
  onCityClick: (city: string) => void;
  currentCity?: string | null;
}

export const FavoritesPanel = ({ onCityClick, currentCity }: FavoritesPanelProps) => {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mb-6"
    >
      <div className="glass-strong rounded-2xl p-6 backdrop-blur-md border border-white/20">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-400 fill-red-400" />
          <h3 className="text-lg font-semibold text-white">Favorite Cities</h3>
          <span className="text-sm text-white/60">({favorites.length})</span>
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
                  className={`w-full h-auto py-3 px-4 flex flex-col items-start gap-1 hover:bg-white/20 transition-all rounded-xl ${
                    currentCity === fav.city ? 'bg-white/20 ring-2 ring-white/40' : 'bg-white/10'
                  }`}
                >
                  <span className="text-white font-medium text-sm truncate w-full text-left">
                    {fav.city}
                  </span>
                  {fav.country && (
                    <span className="text-white/60 text-xs truncate w-full text-left">
                      {fav.country}
                    </span>
                  )}
                </Button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(fav.city);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg"
                  title="Remove from favorites"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

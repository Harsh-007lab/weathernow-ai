import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, Loader2, MapPin, Clock, Heart, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useFavorites } from "@/hooks/useFavorites";

interface CityOption {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

// Popular cities for quick access
const POPULAR_CITIES = [
  "London, GB",
  "New York, US",
  "Tokyo, JP",
  "Paris, FR",
  "Sydney, AU",
  "Dubai, AE",
];

// Country code to flag emoji
const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
  currentCity?: string | null;
  currentCountry?: string | null;
}

export const SearchBar = ({ onSearch, isLoading = false, currentCity, currentCountry }: SearchBarProps) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use new hooks
  const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debouncing (300ms for faster response)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        setShowRecent(false);
        return;
      }

      setIsLoadingSuggestions(true);
      setSelectedIndex(-1);
      try {
        const { fetchCitySuggestions } = await import('@/api/weatherApi');
        const data = await fetchCitySuggestions(city.trim());
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
        setShowRecent(false);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [city]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      const searchTerm = city.trim();
      onSearch(searchTerm);
      addSearch(searchTerm);
      setShowSuggestions(false);
      setShowRecent(false);
      inputRef.current?.blur();
    }
  }, [city, onSearch, addSearch]);

  const handleSelectSuggestion = useCallback((suggestion: CityOption) => {
    const cityName = suggestion.state 
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setCity(cityName);
    setShowSuggestions(false);
    setShowRecent(false);
    onSearch(cityName);
    addSearch(cityName);
    inputRef.current?.blur();
  }, [onSearch, addSearch]);

  const handleRecentClick = useCallback((recent: string) => {
    setCity(recent);
    setShowRecent(false);
    setShowSuggestions(false);
    onSearch(recent);
    addSearch(recent);
    inputRef.current?.blur();
  }, [onSearch, addSearch]);

  const handlePopularClick = useCallback((popular: string) => {
    setCity(popular);
    setShowRecent(false);
    setShowSuggestions(false);
    onSearch(popular);
    addSearch(popular);
    inputRef.current?.blur();
  }, [onSearch, addSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentSuggestions = showRecent ? history.map(h => h.city) : suggestions;
    const maxIndex = currentSuggestions.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      if (showRecent) {
        handleRecentClick(history[selectedIndex].city);
      } else if (suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setShowRecent(false);
      inputRef.current?.blur();
    }
  }, [selectedIndex, suggestions, showRecent, history, handleSelectSuggestion, handleRecentClick]);

  // Display list (recent searches or suggestions)
  const displayList = useMemo(() => {
    if (showRecent && history.length > 0) {
      return { type: "recent" as const, items: history };
    }
    if (showSuggestions && suggestions.length > 0) {
      return { type: "suggestions" as const, items: suggestions };
    }
    return null;
  }, [showRecent, history, showSuggestions, suggestions]);

  // Format timestamp for display
  const formatTimestamp = useCallback((timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }, []);

  // Check if current city is favorite
  const isCurrentFavorite = useMemo(() => {
    return currentCity ? isFavorite(currentCity) : false;
  }, [currentCity, isFavorite]);

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(() => {
    if (currentCity) {
      toggleFavorite(currentCity, currentCountry || undefined);
    }
  }, [currentCity, currentCountry, toggleFavorite]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 animate-slide-down relative" ref={searchRef}>
      <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 card-glow transition-all duration-300 hover:shadow-2xl">
        <Search className="w-6 h-6 text-white/60 ml-4" />
        {currentCity && city.trim() && (
          <Button
            type="button"
            onClick={handleFavoriteToggle}
            size="icon"
            variant="ghost"
            className="hover:bg-white/10 transition-all"
            title={isCurrentFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                isCurrentFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-white/60 hover:text-red-400'
              }`} 
            />
          </Button>
        )}
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => {
            if (city.trim().length < 2 && history.length > 0) {
              setShowRecent(true);
            } else if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          maxLength={100}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
          disabled={isLoading}
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions || showRecent}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
        />
        <Button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="btn-modern bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-6 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 relative z-10"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {/* Suggestions/Recent Searches Dropdown */}
      {displayList && (
        <div 
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-md border border-white/20 animate-slide-down"
        >
          {isLoadingSuggestions ? (
            <div className="p-4 text-center text-white/60">
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : (
            <ul className="py-2 max-h-80 overflow-y-auto">
              {displayList.type === "recent" ? (
                <>
                  <li className="px-4 py-2 text-xs text-white/40 font-semibold uppercase tracking-wider flex items-center justify-between">
                    <span>Recent Searches</span>
                    {history.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistory();
                        }}
                        className="text-white/40 hover:text-red-400 transition-colors"
                        title="Clear history"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </li>
                  {displayList.items.map((item, index) => (
                    <li
                      key={`recent-${index}`}
                      id={`suggestion-${index}`}
                      role="option"
                      aria-selected={selectedIndex === index}
                      className={`group px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 text-white hover:translate-x-1 animate-fade-in ${
                        selectedIndex === index ? "bg-white/20" : "hover:bg-white/10"
                      }`}
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      <Clock className="w-4 h-4 text-white/60 flex-shrink-0" />
                      <div 
                        className="flex-1 flex items-center justify-between"
                        onClick={() => handleRecentClick(item.city)}
                      >
                        <span className="font-medium">{item.city}</span>
                        <span className="text-xs text-white/40 ml-2">{formatTimestamp(item.timestamp)}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSearch(item.city);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                  {history.length > 0 && (
                    <>
                      <li className="px-4 py-2 mt-2 text-xs text-white/40 font-semibold uppercase tracking-wider">
                        Popular Cities
                      </li>
                      {POPULAR_CITIES.map((popular, index) => (
                        <li
                          key={`popular-${index}`}
                          onClick={() => handlePopularClick(popular)}
                          className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-all duration-200 flex items-center gap-3 text-white hover:translate-x-1"
                        >
                          <MapPin className="w-4 h-4 text-white/60 flex-shrink-0" />
                          <div className="flex-1 font-medium">{popular}</div>
                        </li>
                      ))}
                    </>
                  )}
                </>
              ) : (
                displayList.items.map((suggestion, index) => (
                  <li
                    key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 text-white hover:translate-x-1 animate-fade-in ${
                      selectedIndex === index ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <span className="text-xl flex-shrink-0">{getCountryFlag(suggestion.country)}</span>
                    <div className="flex-1">
                      <div className="font-medium">
                        {suggestion.name}
                        {suggestion.state && `, ${suggestion.state}`}
                      </div>
                      <div className="text-sm text-white/60">{suggestion.country}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </form>
  );
};

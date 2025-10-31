import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CityOption {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const { fetchCitySuggestions } = await import('@/api/weatherApi');
        const data = await fetchCitySuggestions(city.trim());
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        // Silently fail - user can still search manually
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [city]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: CityOption) => {
    const cityName = suggestion.state 
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`;
    setCity(cityName);
    setShowSuggestions(false);
    onSearch(cityName);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 animate-slide-down relative" ref={searchRef}>
      <div className="glass-strong rounded-2xl p-2 flex items-center gap-2 card-glow transition-all duration-300 hover:shadow-2xl">
        <Search className="w-6 h-6 text-white/60 ml-4 animate-pulse-glow" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          maxLength={100}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
          disabled={isLoading}
          autoComplete="off"
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

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-md border border-white/20 animate-slide-down">
          {isLoadingSuggestions ? (
            <div className="p-4 text-center text-white/60">
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-all duration-200 flex items-center gap-3 text-white hover:translate-x-1 animate-fade-in"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <MapPin className="w-4 h-4 text-white/60 flex-shrink-0 transition-transform group-hover:scale-110" />
                  <div className="flex-1">
                    <div className="font-medium">
                      {suggestion.name}
                      {suggestion.state && `, ${suggestion.state}`}
                    </div>
                    <div className="text-sm text-white/60">{suggestion.country}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
};

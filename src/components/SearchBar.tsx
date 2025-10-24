import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 animate-slide-down">
      <div className="glass-strong rounded-2xl p-2 flex items-center gap-2">
        <Search className="w-6 h-6 text-white/60 ml-4" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={100}
          className="flex-1 bg-transparent border-0 text-white placeholder:text-white/50 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !city.trim()}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-6 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
    </form>
  );
};

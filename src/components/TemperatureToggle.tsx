import { Button } from "@/components/ui/button";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";

export const TemperatureToggle = () => {
  const { unit, toggleUnit } = useTemperatureUnit();

  return (
    <Button
      onClick={toggleUnit}
      variant="ghost"
      size="sm"
      className="glass hover:bg-white/20 border-0 text-white font-semibold px-3 py-1 h-auto"
      aria-label={`Switch to ${unit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
    >
      {unit === 'celsius' ? '°C' : '°F'}
    </Button>
  );
};

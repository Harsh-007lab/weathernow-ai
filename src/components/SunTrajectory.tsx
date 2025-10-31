import { Sun, Sunrise, Sunset } from "lucide-react";

interface SunTrajectoryProps {
  sunrise: string;
  sunset: string;
  currentTime?: number;
}

export const SunTrajectory = ({ sunrise, sunset, currentTime }: SunTrajectoryProps) => {
  // Parse time strings (format: "HH:MM AM/PM")
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes; // Return minutes from midnight
  };

  const sunriseMinutes = parseTime(sunrise);
  const sunsetMinutes = parseTime(sunset);
  const now = currentTime || new Date().getHours() * 60 + new Date().getMinutes();

  // Calculate sun position percentage (0-100)
  const calculateSunPosition = (): number => {
    if (now < sunriseMinutes) return 0;
    if (now > sunsetMinutes) return 100;
    
    const dayLength = sunsetMinutes - sunriseMinutes;
    const elapsed = now - sunriseMinutes;
    return (elapsed / dayLength) * 100;
  };

  const sunPosition = calculateSunPosition();
  const isDayTime = now >= sunriseMinutes && now <= sunsetMinutes;

  // Calculate arc path for the sun trajectory
  const arcPath = () => {
    const width = 100;
    const height = 30;
    const startX = 0;
    const startY = height;
    const endX = width;
    const endY = height;
    const controlX = width / 2;
    const controlY = 0;
    
    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  };

  // Calculate sun position on the arc
  const getSunPosition = (percentage: number) => {
    const t = percentage / 100;
    const width = 100;
    const height = 80;
    const startX = 0;
    const startY = height;
    const endX = width;
    const endY = height;
    const controlX = width / 2;
    const controlY = 0;
    
    // Quadratic Bezier curve formula
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
    
    return { x, y };
  };

  const currentSunPos = getSunPosition(sunPosition);

  return (
    <div className="glass rounded-2xl p-6 col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <Sun className="w-6 h-6 text-orange-300" />
        <span className="text-white/80 font-medium">Sun Position</span>
      </div>
      
      <div className="relative w-full h-32 mb-4">
        {/* SVG Arc */}
        <svg 
          viewBox="0 0 100 40" 
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Background arc */}
          <path
            d={arcPath()}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.5"
          />
          
          {/* Progress arc */}
          {isDayTime && (
            <path
              d={arcPath()}
              fill="none"
              stroke="url(#sunGradient)"
              strokeWidth="0.8"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (sunPosition * 10)}
              className="transition-all duration-1000"
            />
          )}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Animated Sun */}
        {isDayTime && (
          <div 
            className="absolute w-6 h-6 transition-all duration-1000"
            style={{
              left: `${currentSunPos.x}%`,
              top: `${currentSunPos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              {/* Opaque background to hide trajectory line */}
              <div className="absolute inset-0 bg-gradient-to-br from-background to-background/80 rounded-full scale-150 -z-10" />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-60 animate-pulse" />
              {/* Sun icon */}
              <Sun className="w-6 h-6 text-yellow-300 relative z-10 drop-shadow-lg" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
      
      {/* Sunrise and Sunset Times */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center">
            <Sunrise className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs text-white/60">Sunrise</div>
            <div className="text-lg font-bold text-white">{sunrise}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div>
            <div className="text-xs text-white/60 text-right">Sunset</div>
            <div className="text-lg font-bold text-white text-right">{sunset}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center">
            <Sunset className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      {/* Current status */}
      <div className="mt-3 text-center">
        <div className="text-sm text-white/70">
          {!isDayTime && now < sunriseMinutes && "Night - Sun will rise soon"}
          {!isDayTime && now > sunsetMinutes && "Night - Sun has set"}
          {isDayTime && sunPosition < 50 && "Morning - Sun is rising"}
          {isDayTime && sunPosition >= 50 && "Afternoon - Sun is setting"}
        </div>
      </div>
    </div>
  );
};

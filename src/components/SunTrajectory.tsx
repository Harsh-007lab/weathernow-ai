import { Sun, Sunrise, Sunset, Moon } from "lucide-react";

interface SunTrajectoryProps {
  sunrise: string;
  sunset: string;
  currentLocalTime?: number; // Unix timestamp in city's local timezone
}

export const SunTrajectory = ({ sunrise, sunset, currentLocalTime }: SunTrajectoryProps) => {
  // Parse time strings (format: "HH:MM AM/PM")
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Format minutes to readable time
  const formatTime24 = (minutes: number): string => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const sunriseMinutes = parseTime(sunrise);
  const sunsetMinutes = parseTime(sunset);
  
  // Calculate current time in minutes using city's local time
  // currentLocalTime is already adjusted for timezone (UTC + timezone offset)
  let now: number;
  if (currentLocalTime) {
    // Extract hours and minutes from the local timestamp
    const localDate = new Date(currentLocalTime * 1000);
    now = localDate.getUTCHours() * 60 + localDate.getUTCMinutes();
  } else {
    // Fallback to user's local time
    now = new Date().getHours() * 60 + new Date().getMinutes();
  }
  
  const dayLength = sunsetMinutes - sunriseMinutes;
  const midDay = sunriseMinutes + dayLength / 2;

  // Determine time of day
  const isDayTime = now >= sunriseMinutes && now <= sunsetMinutes;
  const isNight = !isDayTime;

  // Calculate sun/moon position percentage (0-100)
  const calculatePosition = (): number => {
    if (isDayTime) {
      // Daytime: sun progresses from sunrise (0%) to sunset (100%)
      const elapsed = now - sunriseMinutes;
      return (elapsed / dayLength) * 100;
    } else {
      // Nighttime: moon progresses from sunset (0%) to next sunrise (100%)
      const nightLength = (24 * 60) - dayLength; // Total night duration
      if (now > sunsetMinutes) {
        // After sunset: progress from 0% onwards
        const minutesSinceSunset = now - sunsetMinutes;
        return Math.min(100, (minutesSinceSunset / nightLength) * 100);
      } else {
        // Before sunrise: continue from where we left off after midnight
        const minutesAfterMidnight = now;
        const minutesFromSunsetToMidnight = (24 * 60) - sunsetMinutes;
        const totalElapsed = minutesFromSunsetToMidnight + minutesAfterMidnight;
        return Math.min(100, (totalElapsed / nightLength) * 100);
      }
    }
  };

  const sunPosition = calculatePosition();

  // Calculate arc path - always left to right
  const getArcPath = () => {
    const width = 100;
    const height = 30;
    const startX = 0;
    const startY = height;
    const endX = 100;
    const endY = height;
    const controlX = width / 2;
    const controlY = 0;
    
    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  };

  // Calculate sun/moon position on the arc
  const getCelestialPosition = (percentage: number) => {
    const t = percentage / 100;
    
    const width = 100;
    const height = 80;
    const startX = 0;
    const startY = height;
    const endX = 100;
    const endY = height;
    const controlX = width / 2;
    const controlY = 0;
    
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
    
    return { x, y };
  };

  const currentPosition = getCelestialPosition(sunPosition);

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 col-span-2 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        {isDayTime ? (
          <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-pulse" />
        ) : (
          <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 animate-pulse" />
        )}
        <span className="text-white/80 font-medium text-sm sm:text-base">
          {isDayTime ? 'Sun Position' : 'Moon Phase'}
        </span>
      </div>
      
      <div className="relative w-full h-24 sm:h-32 mb-3 sm:mb-4">
        <svg 
          viewBox="0 0 100 40" 
          className="absolute inset-0 w-full h-full drop-shadow-lg"
          preserveAspectRatio="none"
        >
          {/* Background arc with glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* Morning gradient (sunrise to noon) - left to right */}
            <linearGradient id="morningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#facc15" stopOpacity="0.9" />
            </linearGradient>
            
            {/* Afternoon gradient (noon to sunset) - right to left */}
            <linearGradient id="afternoonGradient" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
              <stop offset="100%" stopColor="#c026d3" stopOpacity="0.8" />
            </linearGradient>
            
            {/* Night gradient */}
            <linearGradient id="nightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Base arc - always visible */}
          <path
            d={getArcPath()}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          
          {/* Animated progress arc - Daytime */}
          {isDayTime && (
            <path
              d={getArcPath()}
              fill="none"
              stroke="url(#morningGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (sunPosition * 10)}
              className="transition-all duration-1000 ease-out"
              filter="url(#glow)"
            />
          )}
          
          {/* Animated progress arc - Nighttime */}
          {isNight && (
            <path
              d={getArcPath()}
              fill="none"
              stroke="url(#nightGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (sunPosition * 10)}
              className="transition-all duration-1000 ease-out opacity-70"
            />
          )}
        </svg>
        
        {/* Animated Sun/Moon with enhanced glow effects */}
        {isDayTime && (
          <div 
            className="absolute transition-all duration-1000 ease-out"
            style={{
              left: `${currentPosition.x}%`,
              top: `${currentPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 'clamp(1.5rem, 5vw, 2rem)',
              height: 'clamp(1.5rem, 5vw, 2rem)'
            }}
          >
            <div className="relative w-full h-full">
              {/* Enhanced multi-layer golden glow effect */}
              <div className="absolute inset-0 bg-yellow-400/50 rounded-full blur-2xl animate-pulse" 
                   style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 bg-orange-400/40 rounded-full blur-xl animate-pulse" 
                   style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <div className="absolute inset-0 bg-amber-300/60 rounded-full blur-lg" />
              <div className="absolute inset-0 bg-yellow-300/50 rounded-full blur-md" />
              
              {/* Sun icon */}
              <Sun 
                className="w-full h-full text-yellow-200 relative z-10 drop-shadow-2xl animate-[spin_20s_linear_infinite]" 
                fill="currentColor" 
                strokeWidth={1.5}
              />
            </div>
          </div>
        )}
        
        {isNight && (
          <div 
            className="absolute transition-all duration-1000 ease-out"
            style={{
              left: `${currentPosition.x}%`,
              top: `${currentPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 'clamp(1.5rem, 5vw, 2rem)',
              height: 'clamp(1.5rem, 5vw, 2rem)'
            }}
          >
            <div className="relative w-full h-full">
              {/* Enhanced blue moon glow effect */}
              <div className="absolute inset-0 bg-blue-400/40 rounded-full blur-xl animate-pulse" 
                   style={{ animationDuration: '4s' }} />
              <div className="absolute inset-0 bg-sky-400/30 rounded-full blur-lg animate-pulse"
                   style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
              <div className="absolute inset-0 bg-indigo-400/25 rounded-full blur-md" />
              <Moon className="w-full h-full text-blue-100 relative z-10 drop-shadow-xl" fill="currentColor" />
            </div>
          </div>
        )}
      </div>
      
      {/* Sunrise and Sunset Times - Mobile Responsive */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-400 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs text-white/60 truncate">Sunrise</div>
            <div className="text-sm sm:text-lg font-bold text-white truncate">{sunrise}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <div className="text-[10px] sm:text-xs text-white/60 truncate">Sunset</div>
            <div className="text-sm sm:text-lg font-bold text-white truncate">{sunset}</div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-400 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Sunset className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow" />
          </div>
        </div>
      </div>
      
      {/* Current status - Mobile Responsive */}
      <div className="mt-2 sm:mt-3 text-center">
        <div className="text-xs sm:text-sm text-white/70 px-2">
          {isDayTime ? (
            `☀️ Daytime — Sun at ${Math.round(sunPosition)}%`
          ) : (
            `🌙 Nighttime — Moon at ${Math.round(sunPosition)}%`
          )}
        </div>
      </div>
    </div>
  );
};

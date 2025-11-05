import { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  condition?: string;
  isDaytime?: boolean;
}

export const WeatherBackground = ({ condition = "Clear", isDaytime = true }: WeatherBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate particles for rain/snow effects
    if (condition.toLowerCase().includes("rain") || condition.toLowerCase().includes("snow")) {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 2}s`,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [condition]);

  const getGradient = () => {
    const conditionLower = condition.toLowerCase();
    
    if (!isDaytime) {
      return "bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a3a5c]";
    }
    
    if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
      return "bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500";
    }
    if (conditionLower.includes("cloud")) {
      return "bg-gradient-to-br from-gray-300 via-slate-400 to-blue-400";
    }
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return "bg-gradient-to-br from-slate-400 via-blue-500 to-indigo-600";
    }
    if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
      return "bg-gradient-to-br from-slate-600 via-gray-700 to-slate-800";
    }
    if (conditionLower.includes("snow")) {
      return "bg-gradient-to-br from-blue-100 via-slate-200 to-blue-300";
    }
    
    return "bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500";
  };

  const renderParticles = () => {
    const isRain = condition.toLowerCase().includes("rain");
    const isSnow = condition.toLowerCase().includes("snow");

    if (!isRain && !isSnow) return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute w-0.5 ${isRain ? "h-8 bg-blue-200/40" : "h-2 w-2 rounded-full bg-white/60"} animate-slide-down`}
            style={{
              left: particle.left,
              top: "-10%",
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 transition-all duration-1000 ${getGradient()}`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[40%] left-[60%] w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Weather particles */}
      {renderParticles()}
    </div>
  );
};

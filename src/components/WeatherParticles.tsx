import { useEffect, useState } from "react";

interface WeatherParticlesProps {
  condition: string;
}

export const WeatherParticles = ({ condition }: WeatherParticlesProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const particleCount = getParticleCount(condition);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
    }));
    setParticles(newParticles);
  }, [condition]);

  const getParticleCount = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("drizzle")) return 50;
    if (cond.includes("snow")) return 40;
    if (cond.includes("cloud")) return 20;
    return 0;
  };

  const getParticleStyle = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("drizzle")) {
      return "bg-blue-300/40 w-0.5 h-8";
    }
    if (cond.includes("snow")) {
      return "bg-white/70 w-2 h-2 rounded-full";
    }
    if (cond.includes("cloud")) {
      return "bg-white/20 w-16 h-8 rounded-full";
    }
    return "";
  };

  if (!condition || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${getParticleStyle(condition)} animate-fall`}
          style={{
            left: `${particle.left}%`,
            top: "-10%",
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

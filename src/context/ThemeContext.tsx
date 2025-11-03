import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Theme } from '@/types/weather';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  setCityTime: (isDaytime: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('weather-theme') as Theme;
    return stored || 'auto';
  });

  const [isDark, setIsDark] = useState(false);
  const [cityIsDaytime, setCityIsDaytime] = useState<boolean | null>(null);

  const setCityTime = (isDaytime: boolean) => {
    setCityIsDaytime(isDaytime);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    const updateTheme = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else {
        // Auto mode: prioritize city time if available, fallback to system preference
        if (cityIsDaytime !== null) {
          shouldBeDark = !cityIsDaytime;
        } else {
          shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }

      setIsDark(shouldBeDark);
      
      if (shouldBeDark) {
        root.classList.add('dark');
        root.style.transition = 'background-color 0.5s ease';
      } else {
        root.classList.remove('dark');
        root.style.transition = 'background-color 0.5s ease';
      }
    };

    updateTheme();
    localStorage.setItem('weather-theme', theme);

    // Listen for system theme changes in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme, cityIsDaytime]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, setCityTime }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

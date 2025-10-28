import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="glass hover:bg-white/20 border-0"
        >
          {theme === 'light' && <Sun className="h-5 w-5 text-white" />}
          {theme === 'dark' && <Moon className="h-5 w-5 text-white" />}
          {theme === 'auto' && <Monitor className="h-5 w-5 text-white" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-white/20">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="cursor-pointer text-white hover:bg-white/20"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="cursor-pointer text-white hover:bg-white/20"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('auto')}
          className="cursor-pointer text-white hover:bg-white/20"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>Auto</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

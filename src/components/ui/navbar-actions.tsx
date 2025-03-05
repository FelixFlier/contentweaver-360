
import React from 'react';
import { useTheme } from '@/components/theme/theme-provider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, HelpCircle } from 'lucide-react';
import { useTutorial } from '@/hooks/use-tutorial';

export function NavbarActions() {
  const { theme, setTheme } = useTheme();
  const { setShowTutorial } = useTutorial();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowTutorial(true)}
        aria-label="Show tutorial"
        className="text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>
    </div>
  );
}

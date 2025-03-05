
import { Button } from "@/components/ui/button";
import { Moon, Sun, HelpCircle } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useTutorial } from "@/hooks/use-tutorial";

interface ThemeToggleProps {
  showHelpIcon?: boolean;
}

export function ThemeToggle({ showHelpIcon = true }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const { setShowTutorial } = useTutorial();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      {showHelpIcon && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTutorial(true)}
          aria-label="Open tutorial"
          className="text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="text-muted-foreground hover:text-foreground"
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

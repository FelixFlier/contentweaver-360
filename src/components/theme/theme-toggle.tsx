
import { Moon, Sun, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme/theme-provider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTutorial } from "@/hooks/use-tutorial"

export function ThemeToggle({ showHelpIcon = true }: { showHelpIcon?: boolean }) {
  const { theme, setTheme } = useTheme()
  const { setShowTutorial } = useTutorial()

  return (
    <div className="flex items-center gap-2">
      {/* Always show the help icon, regardless of mobile or desktop */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTutorial(true)}
          >
            <HelpCircle className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            <span className="sr-only">Open tutorial</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tutorial öffnen</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme wechseln</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

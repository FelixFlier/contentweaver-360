
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  FileText, 
  Folder, 
  Menu, 
  Plus, 
  Sparkles, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

// Define our main navigation steps
const NAV_STEPS = [
  { name: 'Start', path: '/', icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { name: 'Meine Inhalte', path: '/content', icon: <Folder className="h-4 w-4 mr-2" /> },
  { name: 'Stilanalyse', path: '/analysis', icon: <Sparkles className="h-4 w-4 mr-2" /> },
  { name: 'Blog erstellen', path: '/create/blog', icon: <FileText className="h-4 w-4 mr-2" /> },
  { name: 'LinkedIn erstellen', path: '/create/linkedin', icon: <FileText className="h-4 w-4 mr-2" /> },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use navigate instead of direct links to prevent page reload
  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Check if the current path matches a navigation item
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism animate-fade-in">
      <nav className="container mx-auto flex h-16 md:h-[64px] items-center justify-between px-4">
        {/* Logo */}
        <div 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-semibold hidden sm:inline-block">ContentWeaver</span>
        </div>

        {/* Desktop Navigation with 5 main steps */}
        {!isMobile && (
          <div className="flex items-center justify-center gap-4">
            {NAV_STEPS.map((step) => (
              <Button 
                key={step.path}
                variant={isActive(step.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(step.path)}
                className={`transition-all duration-300 ${
                  isActive(step.path) 
                    ? "text-primary-foreground bg-primary relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-foreground" 
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                {step.icon}
                {step.name}
              </Button>
            ))}
          </div>
        )}

        {/* Right-side Elements - only user avatar */}
        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem
                onClick={() => handleNavigation('/profile')}
                className="flex items-center gap-2 cursor-pointer"
              >
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigation('/settings')}
                className="flex items-center gap-2 cursor-pointer"
              >
                Einstellungen
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </nav>

      {/* Mobile Menu - Fixed with dark overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40">
          {/* Dark semi-transparent overlay */}
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          
          {/* Menu content */}
          <div className="relative flex flex-col p-4 space-y-4 max-h-[calc(100vh-64px)] overflow-auto z-10">
            {NAV_STEPS.map((step) => (
              <Button 
                key={step.path}
                variant={isActive(step.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(step.path)}
                className={`flex items-center gap-2 p-3 justify-start ${
                  isActive(step.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {React.cloneElement(step.icon, { className: "h-5 w-5" })}
                {step.name}
              </Button>
            ))}
            
            <div className="h-px w-full bg-border my-2"></div>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/profile')}
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors justify-start"
            >
              Profil
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/settings')}
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors justify-start"
            >
              Einstellungen
            </Button>
            
            <Button 
              variant="ghost"
              className="flex items-center gap-2 p-3 hover:bg-destructive/10 text-destructive rounded-md transition-colors justify-start"
            >
              Abmelden
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

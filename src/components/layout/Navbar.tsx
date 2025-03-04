
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Folder, 
  Search, 
  Sparkles, 
  TrendingUp
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
  { name: 'Inhalte', path: '/content', icon: <Folder className="h-4 w-4 mr-2" /> },
  { name: 'Research', path: '/research', icon: <Search className="h-4 w-4 mr-2" /> },
  { name: 'Blog', path: '/create/blog', icon: <FileText className="h-4 w-4 mr-2" /> },
  { name: 'SEO', path: '/seo', icon: <TrendingUp className="h-4 w-4 mr-2" /> },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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
          className="flex items-center gap-2 cursor-pointer mr-4"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-semibold hidden sm:inline-block">ContentWeaver</span>
        </div>

        {/* Main Navigation - Always visible on desktop */}
        <div className={`${isMobile ? 'hidden' : 'flex'} flex-grow items-center justify-center gap-2`}>
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

        {/* User Avatar - Right aligned */}
        <div className="flex items-center ml-auto">
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
        </div>
      </nav>

      {/* Mobile Navigation - Full Screen Menu */}
      {isMobile && (
        <div 
          className={`fixed inset-0 top-16 z-40 bg-background transition-opacity duration-300 ${
            mobileMenuOpen 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col p-4 space-y-2">
            {NAV_STEPS.map((step) => (
              <Button 
                key={step.path}
                variant={isActive(step.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(step.path)}
                className="justify-start w-full"
              >
                {React.cloneElement(step.icon, { className: "h-5 w-5 mr-2" })}
                {step.name}
              </Button>
            ))}
            <div className="h-px w-full bg-border my-2"></div>
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/profile')}
              className="justify-start w-full"
            >
              Profil
            </Button>
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/settings')}
              className="justify-start w-full"
            >
              Einstellungen
            </Button>
            <Button 
              variant="ghost"
              className="justify-start w-full text-destructive"
            >
              Abmelden
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            variant="default" 
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          >
            {mobileMenuOpen ? "×" : "≡"}
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;

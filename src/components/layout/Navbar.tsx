
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  FileText, 
  Folder, 
  Menu, 
  Plus, 
  Search, 
  Settings, 
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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Use navigate instead of direct links to prevent page reload
  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
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

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center justify-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <Plus className="h-4 w-4 mr-1" />
                  Content erstellen
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[200px]">
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/create/blog')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  Blog-Artikel
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/create/linkedin')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  LinkedIn-Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/content')}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Meine Inhalte
            </Button>

            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/analysis')}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Stilanalyse
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-foreground/80 hover:text-foreground">
                  Ressourcen
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[200px]">
                <DropdownMenuItem
                  onClick={() => handleNavigation('/resources/documents')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Folder className="h-4 w-4" />
                  Dokumente
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation('/resources/sources')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  Quellen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Right-side Elements */}
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          
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
                <Settings className="h-4 w-4" />
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

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background animate-fade-in z-40">
          <div className="flex flex-col p-4 space-y-4">
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/create/blog')}
              className="flex items-center gap-2 p-3 bg-primary/5 rounded-md hover:bg-primary/10 transition-colors justify-start"
            >
              <FileText className="h-5 w-5 text-primary" />
              Blog-Artikel erstellen
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/create/linkedin')}
              className="flex items-center gap-2 p-3 bg-secondary/5 rounded-md hover:bg-secondary/10 transition-colors justify-start"
            >
              <FileText className="h-5 w-5 text-secondary" />
              LinkedIn-Post erstellen
            </Button>
            
            <div className="h-px w-full bg-border my-2"></div>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/content')}
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors justify-start"
            >
              <Folder className="h-5 w-5" />
              Meine Inhalte
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/analysis')}
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors justify-start"
            >
              <Sparkles className="h-5 w-5" />
              Stilanalyse
            </Button>
            
            <div className="h-px w-full bg-border my-2"></div>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/resources/documents')}
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors justify-start"
            >
              <Folder className="h-5 w-5" />
              Dokumente
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => handleNavigation('/resources/sources')}
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors justify-start"
            >
              <FileText className="h-5 w-5" />
              Quellen
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

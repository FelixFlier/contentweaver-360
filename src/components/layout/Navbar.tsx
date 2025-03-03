
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism animate-fade-in">
      <nav className="container mx-auto flex h-16 md:h-[64px] items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-semibold hidden sm:inline-block">ContentWeaver</span>
        </Link>

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
                <DropdownMenuItem asChild>
                  <Link to="/create/blog" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Blog-Artikel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/create/linkedin" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    LinkedIn-Post
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/content" className="text-foreground/80 hover:text-foreground transition-colors">
              Meine Inhalte
            </Link>

            <Link to="/analysis" className="text-foreground/80 hover:text-foreground transition-colors">
              Stilanalyse
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-foreground/80 hover:text-foreground">
                  Ressourcen
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[200px]">
                <DropdownMenuItem asChild>
                  <Link to="/resources/documents" className="flex items-center gap-2 cursor-pointer">
                    <Folder className="h-4 w-4" />
                    Dokumente
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/resources/sources" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Quellen
                  </Link>
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
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Einstellungen
                </Link>
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
            <Link 
              to="/create/blog" 
              className="flex items-center gap-2 p-3 bg-primary/5 rounded-md hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5 text-primary" />
              Blog-Artikel erstellen
            </Link>
            
            <Link 
              to="/create/linkedin" 
              className="flex items-center gap-2 p-3 bg-secondary/5 rounded-md hover:bg-secondary/10 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5 text-secondary" />
              LinkedIn-Post erstellen
            </Link>
            
            <div className="h-px w-full bg-border my-2"></div>
            
            <Link 
              to="/content" 
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Folder className="h-5 w-5" />
              Meine Inhalte
            </Link>
            
            <Link 
              to="/analysis" 
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="h-5 w-5" />
              Stilanalyse
            </Link>
            
            <div className="h-px w-full bg-border my-2"></div>
            
            <Link 
              to="/resources/documents" 
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Folder className="h-5 w-5" />
              Dokumente
            </Link>
            
            <Link 
              to="/resources/sources" 
              className="flex items-center gap-2 p-3 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5" />
              Quellen
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

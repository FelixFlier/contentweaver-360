import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Folder, 
  Search, 
  Sparkles, 
  TrendingUp,
  BookOpen,
  Lightbulb,
  LogIn,
  UserPlus,
  Settings,
  User,
  LogOut,
  PenLine,
  ChevronDown,
  Plus,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { toast } from 'sonner';

const NAV_STEPS = [
  { 
    name: 'Start', 
    path: '/', 
    icon: <Sparkles className="h-4 w-4 mr-2" />,
    description: 'Übersicht und Dashboard',
    dropdownItems: [
      { label: 'Letzte Aktivitäten', icon: <FileText className="h-4 w-4" />, path: '/recent-activities' },
      { label: 'Statistiken', icon: <BarChart className="h-4 w-4" />, path: '/statistics' },
      { label: 'Favoriten', icon: <BookOpen className="h-4 w-4" />, path: '/favorites' }
    ]
  },
  { 
    name: 'Inhalte', 
    path: '/content', 
    icon: <Folder className="h-4 w-4 mr-2" />,
    description: 'Ihre erstellten Inhalte',
    dropdownItems: [
      { label: 'Alle Inhalte', icon: <Folder className="h-4 w-4" />, path: '/content' },
      { label: 'Blogs', icon: <FileText className="h-4 w-4" />, path: '/blogs' },
      { label: 'LinkedIn Posts', icon: <FileText className="h-4 w-4" />, path: '/linkedin-posts' },
      { label: 'Entwürfe', icon: <PenLine className="h-4 w-4" />, path: '/drafts' }
    ]
  },
  { 
    name: 'Blog', 
    path: '/create/blog', 
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: 'Blog-Artikel erstellen',
    dropdownItems: [
      { label: 'Neuer Blog', icon: <Plus className="h-4 w-4" />, path: '/create/blog' },
      { label: 'Blog-Vorlagen', icon: <Folder className="h-4 w-4" />, path: '/blog-templates' },
      { label: 'Blog-Tipps', icon: <Lightbulb className="h-4 w-4" />, path: '/blog-tips' }
    ]
  },
  { 
    name: 'LinkedIn', 
    path: '/create/linkedin', 
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: 'LinkedIn-Posts erstellen',
    dropdownItems: [
      { label: 'Neuer LinkedIn Post', icon: <Plus className="h-4 w-4" />, path: '/create/linkedin' },
      { label: 'LinkedIn-Vorlagen', icon: <Folder className="h-4 w-4" />, path: '/linkedin-templates' },
      { label: 'LinkedIn-Tipps', icon: <Lightbulb className="h-4 w-4" />, path: '/linkedin-tips' }
    ]
  },
  { 
    name: 'Research', 
    path: '/research', 
    icon: <Search className="h-4 w-4 mr-2" />,
    description: 'Recherche-Tools',
    dropdownItems: [
      { label: 'Suche', icon: <Search className="h-4 w-4" />, path: '/research/search' },
      { label: 'Trends', icon: <TrendingUp className="h-4 w-4" />, path: '/research/trends' },
      { label: 'Wettbewerber', icon: <BarChart className="h-4 w-4" />, path: '/research/competitors' }
    ]
  },
  { 
    name: 'SEO', 
    path: '/seo', 
    icon: <TrendingUp className="h-4 w-4 mr-2" />,
    description: 'SEO-Optimierung',
    dropdownItems: [
      { label: 'SEO-Analyse', icon: <BarChart className="h-4 w-4" />, path: '/seo/analyze' },
      { label: 'Keywords', icon: <FileText className="h-4 w-4" />, path: '/seo/keywords' },
      { label: 'Metriken', icon: <TrendingUp className="h-4 w-4" />, path: '/seo/metrics' }
    ]
  },
  { 
    name: 'Stilanalyse', 
    path: '/analysis', 
    icon: <Sparkles className="h-4 w-4 mr-2" />,
    description: 'Analyse Ihres Schreibstils',
    dropdownItems: [
      { label: 'Neue Analyse', icon: <Plus className="h-4 w-4" />, path: '/analysis/new' },
      { label: 'Mein Stil', icon: <FileText className="h-4 w-4" />, path: '/analysis/my-style' },
      { label: 'Verbesserungen', icon: <Lightbulb className="h-4 w-4" />, path: '/analysis/improvements' }
    ]
  },
  { 
    name: 'Quellen', 
    path: '/resources/sources', 
    icon: <Lightbulb className="h-4 w-4 mr-2" />,
    description: 'Quellenmanagement',
    dropdownItems: [
      { label: 'Alle Quellen', icon: <Folder className="h-4 w-4" />, path: '/resources/sources' },
      { label: 'Neue Quelle', icon: <Plus className="h-4 w-4" />, path: '/resources/add-source' },
      { label: 'Kategorien', icon: <FileText className="h-4 w-4" />, path: '/resources/categories' }
    ]
  },
];

const NavTooltip = ({ children, content, description }: { children: React.ReactNode, content: string, description: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [longHover, setLongHover] = useState(false);
  let timer: NodeJS.Timeout;
  
  const handleMouseEnter = () => {
    timer = setTimeout(() => {
      setLongHover(true);
    }, 1500);
    setIsOpen(true);
  };
  
  const handleMouseLeave = () => {
    clearTimeout(timer);
    setIsOpen(false);
    setLongHover(false);
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300} open={isOpen}>
        <TooltipTrigger asChild onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setIsOpen(false)}>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          align="center"
          className="tooltip-slide-up"
        >
          <div className="text-sm font-medium">{content}</div>
          {longHover && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    toast.success('Erfolgreich abgemeldet');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism animate-fade-in">
      <nav className="container mx-auto flex h-16 md:h-[64px] items-center justify-between px-4">
        <div 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 cursor-pointer mr-4"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-semibold hidden sm:inline-block">ContentWeaver</span>
        </div>

        <div className={`${isMobile ? 'hidden' : 'flex'} flex-grow items-center justify-center gap-2 overflow-x-auto`}>
          {NAV_STEPS.map((step) => (
            <NavTooltip 
              key={step.path}
              content={step.name}
              description={step.description}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
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
                    {step.dropdownItems && <ChevronDown className="h-3 w-3 ml-1 opacity-50" />}
                  </Button>
                </DropdownMenuTrigger>
                {step.dropdownItems && (
                  <DropdownMenuContent align="center" className="w-56 animate-fade-in bg-card dark:bg-[#1E1E1E]">
                    <DropdownMenuLabel>{step.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {step.dropdownItems.map((item, index) => (
                        <DropdownMenuItem 
                          key={index}
                          onClick={() => handleNavigation(item.path)}
                          className="hover:bg-accent gap-2 cursor-pointer"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </NavTooltip>
          ))}
        </div>

        <div className="flex items-center ml-auto gap-2">
          <ThemeToggle showHelpIcon={!isMobile} />
          
          {isMobile && (
            <ThemeToggle showHelpIcon={true} />
          )}
          
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={openLoginModal}
              className="button-save"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Anmelden
            </Button>
            
            <Button 
              size="sm"
              onClick={openRegisterModal}
              className="bg-gradient-to-r from-primary to-secondary text-white button-create shimmer"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Registrieren
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-fade-in bg-card dark:bg-[#1E1E1E]">
              <DropdownMenuItem 
                onClick={openLoginModal}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Anmelden</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={openRegisterModal}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Registrieren</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

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
              className="justify-start w-full text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            variant="default" 
            className="rounded-full h-12 w-12 shadow-lg button-glow"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          >
            {mobileMenuOpen ? "×" : "≡"}
          </Button>
        </div>
      )}

      <LoginModal 
        open={loginModalOpen} 
        onOpenChange={setLoginModalOpen} 
        onSwitchToRegister={openRegisterModal}
      />
      
      <RegisterModal 
        open={registerModalOpen} 
        onOpenChange={setRegisterModalOpen} 
        onSwitchToLogin={openLoginModal}
      />
    </header>
  );
};

export default Navbar;

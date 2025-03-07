import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Plus,
  BarChart,
  HelpCircle,
  PenLine,
  LogOut
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
import { useTutorial } from '@/hooks/use-tutorial';

const NAV_STEPS = [
  { 
    name: 'Start', 
    path: '/', 
    icon: <Sparkles className="h-4 w-4 mr-2" style={{ color: 'hsl(var(--primary))' }} />,
    description: 'Übersicht und Dashboard',
    dropdownItems: [
      { label: 'Letzte Aktivitäten', icon: <FileText className="h-4 w-4" />, path: '/recent-activities' },
      { label: 'Statistiken', icon: <BarChart className="h-4 w-4" />, path: '/statistics' },
      { label: 'Favoriten', icon: <BookOpen className="h-4 w-4" />, path: '/favorites' }
    ]
  },
  { 
    name: 'Inhalte', 
    path: '/all-contents', 
    icon: <Folder className="h-4 w-4 mr-2" style={{ color: 'hsl(var(--accent))' }} />,
    description: 'Ihre erstellten Inhalte',
    dropdownItems: [
      { label: 'Alle Inhalte', icon: <Folder className="h-4 w-4" />, path: '/all-contents' },
      { label: 'Blogs', icon: <FileText className="h-4 w-4" />, path: '/content' },
      { label: 'LinkedIn Posts', icon: <FileText className="h-4 w-4" />, path: '/linkedin-posts' },
      { label: 'Entwürfe', icon: <PenLine className="h-4 w-4" />, path: '/drafts' }
    ]
  },
  { 
    name: 'Blog', 
    path: '/create/blog', 
    icon: <FileText className="h-4 w-4 mr-2" style={{ color: 'hsl(var(--secondary))' }} />,
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

interface User {
  id: string;
  name: string;
  email: string;
}

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowTutorial } = useTutorial();
  
  useEffect(() => {
    const checkUserSession = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('user');
      
      setIsLoggedIn(loggedIn);
      if (loggedIn && userData) {
        setUser(JSON.parse(userData));
      }
    };
    
    checkUserSession();
    
    window.addEventListener('storage', checkUserSession);
    return () => window.removeEventListener('storage', checkUserSession);
  }, []);
  
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
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
          <span className="font-semibold hidden sm:inline-block text-gradient">ContentWeaver</span>
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
                        ? "bg-gradient-primary text-primary-foreground relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white/50" 
                        : "text-foreground/80 hover:text-foreground hover:bg-accent/10"
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
                          className="hover:bg-accent/10 gap-2 cursor-pointer"
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
          
          {!isMobile && !isLoggedIn && (
            <div className="flex items-center gap-2 ml-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={openLoginModal}
                className="border-primary/20 text-primary hover:text-primary hover:bg-primary/10"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Anmelden
              </Button>
              
              <Button 
                size="sm"
                onClick={openRegisterModal}
                className="bg-gradient-primary text-white shimmer"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Registrieren
              </Button>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-primary/30">
                  {user ? (
                    <>
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback className="bg-gradient-primary text-white">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-gradient-primary text-white">U</AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-fade-in bg-card dark:bg-[#1E1E1E]">
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    <span>{user?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/profile')}
                    className="flex items-center gap-2 cursor-pointer text-foreground"
                  >
                    <Settings className="h-4 w-4 text-secondary" />
                    <span>Einstellungen</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-destructive flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Abmelden</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem 
                    onClick={openLoginModal}
                    className="flex items-center gap-2 cursor-pointer text-foreground"
                  >
                    <LogIn className="h-4 w-4 text-primary" />
                    <span>Anmelden</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={openRegisterModal}
                    className="flex items-center gap-2 cursor-pointer text-foreground"
                  >
                    <UserPlus className="h-4 w-4 text-secondary" />
                    <span>Registrieren</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {isMobile && (
        <div 
          className={`fixed inset-0 top-16 z-40 bg-background dark:bg-[#121212] transition-opacity duration-300 ${
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
                className={`justify-start w-full ${isActive(step.path) ? "bg-gradient-primary text-white" : ""}`}
              >
                {React.cloneElement(step.icon, { className: "h-5 w-5 mr-2" })}
                {step.name}
              </Button>
            ))}
            
            {!isLoggedIn ? (
              <>
                <div className="h-px w-full bg-border my-2"></div>
                <Button 
                  variant="ghost"
                  className="justify-start w-full text-primary"
                  onClick={openLoginModal}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Anmelden
                </Button>
                <Button 
                  variant="ghost"
                  className="justify-start w-full text-secondary"
                  onClick={openRegisterModal}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Registrieren
                </Button>
              </>
            ) : (
              <>
                <div className="h-px w-full bg-border my-2"></div>
                <Button 
                  variant="ghost"
                  className="justify-start w-full"
                >
                  <User className="h-5 w-5 mr-2 text-primary" />
                  {user?.name}
                </Button>
                <Button 
                  variant="ghost"
                  className="justify-start w-full"
                  onClick={() => handleNavigation('/profile')}
                >
                  <Settings className="h-5 w-5 mr-2 text-secondary" />
                  Einstellungen
                </Button>
                <Button 
                  variant="ghost"
                  className="justify-start w-full text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Abmelden
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex gap-2">
            <Button 
              variant="default" 
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg button-glow bg-accent text-white"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              className="rounded-full h-12 w-12 shadow-lg button-glow bg-gradient-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            >
              {mobileMenuOpen ? "×" : "≡"}
            </Button>
          </div>
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

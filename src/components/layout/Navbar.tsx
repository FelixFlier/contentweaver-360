
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Folder, 
  BookOpen,
  LogIn,
  UserPlus,
  Settings,
  User,
  LogOut,
  Sparkles
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
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { 
    name: 'Start', 
    path: '/', 
  },
  { 
    name: 'Inhalte', 
    path: '/all-contents', 
  },
  { 
    name: 'Blog', 
    path: '/create/blog', 
  },
  { 
    name: 'LinkedIn', 
    path: '/create/linkedin', 
  },
  { 
    name: 'Quellen', 
    path: '/resources/sources', 
  },
];

interface User {
  id: string;
  name: string;
  email: string;
}

const Navbar = () => {
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div 
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-2 cursor-pointer mr-8"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">ContentWeaver</span>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`relative px-1 py-2 text-base font-medium transition-colors hover:text-primary ${
                  isActive(item.path) 
                    ? "text-primary font-semibold" 
                    : "text-foreground/80"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-primary"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center ml-auto gap-3">
          <ThemeToggle showHelpIcon={false} />
          
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
                className="bg-primary text-white"
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
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-fade-in">
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

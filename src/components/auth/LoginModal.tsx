
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AtSign, Lock, Github, Twitter } from 'lucide-react';
import { toast } from 'sonner';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      toast.success('Erfolgreich angemeldet');
      setIsLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      toast.success(`Anmeldung über ${provider} erfolgreich`);
      setIsLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Anmelden</DialogTitle>
          <DialogDescription className="text-center">
            Melden Sie sich an, um auf alle Funktionen zuzugreifen
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email"
                type="email"
                placeholder="name@beispiel.de"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Passwort</Label>
              <Button 
                variant="link" 
                size="sm" 
                className="px-0 font-normal h-auto" 
                type="button"
              >
                Passwort vergessen?
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full button-save shimmer" disabled={isLoading}>
            {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
          </Button>
        </form>
        
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Oder weiter mit
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button 
            variant="outline" 
            type="button" 
            className="w-full" 
            onClick={() => handleSocialLogin('Github')}
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            className="w-full" 
            onClick={() => handleSocialLogin('Twitter')}
            disabled={isLoading}
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 pt-2 border-t border-border">
          <div className="text-sm text-center">
            Noch kein Konto? {' '}
            <Button 
              variant="link" 
              className="px-0 font-semibold text-primary h-auto" 
              onClick={onSwitchToRegister}
            >
              Registrieren
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

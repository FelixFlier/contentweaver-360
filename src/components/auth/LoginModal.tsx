
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
import { AtSign, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

const LoginModal = ({ open, onOpenChange, onSwitchToRegister }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }
    
    // Basic password validation (minimum 6 characters)
    if (password.length < 6) {
      toast.error('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }
    
    await signIn(email, password);
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in bg-card dark:bg-[#1E1E1E]">
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

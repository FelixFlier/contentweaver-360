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
import { AtSign, User, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const RegisterModal = ({ open, onOpenChange, onSwitchToLogin }: RegisterModalProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, isLoading } = useAuth();

  const handleNextStep = () => {
    if (step === 1) {
      if (!name || !email) {
        toast.error('Bitte füllen Sie alle Felder aus');
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
        return;
      }
      
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }
    
    // Basic password validation (minimum 6 characters)
    if (password.length < 6) {
      toast.error('Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }
    
    await signUp(email, password, name);
    
    if (!isLoading) {
      // Reset form
      setStep(1);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in bg-card dark:bg-[#1E1E1E]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Registrieren</DialogTitle>
          <DialogDescription className="text-center">
            Erstellen Sie ein Konto, um alle Funktionen zu nutzen
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <div className="flex items-center space-x-6 bg-background px-4 dark:bg-[#1E1E1E]">
              <div 
                className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  1
                </div>
                <span>Daten</span>
              </div>
              <div 
                className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  2
                </div>
                <span>Passwort</span>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    placeholder="Max Mustermann"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">E-Mail</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="register-email"
                    type="email"
                    placeholder="name@beispiel.de"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                className="w-full button-create shimmer"
                onClick={handleNextStep}
              >
                Weiter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="register-password">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Zurück
                </Button>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white button-save shimmer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrierung...' : 'Registrieren'}
                </Button>
              </div>
            </>
          )}
        </form>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 pt-2 border-t border-border">
          <div className="text-sm text-center">
            Bereits ein Konto? {' '}
            <Button 
              variant="link" 
              className="px-0 font-semibold text-primary h-auto" 
              onClick={onSwitchToLogin}
            >
              Anmelden
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;

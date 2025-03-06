
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
import { AtSign, User, Lock, ArrowRight, Github, Twitter } from 'lucide-react';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      if (!name || !email) {
        toast.error('Bitte füllen Sie alle Felder aus');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      toast.success('Registrierung erfolgreich');
      setIsLoading(false);
      onOpenChange(false);
      // Reset form
      setStep(1);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleSocialRegister = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social registration
    setTimeout(() => {
      toast.success(`Registrierung über ${provider} erfolgreich`);
      setIsLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
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
            <div className="flex items-center space-x-6 bg-background px-4">
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
        
        {step === 1 && (
          <>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Oder registrieren mit
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full" 
                onClick={() => handleSocialRegister('Github')}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="w-full" 
                onClick={() => handleSocialRegister('Twitter')}
                disabled={isLoading}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>
          </>
        )}
        
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

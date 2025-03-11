// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextValue {
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisierungsfunktion
  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      // TESTMODUS: Immer einen Test-Benutzer bereitstellen
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        localStorage.setItem('isLoggedIn', 'true');
        setUser({
          id: 'test-user-id',
          email: 'test@example.com',
        });
        setIsLoading(false);
        return;
      }
      
      // Normale Authentifizierung
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else if (data?.session) {
        setUser(data.session.user);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        setUser(null);
        localStorage.removeItem('isLoggedIn');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Anmeldungsfunktion
  const signIn = async (email: string, password: string) => {
    try {
      // TESTMODUS: Direkt anmelden
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        const testUser = {
          id: 'test-user-id',
          email: email || 'test@example.com',
        };
        setUser(testUser);
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Erfolgreich angemeldet (Testmodus)');
        return { user: testUser };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      setUser(data.user);
      localStorage.setItem('isLoggedIn', 'true');
      toast.success('Erfolgreich angemeldet');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Anmeldung');
      throw error;
    }
  };
  
  // Registrierungsfunktion
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // TESTMODUS: Direkt registrieren
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        const testUser = {
          id: 'test-user-id',
          email: email,
        };
        setUser(testUser);
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Erfolgreich registriert (Testmodus)');
        return { user: testUser };
      }
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Registrierung');
      throw error;
    }
  };
  
  // Abmeldungsfunktion
  const signOut = async () => {
    try {
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        localStorage.removeItem('isLoggedIn');
        setUser(null);
        toast.success('Abgemeldet (Testmodus)');
        return;
      }
      
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      toast.success('Erfolgreich abgemeldet');
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Abmeldung');
      console.error('Sign out error:', error);
    }
  };

  // Initialization
  useEffect(() => {
    initializeAuth();
    
    // Auth state subscription only when not in test mode
    if (import.meta.env.VITE_TEST_MODE !== 'true') {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session?.user || null);
          localStorage.setItem('isLoggedIn', 'true');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('isLoggedIn');
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

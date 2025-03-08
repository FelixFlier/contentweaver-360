
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string; bio?: string; location?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast.success('Erfolgreich angemeldet');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Anmeldung fehlgeschlagen');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Registrierung erfolgreich. Bitte prüfen Sie Ihre E-Mails.');
    } catch (error: any) {
      toast.error(error.message || 'Registrierung fehlgeschlagen');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Erfolgreich abgemeldet');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Abmeldung fehlgeschlagen');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: { name?: string; email?: string; bio?: string; location?: string; avatar_url?: string }) => {
    try {
      if (!user) {
        throw new Error('Benutzer nicht angemeldet');
      }

      setIsLoading(true);
      
      // Update profile in the profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Profil aktualisiert');
    } catch (error: any) {
      toast.error(error.message || 'Profilaktualisierung fehlgeschlagen');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

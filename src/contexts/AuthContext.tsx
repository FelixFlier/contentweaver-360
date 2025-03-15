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
  getToken: () => Promise<string | null>;
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

  // Get the JWT token for API requests
  const getToken = async (): Promise<string | null> => {
    // In test mode, return a test token
    if (import.meta.env.VITE_TEST_MODE === 'true') {
      return 'test-token-for-development';
    }
    
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      
      if (token) {
        // Save token in localStorage for API client
        localStorage.setItem('authToken', token);
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Initialization function
  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      // Test mode: Always provide a test user
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        const testUser = {
          id: 'test-user-id',
          email: 'test@example.com',
        };
        
        setUser(testUser);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(testUser));
        setIsLoading(false);
        return;
      }
      
      // Normal authentication
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else if (data?.session) {
        // Get the token and save it
        const token = data.session.access_token;
        localStorage.setItem('authToken', token);
        
        setUser(data.session.user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.session.user));
      } else {
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Test mode: Sign in directly
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        const testUser = {
          id: 'test-user-id',
          email: email || 'test@example.com',
        };
        setUser(testUser);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(testUser));
        localStorage.setItem('authToken', 'test-token-for-development');
        toast.success('Erfolgreich angemeldet (Testmodus)');
        return { user: testUser };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Save the token
      if (data.session) {
        localStorage.setItem('authToken', data.session.access_token);
      }
      
      setUser(data.user);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Erfolgreich angemeldet');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Anmeldung');
      throw error;
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      // Test mode: Sign up directly
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        const testUser = {
          id: 'test-user-id',
          email: email,
          user_metadata: { name: name || email.split('@')[0] }
        };
        setUser(testUser);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(testUser));
        localStorage.setItem('authToken', 'test-token-for-development');
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
      
      // In real mode, we might need to verify email first
      if (data.session) {
        // If auto-confirmed, save token and set user
        localStorage.setItem('authToken', data.session.access_token);
        setUser(data.user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Registrierung erfolgreich!');
      } else {
        // If email confirmation required
        toast.success('Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.');
      }
      
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Registrierung');
      throw error;
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
        toast.success('Abgemeldet (Testmodus)');
        return;
      }
      
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      toast.success('Erfolgreich abgemeldet');
    } catch (error: any) {
      toast.error(error.message || 'Fehler bei der Abmeldung');
      console.error('Sign out error:', error);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    initializeAuth();
    
    // Auth state subscription only when not in test mode
    if (import.meta.env.VITE_TEST_MODE !== 'true') {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
          if (session) {
            localStorage.setItem('authToken', session.access_token);
            setUser(session.user);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(session.user));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update token when refreshed
          localStorage.setItem('authToken', session.access_token);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

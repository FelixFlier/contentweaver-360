// src/contexts/AuthContext.tsx - Modifiziere die AuthProvider-Komponente

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-Login für Entwicklungszwecke
    const mockUser = {
      id: 'mock-user-id',
      email: 'user@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { name: 'Test User' },
      created_at: new Date().toISOString()
    };
    
    const mockSession = {
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh',
      user: mockUser,
      expires_at: Math.floor(Date.now() / 1000) + 3600
    };

    setUser(mockUser as User);
    setSession(mockSession as Session);
    setIsLoading(false);
    
    // Speichere im localStorage für Persistenz
    localStorage.setItem('isLoggedIn', 'true');
    
    // Originaler Supabase Auth Code (auskommentiert)
    /*
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
    */
    
    return () => {};
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock-Anmeldung statt echter Authentifizierung
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: { name: 'Test User' },
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: mockUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600
      };
      
      setUser(mockUser as User);
      setSession(mockSession as Session);
      localStorage.setItem('isLoggedIn', 'true');
      
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
      // Mock-Registrierung
      const mockUser = {
        id: 'mock-user-id',
        email: email,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: { name: name },
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: mockUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600
      };
      
      setUser(mockUser as User);
      setSession(mockSession as Session);
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success('Registrierung erfolgreich');
      navigate('/');
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
      // Mock sign out
      setUser(null);
      setSession(null);
      localStorage.removeItem('isLoggedIn');
      
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
      
      // Mock Profil-Update
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            ...updates
          }
        };
      });
      
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

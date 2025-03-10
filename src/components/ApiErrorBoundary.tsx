import React, { useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ApiErrorBoundaryProps {
  children: ReactNode;
}

const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({ children }) => {
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [checkingBackend, setCheckingBackend] = useState(true);

  const checkBackendConnection = async () => {
    try {
      setCheckingBackend(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/health`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        // Verhindern, dass der Request ewig hängt
        signal: AbortSignal.timeout(5000)
      });
      
      setIsBackendAvailable(response.ok);
      
      if (!response.ok) {
        console.warn('Backend nicht erreichbar:', await response.text());
      }
    } catch (error) {
      console.error('Backend-Verbindungsfehler:', error);
      setIsBackendAvailable(false);
      
      // Im Testmodus keine Fehlermeldung anzeigen
      if (import.meta.env.VITE_TEST_MODE === 'true') {
        setIsBackendAvailable(true);
        toast.info('Backend-Verbindung nicht verfügbar. Test-Modus aktiv.');
      }
    } finally {
      setCheckingBackend(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
    
    // Regelmäßige Überprüfung alle 30 Sekunden
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (checkingBackend) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse">
          <p className="text-lg font-medium mb-2">Verbindung wird hergestellt...</p>
          <p className="text-sm text-muted-foreground">Bitte warten Sie einen Moment.</p>
        </div>
      </div>
    );
  }

  if (!isBackendAvailable && import.meta.env.VITE_TEST_MODE !== 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-destructive mb-4">Verbindungsproblem</h2>
          <p className="mb-4">
            Die Verbindung zum Backend-Server konnte nicht hergestellt werden. 
            Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Server-URL: {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
          </p>
          <div className="flex justify-center">
            <Button onClick={() => checkBackendConnection()}>
              Erneut versuchen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiErrorBoundary;

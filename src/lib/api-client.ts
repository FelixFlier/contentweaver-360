// src/lib/api-client.ts
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with baseURL from environment
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Request interceptor for auth token
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response) {
      // Server returned an error response
      const status = error.response.status;
      const message = error.response.data?.message || 'Ein Fehler ist aufgetreten';
      
      if (status === 401) {
        // Authentication error
        localStorage.removeItem('authToken');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/';
        toast.error('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
      } else if (status === 403) {
        toast.error('Sie haben keine Berechtigung für diese Aktion');
      } else if (status >= 500) {
        toast.error(`Server-Fehler: ${message}`);
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Keine Antwort vom Server. Bitte überprüfen Sie Ihre Internetverbindung.');
    } else {
      // Something else happened
      toast.error(`Fehler: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

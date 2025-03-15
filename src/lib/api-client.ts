// src/lib/api-client.ts
import { toast } from 'sonner';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeoutMs: number;
  private isTestMode: boolean;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    this.timeoutMs = 30000;
    this.isTestMode = import.meta.env.VITE_TEST_MODE === 'true';
    
    console.log('API Client initialized with:', {
      baseURL: this.baseURL,
      testMode: this.isTestMode
    });
  }

  /**
   * Make a request with timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    // In test mode, return mock responses instead of making real requests
    if (this.isTestMode) {
      return this.createMockResponse(url, options);
    }
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  }

  /**
   * Create a mock response for test mode
   */
  private createMockResponse(url: string, options: RequestInit): Promise<Response> {
    console.log('Test mode: Creating mock response for', url, options);
    
    // Default mock data
    const mockData = {
      success: true,
      message: 'This is a mock response in test mode',
      data: []
    };
    
    // Return a mock Response object
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      json: () => Promise.resolve(mockData),
      text: () => Promise.resolve(JSON.stringify(mockData)),
    } as Response);
  }

  /**
   * Get the auth token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Add auth token to headers if available
   */
  private createHeaders(contentType?: string): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    
    // Remove content-type for FormData
    if (contentType === 'multipart/form-data') {
      delete headers['Content-Type'];
    } else if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse(response: Response): Promise<any> {
    // In test mode, always return success
    if (this.isTestMode) {
      return response.json();
    }
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        const text = await response.text();
        errorData = { detail: text || response.statusText };
      }
      
      const errorMessage = errorData.detail || errorData.message || 'Ein Fehler ist aufgetreten';
      
      // Handle specific status codes
      if (response.status === 401) {
        // Never redirect in test mode
        if (!this.isTestMode) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isLoggedIn');
          window.location.href = '/';
        }
        toast.error('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
      } else if (response.status === 403) {
        toast.error('Sie haben keine Berechtigung für diese Aktion');
      } else if (response.status >= 500) {
        toast.error(`Server-Fehler: ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }
      
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  }

  /**
   * GET request
   */
  public async get(endpoint: string): Promise<any> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: this.createHeaders(),
      }, this.timeoutMs);
      
      return this.handleResponse(response);
    } catch (error: any) {
      // In test mode, return mock data instead of throwing errors
      if (this.isTestMode) {
        console.log('Test mode: Returning mock data for GET', endpoint);
        return {
          success: true,
          message: 'Mock response (error recovery)',
          data: []
        };
      }
      
      if (error.name === 'AbortError') {
        toast.error('Die Anfrage hat zu lange gedauert');
        throw new Error('Request timeout');
      }
      
      if (!window.navigator.onLine) {
        toast.error('Keine Internetverbindung');
        throw new Error('No internet connection');
      }
      
      throw error;
    }
  }

  /**
   * POST request
   */
  public async post(endpoint: string, data?: any, isFormData = false): Promise<any> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const contentType = isFormData ? 'multipart/form-data' : 'application/json';
      
      const body = isFormData 
        ? data // FormData should be sent as is
        : data ? JSON.stringify(data) : undefined;
      
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: this.createHeaders(contentType),
        body: body,
      }, this.timeoutMs);
      
      return this.handleResponse(response);
    } catch (error: any) {
      // In test mode, return mock data instead of throwing errors
      if (this.isTestMode) {
        console.log('Test mode: Returning mock data for POST', endpoint);
        return {
          success: true,
          message: 'Mock response (error recovery)',
          data: { id: 'mock-id-' + Math.random().toString(36).substring(2) }
        };
      }
      
      if (error.name === 'AbortError') {
        toast.error('Die Anfrage hat zu lange gedauert');
        throw new Error('Request timeout');
      }
      
      if (!window.navigator.onLine) {
        toast.error('Keine Internetverbindung');
        throw new Error('No internet connection');
      }
      
      throw error;
    }
  }

  /**
   * PUT request
   */
  public async put(endpoint: string, data?: any, isFormData = false): Promise<any> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const contentType = isFormData ? 'multipart/form-data' : 'application/json';
      
      const body = isFormData 
        ? data // FormData should be sent as is
        : data ? JSON.stringify(data) : undefined;
      
      const response = await this.fetchWithTimeout(url, {
        method: 'PUT',
        headers: this.createHeaders(contentType),
        body: body,
      }, this.timeoutMs);
      
      return this.handleResponse(response);
    } catch (error: any) {
      // In test mode, return mock data instead of throwing errors
      if (this.isTestMode) {
        console.log('Test mode: Returning mock data for PUT', endpoint);
        return {
          success: true,
          message: 'Mock response (error recovery)',
          data: { id: endpoint.split('/')[1] }
        };
      }
      
      if (error.name === 'AbortError') {
        toast.error('Die Anfrage hat zu lange gedauert');
        throw new Error('Request timeout');
      }
      
      if (!window.navigator.onLine) {
        toast.error('Keine Internetverbindung');
        throw new Error('No internet connection');
      }
      
      throw error;
    }
  }

  /**
   * DELETE request
   */
  public async delete(endpoint: string): Promise<any> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await this.fetchWithTimeout(url, {
        method: 'DELETE',
        headers: this.createHeaders(),
      }, this.timeoutMs);
      
      return this.handleResponse(response);
    } catch (error: any) {
      // In test mode, return mock data instead of throwing errors
      if (this.isTestMode) {
        console.log('Test mode: Returning mock data for DELETE', endpoint);
        return {
          success: true,
          message: 'Mock response (error recovery)'
        };
      }
      
      if (error.name === 'AbortError') {
        toast.error('Die Anfrage hat zu lange gedauert');
        throw new Error('Request timeout');
      }
      
      if (!window.navigator.onLine) {
        toast.error('Keine Internetverbindung');
        throw new Error('No internet connection');
      }
      
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;

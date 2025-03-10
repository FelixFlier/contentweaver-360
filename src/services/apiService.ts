import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Base API URL - adjust to your actual backend URL
const API_BASE = 'http://localhost:8000/api/v1';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

// Core API fetch function with auth
export const fetchAPI = async (endpoint: string, options: ApiOptions = {}) => {
  const { 
    method = 'GET', 
    body, 
    headers = {},
    isFormData = false 
  } = options;

  try {
    // Get current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    // Headers
    const requestHeaders: Record<string, string> = {
      'Accept': 'application/json',
      ...headers,
    };
    
    // Add auth token if available
    if (session?.access_token) {
      requestHeaders['Authorization'] = `Bearer ${session.access_token}`;
    }

    // Add content type for non-FormData requests
    if (!isFormData && method !== 'GET') {
      requestHeaders['Content-Type'] = 'application/json';
    }

    // Request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body if provided
    if (body) {
      requestOptions.body = isFormData ? body : JSON.stringify(body);
    }

    // Make request
    const response = await fetch(`${API_BASE}${endpoint}`, requestOptions);

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { detail: errorText };
      }
      throw new Error(errorData.detail || 'Ein Fehler ist aufgetreten');
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  } catch (error: any) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API Endpoints organized by feature
export const API = {
  // Workflow endpoints
  workflows: {
    list: async (skip = 0, limit = 50) => {
      try {
        return await fetchAPI(`/workflows?skip=${skip}&limit=${limit}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden der Workflows');
        console.error('Error listing workflows:', error);
        return [];
      }
    },
    
    get: async (id: string) => {
      try {
        return await fetchAPI(`/workflows/${id}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden des Workflows');
        console.error('Error getting workflow:', error);
        return null;
      }
    },
    
    create: async (data: any) => {
      try {
        return await fetchAPI('/workflows', {
          method: 'POST',
          body: data,
        });
      } catch (error: any) {
        toast.error('Fehler beim Erstellen des Workflows');
        console.error('Error creating workflow:', error);
        throw error;
      }
    },
    
    startStage: async (id: string, stage: string) => {
      try {
        return await fetchAPI(`/workflows/${id}/stages/${stage}/start`, {
          method: 'POST',
        });
      } catch (error: any) {
        toast.error('Fehler beim Starten der Phase');
        console.error('Error starting workflow stage:', error);
        throw error;
      }
    },
    
    addFeedback: async (id: string, stage: string, feedback: string) => {
      try {
        return await fetchAPI(`/workflows/${id}/stages/${stage}/feedback`, {
          method: 'POST',
          body: { feedback },
        });
      } catch (error: any) {
        toast.error('Fehler beim Hinzufügen von Feedback');
        console.error('Error adding feedback:', error);
        throw error;
      }
    },
    
    deleteWorkflow: async (id: string) => {
      try {
        return await fetchAPI(`/workflows/${id}`, {
          method: 'DELETE',
        });
      } catch (error: any) {
        toast.error('Fehler beim Löschen des Workflows');
        console.error('Error deleting workflow:', error);
        throw error;
      }
    },
  },
  
  // Document endpoints
  documents: {
    list: async (query = '', skip = 0, limit = 100) => {
      try {
        const queryStr = query ? `&${query}` : '';
        return await fetchAPI(`/documents?skip=${skip}&limit=${limit}${queryStr}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden der Dokumente');
        console.error('Error listing documents:', error);
        return [];
      }
    },
    
    get: async (id: string) => {
      try {
        return await fetchAPI(`/documents/${id}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden des Dokuments');
        console.error('Error getting document:', error);
        return null;
      }
    },
    
    upload: async (formData: FormData) => {
      try {
        return await fetchAPI('/documents', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler beim Hochladen des Dokuments');
        console.error('Error uploading document:', error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        return await fetchAPI(`/documents/${id}`, {
          method: 'DELETE',
        });
      } catch (error: any) {
        toast.error('Fehler beim Löschen des Dokuments');
        console.error('Error deleting document:', error);
        throw error;
      }
    },
  },
  
  // Source endpoints
  sources: {
    list: async (sourceType = '', quality = '', skip = 0, limit = 100) => {
      try {
        let queryParams = `skip=${skip}&limit=${limit}`;
        if (sourceType) queryParams += `&source_type=${sourceType}`;
        if (quality) queryParams += `&quality=${quality}`;
        
        return await fetchAPI(`/sources?${queryParams}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden der Quellen');
        console.error('Error listing sources:', error);
        return [];
      }
    },
    
    get: async (id: string) => {
      try {
        return await fetchAPI(`/sources/${id}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden der Quelle');
        console.error('Error getting source:', error);
        return null;
      }
    },
    
    addUrl: async (url: string, title?: string, extractNow = false) => {
      try {
        const formData = new FormData();
        formData.append('url', url);
        if (title) formData.append('title', title);
        formData.append('extract_now', String(extractNow));
        
        return await fetchAPI('/sources/url', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler beim Hinzufügen der URL');
        console.error('Error adding URL source:', error);
        throw error;
      }
    },
    
    addText: async (content: string, title: string, sourceType = 'manual') => {
      try {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('title', title);
        formData.append('source_type', sourceType);
        
        return await fetchAPI('/sources/text', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler beim Hinzufügen des Textes');
        console.error('Error adding text source:', error);
        throw error;
      }
    },
    
    extractContent: async (id: string, forceRefresh = false) => {
      try {
        return await fetchAPI(`/sources/${id}/extract?force_refresh=${forceRefresh}`, {
          method: 'POST',
        });
      } catch (error: any) {
        toast.error('Fehler beim Extrahieren des Inhalts');
        console.error('Error extracting content:', error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        return await fetchAPI(`/sources/${id}`, {
          method: 'DELETE',
        });
      } catch (error: any) {
        toast.error('Fehler beim Löschen der Quelle');
        console.error('Error deleting source:', error);
        throw error;
      }
    },
  },
  
  // Agent endpoints
  agents: {
    getTask: async (taskId: string) => {
      try {
        return await fetchAPI(`/agents/tasks/${taskId}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden des Tasks');
        console.error('Error getting task:', error);
        return null;
      }
    },
    
    research: async (topic: string, searchQueries?: string, sourceIds?: string[], urls?: string[]) => {
      try {
        const formData = new FormData();
        formData.append('topic', topic);
        if (searchQueries) formData.append('search_queries', searchQueries);
        if (sourceIds?.length) formData.append('source_ids', sourceIds.join(','));
        if (urls?.length) formData.append('urls', urls.join(','));
        
        return await fetchAPI('/agents/research', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Recherche');
        console.error('Error during research:', error);
        throw error;
      }
    },
    
    styleAnalysis: async (textSamples: string) => {
      try {
        const formData = new FormData();
        formData.append('text_samples', textSamples);
        
        return await fetchAPI('/agents/style-analysis', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Stilanalyse');
        console.error('Error during style analysis:', error);
        throw error;
      }
    },
    
    contentPlan: async (topic: string, researchData: string, styleProfile?: string) => {
      try {
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('research_data', researchData);
        if (styleProfile) formData.append('style_profile', styleProfile);
        
        return await fetchAPI('/agents/content-plan', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Content-Planung');
        console.error('Error during content planning:', error);
        throw error;
      }
    },
    
    write: async (topic: string, contentPlan: string, researchData: string, styleProfile?: string) => {
      try {
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('content_plan', contentPlan);
        formData.append('research_data', researchData);
        if (styleProfile) formData.append('style_profile', styleProfile);
        
        return await fetchAPI('/agents/write', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler beim Schreiben');
        console.error('Error during writing:', error);
        throw error;
      }
    },
    
    factCheck: async (article: string, sources: any) => {
      try {
        const formData = new FormData();
        formData.append('article', article);
        formData.append('sources', typeof sources === 'string' ? sources : JSON.stringify(sources));
        
        return await fetchAPI('/agents/fact-check', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Faktenprüfung');
        console.error('Error during fact checking:', error);
        throw error;
      }
    },
    
    edit: async (article: string, factCheckResults?: any, styleProfile?: string) => {
      try {
        const formData = new FormData();
        formData.append('article', article);
        if (factCheckResults) {
          formData.append('fact_check_results', 
            typeof factCheckResults === 'string' ? factCheckResults : JSON.stringify(factCheckResults));
        }
        if (styleProfile) formData.append('style_profile', styleProfile);
        
        return await fetchAPI('/agents/edit', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Bearbeitung');
        console.error('Error during editing:', error);
        throw error;
      }
    },
    
    seoOptimize: async (article: string, topic: string, additionalKeywords?: string) => {
      try {
        const formData = new FormData();
        formData.append('article', article);
        formData.append('topic', topic);
        if (additionalKeywords) formData.append('additional_keywords', additionalKeywords);
        
        return await fetchAPI('/agents/seo-optimize', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der SEO-Optimierung');
        console.error('Error during SEO optimization:', error);
        throw error;
      }
    },
  },
  
  // Social media endpoints
  socialMedia: {
    generate: async (articleTitle: string, articleContent: string, platforms = 'linkedin') => {
      try {
        const formData = new FormData();
        formData.append('article_title', articleTitle);
        formData.append('article_content', articleContent);
        formData.append('platforms', platforms);
        
        return await fetchAPI('/social-media/generate', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Generierung von Social-Media-Inhalten');
        console.error('Error generating social media content:', error);
        throw error;
      }
    },
    
    getResult: async (taskId: string) => {
      try {
        return await fetchAPI(`/social-media/generate/${taskId}`);
      } catch (error: any) {
        toast.error('Fehler beim Laden der Social-Media-Ergebnisse');
        console.error('Error getting social media results:', error);
        return null;
      }
    },
    
    generateLinkedIn: async (articleTitle: string, articleContent: string, focus = 'general') => {
      try {
        const formData = new FormData();
        formData.append('article_title', articleTitle);
        formData.append('article_content', articleContent);
        formData.append('focus', focus);
        
        return await fetchAPI('/social-media/linkedin', {
          method: 'POST',
          body: formData,
          isFormData: true,
        });
      } catch (error: any) {
        toast.error('Fehler bei der Generierung des LinkedIn-Posts');
        console.error('Error generating LinkedIn post:', error);
        throw error;
      }
    },
    
    fromWorkflow: async (workflowId: string, platforms = 'linkedin') => {
      try {
        return await fetchAPI(`/social-media/from-workflow/${workflowId}?platforms=${platforms}`, {
          method: 'POST',
        });
      } catch (error: any) {
        toast.error('Fehler bei der Generierung von Social-Media-Inhalten aus dem Workflow');
        console.error('Error generating social media from workflow:', error);
        throw error;
      }
    },
  },
};

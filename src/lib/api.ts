// lib/api.ts
import { Session } from "next-auth";

type ApiOptions = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/v1';

// Helper für API-Anfragen mit Auth
export const fetchAPI = async (
  endpoint: string, 
  session: Session | null, 
  options: ApiOptions = {}
) => {
  const { 
    method = 'GET', 
    body, 
    headers = {},
    isFormData = false 
  } = options;

  // Headers zusammenstellen
  const requestHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...headers,
  };
  
  // Auth-Token hinzufügen, wenn vorhanden
  if (session?.token) {
    requestHeaders['Authorization'] = `Bearer ${session.token}`;
  }

  // Content-Type nur hinzufügen, wenn keine FormData verwendet wird
  if (!isFormData && method !== 'GET') {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Anfrage konfigurieren
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  // Body hinzufügen, wenn vorhanden
  if (body) {
    requestOptions.body = isFormData ? body : JSON.stringify(body);
  }

  // Anfrage durchführen
  const response = await fetch(`${API_BASE}${endpoint}`, requestOptions);

  // Fehlerbehandlung
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

  // Prüfen, ob die Antwort JSON ist
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

// API-Client mit allen Endpunkten
export const API = {
  workflows: {
    list: (session: Session | null, skip = 0, limit = 50) => 
      fetchAPI(`/workflows?skip=${skip}&limit=${limit}`, session),
    
    get: (session: Session | null, id: string) => 
      fetchAPI(`/workflows/${id}`, session),
    
    create: (session: Session | null, data: any) => 
      fetchAPI('/workflows', session, {
        method: 'POST',
        body: data,
      }),
    
    startStage: (session: Session | null, id: string, stage: string) => 
      fetchAPI(`/workflows/${id}/stages/${stage}/start`, session, {
        method: 'POST',
      }),
    
    addFeedback: (session: Session | null, id: string, stage: string, feedback: string) => 
      fetchAPI(`/workflows/${id}/stages/${stage}/feedback`, session, {
        method: 'POST',
        body: { feedback },
      }),
      
    deleteWorkflow: (session: Session | null, id: string) =>
      fetchAPI(`/workflows/${id}`, session, {
        method: 'DELETE',
      }),
  },
  
  documents: {
    list: (session: Session | null, tags?: string[], skip = 0, limit = 100) => {
      const tagsParam = tags?.length ? `tags=${tags.join(',')}` : '';
      return fetchAPI(`/documents?${tagsParam}&skip=${skip}&limit=${limit}`, session);
    },
    
    get: (session: Session | null, id: string) => 
      fetchAPI(`/documents/${id}`, session),
    
    upload: (session: Session | null, file: File, tags?: string[]) => {
      const formData = new FormData();
      formData.append('file', file);
      
      if (tags?.length) {
        formData.append('tags', tags.join(','));
      }
      
      return fetchAPI('/documents', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    delete: (session: Session | null, id: string) =>
      fetchAPI(`/documents/${id}`, session, {
        method: 'DELETE',
      }),
  },
  
  sources: {
    list: (session: Session | null, sourceType?: string, quality?: string, skip = 0, limit = 100) => {
      let queryParams = `skip=${skip}&limit=${limit}`;
      if (sourceType) queryParams += `&source_type=${sourceType}`;
      if (quality) queryParams += `&quality=${quality}`;
      
      return fetchAPI(`/sources?${queryParams}`, session);
    },
    
    get: (session: Session | null, id: string) => 
      fetchAPI(`/sources/${id}`, session),
    
    addUrl: (session: Session | null, url: string, title?: string, extractNow = false) => {
      const formData = new FormData();
      formData.append('url', url);
      if (title) formData.append('title', title);
      formData.append('extract_now', String(extractNow));
      
      return fetchAPI('/sources/url', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    addText: (session: Session | null, content: string, title: string, sourceType = 'manual') => {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('title', title);
      formData.append('source_type', sourceType);
      
      return fetchAPI('/sources/text', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    extractContent: (session: Session | null, id: string, forceRefresh = false) =>
      fetchAPI(`/sources/${id}/extract?force_refresh=${forceRefresh}`, session, {
        method: 'POST',
      }),
      
    delete: (session: Session | null, id: string) =>
      fetchAPI(`/sources/${id}`, session, {
        method: 'DELETE',
      }),
  },
  
  agents: {
    getTask: (session: Session | null, taskId: string) => 
      fetchAPI(`/agents/tasks/${taskId}`, session),
    
    research: (session: Session | null, topic: string, searchQueries?: string, sourceIds?: string[], urls?: string[]) => {
      const formData = new FormData();
      formData.append('topic', topic);
      if (searchQueries) formData.append('search_queries', searchQueries);
      if (sourceIds?.length) formData.append('source_ids', sourceIds.join(','));
      if (urls?.length) formData.append('urls', urls.join(','));
      
      return fetchAPI('/agents/research', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    styleAnalysis: (session: Session | null, textSamples: string) => {
      const formData = new FormData();
      formData.append('text_samples', textSamples);
      
      return fetchAPI('/agents/style-analysis', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    contentPlan: (session: Session | null, topic: string, researchData: string, styleProfile?: string) => {
      const formData = new FormData();
      formData.append('topic', topic);
      formData.append('research_data', researchData);
      if (styleProfile) formData.append('style_profile', styleProfile);
      
      return fetchAPI('/agents/content-plan', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    write: (session: Session | null, topic: string, contentPlan: string, researchData: string, styleProfile?: string) => {
      const formData = new FormData();
      formData.append('topic', topic);
      formData.append('content_plan', contentPlan);
      formData.append('research_data', researchData);
      if (styleProfile) formData.append('style_profile', styleProfile);
      
      return fetchAPI('/agents/write', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    factCheck: (session: Session | null, article: string, sources: string) => {
      const formData = new FormData();
      formData.append('article', article);
      formData.append('sources', sources);
      
      return fetchAPI('/agents/fact-check', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    edit: (session: Session | null, article: string, factCheckResults?: string, styleProfile?: string) => {
      const formData = new FormData();
      formData.append('article', article);
      if (factCheckResults) formData.append('fact_check_results', factCheckResults);
      if (styleProfile) formData.append('style_profile', styleProfile);
      
      return fetchAPI('/agents/edit', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    seoOptimize: (session: Session | null, article: string, topic: string, additionalKeywords?: string) => {
      const formData = new FormData();
      formData.append('article', article);
      formData.append('topic', topic);
      if (additionalKeywords) formData.append('additional_keywords', additionalKeywords);
      
      return fetchAPI('/agents/seo-optimize', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
  },
  
  socialMedia: {
    generate: (session: Session | null, articleTitle: string, articleContent: string, platforms = 'linkedin') => {
      const formData = new FormData();
      formData.append('article_title', articleTitle);
      formData.append('article_content', articleContent);
      formData.append('platforms', platforms);
      
      return fetchAPI('/social-media/generate', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    getResult: (session: Session | null, taskId: string) => 
      fetchAPI(`/social-media/generate/${taskId}`, session),
    
    generateLinkedIn: (session: Session | null, articleTitle: string, articleContent: string, focus = 'general') => {
      const formData = new FormData();
      formData.append('article_title', articleTitle);
      formData.append('article_content', articleContent);
      formData.append('focus', focus);
      
      return fetchAPI('/social-media/linkedin', session, {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    },
    
    fromWorkflow: (session: Session | null, workflowId: string, platforms = 'linkedin') =>
      fetchAPI(`/social-media/from-workflow/${workflowId}?platforms=${platforms}`, session, {
        method: 'POST',
      }),
  },
};

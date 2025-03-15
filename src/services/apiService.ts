// src/services/apiService.ts
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

// Types for agent tasks
export interface AgentTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

// API Service with all endpoints
export const API = {
  // Workflow endpoints
  workflows: {
    list: async (skip = 0, limit = 50) => {
      try {
        const response = await apiClient.get(`/api/v1/workflows?skip=${skip}&limit=${limit}`);
        return response.data;
      } catch (error: any) {
        console.error('Error listing workflows:', error);
        return [];
      }
    },
    
    get: async (id: string) => {
      try {
        const response = await apiClient.get(`/api/v1/workflows/${id}`);
        return response.data;
      } catch (error: any) {
        console.error('Error getting workflow:', error);
        return null;
      }
    },
    
    create: async (data: any) => {
      try {
        const response = await apiClient.post('/api/v1/workflows', data);
        return response.data;
      } catch (error: any) {
        console.error('Error creating workflow:', error);
        throw error;
      }
    },
    
    update: async (id: string, data: any) => {
      try {
        const response = await apiClient.put(`/api/v1/workflows/${id}`, data);
        return response.data;
      } catch (error: any) {
        console.error('Error updating workflow:', error);
        throw error;
      }
    },
    
    startStage: async (id: string, stage: string) => {
      try {
        const response = await apiClient.post(`/api/v1/workflows/${id}/stages/${stage}/start`);
        return response.data;
      } catch (error: any) {
        console.error('Error starting workflow stage:', error);
        throw error;
      }
    },
    
    addFeedback: async (id: string, stage: string, feedback: string) => {
      try {
        const response = await apiClient.post(`/api/v1/workflows/${id}/stages/${stage}/feedback`, { 
          feedback 
        });
        return response.data;
      } catch (error: any) {
        console.error('Error adding feedback:', error);
        throw error;
      }
    },
    
    reviseStage: async (id: string, stage: string, feedback: string, revision_instructions?: string) => {
      try {
        const response = await apiClient.post(`/api/v1/workflows/${id}/stages/${stage}/revise`, { 
          feedback, 
          revision_instructions 
        });
        return response.data;
      } catch (error: any) {
        console.error('Error revising stage:', error);
        throw error;
      }
    },
    
    deleteWorkflow: async (id: string) => {
      try {
        const response = await apiClient.delete(`/api/v1/workflows/${id}`);
        return response.data;
      } catch (error: any) {
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
        const response = await apiClient.get(`/api/v1/documents?skip=${skip}&limit=${limit}${queryStr}`);
        return response.data;
      } catch (error: any) {
        console.error('Error listing documents:', error);
        return [];
      }
    },
    
    get: async (id: string) => {
      try {
        const response = await apiClient.get(`/api/v1/documents/${id}`);
        return response.data;
      } catch (error: any) {
        console.error('Error getting document:', error);
        return null;
      }
    },
    
    upload: async (formData: FormData) => {
      try {
        const response = await apiClient.post('/api/v1/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('Error uploading document:', error);
        throw error;
      }
    },
    
    update: async (id: string, formData: FormData) => {
      try {
        const response = await apiClient.put(`/api/v1/documents/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error: any) {
        console.error('Error updating document:', error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/api/v1/documents/${id}`);
        return response.data.success;
      } catch (error: any) {
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
        
        const response = await apiClient.get(`/api/v1/sources?${queryParams}`);
        return response.data;
      } catch (error: any) {
        console.error('Error listing sources:', error);
        return [];
      }
    },
    
    get: async (id: string) => {
      try {
        const response = await apiClient.get(`/api/v1/sources/${id}`);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/sources/url', formData);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/sources/text', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error adding text source:', error);
        throw error;
      }
    },
    
    extractContent: async (id: string, forceRefresh = false) => {
      try {
        const response = await apiClient.post(`/api/v1/sources/${id}/extract?force_refresh=${forceRefresh}`);
        return response.data;
      } catch (error: any) {
        console.error('Error extracting content:', error);
        throw error;
      }
    },
    
    search: async (query: string, numResults: number = 5) => {
      try {
        const formData = new FormData();
        formData.append('query', query);
        formData.append('num_results', String(numResults));
        formData.append('extract_content', 'true');
        
        const response = await apiClient.post('/api/v1/sources/search', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error performing search:', error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        const response = await apiClient.delete(`/api/v1/sources/${id}`);
        return response.data.success;
      } catch (error: any) {
        console.error('Error deleting source:', error);
        throw error;
      }
    },
  },
  
  // Agent endpoints
  agents: {
    getTask: async (taskId: string): Promise<AgentTask> => {
      try {
        const response = await apiClient.get(`/api/v1/agents/tasks/${taskId}`);
        return response.data;
      } catch (error: any) {
        console.error('Error getting task:', error);
        throw error;
      }
    },
    
    research: async (topic: string, searchQueries?: string, sourceIds?: string[], urls?: string[]) => {
      try {
        const formData = new FormData();
        formData.append('topic', topic);
        if (searchQueries) formData.append('search_queries', searchQueries);
        if (sourceIds?.length) formData.append('source_ids', sourceIds.join(','));
        if (urls?.length) formData.append('urls', urls.join(','));
        
        const response = await apiClient.post('/api/v1/agents/research', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error during research:', error);
        throw error;
      }
    },
    
    styleAnalysis: async (textSamples: string) => {
      try {
        const formData = new FormData();
        formData.append('text_samples', textSamples);
        
        const response = await apiClient.post('/api/v1/agents/style-analysis', formData);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/agents/content-plan', formData);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/agents/write', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error during writing:', error);
        throw error;
      }
    },
    
    factCheck: async (article: string, sources: any) => {
      try {
        const formData = new FormData();
        formData.append('article', article);
        formData.append('sources', typeof sources === 'string' ? sources : JSON.stringify(sources));
        
        const response = await apiClient.post('/api/v1/agents/fact-check', formData);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/agents/edit', formData);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/agents/seo-optimize', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error during SEO optimization:', error);
        throw error;
      }
    },
    
    workflowExecution: async (workflowId: string, stage: string) => {
      try {
        const response = await apiClient.post(`/api/v1/agents/workflow-execution/${workflowId}/${stage}`);
        return response.data;
      } catch (error: any) {
        console.error('Error executing workflow stage:', error);
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
        
        const response = await apiClient.post('/api/v1/social-media/generate', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error generating social media content:', error);
        throw error;
      }
    },
    
    getResult: async (taskId: string) => {
      try {
        const response = await apiClient.get(`/api/v1/social-media/generate/${taskId}`);
        return response.data;
      } catch (error: any) {
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
        
        const response = await apiClient.post('/api/v1/social-media/linkedin', formData);
        return response.data;
      } catch (error: any) {
        console.error('Error generating LinkedIn post:', error);
        throw error;
      }
    },
    
    fromWorkflow: async (workflowId: string, platforms = 'linkedin') => {
      try {
        const response = await apiClient.post(`/api/v1/social-media/from-workflow/${workflowId}?platforms=${platforms}`);
        return response.data;
      } catch (error: any) {
        console.error('Error generating social media from workflow:', error);
        throw error;
      }
    },
  },
};

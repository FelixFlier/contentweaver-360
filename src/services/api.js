import { fetchAPI, submitFormData } from '../lib/api';

// Workflow-Dienste
export const workflowService = {
  // Workflow erstellen
  create: (data) => fetchAPI('/workflows', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Alle Workflows abrufen
  getAll: () => fetchAPI('/workflows'),
  
  // Workflow nach ID abrufen
  getById: (id) => fetchAPI(`/workflows/${id}`),
  
  // Workflow-Stage starten
  startStage: (workflowId, stage) => fetchAPI(`/workflows/${workflowId}/stages/${stage}/start`, {
    method: 'POST',
  }),
  
  // Feedback zu einem Workflow-Stage hinzufügen
  addFeedback: (workflowId, stage, data) => fetchAPI(`/workflows/${workflowId}/stages/${stage}/feedback`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Dokument-Dienste
export const documentService = {
  // Dokument hochladen
  upload: (file, tags = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (tags) formData.append('tags', tags);
    
    return fetchAPI('/documents', {
      method: 'POST',
      headers: {}, // Content-Type wird automatisch gesetzt
      body: formData,
    });
  },
  
  // Alle Dokumente abrufen
  getAll: (tags) => {
    const queryParams = tags ? `?tags=${tags}` : '';
    return fetchAPI(`/documents${queryParams}`);
  },
};

// Source-Dienste
export const sourceService = {
  // URL-Quelle hinzufügen
  addUrl: (url, title = '', extractNow = false) => {
    return submitFormData('/sources/url', {
      url,
      title,
      extract_now: extractNow,
    });
  },
  
  // Text-Quelle hinzufügen
  addText: (content, title, sourceType = 'manual') => {
    return submitFormData('/sources/text', {
      content,
      title,
      source_type: sourceType,
    });
  },
  
  // Alle Quellen abrufen
  getAll: (sourceType, quality) => {
    let queryParams = '';
    if (sourceType || quality) {
      queryParams = '?';
      if (sourceType) queryParams += `source_type=${sourceType}`;
      if (sourceType && quality) queryParams += '&';
      if (quality) queryParams += `quality=${quality}`;
    }
    return fetchAPI(`/sources${queryParams}`);
  },
};

// Agent-Dienste
export const agentService = {
  // Agent-Task abrufen
  getTask: (taskId) => fetchAPI(`/agents/tasks/${taskId}`),
  
  // Research durchführen
  research: (topic, searchQueries = '', sourceIds = '', urls = '') => {
    return submitFormData('/agents/research', {
      topic,
      search_queries: searchQueries,
      source_ids: sourceIds,
      urls,
    });
  },
  
  // Content-Plan erstellen
  createContentPlan: (topic, researchData, styleProfile = '') => {
    return submitFormData('/agents/content-plan', {
      topic,
      research_data: researchData,
      style_profile: styleProfile,
    });
  },
  
  // Artikel schreiben
  writeArticle: (topic, contentPlan, researchData, styleProfile = '') => {
    return submitFormData('/agents/write', {
      topic,
      content_plan: contentPlan,
      research_data: researchData,
      style_profile: styleProfile,
    });
  },
};

// Social Media Dienste
export const socialMediaService = {
  // Social Media Posts generieren
  generate: (articleTitle, articleContent, platforms = 'linkedin') => {
    return submitFormData('/social-media/generate', {
      article_title: articleTitle,
      article_content: articleContent,
      platforms,
    });
  },
  
  // LinkedIn-Post generieren
  generateLinkedIn: (articleTitle, articleContent, focus = 'general') => {
    return submitFormData('/social-media/linkedin', {
      article_title: articleTitle,
      article_content: articleContent,
      focus,
    });
  },
};

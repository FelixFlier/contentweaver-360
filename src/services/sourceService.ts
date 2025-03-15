// src/services/sourceService.ts
import { API } from '@/services/apiService';
import { toast } from 'sonner';

export interface Source {
  id: string;
  title: string;
  url?: string;
  content?: string;
  author?: string;
  date_published?: string;
  source_type: string;
  quality?: string;
  tags: string[];
  user_id: string;
  created_at: string;
}

export interface SourceCreateInput {
  url?: string;
  title: string;
  content?: string;
  source_type: string;
}

/**
 * Get all sources for the current user
 */
export const getUserSources = async (
  sourceType?: string,
  quality?: string
): Promise<Source[]> => {
  try {
    return await API.sources.list(sourceType, quality);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Quellen');
    console.error('Error fetching sources:', error);
    return [];
  }
};

/**
 * Get source by ID
 */
export const getSourceById = async (id: string): Promise<Source | null> => {
  try {
    return await API.sources.get(id);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Quelle');
    console.error('Error fetching source by id:', error);
    return null;
  }
};

/**
 * Add URL source
 */
export const addUrlSource = async (
  url: string,
  title?: string,
  extractNow = false
): Promise<Source | null> => {
  try {
    return await API.sources.addUrl(url, title, extractNow);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Hinzufügen der URL-Quelle');
    console.error('Error adding URL source:', error);
    return null;
  }
};

/**
 * Add text source
 */
export const addTextSource = async (
  content: string,
  title: string,
  sourceType = 'manual'
): Promise<Source | null> => {
  try {
    return await API.sources.addText(content, title, sourceType);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Hinzufügen der Text-Quelle');
    console.error('Error adding text source:', error);
    return null;
  }
};

/**
 * Extract content from URL source
 */
export const extractSourceContent = async (
  id: string,
  forceRefresh = false
): Promise<Source | null> => {
  try {
    return await API.sources.extractContent(id, forceRefresh);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Extrahieren des Inhalts');
    console.error('Error extracting source content:', error);
    return null;
  }
};

/**
 * Search for sources
 */
export const searchSources = async (
  query: string,
  numResults = 5
): Promise<Source[]> => {
  try {
    return await API.sources.search(query, numResults);
  } catch (error: any) {
    toast.error(error.message || 'Fehler bei der Suche');
    console.error('Error searching sources:', error);
    return [];
  }
};

/**
 * Delete source
 */
export const deleteSource = async (id: string): Promise<boolean> => {
  try {
    return await API.sources.delete(id);
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Löschen der Quelle');
    console.error('Error deleting source:', error);
    return false;
  }
};

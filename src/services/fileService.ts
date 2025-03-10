import { API } from '@/services/apiService';
import { toast } from 'sonner';

export interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  content_id?: string | null;
  created_at: string;
  user_id: string;
}

export interface FileInput {
  file: File;
  content_id?: string | null;
}

/**
 * Upload a file using the documents API
 */
export const uploadFile = async ({ file, content_id }: FileInput): Promise<FileRecord | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add tags if needed
    if (content_id) {
      formData.append('tags', `content:${content_id}`);
    }
    
    // Upload through documents API
    const response = await API.documents.upload(formData);
    
    // If content_id was provided, we need to update the file record
    if (content_id && response && response.id) {
      // This would be handled by a file update endpoint in a real implementation
      // For now, we'll just return the response with the content_id added
      return {
        ...response,
        content_id
      };
    }
    
    toast.success('Datei erfolgreich hochgeladen');
    return response;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Hochladen der Datei');
    console.error('Error uploading file:', error);
    return null;
  }
};

/**
 * Get all files for a specific content
 */
export const getContentFiles = async (contentId: string): Promise<FileRecord[]> => {
  try {
    // Query documents API with content_id filter
    const files = await API.documents.list(`tags=content:${contentId}`);
    return files || [];
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Dateien');
    console.error('Error fetching content files:', error);
    return [];
  }
};

/**
 * Get file URL
 */
export const getFileUrl = (path: string): string => {
  // In a real implementation, this might be a call to an API endpoint
  // For now, we'll just return a placeholder URL
  return `/api/files/${path}`;
};

/**
 * Delete a file
 */
export const deleteFile = async (id: string, path: string): Promise<boolean> => {
  try {
    // Delete through documents API
    await API.documents.delete(id);
    
    toast.success('Datei erfolgreich gelöscht');
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Löschen der Datei');
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Subscribe to file changes (placeholder for Supabase realtime)
 * In the future, this could be replaced with WebSocket or polling
 */
export const subscribeToFiles = (contentId: string, callback: (payload: any) => void) => {
  console.log('File subscription requested for content', contentId);
  
  // For now, just set up a simple interval to refresh the files
  const intervalId = setInterval(async () => {
    try {
      const files = await getContentFiles(contentId);
      callback({ 
        eventType: 'REFRESH', 
        new: files
      });
    } catch (error) {
      console.error('Error in file subscription:', error);
    }
  }, 10000); // Poll every 10 seconds
  
  // Return unsubscribe function
  return () => {
    clearInterval(intervalId);
    console.log('File subscription ended for content', contentId);
  };
};

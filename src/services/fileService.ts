// src/services/fileService.ts
import { API } from '@/services/apiService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      // Update the file with content_id
      const formData = new FormData();
      formData.append('content_id', content_id);
      
      const updated = await API.documents.update(response.id, formData);
      if (updated) {
        return updated;
      }
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
    const files = await API.documents.list(`content_id=${contentId}`);
    return files || [];
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Dateien');
    console.error('Error fetching content files:', error);
    return [];
  }
};

/**
 * Get public file URL
 */
export const getFileUrl = (path: string): string => {
  if (import.meta.env.VITE_TEST_MODE === 'true') {
    // In test mode, return a placeholder image
    return '/placeholder.svg';
  }
  
  try {
    // Get public URL from Supabase
    const bucket = path.split('/')[0]; // Extract bucket name from path
    const filePath = path.split('/').slice(1).join('/'); // Extract file path
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return '/placeholder.svg';
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (id: string, path: string): Promise<boolean> => {
  try {
    // Delete from Supabase Storage
    if (!import.meta.env.VITE_TEST_MODE) {
      const bucket = path.split('/')[0]; // Extract bucket name from path
      const filePath = path.split('/').slice(1).join('/'); // Extract file path
      await supabase.storage.from(bucket).remove([filePath]);
    }
    
    // Delete file record through documents API
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
 * Subscribe to file changes using Supabase Realtime
 */
export const subscribeToFiles = (contentId: string, callback: (payload: any) => void) => {
  if (import.meta.env.VITE_TEST_MODE === 'true') {
    console.log('File subscription requested for content', contentId);
    // In test mode: Set up a simple interval to refresh the files
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
  } else {
    // Production mode: Use Supabase Realtime
    const channel = supabase
      .channel(`files-${contentId}`)
      .on('postgres_changes', {
        event: '*', 
        schema: 'public', 
        table: 'files',
        filter: `content_id=eq.${contentId}`
      }, (payload) => {
        callback(payload);
      })
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

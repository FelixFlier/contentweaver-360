
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  content_id?: string | null;
  created_at: string;
}

export interface FileInput {
  file: File;
  content_id?: string | null;
}

// Upload a file
export const uploadFile = async ({ file, content_id }: FileInput): Promise<FileRecord | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${content_id ? `content/${content_id}` : 'general'}/${fileName}`;

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('content_files')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('content_files')
      .getPublicUrl(filePath);

    // Add to files table
    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .insert([
        {
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          content_id: content_id || null
        }
      ])
      .select('*')
      .single();

    if (fileError) {
      throw fileError;
    }

    toast.success('Datei erfolgreich hochgeladen');
    return fileData;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Hochladen der Datei');
    console.error('Error uploading file:', error);
    return null;
  }
};

// Get files associated with a content
export const getContentFiles = async (contentId: string): Promise<FileRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('content_id', contentId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Dateien');
    console.error('Error fetching content files:', error);
    return [];
  }
};

// Get file URL
export const getFileUrl = (path: string): string => {
  const { data } = supabase.storage.from('content_files').getPublicUrl(path);
  return data.publicUrl;
};

// Delete a file
export const deleteFile = async (id: string, path: string): Promise<boolean> => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('content_files')
      .remove([path]);

    if (storageError) {
      throw storageError;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw dbError;
    }

    toast.success('Datei erfolgreich gelöscht');
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Löschen der Datei');
    console.error('Error deleting file:', error);
    return false;
  }
};

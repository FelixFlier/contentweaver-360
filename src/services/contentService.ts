
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Content {
  id: string;
  title: string;
  description: string | null;
  type: 'blog' | 'linkedin';
  content: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ContentCreateInput {
  title: string;
  description?: string;
  type: 'blog' | 'linkedin';
  content?: string;
  styleId?: string;
}

export interface ContentUpdateInput {
  title?: string;
  description?: string;
  content?: string;
  status?: 'draft' | 'published';
}

// Aktiviert Supabase-Channel für Realtime-Updates
export const subscribeToContents = (callback: (payload: any) => void) => {
  const channel = supabase
    .channel('content-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'contents' 
      }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Get all contents for authenticated user
export const getUserContents = async (): Promise<Content[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Nicht angemeldet');
    }
    
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Typsichere Konvertierung der Daten
    const typedData = (data || []).map(item => ({
      ...item,
      type: item.type as 'blog' | 'linkedin',
      status: item.status as 'draft' | 'published'
    }));

    return typedData as Content[];
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden der Inhalte');
    console.error('Error fetching contents:', error);
    return [];
  }
};

// Get a specific content by id
export const getContentById = async (id: string): Promise<Content | null> => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Typsichere Konvertierung
    const typedData = {
      ...data,
      type: data.type as 'blog' | 'linkedin',
      status: data.status as 'draft' | 'published'
    };

    return typedData as Content;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Laden des Inhalts');
    console.error('Error fetching content by id:', error);
    return null;
  }
};

// Create a new content
export const createContent = async (input: ContentCreateInput): Promise<Content | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Nicht angemeldet');
    }
    
    const { data, error } = await supabase
      .from('contents')
      .insert([{
        ...input,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Typsichere Konvertierung
    const typedData = {
      ...data,
      type: data.type as 'blog' | 'linkedin',
      status: data.status as 'draft' | 'published'
    };

    toast.success('Inhalt erfolgreich erstellt');
    return typedData as Content;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Erstellen des Inhalts');
    console.error('Error creating content:', error);
    return null;
  }
};

// Update an existing content
export const updateContent = async (id: string, input: ContentUpdateInput): Promise<Content | null> => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Typsichere Konvertierung
    const typedData = {
      ...data,
      type: data.type as 'blog' | 'linkedin',
      status: data.status as 'draft' | 'published'
    };

    toast.success('Inhalt erfolgreich aktualisiert');
    return typedData as Content;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Aktualisieren des Inhalts');
    console.error('Error updating content:', error);
    return null;
  }
};

// Delete a content
export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contents')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    toast.success('Inhalt erfolgreich gelöscht');
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Löschen des Inhalts');
    console.error('Error deleting content:', error);
    return false;
  }
};

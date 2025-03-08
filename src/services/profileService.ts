
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  location: string | null;
  joined_date: string;
  avatar_url: string | null;
  updated_at: string;
}

export interface ProfileUpdateInput {
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
}

// Get the user's profile
export const getUserProfile = async (): Promise<Profile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update the user's profile
export const updateUserProfile = async (updates: ProfileUpdateInput): Promise<Profile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success('Profil aktualisiert');
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Aktualisieren des Profils');
    console.error('Error updating profile:', error);
    return null;
  }
};

// Upload avatar image
export const uploadAvatar = async (file: File): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

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

    // Update profile with avatar URL
    await updateUserProfile({ avatar_url: urlData.publicUrl });

    return urlData.publicUrl;
  } catch (error: any) {
    toast.error(error.message || 'Fehler beim Hochladen des Avatars');
    console.error('Error uploading avatar:', error);
    return null;
  }
};

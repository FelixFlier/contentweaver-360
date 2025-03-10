// src/integrations/supabase/client.ts - Vervollständigte Version
import { createClient, Client } from '@supabase/supabase-js';
import { Database } from './types';

// Umgebungsvariablen für Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zxhziuydweffrcwhoodd.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHppdXlkd2VmZnJjd2hvb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjMxMzQsImV4cCI6MjA1Njk5OTEzNH0.CaW9Xkq6P2SLP1FrXsOpAoCqmybKchX5P3WzsEpSQ9U";

// Gecachter Supabase Client
let supabaseInstance: Client | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseInstance;
};

// Exportiere den Client für einfachen Import
export const supabase = getSupabaseClient();

// Supabase Manager für erweiterte Operationen
export class SupabaseManager {
  client: Client;

  constructor() {
    this.client = supabase;
  }

  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async store_file(bucket: string, path: string, file_data: ArrayBuffer | string): Promise<string> {
    try {
      const { error } = await this.client.storage
        .from(bucket)
        .upload(path, file_data, {
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data } = this.client.storage
        .from(bucket)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Error storing file:', error);
      throw error;
    }
  }

  async get_file(bucket: string, path: string): Promise<Uint8Array | null> {
    try {
      const { data, error } = await this.client.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  }
}

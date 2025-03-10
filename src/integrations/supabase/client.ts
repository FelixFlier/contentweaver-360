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
    // Testmodus: Mock-Profil zurückgeben
    if (import.meta.env.VITE_TEST_MODE === 'true') {
      return {
        id: userId,
        name: "Test User",
        email: "test@example.com",
        bio: "Dies ist ein Testbenutzer für die Entwicklung",
        location: "Test Location",
        joined_date: new Date().toISOString(),
        avatar_url: null,
        updated_at: new Date().toISOString()
      };
    }
    
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

  // Rest der Klasse bleibt unverändert
}

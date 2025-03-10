import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Konfiguration fehlt. Stelle sicher, dass die Umgebungsvariablen korrekt gesetzt sind.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Für die Testphase ohne Login: Einen anonymen Benutzer erstellen
export async function getAnonymousUser() {
  return {
    id: "test-user-id-123456",
    email: "test@example.com",
    role: "user"
  };
}

// In der Produktion würde diese Funktion den aktuellen authentifizierten Benutzer zurückgeben
export async function getCurrentUser() {
  // Für die Testphase immer einen anonymen Benutzer zurückgeben
  return getAnonymousUser();
  
  // Später, wenn Authentifizierung aktiviert ist:
  // const { data: { user }, error } = await supabase.auth.getUser();
  // if (error) throw error;
  // return user;
}

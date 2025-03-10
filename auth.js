import { supabase } from './supabase';

// Auth-Zustand überprüfen
export async function checkAuth() {
  // Für Testphase immer true zurückgeben
  return true;
  
  // In Produktion:
  // const { data, error } = await supabase.auth.getSession();
  // return !!data.session;
}

// Token für API-Anfragen abrufen
export async function getAuthToken() {
  // Für Testphase leeren String zurückgeben
  return '';
  
  // In Produktion:
  // const { data } = await supabase.auth.getSession();
  // return data.session?.access_token || '';
}

// Auth-Listener für Zustandsänderungen einrichten
export function setupAuthListener(callback) {
  // Für Testphase nichts tun
  return () => {};
  
  // In Produktion:
  // const { data } = supabase.auth.onAuthStateChange((event, session) => {
  //   callback(event, session);
  // });
  // return data.subscription.unsubscribe;
}

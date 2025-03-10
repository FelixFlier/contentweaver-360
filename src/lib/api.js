const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api/v1`;

// Hilfsfunktion für API-Aufrufe
export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Token hinzufügen, falls vorhanden (für spätere Authentifizierungsimplementierung)
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!res.ok) {
    const error = new Error('Ein API-Fehler ist aufgetreten');
    error.status = res.status;
    try {
      error.info = await res.json();
    } catch (e) {
      error.info = { message: 'Detaillierte Fehlerinformationen konnten nicht geladen werden' };
    }
    throw error;
  }

  return res.json();
}

// Hilfsfunktion für Formularübermittlungen
export async function submitFormData(endpoint, data, options = {}) {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    // Arrays als kommaseparierte Strings umwandeln
    if (Array.isArray(value)) {
      formData.append(key, value.join(','));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return fetchAPI(endpoint, {
    method: 'POST',
    headers: {}, // Content-Type wird automatisch von FormData gesetzt
    body: formData,
    ...options,
  });
}

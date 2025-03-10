// Hilfsfunktionen für sicheren localStorage-Zugriff
export function getLocalStorageItem(key: string, defaultValue: any = null): any {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    try {
      return JSON.parse(item);
    } catch {
      return item; // Falls es kein JSON ist
    }
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

export function setLocalStorageItem(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage';

interface TutorialState {
  hasSeenTutorial: boolean;
  showTutorial: boolean;
  setHasSeenTutorial: (value: boolean) => void;
  setShowTutorial: (value: boolean) => void;
}

// SSR-kompatibler Storage für Zustand
const customStorage = {
  getItem: getLocalStorageItem,
  setItem: setLocalStorageItem,
  removeItem: (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

export const useTutorial = create<TutorialState>()(
  persist(
    (set) => ({
      hasSeenTutorial: false,
      showTutorial: false,
      setHasSeenTutorial: (value) => set({ hasSeenTutorial: value }),
      setShowTutorial: (value) => set({ showTutorial: value }),
    }),
    {
      name: 'tutorial-storage',
      storage: customStorage as any,
    }
  )
);

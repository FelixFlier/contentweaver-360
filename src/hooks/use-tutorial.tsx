
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialState {
  hasSeenTutorial: boolean;
  showTutorial: boolean;
  setHasSeenTutorial: (value: boolean) => void;
  setShowTutorial: (value: boolean) => void;
}

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
    }
  )
);

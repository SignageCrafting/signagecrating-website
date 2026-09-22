import { create } from 'zustand';

interface AppState {
  currentRoute: string;
  activeStage: number;
  activeServiceNode: number | null;
  theme: 'light' | 'dark';
  setActiveStage: (stage: number) => void;
  setActiveServiceNode: (node: number | null) => void;
  setCurrentRoute: (route: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRoute: '/',
  activeStage: 0,
  activeServiceNode: null,
  theme: 'light',
  setActiveStage: (stage) => set({ activeStage: stage }),
  setActiveServiceNode: (node) => set({ activeServiceNode: node }),
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setTheme: (theme) => set({ theme }),
}));

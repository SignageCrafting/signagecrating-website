import { create } from 'zustand';

interface AppState {
  mobileMenuOpen: boolean;
  theme: 'dark' | 'light';
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useStore = create<AppState>((set) => ({
  mobileMenuOpen: false,
  // Always start dark so server-rendered HTML matches the first browser render;
  // Layout applies a saved light theme right after.
  theme: 'dark',
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleTheme: () => set((s) => {
    const newTheme = s.theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('theme', newTheme); } catch { /* storage blocked */ }
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    return { theme: newTheme };
  }),
  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('theme', theme); } catch { /* storage blocked */ }
      document.documentElement.setAttribute('data-theme', theme);
    }
    return { theme };
  }),
}));

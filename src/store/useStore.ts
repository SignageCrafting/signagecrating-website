import { create } from 'zustand';

// Three looks: fully dark, fully light, and "system" — dark with alternating
// light bands between sections.
export type Theme = 'dark' | 'light' | 'system';

export const THEMES: Theme[] = ['dark', 'light', 'system'];

interface AppState {
  mobileMenuOpen: boolean;
  theme: Theme;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  cycleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function apply(theme: Theme) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Storage blocked (private mode); the choice just won't be remembered.
  }
  document.documentElement.setAttribute('data-theme', theme);
}

export const useStore = create<AppState>((set) => ({
  mobileMenuOpen: false,
  // Always start dark so server-rendered HTML matches the first browser render;
  // Layout applies a saved theme right after.
  theme: 'dark',
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  cycleTheme: () => set((s) => {
    const next = THEMES[(THEMES.indexOf(s.theme) + 1) % THEMES.length];
    apply(next);
    return { theme: next };
  }),
  setTheme: (theme) => set(() => {
    apply(theme);
    return { theme };
  }),
}));

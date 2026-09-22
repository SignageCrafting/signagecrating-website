import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStore } from '@/store/useStore';
import { useContent } from '@/content/store';
import { pageMeta } from '@/seo/head';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  const content = useContent();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // The server sets these for the first page; keep them right while navigating.
  useEffect(() => {
    const { title, description } = pageMeta(location.pathname, content);
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [location.pathname, content]);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {
      // Storage can be blocked (private mode); keep the default theme.
    }
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [setTheme]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{
      backgroundColor: theme === 'dark' ? '#080c0d' : '#f8f5f0',
      color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

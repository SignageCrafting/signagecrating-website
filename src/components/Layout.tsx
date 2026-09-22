import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStore } from '@/store/useStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light';
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [setTheme]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{
      backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8f5f0',
      color: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

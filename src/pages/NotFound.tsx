import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function NotFound() {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const accent = isDark ? '#fd4601' : '#c43500';

  return (
    <div className="pt-40 pb-32 text-center px-4" style={{ backgroundColor: isDark ? '#080c0d' : '#f8f5f0' }}>
      <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>404</p>
      <h1 className="font-trajan font-bold text-3xl md:text-5xl mb-4" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>PAGE NOT FOUND</h1>
      <p className="font-helvetica text-base mb-8" style={{ color: isDark ? '#888' : '#5a5a5a' }}>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>BACK TO HOME <ArrowRight size={16} /></Link>
    </div>
  );
}

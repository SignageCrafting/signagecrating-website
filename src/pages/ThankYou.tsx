import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { telHref, useContent } from '@/content/store';

// Shown after a form is sent. Its address (/quote/thank-you, /contact/thank-you)
// can be used as a URL-based conversion goal in Google Ads.
export default function ThankYou({ form }: { form: 'quote' | 'contact' }) {
  const theme = useStore((s) => s.theme);
  const content = useContent();
  const { business } = content;
  const { successTitle, successText } = content[form];
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';

  return (
    <div className="pt-32 pb-24 px-4 transition-colors duration-300" style={{ backgroundColor: isDark ? '#0a0a0a' : '#f8f5f0' }}>
      <div className="max-w-xl mx-auto text-center p-10 md:p-12 rounded-2xl border" style={{ backgroundColor: isDark ? '#111' : '#f0ece5', borderColor: accent }}>
        <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
          <CheckCircle2 size={30} style={{ color: accent }} />
        </div>
        <h1 className="font-trajan font-bold text-2xl md:text-3xl mb-3" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>{successTitle}</h1>
        <p className="font-helvetica text-base mb-8" style={{ color: text }}>{successText}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/sign-types" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>BROWSE SIGN TYPES <ArrowRight size={14} /></Link>
          {business.phone && (
            <a href={telHref(business.phone)} className="btn-outline text-sm" style={{ border: `1px solid ${border}`, color: text }}><Phone size={14} /> {business.phone}</a>
          )}
        </div>
      </div>
    </div>
  );
}

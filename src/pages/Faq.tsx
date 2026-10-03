import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { telHref, useContent } from '@/content/store';
import FaqList from '@/components/FaqList';

export default function Faq() {
  const theme = useStore((s) => s.theme);
  const { business, faq } = useContent();
  const isDark = theme !== 'light';
  const accent = '#ff5a1a';
  const heading = isDark ? '#fff' : '#1a1a1a';
  const text = isDark ? '#888' : '#5a5a5a';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: isDark ? '#080c0d' : '#ffffff' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{faq.label}</p>
          <h1 className="font-trajan font-bold title-page mb-4" style={{ color: heading }}>{faq.title}</h1>
          <p className="font-helvetica text-base text-body max-w-xl mx-auto" style={{ color: text }}>{faq.subtitle}</p>
        </div>

        <FaqList items={faq.items} />

        <div className="mt-12 text-center p-8 rounded-2xl border" style={{ backgroundColor: isDark ? '#050809' : '#f0ece5', borderColor: border }}>
          <h2 className="font-trajan font-bold title-sub mb-4" style={{ color: heading }}>Still have a question?</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={telHref(business.phone)} className="btn-outline text-sm" style={{ border: `1px solid ${border}`, color: text }}><Phone size={14} /> {business.phone}</a>
            <Link to="/contact" className="btn-primary text-sm" style={{ backgroundColor: accent, color: '#080c0d' }}>CONTACT US <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

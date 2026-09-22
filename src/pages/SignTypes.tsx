import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import FadeIn from '@/components/FadeIn';
import { telHref, useContent } from '@/content/store';

export default function SignTypes() {
  const [activeCategory, setActiveCategory] = useState('');
  const theme = useStore((s) => s.theme);
  const { business, signTypes, signTypesPage: page } = useContent();
  const categories = [...new Set(signTypes.map((s) => s.category).filter(Boolean))];
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const bg = isDark ? '#0a0a0a' : '#f8f5f0';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const heading = isDark ? '#fff' : '#1a1a1a';

  const filtered = activeCategory ? signTypes.filter((s) => s.category === activeCategory) : signTypes;

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn eager className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{page.label}</p>
          <h1 className="font-trajan font-bold text-4xl md:text-5xl mb-4" style={{ color: heading }}>{page.title}</h1>
          <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>{page.subtitle}</p>
        </FadeIn>

        {/* Filter Tabs */}
        <FadeIn className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {['', ...categories].map((cat) => (
            <button key={cat || 'all'} onClick={() => setActiveCategory(cat)}
              className="px-5 py-2.5 rounded-full font-helvetica text-sm font-medium transition-all duration-200"
              style={{ backgroundColor: activeCategory === cat ? accent : 'transparent', color: activeCategory === cat ? (isDark ? '#0a0a0a' : '#fff') : text, border: `1px solid ${activeCategory === cat ? accent : border}` }}>
              {cat || page.allLabel}
            </button>
          ))}
        </FadeIn>

        {/* Sign Type Sections */}
        <div className="space-y-16">
          {filtered.map((sign, i) => (
            <FadeIn key={sign.id || sign.name}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className={`grid grid-cols-3 gap-3 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {sign.images.map((img, j) => (
                    <div key={j} className={`rounded-xl overflow-hidden ${j === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
                      <img src={img} alt={`${sign.name} ${j + 1}`} className="w-full h-full object-cover" loading={i === 0 && j === 0 ? 'eager' : 'lazy'} decoding="async" />
                    </div>
                  ))}
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-mono text-xs tracking-wider uppercase mb-3 block" style={{ color: accent }}>{sign.category}</span>
                  <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-4" style={{ color: heading }}><Link to={`/sign-types/${sign.id}`} className="hover:underline">{sign.name}</Link></h2>
                  <p className="font-helvetica text-base leading-relaxed mb-6" style={{ color: text }}>{sign.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {sign.features.map((feat, j) => (
                      <span key={j} className="font-helvetica text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.08)' : 'rgba(13,148,136,0.08)', color: accent, border: `1px solid ${isDark ? 'rgba(0,243,255,0.15)' : 'rgba(13,148,136,0.15)'}` }}>{feat}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link to="/quote" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>{page.quoteButtonLabel} <ArrowRight size={14} /></Link>
                    {sign.startingPrice && <span className="font-trajan font-semibold text-lg" style={{ color: accent }}>{page.pricePrefix} {sign.startingPrice}</span>}
                    <Link to={`/sign-types/${sign.id}`} className="inline-flex items-center gap-1 font-helvetica text-sm font-medium" style={{ color: text }} aria-label={`Learn more about ${sign.name}`}>Learn more <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="mt-20 text-center p-10 rounded-2xl border" style={{ backgroundColor: isDark ? '#050505' : '#f0ece5', borderColor: border }}>
          <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-4" style={{ color: heading }}>{page.ctaTitle}</h2>
          <p className="font-helvetica text-base mb-6" style={{ color: text }}>{page.ctaText}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={telHref(business.phone)} className="btn-outline text-sm" style={{ border: `1px solid ${border}`, color: text }}><Phone size={14} /> {business.phone}</a>
            <Link to="/quote" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>{page.ctaButtonLabel} <ArrowRight size={14} /></Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

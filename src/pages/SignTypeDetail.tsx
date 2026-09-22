import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { telHref, useContent } from '@/content/store';
import NotFound from './NotFound';

export default function SignTypeDetail() {
  const { id } = useParams();
  const theme = useStore((s) => s.theme);
  const { business, signTypes, signTypesPage: page } = useContent();
  const sign = signTypes.find((s) => s.id === id);
  if (!sign) return <NotFound />;

  const others = signTypes.filter((s) => s.id !== sign.id);
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const bg = isDark ? '#0a0a0a' : '#f8f5f0';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const muted = isDark ? '#555' : '#8a8a8a';
  const heading = isDark ? '#fff' : '#1a1a1a';

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 font-helvetica text-xs" style={{ color: muted }}>
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><ChevronRight size={12} /></li>
            <li><Link to="/sign-types" className="hover:underline">{page.label}</Link></li>
            <li><ChevronRight size={12} /></li>
            <li aria-current="page" style={{ color: text }}>{sign.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="grid grid-cols-3 gap-3">
            {sign.images.map((img, j) => (
              <div key={j} className={`rounded-xl overflow-hidden ${j === 0 ? 'col-span-3 aspect-[4/3]' : 'aspect-square'}`}>
                <img src={img} alt={`${sign.name} example ${j + 1}`} className="w-full h-full object-cover" loading={j === 0 ? 'eager' : 'lazy'} decoding="async" />
              </div>
            ))}
          </div>

          <div>
            <span className="font-mono text-xs tracking-wider uppercase mb-3 block" style={{ color: accent }}>{sign.category}</span>
            <h1 className="font-trajan font-bold text-3xl md:text-5xl mb-5" style={{ color: heading }}>{sign.name}</h1>
            <p className="font-helvetica text-lg leading-relaxed mb-6" style={{ color: text }}>{sign.description}</p>
            {sign.features.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {sign.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 font-helvetica text-sm" style={{ color: text }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.15)' : 'rgba(13,148,136,0.15)' }}>
                      <Check size={12} style={{ color: accent }} />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            )}
            {sign.startingPrice && (
              <p className="font-trajan font-semibold text-2xl mb-8" style={{ color: accent }}>{page.pricePrefix} {sign.startingPrice}</p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link to="/quote" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>{page.quoteButtonLabel} <ArrowRight size={16} /></Link>
              <a href={telHref(business.phone)} className="btn-outline" style={{ border: `1px solid ${border}`, color: text }}><Phone size={16} /> {business.phone}</a>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-20">
            <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-8" style={{ color: heading }}>Other Sign Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {others.map((o) => (
                <Link key={o.id} to={`/sign-types/${o.id}`} className="group rounded-xl overflow-hidden border block" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="aspect-square overflow-hidden">
                    {o.images[0] && <img src={o.images[0]} alt={o.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />}
                  </div>
                  <p className="p-3 font-helvetica text-sm font-medium" style={{ color: heading }}>{o.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

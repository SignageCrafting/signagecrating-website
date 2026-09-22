import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import FadeIn from '@/components/FadeIn';
import { telHref, useContent } from '@/content/store';
import MultiLine from '@/content/MultiLine';
import RichText from '@/content/RichText';

const statColumns = ['md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:grid-cols-5', 'md:grid-cols-6'];

export default function About() {
  const theme = useStore((s) => s.theme);
  const { business, about } = useContent();
  const isDark = theme === 'dark';
  const accent = isDark ? '#fd4601' : '#c43500';
  const bg = isDark ? '#080c0d' : '#f8f5f0';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const muted = isDark ? '#555' : '#8a8a8a';
  const heading = isDark ? '#fff' : '#1a1a1a';

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <FadeIn eager className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{about.label}</p>
          <h1 className="font-trajan font-bold text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: heading }}><MultiLine text={about.title} />{about.titleHighlight && <> <span style={{ color: accent }}>{about.titleHighlight}</span></>}</h1>
          <p className="font-helvetica text-lg max-w-2xl mx-auto" style={{ color: text }}>{about.subtitle}</p>
        </FadeIn>

        {/* Story + Image */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
          <FadeIn>
            <div className="rounded-2xl overflow-hidden border h-80 lg:h-[420px]" style={{ borderColor: border }}>
              {about.image && <img src={about.image} alt={business.name} className="w-full h-full object-cover" />}
            </div>
          </FadeIn>
          <FadeIn>
            <div>
              <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-5" style={{ color: heading }}>{about.storyTitle}</h2>
              <RichText text={about.story} linkColor={accent} strongColor={heading} className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: text }} />
            </div>
          </FadeIn>
        </div>

        {/* Stats */}
        <FadeIn className="mb-20">
          <div className={`grid grid-cols-2 ${statColumns[Math.max(1, Math.min(about.stats.length, 6)) - 1]} gap-6 p-8 rounded-2xl border`} style={{ backgroundColor: cardBg, borderColor: border }}>
            {about.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-trajan font-bold text-3xl md:text-4xl" style={{ color: accent }}>{stat.value}</p>
                <p className="font-helvetica text-sm mt-1" style={{ color: muted }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Values */}
        <FadeIn className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{about.valuesLabel}</p>
          <h2 className="font-trajan font-bold text-3xl md:text-4xl" style={{ color: heading }}>{about.valuesTitle}</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {about.values.map((v, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-6 rounded-2xl border h-full text-center transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(253,70,1,0.1)' : 'rgba(196,53,0,0.1)' }}>
                  <span className="font-trajan font-bold text-sm" style={{ color: accent }}>{v.icon}</span>
                </div>
                <h3 className="font-trajan font-semibold text-base mb-2" style={{ color: heading }}>{v.title}</h3>
                <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="text-center p-10 rounded-2xl border" style={{ backgroundColor: isDark ? '#050809' : '#f0ece5', borderColor: border }}>
          <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-4" style={{ color: heading }}>{about.ctaTitle}</h2>
          <p className="font-helvetica text-base mb-6" style={{ color: text }}>{about.ctaText}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href={telHref(business.phone)} className="btn-outline text-sm" style={{ border: `1px solid ${border}`, color: text }}><Phone size={14} /> {business.phone}</a>
            <Link to="/quote" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>{about.ctaButtonLabel} <ArrowRight size={14} /></Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

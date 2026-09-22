import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star, Phone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import FadeIn from '@/components/FadeIn';
import { telHref, useContent } from '@/content/store';
import MultiLine from '@/content/MultiLine';
import FaqList from '@/components/FaqList';

const statColumns = ['lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:grid-cols-5', 'lg:grid-cols-6'];

const cubeFaces = [
  'translateZ(190px)',
  'rotateY(180deg) translateZ(190px)',
  'rotateY(90deg) translateZ(190px)',
  'rotateY(-90deg) translateZ(190px)',
  'rotateX(90deg) translateZ(190px)',
  'rotateX(-90deg) translateZ(190px)',
];

function SignCube3D({ isDark, images }: { isDark: boolean; images: string[] }) {
  if (images.length === 0) return null;
  return (
    <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[380px] h-[380px]" style={{ perspective: '1000px' }}>
      <div className="relative w-full h-full animate-spin-3d" style={{ transformStyle: 'preserve-3d' }}>
        {cubeFaces.map((transform, i) => (
          <div key={i} className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform, borderColor: isDark ? '#fd4601' : '#c43500' }}>
            <img src={images[i % images.length]} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const theme = useStore((s) => s.theme);
  const { business, home, signTypes, faq } = useContent();
  const homeFaqs = faq.items.slice(0, Math.max(0, faq.homeLimit));
  const { hero, stats, collection, process, why, portfolio, testimonials, cta } = home;
  const homeSignTypes = signTypes.filter((s) => s.showOnHome);
  const tel = telHref(business.phone);
  const isDark = theme === 'dark';
  const accent = isDark ? '#fd4601' : '#c43500';
  const bg = isDark ? '#080c0d' : '#f8f5f0';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const muted = isDark ? '#555' : '#8a8a8a';
  const heading = isDark ? '#fff' : '#1a1a1a';

  return (
    <div className="transition-colors duration-300" style={{ backgroundColor: bg }}>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <FadeIn eager>
              {hero.badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-6" style={{ backgroundColor: isDark ? 'rgba(253,70,1,0.1)' : 'rgba(196,53,0,0.1)', color: accent, border: `1px solid ${isDark ? 'rgba(253,70,1,0.2)' : 'rgba(196,53,0,0.2)'}` }}>
                  <Star size={12} fill={accent} /> {hero.badge}
                </div>
              )}
              <h1 className="font-trajan font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6" style={{ color: heading }}>
                <MultiLine text={hero.headline} />{hero.headlineHighlight && <> <span style={{ color: accent }}>{hero.headlineHighlight}</span></>}
              </h1>
              <p className="font-helvetica text-lg leading-relaxed mb-8 max-w-lg" style={{ color: text }}>
                {hero.description}
              </p>
              <div className="space-y-3 mb-10">
                {hero.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(253,70,1,0.15)' : 'rgba(196,53,0,0.15)' }}>
                      <Check size={12} style={{ color: accent }} />
                    </div>
                    <span className="font-helvetica text-sm" style={{ color: text }}>{feat}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/quote" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>{hero.ctaLabel} <ArrowRight size={16} /></Link>
                <a href={tel} className="btn-outline" style={{ border: `1px solid ${border}`, color: text }}><Phone size={16} /> {business.phone}</a>
              </div>
              {hero.trustPoints.length > 0 && (
                <div className="mt-10 pt-6 flex items-center gap-6 flex-wrap" style={{ borderTop: `1px solid ${border}` }}>
                  <p className="font-helvetica text-xs" style={{ color: muted }}>{hero.trustLabel}</p>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {hero.trustPoints.map((point, i) => (
                      <span key={i} className="font-helvetica text-xs font-medium" style={{ color: muted }}>{point}</span>
                    ))}
                  </div>
                </div>
              )}
            </FadeIn>
            <SignCube3D isDark={isDark} images={hero.cubeImages} />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      {stats.length > 0 && (
        <section className="border-y transition-colors duration-300" style={{ backgroundColor: isDark ? '#050809' : '#f0ece5', borderColor: border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className={`grid grid-cols-2 md:grid-cols-3 ${statColumns[Math.min(stats.length, 6) - 1]} gap-6 text-center`}>
              {stats.map((stat, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <p className="font-trajan font-bold text-2xl md:text-3xl" style={{ color: accent }}>{stat.value}</p>
                  <p className="font-helvetica text-xs mt-1" style={{ color: muted }}>{stat.label}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SIGN COLLECTION */}
      <section className="golden-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{collection.label}</p>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>{collection.title}</h2>
            <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>{collection.subtitle}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeSignTypes.map((sign, i) => (
              <FadeIn key={sign.id || i} delay={i * 0.1}>
                <div className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="relative h-52 overflow-hidden">
                    {sign.images[0] && <img src={sign.images[0]} alt={sign.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />}
                    {sign.tag && <span className="absolute top-3 left-3 font-mono text-xs px-3 py-1 rounded-full" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>{sign.tag}</span>}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-trajan font-semibold text-lg" style={{ color: heading }}>{sign.name}</h3>
                      <span className="font-helvetica text-xs" style={{ color: muted }}>{sign.designs}</span>
                    </div>
                    <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{sign.shortDescription}</p>
                    <Link to={`/sign-types/${sign.id}`} className="inline-flex items-center gap-1.5 font-helvetica text-sm font-medium mt-4 transition-colors" style={{ color: accent }} aria-label={`${collection.detailsLabel}: ${sign.name}`}>{collection.detailsLabel} <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center mt-12">
            <Link to="/sign-types" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>{collection.buttonLabel} <ArrowRight size={16} /></Link>
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      {process.steps.length > 0 && (
        <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-16">
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{process.label}</p>
              <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>{process.title}</h2>
              <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>{process.subtitle}</p>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.steps.map((step, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="text-center p-8 rounded-2xl border h-full transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 font-trajan font-bold text-xl" style={{ backgroundColor: isDark ? 'rgba(253,70,1,0.1)' : 'rgba(196,53,0,0.1)', color: accent, border: `1px solid ${isDark ? 'rgba(253,70,1,0.2)' : 'rgba(196,53,0,0.2)'}` }}>{String(i + 1).padStart(2, '0')}</div>
                    <h3 className="font-trajan font-semibold text-lg mb-3" style={{ color: heading }}>{step.title}</h3>
                    <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      {why.items.length > 0 && (
        <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-16">
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{why.label}</p>
              <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>{why.title}</h2>
              <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>{why.subtitle}</p>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {why.items.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl border h-full text-center transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                    <div className="w-12 h-12 mx-auto mb-5 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(253,70,1,0.1)' : 'rgba(196,53,0,0.1)' }}>
                      <span className="font-trajan font-bold text-sm" style={{ color: accent }}>{item.icon}</span>
                    </div>
                    <h3 className="font-trajan font-semibold text-base mb-3" style={{ color: heading }}>{item.title}</h3>
                    <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PORTFOLIO */}
      {portfolio.images.length > 0 && (
        <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-16">
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{portfolio.label}</p>
              <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>{portfolio.title}</h2>
              <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>{portfolio.subtitle}</p>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolio.images.map((img, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                    <img src={img} alt={`${portfolio.title} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                    {portfolio.hoverLabel && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }}>
                        <span className="font-helvetica text-sm font-medium" style={{ color: accent }}>{portfolio.hoverLabel}</span>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.items.length > 0 && (
        <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-16">
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{testimonials.label}</p>
              <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>{testimonials.title}</h2>
              <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>{testimonials.subtitle}</p>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.items.map((t, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: Math.max(0, Math.min(5, Math.round(t.rating))) }).map((_, j) => (
                        <Star key={j} size={14} fill={accent} style={{ color: accent }} />
                      ))}
                    </div>
                    <p className="font-helvetica text-sm leading-relaxed mb-5" style={{ color: text }}>"{t.text}"</p>
                    <div>
                      <p className="font-trajan font-semibold text-sm" style={{ color: heading }}>{t.name}</p>
                      <p className="font-helvetica text-xs" style={{ color: muted }}>{t.role}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {homeFaqs.length > 0 && (
        <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{faq.label}</p>
              <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>{faq.homeTitle}</h2>
            </FadeIn>
            <FaqList items={homeFaqs} isDark={isDark} />
            {faq.items.length > homeFaqs.length && (
              <div className="text-center mt-8">
                <Link to="/faq" className="inline-flex items-center gap-1.5 font-helvetica text-sm font-medium" style={{ color: accent }}>See all questions <ArrowRight size={14} /></Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section className="py-20 md:py-28 border-t" style={{ backgroundColor: isDark ? '#050809' : '#f0ece5', borderColor: border }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-6" style={{ color: heading }}>{cta.title}</h2>
            <p className="font-helvetica text-lg mb-10 max-w-xl mx-auto" style={{ color: text }}>{cta.text}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/quote" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>{cta.buttonLabel} <ArrowRight size={16} /></Link>
              <a href={tel} className="btn-outline" style={{ border: `1px solid ${border}`, color: text }}><Phone size={16} /> {business.phone}</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

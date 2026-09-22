import { useRef } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useStore } from '@/store/useStore';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

function FadeIn({ children, className = '', delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, ease: 'easeOut', delay }} className={className} style={style}>
      {children}
    </motion.div>
  );
}

const values = [
  { icon: 'Quality', title: 'Craftsmanship First', desc: 'Every sign is handcrafted by skilled artisans using premium materials. We never cut corners.' },
  { icon: 'Innovation', title: 'Innovation', desc: 'We stay ahead of industry trends, incorporating the latest LED technology and design techniques.' },
  { icon: 'Integrity', title: 'Integrity', desc: 'Transparent pricing, honest timelines, and clear communication. No hidden fees, no surprises.' },
  { icon: 'Service', title: 'Customer Service', desc: 'From your first inquiry to post-installation support, we are with you every step of the way.' },
];

export default function About() {
  const theme = useStore((s) => s.theme);
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
        {/* Hero */}
        <FadeIn className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>About Us</p>
          <h1 className="font-trajan font-bold text-4xl md:text-5xl lg:text-6xl mb-6" style={{ color: heading }}>CRAFTING SIGNS<br />THAT <span style={{ color: accent }}>STAND OUT</span></h1>
          <p className="font-helvetica text-lg max-w-2xl mx-auto" style={{ color: text }}>For over 15 years, Signage Crafting has been the trusted partner for businesses seeking premium custom signage solutions.</p>
        </FadeIn>

        {/* Story + Image */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
          <FadeIn>
            <div className="rounded-2xl overflow-hidden border h-80 lg:h-[420px]" style={{ borderColor: border }}>
              <img src="/about-workshop.jpg" alt="Signage Crafting Workshop" className="w-full h-full object-cover" />
            </div>
          </FadeIn>
          <FadeIn>
            <div>
              <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-5" style={{ color: heading }}>OUR STORY</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: text }}>
                <p>Signage Crafting was founded with a simple mission: to create signs that don't just display a name, but tell a story. What started as a small workshop in Lodi, California has grown into a nationwide leader in custom signage.</p>
                <p>Over the past 15 years, we have crafted over 10,000 signs for businesses ranging from local coffee shops to Fortune 500 companies. Our team of designers, engineers, and craftsmen brings together decades of combined experience.</p>
                <p>We believe that every business deserves a sign that reflects its unique identity. That is why we offer fully customized solutions, from concept to installation, ensuring that your sign is as unique as your brand.</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats */}
        <FadeIn className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border" style={{ backgroundColor: cardBg, borderColor: border }}>
            {[
              { value: '15+', label: 'Years in Business' },
              { value: '10,000+', label: 'Signs Crafted' },
              { value: '3,500+', label: 'Happy Clients' },
              { value: '50+', label: 'States Served' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-trajan font-bold text-3xl md:text-4xl" style={{ color: accent }}>{stat.value}</p>
                <p className="font-helvetica text-sm mt-1" style={{ color: muted }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Values */}
        <FadeIn className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Our Values</p>
          <h2 className="font-trajan font-bold text-3xl md:text-4xl" style={{ color: heading }}>WHAT DRIVES US</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((v, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-6 rounded-2xl border h-full text-center transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                  <span className="font-trajan font-bold text-sm" style={{ color: accent }}>{v.icon}</span>
                </div>
                <h3 className="font-trajan font-semibold text-base mb-2" style={{ color: heading }}>{v.title}</h3>
                <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{v.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="text-center p-10 rounded-2xl border" style={{ backgroundColor: isDark ? '#050505' : '#f0ece5', borderColor: border }}>
          <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-4" style={{ color: heading }}>LET'S WORK TOGETHER</h2>
          <p className="font-helvetica text-base mb-6" style={{ color: text }}>Ready to create a sign that makes your business unforgettable? Get in touch today.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+12093404633" className="btn-outline text-sm" style={{ border: `1px solid ${border}`, color: text }}><Phone size={14} /> +1 (209) 340-4633</a>
            <a href="/quote" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>GET A FREE QUOTE <ArrowRight size={14} /></a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

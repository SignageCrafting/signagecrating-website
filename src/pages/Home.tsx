import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star, Phone } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useStore } from '@/store/useStore';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, ease: 'easeOut', delay }} className={className}>
      {children}
    </motion.div>
  );
}

const heroFeatures = ['Free digital mockup in 2 hours', 'Premium materials & craftsmanship', 'Nationwide delivery & installation'];

const trustPoints = ['2-Year Warranty', 'Free Digital Mockup', 'Nationwide Delivery', 'No-Obligation Quote'];

const signTypes = [
  { name: 'Neon Signs', image: '/neon-sign-01.jpg', tag: 'Most Popular', designs: '450+ Designs', desc: 'Eye-catching LED neon signs with vibrant colors and custom shapes. Perfect for storefronts, bars, and modern interiors.' },
  { name: 'Light Box Signs', image: '/portfolio-01.jpg', tag: 'Bestseller', designs: '320+ Designs', desc: 'Illuminated cabinet signs with even, bright lighting. Great for retail stores, restaurants, and professional offices.' },
  { name: '3D Channel Letters', image: '/channel-letters-01.jpg', tag: 'Premium', designs: '280+ Designs', desc: 'Individual dimensional letters with LED illumination. The gold standard for corporate branding and retail visibility.' },
  { name: 'Blade Signs', image: '/blade-sign-01.jpg', tag: 'Classic', designs: '150+ Designs', desc: 'Projecting signs mounted perpendicular to the building. Ideal for pedestrian-heavy streets and shopping districts.' },
  { name: 'Metal Signs', image: '/metal-sign-01.jpg', tag: 'Durable', designs: '200+ Designs', desc: 'Brushed aluminum, stainless steel, and brass signs. Sleek, professional, and built to last for decades.' },
  { name: 'Monument Signs', image: '/monument-sign-01.jpg', tag: 'Outdoor', designs: '120+ Designs', desc: 'Free-standing ground signs for businesses, shopping centers, and residential communities. Bold visibility from the road.' },
];

const howItWorks = [
  { step: '01', title: 'Request a Quote', desc: 'Fill out our quick form with your project details. We respond with a detailed quote within 2 hours.' },
  { step: '02', title: 'Design & Approve', desc: 'Our designers create a digital mockup of your sign. Review, request revisions, and approve when perfect.' },
  { step: '03', title: 'Production', desc: 'We craft your sign using premium materials and state-of-the-art manufacturing. Quality checked at every step.' },
  { step: '04', title: 'Delivery & Install', desc: 'Your sign is carefully packaged and shipped, or our team installs it at your location. Ready to shine!' },
];

const whyChooseUs = [
  { icon: 'Quality', title: 'Premium Materials', desc: 'We use only the highest-grade LEDs, acrylics, metals, and weatherproof components. Every sign is built to last.' },
  { icon: 'Speed', title: 'Fast Turnaround', desc: 'Most orders ship within 7-10 business days. Rush orders available for tight deadlines.' },
  { icon: 'Support', title: 'Expert Support', desc: 'Our team of designers and engineers guide you through every step, from concept to installation.' },
  { icon: 'Warranty', title: '2-Year Warranty', desc: 'Every sign comes with a comprehensive 2-year warranty. We stand behind our craftsmanship 100%.' },
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Owner, Brew & Bloom Cafe', rating: 5, text: 'Signage Crafting transformed our storefront. The neon sign they designed perfectly captures our brand. Sales increased 30% in the first month!' },
  { name: 'James Rodriguez', role: 'Manager, Apex Fitness', rating: 5, text: 'Professional from start to finish. The channel letters look incredible on our building. Installation was seamless and the team was fantastic.' },
  { name: 'Emily Chen', role: 'Director, Lumiere Boutique', rating: 5, text: 'I shopped around for months. Signage Crafting offered the best quality at the best price. Our lightbox sign is absolutely stunning.' },
  { name: 'Michael Torres', role: 'Owner, El Sabor Restaurant', rating: 5, text: 'They nailed the design on the first mockup. The metal sign with LED backlighting gives our restaurant such a premium feel. Highly recommend!' },
];

function SignCube3D({ isDark }: { isDark: boolean }) {
  return (
    <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[380px] h-[380px]" style={{ perspective: '1000px' }}>
      <div className="relative w-full h-full animate-spin-3d" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform: 'translateZ(190px)', borderColor: isDark ? '#00f3ff' : '#0d9488' }}><img src="/neon-sign-01.jpg" alt="Neon sign" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform: 'rotateY(180deg) translateZ(190px)', borderColor: isDark ? '#00f3ff' : '#0d9488' }}><img src="/channel-letters-01.jpg" alt="Channel letters" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform: 'rotateY(90deg) translateZ(190px)', borderColor: isDark ? '#00f3ff' : '#0d9488' }}><img src="/portfolio-01.jpg" alt="Light box" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform: 'rotateY(-90deg) translateZ(190px)', borderColor: isDark ? '#00f3ff' : '#0d9488' }}><img src="/blade-sign-01.jpg" alt="Blade sign" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform: 'rotateX(90deg) translateZ(190px)', borderColor: isDark ? '#00f3ff' : '#0d9488' }}><img src="/metal-sign-01.jpg" alt="Metal sign" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 rounded-xl overflow-hidden border-2" style={{ transform: 'rotateX(-90deg) translateZ(190px)', borderColor: isDark ? '#00f3ff' : '#0d9488' }}><img src="/monument-sign-01.jpg" alt="Monument sign" className="w-full h-full object-cover" /></div>
      </div>
    </div>
  );
}

export default function Home() {
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
    <div className="transition-colors duration-300" style={{ backgroundColor: bg }}>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20" style={{ backgroundColor: bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono mb-6" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)', color: accent, border: `1px solid ${isDark ? 'rgba(0,243,255,0.2)' : 'rgba(13,148,136,0.2)'}` }}>
                <Star size={12} fill={accent} /> 4.9/5 by 3,500+ business owners
              </div>
              <h1 className="font-trajan font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6" style={{ color: heading }}>
                HIGH-QUALITY, CUSTOM SIGNS FOR YOUR <span style={{ color: accent }}>BUSINESS</span>
              </h1>
              <p className="font-helvetica text-lg leading-relaxed mb-8 max-w-lg" style={{ color: text }}>
                Premium custom signs crafted with precision. From neon to metal, we bring your brand to life with stunning signage that attracts customers.
              </p>
              <div className="space-y-3 mb-10">
                {heroFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.15)' : 'rgba(13,148,136,0.15)' }}>
                      <Check size={12} style={{ color: accent }} />
                    </div>
                    <span className="font-helvetica text-sm" style={{ color: text }}>{feat}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/quote" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>GET A FREE QUOTE <ArrowRight size={16} /></Link>
                <a href="tel:+12093404633" className="btn-outline" style={{ border: `1px solid ${border}`, color: text }}><Phone size={16} /> +1 (209) 340-4633</a>
              </div>
              <div className="mt-10 pt-6 flex items-center gap-6 flex-wrap" style={{ borderTop: `1px solid ${border}` }}>
                <p className="font-helvetica text-xs" style={{ color: muted }}>Every order includes:</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {trustPoints.map((point, i) => (
                    <span key={i} className="font-helvetica text-xs font-medium" style={{ color: muted }}>{point}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
            <SignCube3D isDark={isDark} />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y transition-colors duration-300" style={{ backgroundColor: isDark ? '#050505' : '#f0ece5', borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '10,000+', label: 'Signs Crafted' },
              { value: '3,500+', label: 'Happy Clients' },
              { value: '2-Year', label: 'Warranty' },
              { value: '100%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <p className="font-trajan font-bold text-2xl md:text-3xl" style={{ color: accent }}>{stat.value}</p>
                <p className="font-helvetica text-xs mt-1" style={{ color: muted }}>{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SIGN COLLECTION */}
      <section className="golden-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Our Collection</p>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>PREMIUM SIGN TYPES</h2>
            <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>Explore our wide range of custom sign solutions designed to make your business stand out.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signTypes.map((sign, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={sign.image} alt={sign.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 font-mono text-xs px-3 py-1 rounded-full" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>{sign.tag}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-trajan font-semibold text-lg" style={{ color: heading }}>{sign.name}</h3>
                      <span className="font-helvetica text-xs" style={{ color: muted }}>{sign.designs}</span>
                    </div>
                    <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{sign.desc}</p>
                    <Link to="/sign-types" className="inline-flex items-center gap-1.5 font-helvetica text-sm font-medium mt-4 transition-colors" style={{ color: accent }}>View Details <ArrowRight size={14} /></Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center mt-12">
            <Link to="/sign-types" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>VIEW ALL SIGN TYPES <ArrowRight size={16} /></Link>
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Simple Process</p>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>HOW IT WORKS</h2>
            <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>From concept to installation in four simple steps.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="text-center p-8 rounded-2xl border h-full transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 font-trajan font-bold text-xl" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)', color: accent, border: `1px solid ${isDark ? 'rgba(0,243,255,0.2)' : 'rgba(13,148,136,0.2)'}` }}>{step.step}</div>
                  <h3 className="font-trajan font-semibold text-lg mb-3" style={{ color: heading }}>{step.title}</h3>
                  <p className="font-helvetica text-sm leading-relaxed" style={{ color: text }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Why Us</p>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>WHY CHOOSE SIGNAGE CRAFTING</h2>
            <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>We combine craftsmanship, technology, and customer service to deliver the best signs in the industry.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border h-full text-center transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="w-12 h-12 mx-auto mb-5 rounded-xl flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
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

      {/* PORTFOLIO */}
      <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Portfolio</p>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>OUR WORK</h2>
            <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>Real signs for real businesses. Browse our latest projects.</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['/neon-sign-02.jpg', '/case-neon-01.jpg', '/case-signboard-01.jpg', '/portfolio-02.jpg', '/metal-sign-01.jpg', '/specialty-sign-01.jpg'].map((img, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                  <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }}>
                    <span className="font-helvetica text-sm font-medium" style={{ color: accent }}>View Project</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="golden-spacing border-t" style={{ backgroundColor: bg, borderColor: border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Testimonials</p>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: heading }}>WHAT OUR CLIENTS SAY</h2>
            <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>Don't just take our word for it. Here's what business owners say about working with us.</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-md" style={{ backgroundColor: cardBg, borderColor: border }}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
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

      {/* CTA BANNER */}
      <section className="py-20 md:py-28 border-t" style={{ backgroundColor: isDark ? '#050505' : '#f0ece5', borderColor: border }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="font-trajan font-bold text-3xl md:text-4xl lg:text-5xl mb-6" style={{ color: heading }}>READY TO MAKE YOUR MARK?</h2>
            <p className="font-helvetica text-lg mb-10 max-w-xl mx-auto" style={{ color: text }}>Get a free quote and digital mockup for your custom sign today. No obligation, fast turnaround.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/quote" className="btn-primary" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>GET A FREE QUOTE <ArrowRight size={16} /></Link>
              <a href="tel:+12093404633" className="btn-outline" style={{ border: `1px solid ${border}`, color: text }}><Phone size={16} /> +1 (209) 340-4633</a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

import { useState, useRef } from 'react';
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

const categories = ['All', 'Neon', 'Light Box', '3D Letters', 'Blade', 'Metal', 'Monument', 'Specialty'];

const signTypes = [
  {
    name: 'Neon Signs',
    category: 'Neon',
    images: ['/neon-sign-01.jpg', '/neon-sign-02.jpg', '/neon-sign-03.jpg'],
    features: ['LED neon technology', 'Custom shapes & fonts', 'Indoor & outdoor rated', 'Energy efficient', '2-year warranty'],
    description: 'Our LED neon signs combine the classic look of traditional neon with modern energy-efficient technology. Perfect for bars, restaurants, retail stores, and home decor. Available in any color, shape, or font.',
    startingPrice: '$299',
  },
  {
    name: 'Light Box Signs',
    category: 'Light Box',
    images: ['/portfolio-01.jpg', '/case-neon-01.jpg', '/case-signboard-02.jpg'],
    features: ['Even illumination', 'Weatherproof', 'Custom graphics', 'Face-lit or backlit', '3-year LED warranty'],
    description: 'Light box signs provide bright, even illumination that makes your brand visible day and night. Ideal for storefronts, shopping centers, and any business that needs to stand out after dark.',
    startingPrice: '$450',
  },
  {
    name: '3D Channel Letters',
    category: '3D Letters',
    images: ['/channel-letters-01.jpg', '/case-signboard-01.jpg', '/portfolio-02.jpg'],
    features: ['Individual letters', 'Face-lit or halo-lit', 'Metal or acrylic', 'Flush or raceway mount', 'Premium look'],
    description: 'Channel letters are the industry standard for professional business signage. Each letter is individually crafted and illuminated, creating a bold, dimensional look that commands attention.',
    startingPrice: '$599',
  },
  {
    name: 'Blade Signs',
    category: 'Blade',
    images: ['/blade-sign-01.jpg', '/hero-main.jpg', '/portfolio-hero.jpg'],
    features: ['Double-sided display', 'Projecting mount', 'Classic & modern styles', 'Illuminated options', 'ADA compliant'],
    description: 'Blade signs project perpendicular to your building, making them visible to pedestrians from both directions. A timeless choice for downtown shops, restaurants, and historic districts.',
    startingPrice: '$399',
  },
  {
    name: 'Metal Signs',
    category: 'Metal',
    images: ['/metal-sign-01.jpg', '/case-logistics-02.jpg', '/about-hero.jpg'],
    features: ['Brushed aluminum', 'Stainless steel', 'Brass & copper', 'Etched or engraved', 'Lifetime durability'],
    description: 'Metal signs offer unmatched durability and a premium aesthetic. Choose from brushed aluminum, stainless steel, brass, or copper. Perfect for professional offices, luxury brands, and outdoor applications.',
    startingPrice: '$349',
  },
  {
    name: 'Monument Signs',
    category: 'Monument',
    images: ['/monument-sign-01.jpg', '/case-signboard-03.jpg', '/case-logistics-01.jpg'],
    features: ['Free-standing', 'Stone, metal, or acrylic', 'LED illuminated', 'Changeable panels', 'Weather resistant'],
    description: 'Monument signs make a bold statement at the entrance to your property. Built to withstand the elements and designed to match your architecture, these signs establish a strong professional presence.',
    startingPrice: '$1,200',
  },
  {
    name: 'Specialty & Custom Signs',
    category: 'Specialty',
    images: ['/specialty-sign-01.jpg', '/case-neon-03.jpg', '/case-neon-02.jpg'],
    features: ['Any shape or size', 'Mixed materials', 'Interactive elements', 'Artistic designs', 'Fully custom'],
    description: 'Have a unique vision? Our specialty sign team can bring any concept to life. From architectural signage to artistic installations, we handle projects that push the boundaries of conventional signage.',
    startingPrice: 'Custom',
  },
];

export default function SignTypes() {
  const [activeCategory, setActiveCategory] = useState('All');
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const bg = isDark ? '#0a0a0a' : '#f8f5f0';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const heading = isDark ? '#fff' : '#1a1a1a';

  const filtered = activeCategory === 'All' ? signTypes : signTypes.filter((s) => s.category === activeCategory);

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Sign Types</p>
          <h1 className="font-trajan font-bold text-4xl md:text-5xl mb-4" style={{ color: heading }}>OUR SIGN COLLECTION</h1>
          <p className="font-helvetica text-base max-w-2xl mx-auto" style={{ color: text }}>Browse our complete range of custom sign solutions. Click any category to filter.</p>
        </FadeIn>

        {/* Filter Tabs */}
        <FadeIn className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-5 py-2.5 rounded-full font-helvetica text-sm font-medium transition-all duration-200"
              style={{ backgroundColor: activeCategory === cat ? accent : 'transparent', color: activeCategory === cat ? (isDark ? '#0a0a0a' : '#fff') : text, border: `1px solid ${activeCategory === cat ? accent : border}` }}>
              {cat}
            </button>
          ))}
        </FadeIn>

        {/* Sign Type Sections */}
        <div className="space-y-16">
          {filtered.map((sign, i) => (
            <FadeIn key={sign.name}>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className={`grid grid-cols-3 gap-3 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  {sign.images.map((img, j) => (
                    <div key={j} className={`rounded-xl overflow-hidden ${j === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}>
                      <img src={img} alt={`${sign.name} ${j + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-mono text-xs tracking-wider uppercase mb-3 block" style={{ color: accent }}>{sign.category}</span>
                  <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-4" style={{ color: heading }}>{sign.name}</h2>
                  <p className="font-helvetica text-base leading-relaxed mb-6" style={{ color: text }}>{sign.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {sign.features.map((feat, j) => (
                      <span key={j} className="font-helvetica text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.08)' : 'rgba(13,148,136,0.08)', color: accent, border: `1px solid ${isDark ? 'rgba(0,243,255,0.15)' : 'rgba(13,148,136,0.15)'}` }}>{feat}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <a href="/quote" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>GET A QUOTE <ArrowRight size={14} /></a>
                    <span className="font-trajan font-semibold text-lg" style={{ color: accent }}>From {sign.startingPrice}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="mt-20 text-center p-10 rounded-2xl border" style={{ backgroundColor: isDark ? '#050505' : '#f0ece5', borderColor: border }}>
          <h2 className="font-trajan font-bold text-2xl md:text-3xl mb-4" style={{ color: heading }}>Not Sure Which Sign is Right for You?</h2>
          <p className="font-helvetica text-base mb-6" style={{ color: text }}>Our experts can help you choose the perfect sign for your business, budget, and location.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+12093404633" className="btn-outline text-sm" style={{ border: `1px solid ${border}`, color: text }}><Phone size={14} /> +1 (209) 340-4633</a>
            <a href="/quote" className="btn-primary text-sm" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>GET FREE CONSULTATION <ArrowRight size={14} /></a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

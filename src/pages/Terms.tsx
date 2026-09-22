import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useStore } from '@/store/useStore';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

function FadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

export default function TermsPage() {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const headingColor = isDark ? '#fff' : '#1a1a1a';
  const textColor = isDark ? '#888' : '#5a5a5a';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const borderColor = isDark ? '#2a2a2a' : '#d4d0c8';

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: isDark ? '#0a0a0a' : '#f8f5f0' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Legal</p>
          <h1 className="font-trajan font-bold text-4xl md:text-5xl" style={{ color: headingColor }}>Terms of Service & Guidelines</h1>
          <p className="font-helvetica text-sm mt-4" style={{ color: isDark ? '#555' : '#8a8a8a' }}>Last updated: January 2025</p>
        </FadeIn>

        <FadeIn>
          <div className="p-8 md:p-10 rounded-2xl border transition-colors duration-300" style={{ backgroundColor: cardBg, borderColor }}>
            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Terms of Service</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>Welcome to Signage Crafting. These Terms of Service ("Terms") govern your access to and use of our website, products, and services (collectively, "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
                <p>You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into a binding contract.</p>
                <p>All quotes provided by Signage Crafting are valid for 30 days unless otherwise specified. Pricing is based on the information provided by the client and may be subject to change if project specifications change.</p>
                <p>We reserve the right to refuse service to anyone for any reason at any time. We may also terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever.</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Order Guidelines</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>All custom sign orders require a signed approval of the digital mockup before production begins. Production timelines begin only after mockup approval and deposit payment are received.</p>
                <p>A deposit of 50% is required to begin production. The remaining balance is due upon completion and prior to delivery or installation.</p>
                <p>Clients are responsible for reviewing all proofs, mockups, and specifications carefully. Signage Crafting is not liable for errors in approved designs.</p>
                <p>Installation services are provided based on site assessment. Additional fees may apply for difficult access, electrical work, permits, or structural modifications.</p>
                <p>Warranty coverage varies by sign type. Neon signs carry a 2-year warranty on transformers and workmanship. LED signs carry a 3-year warranty. Metal and acrylic signs carry a 1-year warranty against manufacturing defects.</p>
              </div>
            </div>

            <div>
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Intellectual Property</h2>
              <p className="font-helvetica text-base leading-relaxed" style={{ color: textColor }}>
                All content on this website, including designs, images, logos, and text, is the property of Signage Crafting and is protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works from our content without express written permission. For questions regarding these Terms, please contact us at <a href="mailto:info@signagecrafting.com" className="underline" style={{ color: accent }}>info@signagecrafting.com</a>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

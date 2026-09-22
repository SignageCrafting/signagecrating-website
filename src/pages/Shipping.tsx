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

export default function ShippingPage() {
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
          <h1 className="font-trajan font-bold text-4xl md:text-5xl" style={{ color: headingColor }}>Shipping Policy</h1>
          <p className="font-helvetica text-sm mt-4" style={{ color: isDark ? '#555' : '#8a8a8a' }}>Last updated: January 2025</p>
        </FadeIn>

        <FadeIn>
          <div className="p-8 md:p-10 rounded-2xl border transition-colors duration-300" style={{ backgroundColor: cardBg, borderColor }}>
            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Shipping Methods & Timeframes</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>Signage Crafting offers several shipping options to meet your needs. All shipping timeframes are estimates and begin after your order has completed production and passed quality inspection.</p>
                <p><strong style={{ color: headingColor }}>Standard Shipping:</strong> 5-7 business days. Free for orders over $500 within the continental United States.</p>
                <p><strong style={{ color: headingColor }}>Expedited Shipping:</strong> 2-3 business days. Available for an additional fee based on size and weight.</p>
                <p><strong style={{ color: headingColor }}>White Glove Delivery:</strong> For large or delicate signs, we offer white glove delivery with inside placement and packaging removal. Pricing varies by location and item size.</p>
                <p><strong style={{ color: headingColor }}>Local Pickup:</strong> Customers in the Lodi, CA area may pick up their orders from our facility at 1310 Auto Center Dr Unit C, Lodi, CA 95240. No shipping fees apply for local pickup.</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Shipping Costs</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>Shipping costs are calculated based on the dimensions, weight, and destination of your order. Because signs are custom-made and vary significantly in size, exact shipping costs will be provided in your quote.</p>
                <p>Orders over $500 qualify for free standard shipping within the continental United States. Oversized items, international orders, and orders requiring special handling may incur additional shipping fees.</p>
                <p>All shipments are fully insured against damage during transit. In the rare event that your sign arrives damaged, please notify us immediately and we will coordinate a replacement.</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>International Shipping</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>We ship to most countries worldwide. International shipping costs, customs duties, and import taxes are the responsibility of the buyer. Delivery times for international orders vary by destination, typically 10-20 business days after production.</p>
              </div>
            </div>

            <div>
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Tracking & Delivery</h2>
              <p className="font-helvetica text-base leading-relaxed" style={{ color: textColor }}>
                Once your order ships, you will receive a tracking number via email. For questions about shipping, please contact us at <a href="mailto:info@signagecrafting.com" className="underline" style={{ color: accent }}>info@signagecrafting.com</a> or <a href="tel:+12093404633" className="underline" style={{ color: accent }}>+1 (209) 340-4633</a>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

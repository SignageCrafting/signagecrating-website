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

export default function RefundPage() {
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
          <h1 className="font-trajan font-bold text-4xl md:text-5xl" style={{ color: headingColor }}>Return & Refund Policy</h1>
          <p className="font-helvetica text-sm mt-4" style={{ color: isDark ? '#555' : '#8a8a8a' }}>Last updated: January 2025</p>
        </FadeIn>

        <FadeIn>
          <div className="p-8 md:p-10 rounded-2xl border transition-colors duration-300" style={{ backgroundColor: cardBg, borderColor }}>
            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Return Policy</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>At Signage Crafting, we take pride in the quality of our custom signs. Because each sign is custom-made to your specifications, returns are handled on a case-by-case basis.</p>
                <p>Custom signs that have been produced according to approved mockups and specifications are generally not eligible for return unless there is a manufacturing defect or the product does not match the approved specifications.</p>
                <p>If you receive a damaged or defective product, you must notify us within 7 days of delivery. We will work with you to assess the issue and determine the appropriate resolution, which may include repair, replacement, or refund at our discretion.</p>
                <p>Stock items (non-custom products) may be returned within 14 days of delivery in their original, unused condition. Return shipping costs are the responsibility of the customer unless the return is due to our error.</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Refund Policy</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>Refunds are issued based on the nature of the issue and the stage of production:</p>
                <p><strong style={{ color: headingColor }}>Before Production:</strong> If you cancel your order before production has begun, you are eligible for a full refund of your deposit minus a 10% administrative fee.</p>
                <p><strong style={{ color: headingColor }}>During Production:</strong> If production has already begun, refunds are not available. However, we may offer a partial credit toward a future order at our discretion.</p>
                <p><strong style={{ color: headingColor }}>After Delivery:</strong> For defective or incorrectly manufactured products, we will either repair, replace, or refund the item. Refunds for defective products are processed within 7-10 business days after the returned item is received and inspected.</p>
                <p>All refunds are issued to the original payment method. Processing times may vary depending on your bank or credit card provider.</p>
              </div>
            </div>

            <div>
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>How to Request a Return</h2>
              <p className="font-helvetica text-base leading-relaxed" style={{ color: textColor }}>
                To initiate a return or refund request, please contact our customer service team at <a href="mailto:info@signagecrafting.com" className="underline" style={{ color: accent }}>info@signagecrafting.com</a> or call <a href="tel:+12093404633" className="underline" style={{ color: accent }}>+1 (209) 340-4633</a>. Please include your order number, photos of the issue (if applicable), and a detailed description of the problem.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

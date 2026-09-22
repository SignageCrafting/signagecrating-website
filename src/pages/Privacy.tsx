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

export default function PrivacyPage() {
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
          <h1 className="font-trajan font-bold text-4xl md:text-5xl" style={{ color: headingColor }}>Privacy & Security Policy</h1>
          <p className="font-helvetica text-sm mt-4" style={{ color: isDark ? '#555' : '#8a8a8a' }}>Last updated: September 2026</p>
        </FadeIn>

        <FadeIn>
          <div className="p-8 md:p-10 rounded-2xl border transition-colors duration-300" style={{ backgroundColor: cardBg, borderColor }}>
            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Privacy Policy</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>At Signage Crafting ("we," "us," or "our"), your privacy is critically important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. By accessing or using our services, you agree to the terms of this Privacy Policy.</p>
                <p>We collect personal information that you voluntarily provide to us when you fill out a quote form, contact us, or otherwise interact with our website. This may include your name, email address, phone number, business name, project details, and any other information you choose to provide.</p>
                <p>We use the information we collect to provide, maintain, and improve our services; to communicate with you about your project; to process your requests and orders; to send you marketing communications (with your consent); and to comply with legal obligations.</p>
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided that those parties agree to keep this information confidential.</p>
                <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and encrypted in our database.</p>
                <p>You have the right to access, correct, update, or delete your personal information at any time. To exercise these rights, please contact us at info@signagecrafting.com.</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Security Policy</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>Signage Crafting is committed to protecting the security of your personal information. We employ industry-standard security measures including SSL encryption for all data transmission, secure server infrastructure, regular security audits, and access controls to prevent unauthorized access to your data.</p>
                <p>Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect the functionality of certain features on our website.</p>
                <p>We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.</p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Cookies & Advertising</h2>
              <div className="font-helvetica text-base leading-relaxed space-y-4" style={{ color: textColor }}>
                <p>We use Google Ads, including its conversion tracking and remarketing features, to advertise our services and to measure how well our ads work. Google and other third-party vendors use cookies to show our ads to you on other websites based on your past visits to our website, and to tell us when someone who clicked one of our ads requests a quote, sends a message, or calls us.</p>
                <p>You can opt out of personalized advertising by Google at any time by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: accent }}>Google Ads Settings</a>, or opt out of many third-party vendors' use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: accent }}>aboutads.info/choices</a>. To learn more about how Google uses data, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: accent }}>How Google uses information from sites that use its services</a>.</p>
              </div>
            </div>

            <div>
              <h2 className="font-trajan font-bold text-xl md:text-2xl mb-4" style={{ color: headingColor }}>Contact Us</h2>
              <p className="font-helvetica text-base leading-relaxed" style={{ color: textColor }}>
                If you have any questions about this Privacy & Security Policy, please contact us at <a href="mailto:info@signagecrafting.com" className="underline" style={{ color: accent }}>info@signagecrafting.com</a> or call us at <a href="tel:+12093404633" className="underline" style={{ color: accent }}>+1 (209) 340-4633</a>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

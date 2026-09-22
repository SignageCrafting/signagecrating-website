import { useState, useRef } from 'react';
import { Phone, Mail, Clock, MapPin, Send, Instagram, Facebook, Linkedin } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { trackConversion } from '@/lib/googleAds';

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

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const bg = isDark ? '#0a0a0a' : '#f8f5f0';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const muted = isDark ? '#555' : '#8a8a8a';
  const heading = isDark ? '#fff' : '#1a1a1a';
  const inputBg = isDark ? '#1a1a1a' : '#e8e4dc';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('contactForm', 'contact_form_submit');
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Contact Us</p>
          <h1 className="font-trajan font-bold text-3xl md:text-5xl mb-4" style={{ color: heading }}>GET IN TOUCH</h1>
          <p className="font-helvetica text-base max-w-lg mx-auto" style={{ color: text }}>Have questions? We're here to help. Reach out and our team will get back to you within 1 hour.</p>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-8">
          <FadeIn className="lg:col-span-3">
            {submitted ? (
              <div className="p-10 rounded-2xl text-center border" style={{ backgroundColor: cardBg, borderColor: accent }}>
                <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                  <Send size={24} style={{ color: accent }} />
                </div>
                <h2 className="font-trajan font-bold text-xl mb-2" style={{ color: heading }}>Message Sent!</h2>
                <p className="font-helvetica text-base" style={{ color: text }}>Thank you for reaching out. We'll get back to you within 1 hour.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-5 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Name *</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="(209) 340-4633" />
                </div>
                <div>
                  <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Message *</label>
                  <textarea name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors resize-none" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="How can we help you?" />
                </div>
                <button type="submit" className="w-full btn-primary" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>SEND MESSAGE <Send size={16} /></button>
              </form>
            )}
          </FadeIn>

          <FadeIn className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
              <h3 className="font-trajan font-semibold text-lg mb-5 tracking-wide" style={{ color: heading }}>Contact Information</h3>
              <div className="space-y-4">
                <a href="tel:+12093404633" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                    <Phone size={16} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="font-helvetica text-xs" style={{ color: muted }}>Phone</p>
                    <p className="font-helvetica text-sm transition-colors" style={{ color: text }}>+1 (209) 340-4633</p>
                  </div>
                </a>
                <a href="mailto:info@signagecrafting.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                    <Mail size={16} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="font-helvetica text-xs" style={{ color: muted }}>Email</p>
                    <p className="font-helvetica text-sm transition-colors" style={{ color: text }}>info@signagecrafting.com</p>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                    <Clock size={16} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="font-helvetica text-xs" style={{ color: muted }}>Business Hours</p>
                    <p className="font-helvetica text-sm" style={{ color: text }}>Mon-Fri 8AM-6PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                    <MapPin size={16} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="font-helvetica text-xs" style={{ color: muted }}>Address</p>
                    <p className="font-helvetica text-sm" style={{ color: text }}>1310 Auto Center Dr Unit C<br />Lodi, CA 95240, USA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
              <h3 className="font-trajan font-semibold text-base mb-4" style={{ color: heading }}>Follow Us</h3>
              <div className="flex gap-3">
                {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text }}>
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mt-10">
          <div className="rounded-2xl h-64 overflow-hidden relative border" style={{ borderColor: border }}>
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: isDark ? '#1a1a1a' : '#e8e4dc' }}>
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <MapPin size={40} style={{ color: accent }} />
                  <div className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.2)' : 'rgba(13,148,136,0.2)', animationDuration: '2s' }} />
                </div>
                <p className="font-trajan font-semibold" style={{ color: heading }}>Signage Crafting</p>
                <p className="font-helvetica text-sm" style={{ color: text }}>1310 Auto Center Dr Unit C, Lodi, CA 95240</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

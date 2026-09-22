import { useState, useRef } from 'react';
import { ArrowRight, Lock, Shield, Zap } from 'lucide-react';
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

const signTypes = ['Neon Signs', 'Light Box Signs', '3D Channel Letters', 'Blade Signs', 'Metal Signs', 'Monument Signs', 'Specialty/Custom', 'Not Sure - Need Advice'];
const budgetRanges = ['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'Not Sure'];

export default function Quote() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', businessName: '', signType: '', budget: '', details: '' });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('quoteForm', 'generate_lead');
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>Get Your Free Quote</p>
          <h1 className="font-trajan font-bold text-3xl md:text-5xl mb-4" style={{ color: heading }}>LET'S CREATE SOMETHING<br />AMAZING</h1>
          <p className="font-helvetica text-base max-w-lg mx-auto mb-4" style={{ color: text }}>Fill out the form below and receive a detailed quote and digital mockup in as fast as 2 hours.</p>
          <div className="flex items-center justify-center gap-4 text-xs font-helvetica" style={{ color: muted }}>
            <span className="flex items-center gap-1"><Zap size={12} style={{ color: accent }} /> No obligation</span>
            <span className="flex items-center gap-1"><Zap size={12} style={{ color: accent }} /> Free mockup</span>
            <span className="flex items-center gap-1"><Zap size={12} style={{ color: accent }} /> 2-hour response</span>
          </div>
        </FadeIn>

        {submitted ? (
          <FadeIn>
            <div className="p-12 rounded-2xl text-center border" style={{ backgroundColor: cardBg, borderColor: accent }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? 'rgba(0,243,255,0.1)' : 'rgba(13,148,136,0.1)' }}>
                <Zap size={28} style={{ color: accent }} />
              </div>
              <h2 className="font-trajan font-bold text-2xl mb-3" style={{ color: heading }}>Quote Request Received!</h2>
              <p className="font-helvetica text-base max-w-md mx-auto" style={{ color: text }}>Thank you for reaching out. Our team will review your project details and send you a detailed quote with digital mockups within 2 hours.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Full Name *</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="john@company.com" />
                  </div>
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Phone Number *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="(209) 340-4633" />
                  </div>
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Business Name <span style={{ color: muted }}>(optional)</span></label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Sign Type *</label>
                    <select name="signType" required value={formData.signType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors appearance-none cursor-pointer" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }}>
                      <option value="" disabled>Select sign type</option>
                      {signTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Budget Range</label>
                    <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors appearance-none cursor-pointer" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }}>
                      <option value="" disabled>Select budget range</option>
                      {budgetRanges.map((r) => (<option key={r} value={r}>{r}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-helvetica text-sm mb-2" style={{ color: text }}>Project Details *</label>
                    <textarea name="details" required rows={5} value={formData.details} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors resize-none" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="Tell us about your project — size, colors, design ideas, installation location..." />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button type="submit" className="w-full btn-primary text-base py-4" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>GET MY FREE QUOTE <ArrowRight size={18} /></button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs font-helvetica" style={{ color: muted }}>
                <span className="flex items-center gap-1"><Lock size={12} /> Secure form</span>
                <span className="flex items-center gap-1"><Zap size={12} /> 2-hour response</span>
                <span className="flex items-center gap-1"><Shield size={12} /> No obligation</span>
              </div>
            </form>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

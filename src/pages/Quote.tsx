import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Shield, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import FadeIn from '@/components/FadeIn';
import { trackConversion } from '@/lib/googleAds';
import { submitLead } from '@/lib/leads';
import { useContent } from '@/content/store';
import MultiLine from '@/content/MultiLine';

const footnoteIcons = [Lock, Zap, Shield];

export default function Quote() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', businessName: '', signType: '', budget: '', details: '', website: '' });
  const theme = useStore((s) => s.theme);
  const { quote } = useContent();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await submitLead('quote', formData);
      trackConversion('quoteFormLabel', 'generate_lead');
      navigate('/quote/thank-you');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn eager className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{quote.label}</p>
          <h1 className="font-trajan font-bold text-3xl md:text-5xl mb-4" style={{ color: heading }}><MultiLine text={quote.title} /></h1>
          <p className="font-helvetica text-base max-w-lg mx-auto mb-4" style={{ color: text }}>{quote.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-helvetica" style={{ color: muted }}>
            {quote.badges.map((badge, i) => (
              <span key={i} className="flex items-center gap-1"><Zap size={12} style={{ color: accent }} /> {badge}</span>
            ))}
          </div>
        </FadeIn>

          <FadeIn>
            <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="quote-fullName" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Full Name *</label>
                    <input id="quote-fullName" type="text" name="fullName" autoComplete="name" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="John Smith" />
                  </div>
                  <div>
                    <label htmlFor="quote-email" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Email Address *</label>
                    <input id="quote-email" type="email" name="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="john@company.com" />
                  </div>
                  <div>
                    <label htmlFor="quote-phone" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Phone Number *</label>
                    <input id="quote-phone" type="tel" name="phone" autoComplete="tel" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label htmlFor="quote-businessName" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Business Name <span style={{ color: muted }}>(optional)</span></label>
                    <input id="quote-businessName" type="text" name="businessName" autoComplete="organization" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="quote-signType" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Sign Type *</label>
                    <select id="quote-signType" name="signType" required value={formData.signType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors appearance-none cursor-pointer" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }}>
                      <option value="" disabled>Select sign type</option>
                      {quote.signTypeOptions.map((t, i) => (<option key={i} value={t}>{t}</option>))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quote-budget" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Budget Range</label>
                    <select id="quote-budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors appearance-none cursor-pointer" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }}>
                      <option value="" disabled>Select budget range</option>
                      {quote.budgetOptions.map((r, i) => (<option key={i} value={r}>{r}</option>))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quote-details" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Project Details *</label>
                    <textarea id="quote-details" name="details" required rows={5} value={formData.details} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors resize-none" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="Tell us about your project — size, colors, design ideas, installation location..." />
                  </div>
                </div>
              </div>
              <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              {error && <p className="mt-6 font-helvetica text-sm text-center text-red-500" role="alert">{error}</p>}
              <div className="mt-8">
                <button type="submit" disabled={sending} className="w-full btn-primary text-base py-4 disabled:opacity-60" style={{ backgroundColor: accent, color: isDark ? '#0a0a0a' : '#fff' }}>{sending ? 'SENDING…' : quote.submitLabel} <ArrowRight size={18} /></button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-helvetica" style={{ color: muted }}>
                {quote.footnotes.map((note, i) => {
                  const Icon = footnoteIcons[i % footnoteIcons.length];
                  return <span key={i} className="flex items-center gap-1"><Icon size={12} /> {note}</span>;
                })}
              </div>
            </form>
          </FadeIn>
      </div>
    </div>
  );
}

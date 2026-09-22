import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Send, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import FadeIn from '@/components/FadeIn';
import { trackConversion } from '@/lib/googleAds';
import { submitLead } from '@/lib/leads';
import { cityLine, fullAddress, telHref, useContent } from '@/content/store';

export default function Contact() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const theme = useStore((s) => s.theme);
  const { business, contact } = useContent();
  const isDark = theme === 'dark';
  const accent = isDark ? '#fd4601' : '#c43500';
  const bg = isDark ? '#080c0d' : '#f8f5f0';
  const cardBg = isDark ? '#111' : '#f0ece5';
  const border = isDark ? '#2a2a2a' : '#d4d0c8';
  const text = isDark ? '#888' : '#5a5a5a';
  const muted = isDark ? '#555' : '#8a8a8a';
  const heading = isDark ? '#fff' : '#1a1a1a';
  const inputBg = isDark ? '#1a1a1a' : '#e8e4dc';
  const iconBg = isDark ? 'rgba(253,70,1,0.1)' : 'rgba(196,53,0,0.1)';

  const socials = [
    { url: business.social.instagram, Icon: Instagram, label: 'Instagram' },
    { url: business.social.facebook, Icon: Facebook, label: 'Facebook' },
    { url: business.social.linkedin, Icon: Linkedin, label: 'LinkedIn' },
  ].filter((s) => s.url);
  const address = fullAddress(business);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await submitLead('contact', formData);
      trackConversion('contactFormLabel', 'contact_form_submit');
      navigate('/contact/thank-you');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-24 pb-20 transition-colors duration-300" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn eager className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>{contact.label}</p>
          <h1 className="font-trajan font-bold text-3xl md:text-5xl mb-4" style={{ color: heading }}>{contact.title}</h1>
          <p className="font-helvetica text-base max-w-lg mx-auto" style={{ color: text }}>{contact.subtitle}</p>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-8">
          <FadeIn className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="p-8 space-y-5 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Name *</label>
                    <input id="contact-name" type="text" name="name" required value={formData.name} onChange={handleChange} autoComplete="name" className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Email *</label>
                    <input id="contact-email" type="email" name="email" required value={formData.email} onChange={handleChange} autoComplete="email" className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Phone</label>
                  <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} autoComplete="tel" className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block font-helvetica text-sm mb-2" style={{ color: text }}>Message *</label>
                  <textarea id="contact-message" name="message" required rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl font-helvetica text-sm focus:outline-none transition-colors resize-none" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: heading }} placeholder="How can we help you?" />
                </div>
                <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                {error && <p className="font-helvetica text-sm text-center text-red-500" role="alert">{error}</p>}
                <button type="submit" disabled={sending} className="w-full btn-primary disabled:opacity-60" style={{ backgroundColor: accent, color: isDark ? '#080c0d' : '#fff' }}>{sending ? 'SENDING…' : contact.submitLabel} <Send size={16} /></button>
              </form>
          </FadeIn>

          <FadeIn className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
              <h2 className="font-trajan font-semibold text-lg mb-5 tracking-wide" style={{ color: heading }}>{contact.infoTitle}</h2>
              <div className="space-y-4">
                {business.phone && (
                  <a href={telHref(business.phone)} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                      <Phone size={16} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="font-helvetica text-xs" style={{ color: muted }}>Phone</p>
                      <p className="font-helvetica text-sm transition-colors" style={{ color: text }}>{business.phone}</p>
                    </div>
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                      <Mail size={16} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="font-helvetica text-xs" style={{ color: muted }}>Email</p>
                      <p className="font-helvetica text-sm transition-colors" style={{ color: text }}>{business.email}</p>
                    </div>
                  </a>
                )}
                {business.hours && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                      <Clock size={16} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="font-helvetica text-xs" style={{ color: muted }}>Business Hours</p>
                      <p className="font-helvetica text-sm" style={{ color: text }}>{business.hours}</p>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                      <MapPin size={16} style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="font-helvetica text-xs" style={{ color: muted }}>Address</p>
                      <address className="font-helvetica text-sm not-italic" style={{ color: text }}>{business.street}{business.street && <br />}{cityLine(business)}</address>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {socials.length > 0 && (
              <div className="p-6 rounded-2xl border transition-all duration-300" style={{ backgroundColor: cardBg, borderColor: border }}>
                <h2 className="font-trajan font-semibold text-base mb-4" style={{ color: heading }}>{contact.socialTitle}</h2>
                <div className="flex gap-3">
                  {socials.map(({ url, Icon, label }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all" style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: text }}>
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </FadeIn>
        </div>

        {address && (
          <FadeIn className="mt-10">
            <div className="rounded-2xl h-72 overflow-hidden border" style={{ borderColor: border }}>
              <iframe
                title={`Map of ${business.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${business.name}, ${address}`)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

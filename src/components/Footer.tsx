import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cityLine, fillTokens, logoFor, telHref, useContent } from '@/content/store';

export default function Footer() {
  const theme = useStore((s) => s.theme);
  const content = useContent();
  const { business, footer } = content;
  const isDark = theme === 'dark';
  const accent = isDark ? '#fd4601' : '#c43500';
  const textColor = isDark ? '#888' : '#5a5a5a';
  const mutedColor = isDark ? '#555' : '#8a8a8a';
  const bgColor = isDark ? '#050809' : '#f0ece5';
  const borderColor = isDark ? '#2a2a2a' : '#d4d0c8';

  return (
    <footer className="border-t transition-colors duration-300" style={{ backgroundColor: bgColor, borderColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoFor(business, isDark)
                ? <img src={logoFor(business, isDark)} alt={`${business.name} logo`} width={69} height={36} loading="lazy" className="h-9 w-auto" />
                : <span className="font-trajan font-extrabold text-xl" style={{ color: accent }}>{business.logoText}</span>}
              <span className="font-trajan font-semibold text-sm" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>{business.name}</span>
            </div>
            <p className="font-helvetica text-sm leading-relaxed" style={{ color: textColor }}>
              {fillTokens(footer.description, content)}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-trajan font-semibold text-sm mb-4 tracking-wide" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>{footer.quickLinksTitle}</h4>
            <ul className="space-y-2.5">
              {footer.quickLinks.map((link, i) => (
                <li key={`${link.path}-${i}`}>
                  <Link to={link.path} className="font-helvetica text-sm transition-colors hover:text-[#fd4601]" style={{ color: textColor }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-trajan font-semibold text-sm mb-4 tracking-wide" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>{footer.legalTitle}</h4>
            <ul className="space-y-2.5">
              {footer.legalLinks.map((link, i) => (
                <li key={`${link.path}-${i}`}>
                  <Link to={link.path} className="font-helvetica text-sm transition-colors hover:text-[#fd4601]" style={{ color: textColor }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-trajan font-semibold text-sm mb-4 tracking-wide" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>{footer.contactTitle}</h4>
            <ul className="space-y-3">
              {business.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={14} style={{ color: accent }} className="flex-shrink-0" />
                  <a href={telHref(business.phone)} className="font-helvetica text-sm transition-colors hover:text-[#fd4601]" style={{ color: textColor }}>{business.phone}</a>
                </li>
              )}
              {business.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={14} style={{ color: accent }} className="flex-shrink-0" />
                  <a href={`mailto:${business.email}`} className="font-helvetica text-sm transition-colors hover:text-[#fd4601]" style={{ color: textColor }}>{business.email}</a>
                </li>
              )}
              {business.hours && (
                <li className="flex items-center gap-2.5">
                  <Clock size={14} style={{ color: accent }} className="flex-shrink-0" />
                  <span className="font-helvetica text-sm" style={{ color: textColor }}>{business.hours}</span>
                </li>
              )}
              {(business.street || business.city) && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} style={{ color: accent }} className="flex-shrink-0 mt-0.5" />
                  <address className="font-helvetica text-sm not-italic" style={{ color: textColor }}>
                    {business.street}
                    {business.street && business.city && <br />}
                    {cityLine(business)}
                  </address>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor }}>
          <p className="font-helvetica text-xs" style={{ color: mutedColor }}>{fillTokens(footer.copyright, content)}</p>
          <div className="flex items-center gap-6">
            {footer.bottomLinks.map((link, i) => (
              <Link key={`${link.path}-${i}`} to={link.path} className="font-helvetica text-xs transition-colors hover:text-[#fd4601]" style={{ color: mutedColor }}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

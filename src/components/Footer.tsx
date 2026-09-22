import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Sign Types', path: '/sign-types' },
  { label: 'Get a Quote', path: '/quote' },
  { label: 'Contact', path: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Refund Policy', path: '/refund' },
  { label: 'Shipping Policy', path: '/shipping' },
];

export default function Footer() {
  const theme = useStore((s) => s.theme);
  const isDark = theme === 'dark';
  const accent = isDark ? '#00f3ff' : '#0d9488';
  const textColor = isDark ? '#888' : '#5a5a5a';
  const mutedColor = isDark ? '#555' : '#8a8a8a';
  const bgColor = isDark ? '#050505' : '#f0ece5';
  const borderColor = isDark ? '#2a2a2a' : '#d4d0c8';

  return (
    <footer className="border-t transition-colors duration-300" style={{ backgroundColor: bgColor, borderColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-trajan font-extrabold text-xl" style={{ color: accent }}>SC</span>
              <span className="font-trajan font-semibold text-sm" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>Signage Crafting</span>
            </div>
            <p className="font-helvetica text-sm leading-relaxed" style={{ color: textColor }}>
              Premium custom signs crafted with precision. From neon to metal, we bring your brand to life. 15+ years, 10,000+ signs, 3,500+ happy clients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-trajan font-semibold text-sm mb-4 tracking-wide" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>QUICK LINKS</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="font-helvetica text-sm transition-colors hover:text-[#00f3ff]" style={{ color: textColor }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-trajan font-semibold text-sm mb-4 tracking-wide" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>LEGAL</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="font-helvetica text-sm transition-colors hover:text-[#00f3ff]" style={{ color: textColor }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-trajan font-semibold text-sm mb-4 tracking-wide" style={{ color: isDark ? '#fff' : '#1a1a1a' }}>CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Phone size={14} style={{ color: accent }} className="flex-shrink-0" />
                <a href="tel:+12093404633" className="font-helvetica text-sm transition-colors hover:text-[#00f3ff]" style={{ color: textColor }}>+1 (209) 340-4633</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} style={{ color: accent }} className="flex-shrink-0" />
                <a href="mailto:info@signagecrafting.com" className="font-helvetica text-sm transition-colors hover:text-[#00f3ff]" style={{ color: textColor }}>info@signagecrafting.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={14} style={{ color: accent }} className="flex-shrink-0" />
                <span className="font-helvetica text-sm" style={{ color: textColor }}>Mon-Fri 8AM-6PM</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} style={{ color: accent }} className="flex-shrink-0 mt-0.5" />
                <span className="font-helvetica text-sm" style={{ color: textColor }}>1310 Auto Center Dr Unit C<br />Lodi, CA 95240, USA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor }}>
          <p className="font-helvetica text-xs" style={{ color: mutedColor }}>&copy; 2025 Signage Crafting. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="font-helvetica text-xs transition-colors hover:text-[#00f3ff]" style={{ color: mutedColor }}>Privacy</Link>
            <Link to="/terms" className="font-helvetica text-xs transition-colors hover:text-[#00f3ff]" style={{ color: mutedColor }}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

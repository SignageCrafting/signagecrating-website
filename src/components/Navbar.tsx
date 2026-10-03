import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Sun, Moon, MonitorSmartphone } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { logoFor, telHref, useContent } from '@/content/store';

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, theme, cycleTheme } = useStore();
  const { business, header } = useContent();
  const navLinks = header.navLinks;
  const tel = telHref(business.phone);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const isDark = theme !== 'light';
  const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? isDark ? 'bg-[#080c0d]/90 backdrop-blur-md border-b border-[#2a2a2a]' : 'bg-[#f8f5f0]/90 backdrop-blur-md border-b border-[#d4d0c8]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            {logoFor(business, isDark)
              ? <img src={logoFor(business, isDark)} alt={`${business.name} logo`} width={77} height={40} className="h-9 md:h-10 w-auto" />
              : <span className="font-trajan font-extrabold text-xl" style={{ color: '#ff5a1a' }}>{business.logoText}</span>}
            <span className="font-trajan font-semibold text-sm hidden sm:inline" style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}>{business.name}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link, i) => (
              <Link key={`${link.path}-${i}`} to={link.path}
                className={`font-helvetica text-sm whitespace-nowrap transition-colors duration-200 ${
                  isActive(link.path)
                    ? isDark ? 'text-[#ff5a1a] border-b-2 border-[#ff5a1a] pb-0.5' : 'text-[#ff5a1a] border-b-2 border-[#ff5a1a] pb-0.5'
                    : isDark ? 'text-[#888] hover:text-white' : 'text-[#5a5a5a] hover:text-[#1a1a1a]'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 lg:gap-4">
            {header.showPhone && (
              <a href={tel} className="hidden xl:inline-flex items-center gap-2 whitespace-nowrap font-helvetica text-sm font-medium" style={{ color: '#ff5a1a' }}>
                <Phone size={14} /> {business.phone}
              </a>
            )}
            {header.ctaLabel && (
              <Link to={header.ctaPath || '/quote'} className="hidden md:inline-flex whitespace-nowrap btn-primary text-xs py-2.5 px-5" style={{
                backgroundColor: '#ff5a1a',
                color: isDark ? '#080c0d' : '#ffffff',
              }}>{header.ctaLabel}</Link>
            )}

            {/* Theme Toggle */}
            <button onClick={cycleTheme} className="p-2 rounded-full transition-colors" style={{ color: isDark ? '#888' : '#5a5a5a' }} aria-label={`Theme: ${theme}. Switch to ${nextTheme} theme`} title={`Theme: ${theme}`}>
              {theme === 'light' ? <Moon size={18} /> : theme === 'dark' ? <Sun size={18} /> : <MonitorSmartphone size={18} />}
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" style={{ color: isDark ? '#fff' : '#1a1a1a' }} onClick={toggleMobileMenu} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden backdrop-blur-lg border-t ${isDark ? 'bg-[#080c0d]/98 border-[#2a2a2a]' : 'bg-[#f8f5f0]/98 border-[#d4d0c8]'}`}>
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link, i) => (
              <Link key={`${link.path}-${i}`} to={link.path} onClick={closeMobileMenu}
                className={`block font-helvetica text-base py-2 ${isActive(link.path) ? (isDark ? 'text-[#ff5a1a]' : 'text-[#ff5a1a]') : (isDark ? 'text-[#888]' : 'text-[#5a5a5a]')}`}>
                {link.label}
              </Link>
            ))}
            <a href={tel} className={`flex items-center gap-2 font-helvetica text-sm pt-4 border-t ${isDark ? 'text-[#ff5a1a] border-[#2a2a2a]' : 'text-[#ff5a1a] border-[#d4d0c8]'}`}>
              <Phone size={14} /> {business.phone}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

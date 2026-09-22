import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Sun, Moon } from 'lucide-react';
import { useStore } from '@/store/useStore';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Sign Types', path: '/sign-types' },
  { label: 'About', path: '/about' },
  { label: 'Get a Quote', path: '/quote' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, theme, toggleTheme } = useStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const isDark = theme === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? isDark ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a]' : 'bg-[#f8f5f0]/90 backdrop-blur-md border-b border-[#d4d0c8]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <span className="font-trajan font-extrabold text-xl text-dt-accent dark:text-dt-accent light:text-lt-accent" style={{ color: isDark ? '#00f3ff' : '#0d9488' }}>SC</span>
            <span className="font-trajan font-semibold text-sm hidden sm:inline" style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}>Signage Crafting</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`font-helvetica text-sm transition-colors duration-200 ${
                  isActive(link.path)
                    ? isDark ? 'text-[#00f3ff] border-b-2 border-[#00f3ff] pb-0.5' : 'text-[#0d9488] border-b-2 border-[#0d9488] pb-0.5'
                    : isDark ? 'text-[#888] hover:text-white' : 'text-[#5a5a5a] hover:text-[#1a1a1a]'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <a href="tel:+12093404633" className="hidden md:inline-flex items-center gap-2 font-helvetica text-sm font-medium" style={{ color: isDark ? '#00f3ff' : '#0d9488' }}>
              <Phone size={14} /> +1 (209) 340-4633
            </a>
            <Link to="/quote" className="hidden md:inline-flex btn-primary text-xs py-2.5 px-5" style={{
              backgroundColor: isDark ? '#00f3ff' : '#0d9488',
              color: isDark ? '#0a0a0a' : '#ffffff',
            }}>Get a Quote</Link>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full transition-colors" style={{ color: isDark ? '#888' : '#5a5a5a' }} aria-label="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
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
        <div className={`md:hidden backdrop-blur-lg border-t ${isDark ? 'bg-[#0a0a0a]/98 border-[#2a2a2a]' : 'bg-[#f8f5f0]/98 border-[#d4d0c8]'}`}>
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={closeMobileMenu}
                className={`block font-helvetica text-base py-2 ${isActive(link.path) ? (isDark ? 'text-[#00f3ff]' : 'text-[#0d9488]') : (isDark ? 'text-[#888]' : 'text-[#5a5a5a]')}`}>
                {link.label}
              </Link>
            ))}
            <a href="tel:+12093404633" className={`flex items-center gap-2 font-helvetica text-sm pt-4 border-t ${isDark ? 'text-[#00f3ff] border-[#2a2a2a]' : 'text-[#0d9488] border-[#d4d0c8]'}`}>
              <Phone size={14} /> +1 (209) 340-4633
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

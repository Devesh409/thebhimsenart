import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (totalScroll / windowHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Virtual Museum', href: '#virtual-museum' },
    { label: 'Collection', href: '#gallery' },
    { label: 'Artist', href: '#about' },
    { label: 'Process', href: '#process' },
    { label: 'Collaborations', href: '#collaborations' },
  ];

  return (
    <>
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-3 focus:bg-[#d4af37] focus:text-[#0b0b0e] focus:font-semibold focus:rounded-lg shadow-2xl"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 left-0 right-0 z-40 bg-[#0b0b0e]/92 backdrop-blur-md border-b border-white/10">
        {/* Reading Progress Bar */}
        <div
          className="h-0.5 bg-[#d4af37] transition-transform duration-150 origin-left"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Page reading progress"
        />

        {/* Strict 3-Zone Top Bar Contract */}
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="font-display text-base sm:text-lg font-bold tracking-widest text-[#faf6ee] hover:text-[#d4af37] smooth-transition whitespace-nowrap shrink-0 py-2"
          >
            THEBHIMSENART
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium text-[#c9bfa8]"
          >
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-2 hover:text-[#faf6ee] smooth-transition whitespace-nowrap shrink-0 after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-px after:bg-[#d4af37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + Mobile Drawer button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] rounded-lg bg-[#d4af37] hover:bg-[#e3c14d] text-[#0b0b0e] font-semibold text-xs tracking-wide smooth-transition whitespace-nowrap shrink-0 shadow-sm"
            >
              Inquire
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 hover:bg-white/10 text-[#faf6ee] border border-white/10 smooth-transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Accessible Navigation Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-white/10 bg-[#0e0e13] px-4 py-4 space-y-1"
          >
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium text-[#e8e4dc] hover:bg-white/5 hover:text-[#d4af37] smooth-transition"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

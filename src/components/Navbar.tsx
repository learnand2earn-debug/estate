'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { DEFAULT_COMPANY_CONFIG } from '@/src/lib/galiyat-data';
import { buildWhatsAppInquiryUrl } from '@/src/lib/property-logic';

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', hasDropdown: false },
    { href: '/properties', label: 'Properties', hasDropdown: true },
    { href: '/locations', label: 'Locations', hasDropdown: true },
    { href: '/explore', label: 'Explore Wholdings', hasDropdown: true },
    { href: '/investment', label: 'Investment', hasDropdown: true },
    { href: '/about', label: 'About Us', hasDropdown: false },
    { href: '/contact', label: 'Contact', hasDropdown: false },
  ];

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber: DEFAULT_COMPANY_CONFIG.whatsappNumber,
    customerMessage:
      'Assalam-o-Alaikum Wholdings, I would like to inquire about luxury mountain properties.',
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B1914]/95 border-b border-[#C7A66A]/30 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#08120F]/90 via-[#08120F]/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Wholdings Logo Emblem + Gold Title */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label="Wholdings Home"
        >
          <img
            src="/assets/wholdings-logo.png"
            alt="Wholdings Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />

          <div className="flex flex-col leading-none">
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.12em] bg-gradient-to-b from-[#FFF1C9] via-[#DAB675] to-[#A67C3B] bg-clip-text text-transparent">
              WHOLDINGS
            </span>
            <span className="font-serif-luxury text-[10px] sm:text-xs font-semibold tracking-[0.34em] text-[#D8B576] mt-0.5">
              ESTATES
            </span>
          </div>
        </Link>

        {/* Zone 2: Center Navigation Bar Matching Reference Mockup */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-5 text-[13px] font-medium"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

            if (isActive) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-5 py-1.5 rounded-full bg-gradient-to-b from-[#E7C789] via-[#CFA662] to-[#B08440] text-[#101614] font-semibold shadow-[0_2px_14px_rgba(207,166,98,0.45)] whitespace-nowrap shrink-0"
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1 text-white/90 hover:text-[#E5C384] transition-colors py-1.5 whitespace-nowrap shrink-0"
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown className="w-3.5 h-3.5 text-[#D8B576]/80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Right Gold-Bordered WhatsApp Pill Button (+92 331 2345678) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#0C1D17]/90 border border-[#D5AF6B]/70 text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(199,166,106,0.2)] hover:border-[#FFF0C4] hover:bg-[#132C24] transition-all whitespace-nowrap shrink-0"
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-b from-[#E7C789] to-[#B08440] text-[#101614] flex items-center justify-center">
              <Phone className="w-3.5 h-3.5 fill-current" />
            </span>
            <span className="font-mono-tabular tracking-wide">
              {DEFAULT_COMPANY_CONFIG.whatsappNumber}
            </span>
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="xl:hidden p-2.5 rounded-lg bg-[#102B24] border border-[#C7A66A]/40 text-[#DCE5E0] hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#0B1713] border-b border-[#C7A66A]/30 px-6 py-5 space-y-3">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
            {[
              ...navItems,
              { href: '/gallery', label: '3D Gallery', hasDropdown: false },
              { href: '/admin', label: 'Admin Portal', hasDropdown: false },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm font-medium border-b border-white/5 ${
                  pathname === item.href ? 'text-[#E5C384]' : 'text-white/90'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E5C384] to-[#B88E4C] text-[#101614] text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{DEFAULT_COMPANY_CONFIG.whatsappNumber}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

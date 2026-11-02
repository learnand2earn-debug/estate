'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, PhoneCall, ArrowUpRight } from 'lucide-react';
import { DEFAULT_COMPANY_CONFIG } from '@/src/lib/galiyat-data';
import { buildWhatsAppInquiryUrl } from '@/src/lib/property-logic';

export function Footer() {
  const whatsappHref = buildWhatsAppInquiryUrl({
    whatsappNumber: DEFAULT_COMPANY_CONFIG.whatsappNumber,
    customerMessage:
      'Hello Wholdings, I would like to explore available luxury mountain villas and cottages.',
  });

  return (
    <>
      <footer className="bg-[#0B100E] border-t border-[#C7A66A]/20 text-[#DCE5E0] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <Link
                href="/"
                className="flex items-center gap-3 group"
              >
                <img
                  src="/assets/wholdings-logo.png"
                  alt="Wholdings Logo"
                  className="h-9 w-auto object-contain"
                />
                <span className="font-serif-luxury text-2xl font-semibold tracking-wider text-white block">
                  WHOLDINGS
                </span>
              </Link>
              <p className="text-sm text-[#DCE5E0]/80 max-w-sm leading-relaxed">
                Discover Luxury Above the Clouds. Curated mountain villas, heritage wooden
                cottages, serviced alpine residences, and scenic land investments with Wholdings.
              </p>
              <p className="text-xs text-[#C7A66A]/90 leading-relaxed max-w-md">
                Transparency Notice: Sample showcase listings are clearly designated as
                SAMPLE PROPERTY. Authorized administrators can manage live inventory via
                the Admin Portal.
              </p>
            </div>

            {/* Regions Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Galiyat Regions
              </h3>
              <ul className="space-y-2 text-sm text-[#DCE5E0]/75">
                <li>
                  <Link href="/locations/wholdings" className="hover:text-[#C7A66A] transition-colors">
                    Wholdings
                  </Link>
                </li>
                <li>
                  <Link href="/locations/dunga-gali" className="hover:text-[#C7A66A] transition-colors">
                    Dunga Gali
                  </Link>
                </li>
                <li>
                  <Link href="/locations/ayubia" className="hover:text-[#C7A66A] transition-colors">
                    Ayubia
                  </Link>
                </li>
                <li>
                  <Link href="/locations/changla-gali" className="hover:text-[#C7A66A] transition-colors">
                    Changla Gali
                  </Link>
                </li>
                <li>
                  <Link href="/locations/khanspur" className="hover:text-[#C7A66A] transition-colors">
                    Khanspur
                  </Link>
                </li>
                <li>
                  <Link href="/locations/bara-gali" className="hover:text-[#C7A66A] transition-colors">
                    Bara Gali
                  </Link>
                </li>
              </ul>
            </div>

            {/* Discovery & Pages Column */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Platform Directory
              </h3>
              <ul className="space-y-2 text-sm text-[#DCE5E0]/75">
                <li>
                  <Link href="/properties" className="hover:text-[#C7A66A] transition-colors">
                    Property Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="hover:text-[#C7A66A] transition-colors">
                    3D Location Map
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="hover:text-[#C7A66A] transition-colors">
                    Explore Galiyat Tourism
                  </Link>
                </li>
                <li>
                  <Link href="/investment" className="hover:text-[#C7A66A] transition-colors">
                    Investment Advisory
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#C7A66A] transition-colors">
                    3D Photographic Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#C7A66A] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#C7A66A] transition-colors">
                    Admin Property Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Private Advisory Desk */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Private Advisory Desk
              </h3>
              <p className="text-xs text-[#DCE5E0]/75 leading-relaxed">
                {DEFAULT_COMPANY_CONFIG.officeAddress}
              </p>
              <p className="text-xs font-mono-tabular text-[#C7A66A]">
                WhatsApp: {DEFAULT_COMPANY_CONFIG.whatsappNumber}
              </p>
              <p className="text-xs text-[#DCE5E0]/80">{DEFAULT_COMPANY_CONFIG.email}</p>
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#102B24] border border-[#C7A66A]/40 text-xs font-medium text-white hover:bg-[#193F35] transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C7A66A]" />
                  <span>WhatsApp Concierge</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors whitespace-nowrap"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Direct Contact Form</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Legal Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DCE5E0]/60">
            <p>© {new Date().getFullYear()} Wholdings. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-[#C7A66A] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#C7A66A] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/admin" className="hover:text-[#C7A66A] transition-colors">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact / WhatsApp Action Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Inquire on WhatsApp"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#102B24] border border-[#C7A66A] text-white text-xs font-semibold shadow-2xl hover:bg-[#173D32] transition-all"
        >
          <MessageSquare className="w-4 h-4 text-[#C7A66A]" />
          <span className="hidden sm:inline whitespace-nowrap">WhatsApp Inquiry</span>
        </a>
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import { MessageSquare, MapPin, Mail, Phone } from 'lucide-react';
import { DEFAULT_COMPANY_CONFIG } from '@/src/lib/galiyat-data';
import { buildWhatsAppInquiryUrl } from '@/src/lib/property-logic';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { InquiryForm } from '@/src/components/InquiryModalAndForm';
import { Galiyat3DScene } from '@/src/components/Galiyat3DScene';

export default function ContactPage() {
  const [whatsappNumber, setWhatsappNumber] = useState(
    DEFAULT_COMPANY_CONFIG.whatsappNumber
  );

  const directWaUrl = buildWhatsAppInquiryUrl({
    whatsappNumber,
    customerMessage:
      'Assalam-o-Alaikum Wholdings, I would like to inquire about luxury mountain properties.',
  });

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
              PRIVATE CLIENT CONCIERGE
            </p>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-semibold text-white">
              Contact & WhatsApp Advisory Desk
            </h1>
            <p className="text-sm sm:text-base text-[#DCE5E0]/80 leading-relaxed">
              Reach our Wholdings advisory office via the validated inquiry form below or
              launch an immediate WhatsApp conversation with prefilled property details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-[#13241F] border border-[#C7A66A]/25 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C7A66A] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-white">Office Address</h2>
                    <p className="text-xs text-[#DCE5E0]/75 mt-1 leading-relaxed">
                      {DEFAULT_COMPANY_CONFIG.officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C7A66A] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <label
                      htmlFor="configurable-whatsapp"
                      className="block text-sm font-semibold text-white"
                    >
                      Configurable WhatsApp Dispatch Number
                    </label>
                    <input
                      id="configurable-whatsapp"
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="mt-1.5 w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs font-mono-tabular text-[#C7A66A]"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C7A66A] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-white">Official Email</h2>
                    <p className="text-xs text-[#DCE5E0]/75 mt-1">
                      {DEFAULT_COMPANY_CONFIG.email}
                    </p>
                  </div>
                </div>

                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Concierge</span>
                </a>
              </div>

              {/* Interactive 3D Map Preview */}
              <div className="h-72 rounded-2xl overflow-hidden border border-[#C7A66A]/30 bg-[#101614]">
                <Galiyat3DScene mode="explorer" selectedLocationSlug="wholdings" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <InquiryForm
                inquiryType="general"
                whatsappNumber={whatsappNumber}
                heading="Submit a Direct Property or Viewing Inquiry"
                subheading="All fields are validated and saved directly to our PostgreSQL inquiry registry."
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

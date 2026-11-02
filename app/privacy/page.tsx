import React from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 max-w-4xl mx-auto px-6 space-y-6">
        <p className="text-xs font-mono-tabular text-[#C7A66A]">LEGAL & DATA GOVERNANCE</p>
        <h1 className="font-serif-luxury text-4xl font-semibold text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#DCE5E0]/80 leading-relaxed">
          Wholdings respects your privacy and protects all personal information
          submitted through our property inquiry, investment advisory, and WhatsApp
          concierge forms.
        </p>
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-2xl text-white">
            1. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-[#DCE5E0]/75 leading-relaxed">
            When you submit an inquiry regarding a mountain villa, cottage, apartment, or
            land parcel in Wholdings, Dunga Gali, Ayubia, Changla Gali, Khanspur, or Bara
            Gali, we collect your name, email address, phone/WhatsApp number, location
            preference, and inquiry notes solely to respond to your request.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-2xl text-white">
            2. Security & Database Access
          </h2>
          <p className="text-xs sm:text-sm text-[#DCE5E0]/75 leading-relaxed">
            All client inquiries are stored in an encrypted PostgreSQL database with strict
            access controls. Public visitors have no access to private customer submissions.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

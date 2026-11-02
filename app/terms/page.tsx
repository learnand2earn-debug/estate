import React from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20 max-w-4xl mx-auto px-6 space-y-6">
        <p className="text-xs font-mono-tabular text-[#C7A66A]">LEGAL DISCLOSURES</p>
        <h1 className="font-serif-luxury text-4xl font-semibold text-white">
          Terms and Conditions
        </h1>
        <p className="text-sm text-[#DCE5E0]/80 leading-relaxed">
          Welcome to Wholdings. By exploring our 3D mountain real estate platform,
          you agree to the following terms governing sample listings, architectural
          representations, and investment inquiries.
        </p>
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-2xl text-white">
            1. Sample Property Transparency
          </h2>
          <p className="text-xs sm:text-sm text-[#DCE5E0]/75 leading-relaxed">
            All demonstration properties pre-populated on this platform are explicitly
            labeled as SAMPLE PROPERTY. Guide prices in PKR, architectural specifications,
            and payment schedule calculators are provided for illustrative discovery until
            verified by a formal sale and purchase agreement.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-serif-luxury text-2xl text-white">
            2. Advisory & Non-Guarantee of Financial Returns
          </h2>
          <p className="text-xs sm:text-sm text-[#DCE5E0]/75 leading-relaxed">
            Real estate acquisitions in mountain regions involve topographical, regulatory,
            and market variables. Wholdings never fabricates or guarantees investment
            returns. Buyers are encouraged to conduct independent legal and engineering due
            diligence prior to acquisition.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

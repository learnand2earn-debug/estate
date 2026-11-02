'use client';

import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { calculateAcquisitionSchedule } from '@/src/lib/property-logic';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { InquiryForm } from '@/src/components/InquiryModalAndForm';

export default function InvestmentPage() {
  const [priceMillions, setPriceMillions] = useState(160);
  const [downPercent, setDownPercent] = useState(30);
  const [quarters, setQuarters] = useState(8);

  const schedule = calculateAcquisitionSchedule(priceMillions, downPercent, quarters);

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
              GALIYAT CAPITAL ADVISORY
            </p>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-semibold text-white">
              Invest in the Beauty of Galiyat
            </h1>
            <p className="text-sm sm:text-base text-[#DCE5E0]/80 leading-relaxed">
              Structured mountain real estate acquisitions across Wholdings, Dunga Gali,
              Ayubia, Changla Gali, Khanspur, and Bara Gali. We provide factual engineering
              and legal due diligence without inventing speculative or guaranteed returns.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#13241F] border border-[#C7A66A]/25 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#C7A66A]">
                <Sliders className="w-4 h-4" />
                <span>ACQUISITION SCHEDULE MODELER</span>
              </div>

              <h2 className="font-serif-luxury text-2xl font-semibold text-white">
                Custom Payment Structuring
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>Indicative Estate Value</span>
                    <span className="font-mono-tabular text-[#C7A66A] font-semibold">
                      PKR {priceMillions} Million
                    </span>
                  </div>
                  <input
                    type="range"
                    min={35}
                    max={350}
                    step={5}
                    aria-label="Indicative Estate Value"
                    value={priceMillions}
                    onChange={(e) => setPriceMillions(Number(e.target.value))}
                    className="w-full accent-[#C7A66A]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>Initial Down Payment</span>
                    <span className="font-mono-tabular text-[#C7A66A] font-semibold">
                      {downPercent}% (PKR {schedule.downPaymentMillions}M)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={60}
                    step={5}
                    aria-label="Initial Down Payment"
                    value={downPercent}
                    onChange={(e) => setDownPercent(Number(e.target.value))}
                    className="w-full accent-[#C7A66A]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>Installment Horizon</span>
                    <span className="font-mono-tabular text-[#C7A66A] font-semibold">
                      {quarters} Quarters
                    </span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    step={2}
                    aria-label="Installment Horizon"
                    value={quarters}
                    onChange={(e) => setQuarters(Number(e.target.value))}
                    className="w-full accent-[#C7A66A]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#101614] border border-white/10 space-y-2 font-mono-tabular text-xs">
                <div className="flex justify-between">
                  <span className="text-[#DCE5E0]/70">Booking Down Payment:</span>
                  <span className="text-white font-semibold">
                    PKR {schedule.downPaymentMillions}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#DCE5E0]/70">Quarterly Milestone:</span>
                  <span className="text-[#C7A66A] font-semibold">
                    PKR {schedule.quarterlyInstallmentMillions}M / quarter
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#DCE5E0]/70">Handover Balance (10%):</span>
                  <span className="text-white font-semibold">
                    PKR {schedule.possessionPaymentMillions}M
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InquiryForm
                inquiryType="investment"
                heading="Investment Advisory Inquiry"
                subheading="Specify your preferred Galiyat location, budget range, and asset category to receive our private investment brief."
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

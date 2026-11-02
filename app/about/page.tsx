'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DEFAULT_COMPANY_CONFIG } from '@/src/lib/galiyat-data';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { ArchitecturalSceneArt } from '@/src/components/ArchitecturalSceneArt';

export default function AboutPage() {
  const [config, setConfig] = useState(DEFAULT_COMPANY_CONFIG);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
                COMPANY INTRODUCTION · EDITABLE PROFILE
              </p>
              <h1 className="font-serif-luxury text-4xl sm:text-5xl font-semibold text-white">
                {config.aboutHeadline}
              </h1>
              <p className="text-sm sm:text-base text-[#DCE5E0]/85 leading-relaxed">
                {config.aboutStory}
              </p>
              <p className="text-xs text-[#C7A66A]/90 leading-relaxed">
                {config.advisoryNotice}
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="px-4 py-2.5 rounded-lg bg-[#13241F] border border-[#C7A66A]/40 text-xs font-medium text-white hover:border-[#C7A66A]"
                >
                  {isEditing ? 'Done Editing Company Details' : 'Customize Company Details'}
                </button>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold"
                >
                  Contact Advisory Desk
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 h-96 rounded-2xl overflow-hidden border border-[#C7A66A]/30">
              <ArchitecturalSceneArt
                sceneType="villa-sunset"
                title="Wholdings Architectural Advisory"
                subtitle="Curating Mountain Villas, Cottages & Land with Wholdings"
              />
            </div>
          </div>

          {isEditing && (
            <div className="p-6 rounded-2xl bg-[#13241F] border border-[#C7A66A]/40 space-y-4">
              <h2 className="font-serif-luxury text-2xl font-semibold text-white">
                Edit Company Profile & Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-headline" className="block text-xs text-[#DCE5E0] mb-1">
                    About Headline
                  </label>
                  <input
                    id="edit-headline"
                    type="text"
                    value={config.aboutHeadline}
                    onChange={(e) =>
                      setConfig({ ...config, aboutHeadline: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                  />
                </div>
                <div>
                  <label htmlFor="edit-whatsapp" className="block text-xs text-[#DCE5E0] mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    id="edit-whatsapp"
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(e) =>
                      setConfig({ ...config, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white font-mono-tabular"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="edit-story" className="block text-xs text-[#DCE5E0] mb-1">
                  Company Introduction
                </label>
                <textarea
                  id="edit-story"
                  rows={3}
                  value={config.aboutStory}
                  onChange={(e) => setConfig({ ...config, aboutStory: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Core Advisory Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '01. Mountain Property Discovery',
                body: 'Explore villas, wooden cottages, apartments, and terraced land across Wholdings, Dunga Gali, Ayubia, Changla Gali, Khanspur, and Bara Gali.',
              },
              {
                title: '02. Buyer Inquiries & Site Viewings',
                body: 'Direct coordination for private on-site property inspections, topographical boundary walks, and architectural consultations.',
              },
              {
                title: '03. Investment & Location Assistance',
                body: 'Objective comparison of microclimates, winter road accessibility, utility infrastructure, and contour suitability across Galiyat.',
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-[#13241F] border border-[#C7A66A]/20 space-y-2.5"
              >
                <h2 className="font-serif-luxury text-2xl font-semibold text-white">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#DCE5E0]/75 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

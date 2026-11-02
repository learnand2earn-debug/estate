'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TOURISM_LANDMARKS, type TourismLandmark } from '@/src/lib/galiyat-data';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { ArchitecturalSceneArt } from '@/src/components/ArchitecturalSceneArt';
import { MountainCinemaVideo } from '@/src/components/MountainCinemaVideo';

export default function ExploreGaliyatPage() {
  const [activePlace, setActivePlace] = useState<TourismLandmark>(TOURISM_LANDMARKS[0]);

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24">
        {/* Hero Video Banner */}
        <section className="relative h-[420px] flex items-center overflow-hidden border-b border-white/10">
          <MountainCinemaVideo
            mode="section"
            atmosphere="morning-mist"
            className="absolute inset-0 w-full h-full"
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-4">
            <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
              TOURISM & NATURAL HERITAGE
            </p>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-semibold text-white">
              Experience the Beauty of Galiyat
            </h1>
            <p className="text-sm sm:text-base text-[#DCE5E0]/85 max-w-2xl leading-relaxed">
              From the mist-wrapped deodar groves of Wholdings and Ayubia National Park to
              the historic Pipeline Track, Mukshpuri Top, and Miranjani Peak.
            </p>
          </div>
        </section>

        {/* Featured Landmark Spotlight */}
        <section className="py-16 max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#13241F] border border-[#C7A66A]/25 rounded-2xl overflow-hidden">
            <div className="lg:col-span-7 min-h-[340px]">
              <ArchitecturalSceneArt
                sceneType={activePlace.sceneType}
                title={activePlace.name}
                subtitle={activePlace.region}
              />
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-mono-tabular text-[#C7A66A]">
                  {activePlace.region} · {activePlace.category}
                </div>
                <h2 className="font-serif-luxury text-3xl font-semibold text-white">
                  {activePlace.name}
                </h2>
                <p className="text-sm text-[#DCE5E0]/85 leading-relaxed">
                  {activePlace.summary}
                </p>
                <p className="text-xs text-[#DCE5E0]/75 leading-relaxed">
                  {activePlace.experienceNotes}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
                >
                  <span>View Properties Near {activePlace.region}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* All 8 Tourism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOURISM_LANDMARKS.map((place) => (
              <article
                key={place.id}
                className="bg-[#13241F] border border-[#C7A66A]/20 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44">
                    <ArchitecturalSceneArt
                      sceneType={place.sceneType}
                      title={place.name}
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-mono-tabular text-[#C7A66A]">
                      {place.region}
                    </div>
                    <h3 className="font-serif-luxury text-xl font-semibold text-white">
                      {place.name}
                    </h3>
                    <p className="text-xs text-[#DCE5E0]/75 leading-relaxed">
                      {place.summary}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setActivePlace(place)}
                    className="w-full px-4 py-2 rounded-lg bg-[#102B24] border border-[#C7A66A]/35 text-xs font-medium text-white hover:bg-[#C7A66A] hover:text-[#101614] transition-colors"
                  >
                    Highlight Destination
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

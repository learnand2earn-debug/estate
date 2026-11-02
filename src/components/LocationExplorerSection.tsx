'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass } from 'lucide-react';
import {
  GALIYAT_LOCATIONS,
  type GaliyatLocation,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { Galiyat3DScene } from './Galiyat3DScene';
import { ArchitecturalSceneArt } from './ArchitecturalSceneArt';

interface LocationExplorerSectionProps {
  properties: PropertyRecord[];
}

export function LocationExplorerSection({ properties }: LocationExplorerSectionProps) {
  const [activeLocation, setActiveLocation] = useState<GaliyatLocation>(
    GALIYAT_LOCATIONS[0]
  );

  const locationProperties = properties.filter(
    (p) => p.locationSlug === activeLocation.slug
  );

  return (
    <section id="location-explorer" className="py-20 bg-[#0D1412] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
              02. INTERACTIVE 3D TOPOGRAPHICAL ATLAS
            </p>
            <h2
              className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-white"
              style={{ textWrap: 'balance' }}
            >
              3D Location Explorer — The Six Towns of Galiyat
            </h2>
            <p className="text-sm sm:text-base text-[#DCE5E0]/80 leading-relaxed">
              Select any mountain town below or click the golden 3D beacons on the terrain
              to glide the camera across Wholdings, Dunga Gali, Ayubia, Changla Gali,
              Khanspur, and Bara Gali.
            </p>
          </div>

          <Link
            href="/locations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#102B24] border border-[#C7A66A]/40 text-xs font-semibold text-white hover:bg-[#183E34] transition-colors whitespace-nowrap shrink-0"
          >
            <Compass className="w-4 h-4 text-[#C7A66A]" />
            <span>Open Full Regional Directory</span>
          </Link>
        </div>

        {/* Split Layout: Interactive 3D Terrain Viewport + Animated Region Dossier Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 Columns: Live Three.js 3D Galiyat Mountain Terrain */}
          <div className="lg:col-span-7 min-h-[460px] lg:min-h-[560px] rounded-2xl overflow-hidden border border-[#C7A66A]/30 bg-[#101614] relative">
            <Galiyat3DScene
              mode="explorer"
              selectedLocationSlug={activeLocation.slug}
              onSelectLocation={(loc) => setActiveLocation(loc)}
            />
          </div>

          {/* Right 5 Columns: Selected Location Dossier & Available Properties */}
          <div className="lg:col-span-5 bg-[#13241F] border border-[#C7A66A]/25 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Visual Preview */}
              <div className="h-44 rounded-xl overflow-hidden border border-white/10">
                <ArchitecturalSceneArt
                  sceneType={
                    activeLocation.slug === 'dunga-gali'
                      ? 'cottage-mist'
                      : activeLocation.slug === 'changla-gali'
                      ? 'glass-house'
                      : activeLocation.slug === 'ayubia'
                      ? 'penthouse-clouds'
                      : 'villa-sunset'
                  }
                  title={activeLocation.name}
                  subtitle={activeLocation.tagline}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#C7A66A]">
                  <span>{activeLocation.elevationSummary}</span>
                  <span aria-hidden="true">·</span>
                  <span>{locationProperties.length} Curated Estates</span>
                </div>

                <h3 className="font-serif-luxury text-3xl font-semibold text-white">
                  {activeLocation.name}
                </h3>

                <p className="text-xs font-medium text-[#C7A66A]/90">
                  {activeLocation.character}
                </p>

                <p className="text-sm text-[#DCE5E0]/80 leading-relaxed">
                  {activeLocation.description}
                </p>
              </div>

              {/* Regional Highlights */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Regional Characteristics
                </h4>
                <ul className="space-y-1.5 text-xs text-[#DCE5E0]/80">
                  {activeLocation.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="text-[#C7A66A]">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Properties in this Location */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Available Properties in {activeLocation.name}
                </h4>
                {locationProperties.length === 0 ? (
                  <p className="text-xs text-[#DCE5E0]/60">
                    Bespoke off-market parcels available upon inquiry.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {locationProperties.map((prop) => (
                      <Link
                        key={prop.slug}
                        href={`/properties/${prop.slug}`}
                        className="block p-3 rounded-xl bg-[#101614] border border-white/10 hover:border-[#C7A66A]/60 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-white truncate">
                            {prop.title}
                          </span>
                          <span className="text-xs font-mono-tabular text-[#C7A66A] shrink-0">
                            {prop.pricePkr}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-[#DCE5E0]/65 font-mono-tabular">
                          {prop.propertyType} · {prop.areaLabel} · SAMPLE
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <Link
                href={`/locations/${activeLocation.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
              >
                <span>Explore {activeLocation.name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

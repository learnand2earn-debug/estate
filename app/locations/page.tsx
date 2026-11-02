'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  GALIYAT_LOCATIONS,
  INITIAL_SAMPLE_PROPERTIES,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { LocationExplorerSection } from '@/src/components/LocationExplorerSection';
import { ArchitecturalSceneArt } from '@/src/components/ArchitecturalSceneArt';

export default function LocationsPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>(() =>
    INITIAL_SAMPLE_PROPERTIES.map((p, idx) => ({ ...p, id: idx + 1 }))
  );

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.properties) && data.properties.length > 0) {
          setProperties(data.properties);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28">
        <LocationExplorerSection properties={properties} />

        <section className="py-20 max-w-7xl mx-auto px-6 space-y-10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
              REGIONAL DIRECTORY
            </p>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-white">
              Explore Every Mountain Town in Galiyat
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {GALIYAT_LOCATIONS.map((loc) => {
              const count = properties.filter((p) => p.locationSlug === loc.slug).length;
              return (
                <article
                  key={loc.slug}
                  className="bg-[#13241F] border border-[#C7A66A]/20 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-52">
                      <ArchitecturalSceneArt
                        sceneType={
                          loc.slug === 'dunga-gali'
                            ? 'cottage-mist'
                            : loc.slug === 'changla-gali'
                            ? 'glass-house'
                            : 'villa-sunset'
                        }
                        title={loc.name}
                        subtitle={loc.tagline}
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="text-xs font-mono-tabular text-[#C7A66A]">
                        {loc.elevationSummary} · {count} Sample Properties
                      </div>
                      <h2 className="font-serif-luxury text-2xl font-semibold text-white">
                        {loc.name}
                      </h2>
                      <p className="text-xs text-[#DCE5E0]/75 leading-relaxed">
                        {loc.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      href={`/locations/${loc.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
                    >
                      <span>Explore {loc.name}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

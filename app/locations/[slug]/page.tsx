'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  GALIYAT_LOCATIONS,
  INITIAL_SAMPLE_PROPERTIES,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { Galiyat3DScene } from '@/src/components/Galiyat3DScene';
import { PropertyCard3D } from '@/src/components/PropertyCard3D';
import { InquiryForm } from '@/src/components/InquiryModalAndForm';

export default function LocationDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || 'wholdings';

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

  const location =
    GALIYAT_LOCATIONS.find((l) => l.slug === slug) || GALIYAT_LOCATIONS[0];

  const regionalProperties = properties.filter((p) => p.locationSlug === location.slug);

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#C7A66A] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Galiyat Locations</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono-tabular text-[#C7A66A]">
                {location.elevationSummary} · GALIYAT CORRIDOR
              </div>
              <h1 className="font-serif-luxury text-4xl sm:text-5xl font-semibold text-white">
                {location.name}
              </h1>
              <p className="text-sm font-medium text-[#C7A66A]">{location.tagline}</p>
              <p className="text-sm sm:text-base text-[#DCE5E0]/85 leading-relaxed">
                {location.description}
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-[#DCE5E0]/80">
                {location.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-[#C7A66A]">·</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6 h-96 rounded-2xl overflow-hidden border border-[#C7A66A]/30 bg-[#101614]">
              <Galiyat3DScene mode="explorer" selectedLocationSlug={location.slug} />
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/10">
            <h2 className="font-serif-luxury text-3xl font-semibold text-white">
              Available Properties in {location.name} ({regionalProperties.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {regionalProperties.map((prop) => (
                <PropertyCard3D key={prop.slug} property={prop} />
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 max-w-3xl">
            <InquiryForm
              inquiryType="property"
              defaultLocation={location.name}
              heading={`Request Off-Market Estates in ${location.name}`}
              subheading={`Looking for a custom plot, cottage, or mountain villa in ${location.name}? Connect with our regional specialists.`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

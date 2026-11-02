'use client';

import React, { useEffect, useState } from 'react';
import { INITIAL_SAMPLE_PROPERTIES, type PropertyRecord } from '@/src/lib/galiyat-data';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { PropertyExplorerSection } from '@/src/components/PropertyExplorerSection';

export default function PropertiesPage() {
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
        <div className="max-w-7xl mx-auto px-6 pb-4">
          <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
            WHOLDINGS PORTFOLIO DIRECTORY
          </p>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-semibold text-white mt-2">
            Luxury Mountain Properties with Wholdings
          </h1>
          <p className="text-sm sm:text-base text-[#DCE5E0]/80 max-w-2xl mt-3">
            Filter by mountain town, architectural category, bedroom count, or guide price.
            All demonstration listings are clearly marked as SAMPLE PROPERTY.
          </p>
        </div>

        <PropertyExplorerSection properties={properties} showHeading={false} />
      </main>
      <Footer />
    </div>
  );
}

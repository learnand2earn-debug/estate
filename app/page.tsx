import React from 'react';
import { INITIAL_SAMPLE_PROPERTIES, type PropertyRecord } from '@/src/lib/galiyat-data';
import { HomeClient } from '@/src/components/HomeClient';

export default function HomePage() {
  const initialProperties: PropertyRecord[] = INITIAL_SAMPLE_PROPERTIES.map((p, idx) => ({
    ...p,
    id: idx + 1,
  }));

  return <HomeClient initialProperties={initialProperties} />;
}

'use client';

import React from 'react';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { GallerySection } from '@/src/components/GallerySection';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GALLERY_ITEMS, type GalleryItem } from '@/src/lib/galiyat-data';
import { ArchitecturalSceneArt } from './ArchitecturalSceneArt';

const CATEGORIES = [
  'All Photographs',
  'Mountain Landscapes',
  'Luxury Villas',
  'Wooden Cottages',
  'Interior Architecture',
  'Snow & Winter',
  'Sunrise & Golden Hour',
] as const;

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Photographs');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems =
    selectedCategory === 'All Photographs'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % visibleItems.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, visibleItems.length]);

  const activeItem: GalleryItem | null =
    lightboxIndex !== null && visibleItems[lightboxIndex]
      ? visibleItems[lightboxIndex]
      : null;

  return (
    <section id="gallery-experience" className="py-20 bg-[#101614] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
            06. ARCHITECTURAL & ALPINE ARCHIVE
          </p>
          <h2
            className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-white"
            style={{ textWrap: 'balance' }}
          >
            3D Gallery Experience — Life Above the Clouds
          </h2>
          <p className="text-sm sm:text-base text-[#DCE5E0]/80 leading-relaxed">
            Explore mountain landscapes, cantilevered cedar villas, interior hearths, and
            golden hour vistas across Wholdings and Galiyat. Click any frame to launch
            the full-screen architectural viewer.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#C7A66A] text-[#101614] font-semibold'
                    : 'bg-[#13241F] text-[#DCE5E0] hover:bg-[#1A352D]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry-Style Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleItems.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden border border-[#C7A66A]/20 bg-[#13241F] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${
                item.aspect === 'wide' ? 'md:col-span-2' : 'col-span-1'
              }`}
            >
              <div className="relative h-64 w-full overflow-hidden">
                <ArchitecturalSceneArt
                  sceneType={item.sceneType}
                  title={item.title}
                />
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={`View ${item.title} in full screen`}
                  className="absolute inset-0 flex items-end justify-between p-5 bg-gradient-to-t from-[#101614]/90 via-transparent to-transparent text-left"
                >
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono-tabular text-[#C7A66A]">
                      {item.location} · {item.category}
                    </div>
                    <h3 className="font-serif-luxury text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#DCE5E0]/75 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                  <span className="p-2 rounded-lg bg-[#102B24]/90 border border-[#C7A66A]/40 text-[#C7A66A] group-hover:bg-[#C7A66A] group-hover:text-[#101614] transition-colors shrink-0">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Full-Screen Lightbox Viewer */}
        {activeItem && lightboxIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            className="fixed inset-0 z-50 bg-[#101614]/95 flex flex-col justify-between p-6 md:p-10"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono-tabular text-[#C7A66A]">
                Frame {lightboxIndex + 1} of {visibleItems.length} · {activeItem.location}
              </div>
              <button
                type="button"
                aria-label="Close full-screen viewer"
                onClick={() => setLightboxIndex(null)}
                className="p-2.5 rounded-lg bg-[#13241F] border border-[#C7A66A]/40 text-white hover:bg-[#C7A66A] hover:text-[#101614] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-auto max-w-5xl w-full mx-auto space-y-6">
              <div className="h-[52vh] rounded-2xl overflow-hidden border border-[#C7A66A]/35">
                <ArchitecturalSceneArt
                  sceneType={activeItem.sceneType}
                  title={activeItem.title}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-white">
                    {activeItem.title}
                  </h3>
                  <p className="text-sm text-[#DCE5E0]/80 mt-1">{activeItem.caption}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + visibleItems.length) % visibleItems.length
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#13241F] border border-[#C7A66A]/35 text-xs font-medium text-white hover:border-[#C7A66A]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % visibleItems.length)
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c]"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

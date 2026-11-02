'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize, ArrowRight } from 'lucide-react';
import { type PropertyRecord } from '@/src/lib/galiyat-data';
import { ArchitecturalSceneArt } from './ArchitecturalSceneArt';

interface PropertyCard3DProps {
  property: PropertyRecord;
  whatsappNumber?: string;
  compact?: boolean;
}

export function PropertyCard3D({ property, compact = false }: PropertyCard3DProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: Number((-y * 6).toFixed(2)),
      rotateY: Number((x * 6).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const primaryVisual = property.galleryVisuals[0] || {
    id: 'default',
    title: property.title,
    caption: property.locationName,
    sceneType: 'villa-sunset' as const,
    palette: ['#102B24', '#C7A66A', '#101614'] as [string, string, string],
  };

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group relative bg-gradient-to-b from-[#142C24] via-[#0F221C] to-[#0A1713] border border-[#C7A66A]/55 rounded-2xl overflow-hidden flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.65)] hover:border-[#E7C789] transition-all"
    >
      {/* Top Photograph Frame + "For Sale" Emerald Badge */}
      <div className={`relative ${compact ? 'h-32' : 'h-56'} w-full overflow-hidden`}>
        <ArchitecturalSceneArt
          sceneType={primaryVisual.sceneType}
          title={property.title}
        />

        {/* Green "For Sale" Badge at Top-Left Matching Reference */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#138A4B] text-white text-[10px] font-semibold tracking-wide shadow-md">
            {property.availabilityStatus === 'Available'
              ? 'For Sale'
              : property.availabilityStatus}
          </span>
          {property.isSample && (
            <span className="px-1.5 py-0.5 rounded bg-[#0A1713]/85 border border-[#C7A66A]/35 text-[9px] font-mono-tabular text-[#E5C384]">
              SAMPLE
            </span>
          )}
        </div>

        {/* Location Pin Overlay at Bottom-Left of Image */}
        <div className="absolute bottom-2 left-3 z-10 flex items-center gap-1 text-[11px] font-medium text-white drop-shadow">
          <MapPin className="w-3 h-3 text-[#E5C384] fill-[#E5C384]/25 shrink-0" />
          <span>{property.locationName}</span>
        </div>
      </div>

      {/* Card Body Matching Reference Mockup */}
      <div
        className={`${
          compact ? 'p-3 space-y-1.5' : 'p-4 sm:p-5 space-y-3'
        } flex-1 flex flex-col justify-between`}
      >
        <div className={compact ? 'space-y-1' : 'space-y-2.5'}>
          <h3
            className={`font-sans ${
              compact ? 'text-sm sm:text-base' : 'text-lg sm:text-xl'
            } font-bold text-white leading-snug group-hover:text-[#E7C789] transition-colors truncate`}
          >
            <Link href={`/properties/${property.slug}`}>{property.title}</Link>
          </h3>

          {/* Specs Row: Beds · Baths · Sq Ft with Gold Icons */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-[#DCE5E0]/90 font-medium">
            {property.bedrooms > 0 ? (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="w-3 h-3 text-[#D8B576]" />
                <span>{property.bedrooms} Beds</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Maximize className="w-3 h-3 text-[#D8B576]" />
                <span>Land Plot</span>
              </span>
            )}

            {property.bathrooms > 0 && (
              <span className="inline-flex items-center gap-1">
                <Bath className="w-3 h-3 text-[#D8B576]" />
                <span>{property.bathrooms} Baths</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <Maximize className="w-3 h-3 text-[#D8B576]" />
              <span>{property.areaSqFt.toLocaleString()} Sq Ft</span>
            </span>
          </div>
        </div>

        {/* Bottom Price & Gold Circle Arrow Button */}
        <div
          className={`${
            compact ? 'pt-2' : 'pt-3'
          } border-t border-[#C7A66A]/20 flex items-center justify-between gap-2`}
        >
          <span
            className={`font-sans ${
              compact ? 'text-sm sm:text-[15px]' : 'text-base sm:text-lg'
            } font-extrabold tracking-tight bg-gradient-to-b from-[#FFF0C4] via-[#E2BF7D] to-[#B68B46] bg-clip-text text-transparent font-mono-tabular`}
          >
            {property.pricePkr}
          </span>

          <Link
            href={`/properties/${property.slug}`}
            aria-label={`View details for ${property.title}`}
            className={`${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            } rounded-full bg-gradient-to-b from-[#E7C789] to-[#B08440] text-[#101614] flex items-center justify-center shadow-[0_2px_10px_rgba(213,175,107,0.45)] hover:scale-105 transition-transform shrink-0`}
          >
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

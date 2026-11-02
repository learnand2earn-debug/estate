'use client';

import React from 'react';
import type { PropertyVisual } from '@/src/lib/galiyat-data';

interface ArchitecturalSceneArtProps {
  sceneType: PropertyVisual['sceneType'];
  title: string;
  subtitle?: string;
  className?: string;
  badgeText?: string;
}

export function ArchitecturalSceneArt({
  sceneType,
  title,
  subtitle,
  className = 'w-full h-full',
}: ArchitecturalSceneArtProps) {
  // Map each sceneType to a clean, high-resolution architectural region of the uploaded reference asset
  // where the twilight luxury mountain villa, pine trees, and sunset mountains are unobstructed
  const getCropStyle = (): React.CSSProperties => {
    switch (sceneType) {
      case 'villa-sunset':
        return {
          backgroundImage:
            "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
          backgroundSize: '740% 750%',
          backgroundPosition: '27.1% 78.6%',
        };
      case 'cottage-mist':
        return {
          backgroundImage:
            "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
          backgroundSize: '740% 750%',
          backgroundPosition: '44.2% 78.6%',
        };
      case 'glass-house':
        return {
          backgroundImage:
            "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
          backgroundSize: '740% 750%',
          backgroundPosition: '61.3% 78.6%',
        };
      case 'penthouse-clouds':
        return {
          backgroundImage:
            "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
          backgroundSize: '280% 340%',
          backgroundPosition: '76% 22%',
        };
      case 'pine-plot':
        return {
          backgroundImage:
            "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
          backgroundSize: '340% 360%',
          backgroundPosition: '46% 24%',
        };
      case 'commercial-ridge':
      case 'resort-twilight':
      case 'interior-hearth':
      default:
        return {
          backgroundImage:
            "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
          backgroundSize: '290% 340%',
          backgroundPosition: '80% 24%',
        };
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#0E1E19] select-none ${className}`}
      role="img"
      aria-label={title}
    >
      {/* Photorealistic 3D Rendered Architectural Layer */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-105"
        style={getCropStyle()}
      />

      {/* Subtle Golden & Forest Atmospheric Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(11,24,20,0.18) 0%, rgba(11,24,20,0.12) 55%, rgba(10,20,16,0.92) 100%)',
        }}
      />

      {subtitle && (
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-[#DCE5E0]/90 pointer-events-none">
          <span className="truncate drop-shadow">{subtitle}</span>
        </div>
      )}
    </div>
  );
}

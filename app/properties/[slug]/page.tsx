'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Check } from 'lucide-react';
import {
  INITIAL_SAMPLE_PROPERTIES,
  DEFAULT_COMPANY_CONFIG,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { buildWhatsAppInquiryUrl } from '@/src/lib/property-logic';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { ArchitecturalSceneArt } from '@/src/components/ArchitecturalSceneArt';
import { InquiryForm } from '@/src/components/InquiryModalAndForm';
import { PropertyCard3D } from '@/src/components/PropertyCard3D';

export default function PropertyDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';

  const [allProperties, setAllProperties] = useState<PropertyRecord[]>(() =>
    INITIAL_SAMPLE_PROPERTIES.map((p, idx) => ({ ...p, id: idx + 1 }))
  );
  const [activeVisualIdx, setActiveVisualIdx] = useState(0);

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.properties) && data.properties.length > 0) {
          setAllProperties(data.properties);
        }
      })
      .catch(() => {});
  }, []);

  const property =
    allProperties.find((p) => p.slug === slug) || allProperties[0];

  const similarProperties = allProperties
    .filter((p) => p.slug !== property.slug)
    .slice(0, 3);

  const visuals =
    property.galleryVisuals.length > 0
      ? property.galleryVisuals
      : [
          {
            id: 'default',
            title: property.title,
            caption: property.locationName,
            sceneType: 'villa-sunset' as const,
            palette: ['#102B24', '#C7A66A', '#101614'] as [string, string, string],
          },
        ];

  const currentVisual = visuals[activeVisualIdx % visuals.length];

  const whatsappUrl = buildWhatsAppInquiryUrl({
    whatsappNumber: DEFAULT_COMPANY_CONFIG.whatsappNumber,
    propertyName: property.title,
    propertyLocation: property.locationName,
    propertyReferenceId: property.referenceId,
  });

  return (
    <div className="min-h-screen bg-[#101614] text-[#DCE5E0] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Breadcrumb & Back Link */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-xs font-medium text-[#C7A66A] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Galiyat Properties</span>
            </Link>

            <div className="text-xs font-mono-tabular text-[#DCE5E0]/75">
              Ref ID: <span className="text-[#C7A66A]">{property.referenceId}</span> ·{' '}
              {property.availabilityStatus} ·{' '}
              {property.isSample ? 'SAMPLE PROPERTY' : 'VERIFIED LISTING'}
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono-tabular text-[#C7A66A]">
                {property.locationName} · {property.propertyType} · {property.elevationFt}
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-semibold text-white leading-tight">
                {property.title}
              </h1>
              <p className="text-sm text-[#DCE5E0]/80">{property.subtitle}</p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
              <div>
                <span className="block text-xs text-[#DCE5E0]/60 lg:text-right">
                  Guide Price
                </span>
                <span className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#C7A66A]">
                  {property.pricePkr}
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Inquire via WhatsApp ({property.referenceId})</span>
              </a>
            </div>
          </div>

          {/* Interactive Architectural Gallery */}
          <div className="space-y-4">
            <div className="h-[380px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#C7A66A]/30">
              <ArchitecturalSceneArt
                sceneType={currentVisual.sceneType}
                title={currentVisual.title}
                subtitle={currentVisual.caption}
              />
            </div>

            {visuals.length > 1 && (
              <div className="flex flex-wrap items-center gap-3">
                {visuals.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVisualIdx(idx)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeVisualIdx === idx
                        ? 'bg-[#C7A66A] text-[#101614] font-semibold'
                        : 'bg-[#13241F] text-[#DCE5E0] hover:bg-[#1A352D]'
                    }`}
                  >
                    0{idx + 1}. {v.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#13241F] border border-[#C7A66A]/20 font-mono-tabular">
            <div>
              <span className="block text-xs text-[#DCE5E0]/60">Location</span>
              <span className="text-base font-semibold text-white">
                {property.locationName}
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#DCE5E0]/60">Bedrooms / Baths</span>
              <span className="text-base font-semibold text-white">
                {property.bedrooms > 0
                  ? `${property.bedrooms} Beds / ${property.bathrooms} Baths`
                  : 'Surveyed Land Parcel'}
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#DCE5E0]/60">Built / Plot Area</span>
              <span className="text-base font-semibold text-[#C7A66A]">
                {property.areaLabel}
              </span>
            </div>
            <div>
              <span className="block text-xs text-[#DCE5E0]/60">Reference ID</span>
              <span className="text-base font-semibold text-white">
                {property.referenceId}
              </span>
            </div>
          </div>

          {/* Split Description, Amenities & Inquiry Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-white">
                  Architectural Monograph & Overview
                </h2>
                <p className="text-sm sm:text-base text-[#DCE5E0]/85 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#13241F] border border-white/10 space-y-2">
                <h3 className="text-sm font-semibold text-[#C7A66A]">
                  Engineering & Mountain Specifications
                </h3>
                <p className="text-xs sm:text-sm text-[#DCE5E0]/80 leading-relaxed">
                  {property.architecturalNotes}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif-luxury text-2xl font-semibold text-white">
                  Estate Amenities & Facilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="p-3.5 rounded-xl bg-[#13241F] border border-white/10 flex items-center gap-2.5 text-xs text-white"
                    >
                      <Check className="w-4 h-4 text-[#C7A66A] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <InquiryForm
                inquiryType="property"
                propertyId={property.id}
                propertyTitle={property.title}
                propertyReferenceId={property.referenceId}
                defaultLocation={property.locationName}
                heading={`Inquire About ${property.referenceId}`}
                subheading="Schedule a private viewing or request the complete architectural floor plans and land title dossier."
              />
            </div>
          </div>

          {/* Similar Properties */}
          <div className="pt-12 border-t border-white/10 space-y-6">
            <h2 className="font-serif-luxury text-3xl font-semibold text-white">
              Similar Mountain Estates in Galiyat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {similarProperties.map((sim) => (
                <PropertyCard3D key={sim.slug} property={sim} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

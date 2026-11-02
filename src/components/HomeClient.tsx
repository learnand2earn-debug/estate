'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  ChevronRight,
  Home,
  Map as MapIcon,
  MapPin,
  Play,
  Search,
  Tag,
} from 'lucide-react';
import {
  GALIYAT_LOCATIONS,
  PROPERTY_CATEGORIES,
  DEFAULT_COMPANY_CONFIG,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { filterProperties } from '@/src/lib/property-logic';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PropertyCard3D } from './PropertyCard3D';

interface HomeClientProps {
  initialProperties: PropertyRecord[];
}

export function HomeClient({ initialProperties }: HomeClientProps) {
  const [properties, setProperties] = useState<PropertyRecord[]>(initialProperties);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Ensure background video plays automatically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Hero Search Bar Filters
  const [heroLocation, setHeroLocation] = useState<string>('all');
  const [heroCategory, setHeroCategory] = useState<string>('all');
  const [heroMinPriceM, setHeroMinPriceM] = useState<number>(0);
  const [heroMaxPriceM, setHeroMaxPriceM] = useState<number>(500);
  const [heroBedrooms, setHeroBedrooms] = useState<number>(0);
  const [activeMapPin, setActiveMapPin] = useState<string>('all');

  // Sync live properties from Cloud SQL database API on mount
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.properties) && data.properties.length > 0) {
          setProperties(data.properties);
        }
      })
      .catch(() => {
        // Keep initialProperties fallback
      });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / 800));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filteredTopProperties = filterProperties(properties, {
    location: activeMapPin !== 'all' ? activeMapPin : heroLocation,
    category: heroCategory,
    minPrice: heroMinPriceM * 1_000_000,
    maxPrice: heroMaxPriceM * 1_000_000,
    minBedrooms: heroBedrooms,
  });

  const displayPool =
    filteredTopProperties.length > 0 ? filteredTopProperties : properties;
  const visibleThreeCards = [0, 1, 2].map(
    (idx) => displayPool[(carouselOffset + idx) % Math.max(1, displayPool.length)]
  );

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveMapPin('all');
    setCarouselOffset(0);
    const el = document.getElementById('featured-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1A16] text-[#DCE5E0] flex flex-col selection:bg-[#C7A66A] selection:text-[#101614]">
      <Navbar />

      <main className="flex-1">
        {/* ==================================================
            MASTERPIECE ABOVE-THE-FOLD HERO + SEARCH + 3-COLUMN SHOWCASE
            Matches uploaded screenshot design pixel-for-pixel
           ================================================== */}
        <section
          aria-label="Hero Section"
          className="relative w-full overflow-hidden bg-[#0A1612] pt-24 pb-12 border-b border-[#C7A66A]/25"
        >
          {/* Ambient Background Looping Video Layer - Bright, Vivid and Fully Visible */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              src="/videos/wholdings-hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105 opacity-90"
            />
            {/* Subtle soft gradient on the left text area only, keeping video vibrant across the entire center and right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#07130F]/80 via-[#0A1A14]/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A1612] to-transparent pointer-events-none" />
          </div>

          {/* Luxury Mountain Villa, Mercedes G-Wagon Car, Terrace and Stone Sign in Foreground */}
          <div className="absolute top-[48px] right-0 w-full lg:w-[68%] h-[440px] z-[2] overflow-hidden pointer-events-none">
            <img
              src="/assets/hero-villa-foreground.png"
              alt="Luxury Mountain Villa & Mercedes G-Wagon"
              className="w-full h-full object-contain object-right-top"
            />
          </div>

          {/* Left Vertical Social Bar */}
          <aside
            aria-label="Social Media Channels"
            className="hidden xl:flex flex-col items-center gap-3 fixed left-3.5 top-[38%] -translate-y-1/2 z-30 py-3.5 px-2 rounded-2xl bg-[#0D1A16]/85 backdrop-blur-md border border-[#C7A66A]/35 shadow-2xl"
          >
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C7A66A] text-white hover:text-[#101614] flex items-center justify-center text-[11px] font-bold transition-colors"
            >
              f
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C7A66A] text-white hover:text-[#101614] flex items-center justify-center text-[9px] transition-colors"
            >
              ▶
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C7A66A] text-white hover:text-[#101614] flex items-center justify-center text-[11px] transition-colors"
            >
              ◎
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X Updates"
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-[#C7A66A] text-white hover:text-[#101614] flex items-center justify-center text-[11px] font-semibold transition-colors"
            >
              𝕏
            </a>
            <span className="w-[1px] h-5 bg-[#C7A66A]/45" />
          </aside>

          {/* Main Container */}
          <div className="relative z-10 max-w-[1420px] mx-auto px-4 sm:px-8 xl:pl-16 pt-2">
            {/* Upper Hero Row */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-h-[345px]">
              {/* Left Column: WHOLDINGS 3D Gold Hero Stack */}
              <div
                className="lg:col-span-6 space-y-2.5 pt-2"
                style={{
                  transform: `translateY(${scrollProgress * -16}px)`,
                  transition: 'transform 120ms linear',
                }}
              >
                {/* Tagline Pill with Mountain Roof Icon */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0E211B]/90 border border-[#C7A66A]/45 shadow-lg">
                  <svg
                    viewBox="0 0 36 22"
                    className="w-5 h-3.5 shrink-0"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 19L14 4L22 13L27 7L34 19"
                      stroke="#E5C17B"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <rect x="12" y="13" width="4" height="4" fill="#E5C17B" />
                  </svg>
                  <span className="text-xs font-serif-luxury italic tracking-wide text-[#F3DFB2]">
                    Discover Luxury Above the Clouds
                  </span>
                </div>

                {/* Giant Metallic 3D Gold Heading */}
                <h1 className="font-serif-luxury font-bold uppercase tracking-[0.05em] leading-[0.92] select-none">
                  <span className="block text-4xl sm:text-5xl lg:text-[4.5rem] bg-gradient-to-b from-[#FFF6D6] via-[#E5C17B] to-[#9E7130] bg-clip-text text-transparent drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)]">
                    WHOLDINGS
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="font-serif-luxury text-lg sm:text-xl lg:text-[1.5rem] text-white font-medium tracking-wide drop-shadow">
                  Where Luxury Meets the Mountains
                </p>

                {/* Supporting Paragraph */}
                <p className="text-xs sm:text-sm text-[#DCE5E0]/90 max-w-md leading-relaxed">
                  Discover exceptional properties, breathtaking mountain views and
                  exclusive real estate opportunities with Wholdings.
                </p>

                {/* Hero Action Buttons */}
                <div className="pt-1.5 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#featured-showcase"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#ECCF96] via-[#CFA662] to-[#A87A38] text-[#101614] text-xs sm:text-sm font-bold shadow-[0_10px_28px_rgba(199,166,106,0.4)] hover:brightness-110 transition-all whitespace-nowrap"
                  >
                    <Home className="w-4 h-4 stroke-[2.3]" />
                    <span>Explore Properties</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.3]" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('featured-showcase');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0E1E19]/90 border border-[#C7A66A]/65 text-white text-xs sm:text-sm font-medium hover:bg-[#152D25] hover:border-[#E5C17B] transition-all whitespace-nowrap shadow-xl cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full border border-[#E5C17B] flex items-center justify-center text-[#E5C17B]">
                      <Play className="w-2 h-2 fill-current ml-0.5" />
                    </span>
                    <span>Discover Wholdings</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Top-Right "Premium Mountain Living" Glass Badge */}
              <div className="lg:col-span-6 flex flex-col items-end justify-between h-full min-h-[320px] pointer-events-none">
                <div className="hidden lg:inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0E201A]/90 backdrop-blur-md border border-[#C7A66A]/50 shadow-[0_12px_32px_rgba(0,0,0,0.75)] pointer-events-auto">
                  <svg
                    viewBox="0 0 40 28"
                    className="w-8 h-6 shrink-0"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 24L15 7L23 17L29 10L37 24H3Z"
                      stroke="#E5C17B"
                      strokeWidth="2.2"
                      fill="rgba(199,166,106,0.18)"
                    />
                  </svg>
                  <div className="leading-tight">
                    <span className="block text-xs font-semibold text-white">
                      Premium
                    </span>
                    <span className="block text-[11px] text-[#DCE5E0]/90">
                      Mountain Living
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Scroll to Explore Indicator */}
              <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-1 flex flex-col items-center justify-center z-20">
                <a
                  href="#featured-showcase"
                  aria-label="Scroll to Explore"
                  className="group flex flex-col items-center gap-1 text-white/95 hover:text-[#E5C17B] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#0E201A]/90 border border-[#C7A66A]/70 flex items-center justify-center text-[#E5C17B] shadow-lg group-hover:translate-y-0.5 transition-transform">
                    <ArrowDown className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-medium tracking-wide text-white drop-shadow">
                    Scroll to Explore
                  </span>
                </a>
              </div>
            </div>

            {/* ==================================================
                FULL-WIDTH GLASS SEARCH & FILTER BAR
               ================================================== */}
            <form
              onSubmit={handleHeroSearchSubmit}
              aria-label="Quick Property Search"
              className="relative z-20 max-w-5xl mx-auto mt-4 rounded-3xl lg:rounded-full bg-gradient-to-r from-[#0E221B]/95 via-[#132B23]/95 to-[#0E221B]/95 backdrop-blur-xl border border-[#C7A66A]/55 shadow-[0_18px_45px_rgba(0,0,0,0.85)] p-1.5 sm:px-3.5 sm:py-1.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 items-center gap-1.5">
                {/* 1. Location Dropdown */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer border-b sm:border-b-0 sm:border-r border-white/10">
                  <MapPin className="w-4 h-4 text-[#E5C17B] shrink-0" />
                  <select
                    aria-label="Filter by Location"
                    value={heroLocation}
                    onChange={(e) => {
                      setHeroLocation(e.target.value);
                      setActiveMapPin('all');
                      setCarouselOffset(0);
                    }}
                    className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#10231C] text-white">
                      All Locations
                    </option>
                    {GALIYAT_LOCATIONS.map((loc) => (
                      <option
                        key={loc.slug}
                        value={loc.slug}
                        className="bg-[#10231C] text-white"
                      >
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 2. Property Category Dropdown */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer border-b sm:border-b-0 lg:border-r border-white/10">
                  <Home className="w-4 h-4 text-[#E5C17B] shrink-0" />
                  <select
                    aria-label="Filter by Property Type"
                    value={heroCategory}
                    onChange={(e) => {
                      setHeroCategory(e.target.value);
                      setCarouselOffset(0);
                    }}
                    className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-[#10231C] text-white">
                      All Properties
                    </option>
                    {PROPERTY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#10231C] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 3. Min Price Dropdown */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer border-b sm:border-b-0 sm:border-r border-white/10">
                  <Tag className="w-4 h-4 text-[#E5C17B] shrink-0" />
                  <select
                    aria-label="Minimum Price"
                    value={heroMinPriceM}
                    onChange={(e) => {
                      setHeroMinPriceM(Number(e.target.value));
                      setCarouselOffset(0);
                    }}
                    className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value={0} className="bg-[#10231C] text-white">
                      Min Price
                    </option>
                    <option value={15} className="bg-[#10231C] text-white">
                      PKR 15,000,000
                    </option>
                    <option value={25} className="bg-[#10231C] text-white">
                      PKR 25,000,000
                    </option>
                    <option value={40} className="bg-[#10231C] text-white">
                      PKR 40,000,000
                    </option>
                  </select>
                </label>

                {/* 4. Max Price Dropdown */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer border-b sm:border-b-0 lg:border-r border-white/10">
                  <Tag className="w-4 h-4 text-[#E5C17B] shrink-0" />
                  <select
                    aria-label="Maximum Price"
                    value={heroMaxPriceM}
                    onChange={(e) => {
                      setHeroMaxPriceM(Number(e.target.value));
                      setCarouselOffset(0);
                    }}
                    className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value={500} className="bg-[#10231C] text-white">
                      Max Price
                    </option>
                    <option value={25} className="bg-[#10231C] text-white">
                      PKR 25,000,000
                    </option>
                    <option value={35} className="bg-[#10231C] text-white">
                      PKR 35,000,000
                    </option>
                    <option value={50} className="bg-[#10231C] text-white">
                      PKR 50,000,000
                    </option>
                    <option value={250} className="bg-[#10231C] text-white">
                      PKR 250,000,000
                    </option>
                  </select>
                </label>

                {/* 5. Bedrooms Dropdown */}
                <label className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
                  <BedDouble className="w-4 h-4 text-[#E5C17B] shrink-0" />
                  <select
                    aria-label="Minimum Bedrooms"
                    value={heroBedrooms}
                    onChange={(e) => {
                      setHeroBedrooms(Number(e.target.value));
                      setCarouselOffset(0);
                    }}
                    className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value={0} className="bg-[#10231C] text-white">
                      Bedrooms
                    </option>
                    <option value={2} className="bg-[#10231C] text-white">
                      2+ Bedrooms
                    </option>
                    <option value={3} className="bg-[#10231C] text-white">
                      3+ Bedrooms
                    </option>
                    <option value={4} className="bg-[#10231C] text-white">
                      4+ Bedrooms
                    </option>
                  </select>
                </label>

                {/* 6. Gold Search Properties Button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-b from-[#ECCF96] via-[#CFA662] to-[#A87A38] text-[#101614] text-xs font-bold shadow-[0_6px_20px_rgba(199,166,106,0.4)] hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.4]" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>

            {/* ==================================================
                LOWER 3-COLUMN SHOWCASE (Matches Reference Bottom Section)
                Left: "Find Your Place Above the Ordinary"
                Center: 3 Luxury Property Cards + Next Carousel Button
                Right: 3D Terrain Island with Location Pins
               ================================================== */}
            <div
              id="featured-showcase"
              className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
            >
              {/* Left Column: Editorial Intro + View All Properties Button */}
              <div className="lg:col-span-3 space-y-2.5 pr-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-[1.5px] bg-[#E5C17B]" />
                  <span className="text-xs font-medium text-[#E5C17B] tracking-wide">
                    Our Premium Properties
                  </span>
                </div>

                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-white leading-[1.12]">
                  Find Your Place Above the Ordinary
                </h2>

                <p className="text-xs text-[#DCE5E0]/85 leading-relaxed">
                  Explore our handpicked selection of luxury properties in
                  Wholdings&apos; most beautiful locations.
                </p>

                <div className="pt-1">
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-[#ECCF96] via-[#CFA662] to-[#A87A38] text-[#101614] text-xs font-bold shadow-[0_8px_24px_rgba(199,166,106,0.35)] hover:brightness-110 transition-all whitespace-nowrap"
                  >
                    <span>View All Properties</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </Link>
                </div>
              </div>

              {/* Center Column: 3 Reference Property Cards + Carousel Button */}
              <div className="lg:col-span-6 relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {visibleThreeCards.map((property, idx) =>
                    property ? (
                      <PropertyCard3D
                        key={`${property.id}-${idx}`}
                        property={property}
                        compact
                      />
                    ) : null
                  )}
                </div>

                {/* Circular Gold-Bordered Next Carousel Button */}
                <button
                  type="button"
                  onClick={() => setCarouselOffset((prev) => prev + 1)}
                  aria-label="Next Featured Properties"
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-[#0E201A]/95 border border-[#C7A66A]/75 text-[#E5C17B] shadow-[0_8px_24px_rgba(0,0,0,0.8)] hover:bg-[#C7A66A] hover:text-[#101614] transition-all absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Column: Interactive 3D Terrain Map Island Widget */}
              <div className="lg:col-span-3 flex flex-col items-center">
                <div className="relative w-full h-[235px] rounded-2xl overflow-hidden border border-[#C7A66A]/35 bg-[#0B1713] shadow-[0_18px_45px_rgba(0,0,0,0.75)] group">
                  {/* 3D Topographical Island Crop from Reference Asset */}
                  <div
                    className="absolute inset-0 bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        "url('/assets/aistudio/a_luxurious_cinematic_3d_rendered_website_homepag_e7c67909.png')",
                      backgroundSize: '335% 305%',
                      backgroundPosition: '99% 99%',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1713]/95 via-transparent to-[#0B1713]/40" />

                  {/* Interactive Filter Buttons Covering the 4 Locations */}
                  {[
                    {
                      slug: 'ayubia',
                      label: 'Ayubia',
                      top: '16%',
                      left: '48%',
                    },
                    {
                      slug: 'dunga-gali',
                      label: 'Dunga Gali',
                      top: '28%',
                      left: '78%',
                    },
                    {
                      slug: 'wholdings',
                      label: 'Wholdings',
                      top: '44%',
                      left: '27%',
                    },
                    {
                      slug: 'changla-gali',
                      label: 'Changla Gali',
                      top: '56%',
                      left: '68%',
                    },
                  ].map((pin) => {
                    const isSelected = activeMapPin === pin.slug;
                    return (
                      <button
                        key={pin.slug}
                        type="button"
                        onClick={() => {
                          setActiveMapPin((prev) =>
                            prev === pin.slug ? 'all' : pin.slug
                          );
                          setCarouselOffset(0);
                        }}
                        style={{ top: pin.top, left: pin.left }}
                        className={`-translate-x-1/2 -translate-y-1/2 absolute z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer shadow-lg ${
                          isSelected
                            ? 'bg-[#E5C17B] text-[#101614] scale-110 ring-2 ring-white'
                            : 'bg-[#0C1D17] text-white border border-[#C7A66A]/85 hover:bg-[#C7A66A] hover:text-[#101614]'
                        }`}
                      >
                        <MapPin className="w-2.5 h-2.5 text-[#E5C17B] shrink-0" />
                        <span>{pin.label}</span>
                      </button>
                    );
                  })}

                  {/* Bottom CTA Pill Inside 3D Map Widget */}
                  <div className="absolute bottom-2.5 inset-x-3 flex justify-center z-10">
                    <Link
                      href="/locations"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1A2A22]/95 via-[#2B2618]/95 to-[#1A2A22]/95 border border-[#C7A66A]/75 text-white text-[11px] font-semibold shadow-xl hover:border-[#E5C17B] hover:text-[#F5DFB0] transition-all"
                    >
                      <MapIcon className="w-3.5 h-3.5 text-[#E5C17B] shrink-0" />
                      <span className="leading-tight text-left">
                        Explore Wholdings on 3D Map
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#E5C17B] shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

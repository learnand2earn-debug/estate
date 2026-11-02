'use client';

import React, { useMemo, useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import {
  GALIYAT_LOCATIONS,
  PROPERTY_CATEGORIES,
  type PropertyRecord,
} from '@/src/lib/galiyat-data';
import { filterProperties, sortProperties } from '@/src/lib/property-logic';
import { PropertyCard3D } from './PropertyCard3D';

interface PropertyExplorerSectionProps {
  properties: PropertyRecord[];
  initialLocation?: string;
  initialCategory?: string;
  showHeading?: boolean;
}

export function PropertyExplorerSection({
  properties,
  initialLocation = 'all',
  initialCategory = 'All Categories',
  showHeading = true,
}: PropertyExplorerSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [minAreaSqFt, setMinAreaSqFt] = useState<number>(0);
  const [availability, setAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'area-desc'>('featured');

  const filtered = useMemo(() => {
    const matched = filterProperties(properties, {
      location: selectedLocation,
      category: selectedCategory,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBedrooms,
      minAreaSqFt,
      availability,
      searchQuery,
    });
    return sortProperties(matched, sortBy);
  }, [
    properties,
    selectedLocation,
    selectedCategory,
    minPrice,
    maxPrice,
    minBedrooms,
    minAreaSqFt,
    availability,
    searchQuery,
    sortBy,
  ]);

  const handleReset = () => {
    setSelectedLocation('all');
    setSelectedCategory('All Categories');
    setMinPrice('');
    setMaxPrice('');
    setMinBedrooms(0);
    setMinAreaSqFt(0);
    setAvailability('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section id="property-explorer" className="py-20 bg-[#101614] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {showHeading && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-mono-tabular text-[#C7A66A] tracking-wider">
                01. CURATED PORTFOLIO · SAMPLE DEMONSTRATION INVENTORY
              </p>
              <h2
                className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-semibold text-white"
                style={{ textWrap: 'balance' }}
              >
                Find Your Place Above the Ordinary
              </h2>
              <p className="text-sm sm:text-base text-[#DCE5E0]/80 leading-relaxed">
                Explore private mountain villas, handcrafted cedar cottages, serviced
                apartments, and scenic land parcels across Galiyat. All sample listings are
                clearly labeled for transparency and editable via the Admin Dashboard.
              </p>
            </div>

            <div className="text-xs font-mono-tabular text-[#DCE5E0]/75">
              Showing <span className="text-[#C7A66A] font-semibold">{filtered.length}</span>{' '}
              of {properties.length} estates
            </div>
          </div>
        )}

        {/* Interactive Category Tabs */}
        <div
          role="tablist"
          aria-label="Property Categories"
          className="flex items-center gap-1.5 overflow-x-auto pb-2"
        >
          {PROPERTY_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#C7A66A] text-[#101614] font-semibold'
                    : 'bg-[#13241F] text-[#DCE5E0] hover:bg-[#19332B]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Advanced Filter Bar */}
        <div className="p-6 rounded-2xl bg-[#13241F] border border-[#C7A66A]/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label
                htmlFor="property-search"
                className="block text-xs font-medium text-[#DCE5E0]/80 mb-1.5"
              >
                Search Keyword or Ref ID
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#C7A66A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="property-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Villa, Pipeline, GE-NG-101..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white placeholder:text-[#DCE5E0]/40 focus:outline-none focus:border-[#C7A66A]"
                />
              </div>
            </div>

            {/* Location Selector */}
            <div>
              <label
                htmlFor="filter-location"
                className="block text-xs font-medium text-[#DCE5E0]/80 mb-1.5"
              >
                Galiyat Region
              </label>
              <select
                id="filter-location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C7A66A]"
              >
                <option value="all">All Galiyat Locations</option>
                {GALIYAT_LOCATIONS.map((loc) => (
                  <option key={loc.slug} value={loc.slug}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min / Max Price */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="filter-min-price"
                  className="block text-xs font-medium text-[#DCE5E0]/80 mb-1.5"
                >
                  Min (PKR M)
                </label>
                <input
                  id="filter-min-price"
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="40"
                  className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white font-mono-tabular focus:outline-none focus:border-[#C7A66A]"
                />
              </div>
              <div>
                <label
                  htmlFor="filter-max-price"
                  className="block text-xs font-medium text-[#DCE5E0]/80 mb-1.5"
                >
                  Max (PKR M)
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="300"
                  className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white font-mono-tabular focus:outline-none focus:border-[#C7A66A]"
                />
              </div>
            </div>

            {/* Bedrooms & Availability */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="filter-bedrooms"
                  className="block text-xs font-medium text-[#DCE5E0]/80 mb-1.5"
                >
                  Bedrooms
                </label>
                <select
                  id="filter-bedrooms"
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C7A66A]"
                >
                  <option value={0}>Any Beds</option>
                  <option value={3}>3+ Beds</option>
                  <option value={4}>4+ Beds</option>
                  <option value={5}>5+ Beds</option>
                  <option value={6}>6+ Beds</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-availability"
                  className="block text-xs font-medium text-[#DCE5E0]/80 mb-1.5"
                >
                  Availability
                </label>
                <select
                  id="filter-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#101614] border border-white/15 text-xs text-white focus:outline-none focus:border-[#C7A66A]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="filter-size" className="text-xs text-[#DCE5E0]/75">
                  Min Size:
                </label>
                <select
                  id="filter-size"
                  value={minAreaSqFt}
                  onChange={(e) => setMinAreaSqFt(Number(e.target.value))}
                  className="px-2.5 py-1.5 rounded bg-[#101614] border border-white/15 text-xs text-white"
                >
                  <option value={0}>Any Area</option>
                  <option value={2500}>2,500+ sq. ft.</option>
                  <option value={4500}>4,500+ sq. ft. (1 Kanal+)</option>
                  <option value={9000}>9,000+ sq. ft. (2 Kanal+)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-properties" className="text-xs text-[#DCE5E0]/75">
                  Sort By:
                </label>
                <select
                  id="sort-properties"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded bg-[#101614] border border-white/15 text-xs text-white"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area-desc">Largest Area</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#101614] border border-white/15 text-xs text-[#DCE5E0] hover:text-[#C7A66A] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Properties Grid or Empty State */}
        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#13241F] border border-white/10 text-center space-y-4">
            <h3 className="font-serif-luxury text-2xl text-white">
              No Mountain Properties Match Your Current Filter Criteria
            </h3>
            <p className="text-sm text-[#DCE5E0]/75 max-w-md mx-auto">
              Try expanding your price range, switching Galiyat regions, or resetting the
              active filters to explore all available sample estates.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
            >
              Show All Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((property) => (
              <PropertyCard3D key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

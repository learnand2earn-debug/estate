import type { PropertyRecord } from './galiyat-data';

export interface PropertyFilterCriteria {
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minAreaSqFt?: number;
  availability?: string;
  searchQuery?: string;
}

export function filterProperties(
  properties: PropertyRecord[],
  criteria: PropertyFilterCriteria
): PropertyRecord[] {
  return properties.filter((prop) => {
    if (criteria.location && criteria.location !== 'all') {
      const locMatch =
        prop.locationSlug.toLowerCase() === criteria.location.toLowerCase() ||
        prop.locationName.toLowerCase() === criteria.location.toLowerCase();
      if (!locMatch) return false;
    }

    if (
      criteria.category &&
      criteria.category !== 'all' &&
      criteria.category !== 'All Categories'
    ) {
      if (prop.propertyType.toLowerCase() !== criteria.category.toLowerCase()) {
        return false;
      }
    }

    if (typeof criteria.minPrice === 'number' && !Number.isNaN(criteria.minPrice)) {
      if (prop.priceNumeric < criteria.minPrice) return false;
    }

    if (
      typeof criteria.maxPrice === 'number' &&
      !Number.isNaN(criteria.maxPrice) &&
      criteria.maxPrice > 0
    ) {
      if (prop.priceNumeric > criteria.maxPrice) return false;
    }

    if (typeof criteria.minBedrooms === 'number' && criteria.minBedrooms > 0) {
      if (prop.bedrooms < criteria.minBedrooms) return false;
    }

    if (typeof criteria.minAreaSqFt === 'number' && criteria.minAreaSqFt > 0) {
      if (prop.areaSqFt < criteria.minAreaSqFt) return false;
    }

    if (criteria.availability && criteria.availability !== 'all') {
      if (prop.availabilityStatus.toLowerCase() !== criteria.availability.toLowerCase()) {
        return false;
      }
    }

    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.trim().toLowerCase();
      const haystack = [
        prop.title,
        prop.subtitle,
        prop.locationName,
        prop.propertyType,
        prop.referenceId,
        prop.description,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function sortProperties(
  properties: PropertyRecord[],
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'area-desc'
): PropertyRecord[] {
  const copy = [...properties];
  switch (sortBy) {
    case 'price-asc':
      return copy.sort((a, b) => a.priceNumeric - b.priceNumeric);
    case 'price-desc':
      return copy.sort((a, b) => b.priceNumeric - a.priceNumeric);
    case 'area-desc':
      return copy.sort((a, b) => b.areaSqFt - a.areaSqFt);
    case 'featured':
    default:
      return copy.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

export interface InquiryFormInput {
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  locationInterest: string;
  message: string;
  propertyTitle?: string;
  propertyReferenceId?: string;
  budgetRange?: string;
  propertyCategory?: string;
  honeypot?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateInquiryInput(input: InquiryFormInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Spam protection honeypot check
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { valid: false, errors: { form: 'Automated spam submission rejected.' } };
  }

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const cleanPhone = (input.phoneWhatsapp || '').replace(/[\s\-()]/g, '');
  if (!cleanPhone || !/^\+?[0-9]{9,15}$/.test(cleanPhone)) {
    errors.phoneWhatsapp = 'Please enter a valid phone or WhatsApp number (9 to 15 digits).';
  }

  if (!input.locationInterest || input.locationInterest.trim().length === 0) {
    errors.locationInterest = 'Please select or specify a location of interest.';
  }

  if (!input.message || input.message.trim().length < 10) {
    errors.message = 'Please enter a message of at least 10 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppInquiryUrl(params: {
  whatsappNumber: string;
  propertyName?: string;
  propertyLocation?: string;
  propertyReferenceId?: string;
  customerName?: string;
  customerMessage?: string;
}): string {
  const digitsOnly = params.whatsappNumber.replace(/[^0-9]/g, '') || '923001234567';
  const lines: string[] = [
    'Assalam-o-Alaikum Wholdings Advisory Team,',
    '',
    'I would like to inquire about a luxury mountain property:',
  ];

  if (params.propertyName) {
    lines.push(`• Property: ${params.propertyName}`);
  }
  if (params.propertyLocation) {
    lines.push(`• Location: ${params.propertyLocation}`);
  }
  if (params.propertyReferenceId) {
    lines.push(`• Reference ID: ${params.propertyReferenceId}`);
  }
  if (params.customerName) {
    lines.push(`• Name: ${params.customerName}`);
  }
  if (params.customerMessage) {
    lines.push(`• Message: ${params.customerMessage}`);
  } else {
    lines.push('• Request: Please share complete dossier and private viewing availability.');
  }

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}

export function calculateAcquisitionSchedule(
  totalPriceMillions: number,
  downPaymentPercent: number,
  installmentQuarters: number
) {
  const safeTotal = Math.max(1, totalPriceMillions);
  const clampedDown = Math.min(80, Math.max(10, downPaymentPercent));
  const clampedQuarters = Math.min(16, Math.max(1, installmentQuarters));

  const downPaymentMillions = Number(((safeTotal * clampedDown) / 100).toFixed(2));
  const possessionPaymentMillions = Number(((safeTotal * 10) / 100).toFixed(2));
  const remainingMillions = Math.max(
    0,
    Number((safeTotal - downPaymentMillions - possessionPaymentMillions).toFixed(2))
  );
  const quarterlyInstallmentMillions = Number(
    (remainingMillions / clampedQuarters).toFixed(2)
  );

  return {
    totalPriceMillions: safeTotal,
    downPaymentMillions,
    possessionPaymentMillions,
    remainingMillions,
    quarterlyInstallmentMillions,
    installmentQuarters: clampedQuarters,
  };
}

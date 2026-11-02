import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_SAMPLE_PROPERTIES, type PropertyRecord } from './galiyat-data';
import {
  filterProperties,
  sortProperties,
  validateInquiryInput,
  buildWhatsAppInquiryUrl,
  calculateAcquisitionSchedule,
} from './property-logic';

const mockProperties: PropertyRecord[] = INITIAL_SAMPLE_PROPERTIES.map((p, idx) => ({
  ...p,
  id: idx + 1,
}));

test('filterProperties filters by locationSlug and category accurately', () => {
  const nathiaProperties = filterProperties(mockProperties, {
    location: 'wholdings',
  });
  assert.equal(nathiaProperties.length, 2);
  assert.equal(nathiaProperties.every((p) => p.locationSlug === 'wholdings'), true);

  const villas = filterProperties(mockProperties, {
    category: 'Luxury Mountain Villas',
  });
  assert.equal(villas.length, 2);
  assert.equal(villas[0].referenceId, 'GE-NG-101');
});

test('filterProperties filters by price range, bedrooms, and search query', () => {
  const midRange = filterProperties(mockProperties, {
    minPrice: 25,
    maxPrice: 90,
    minBedrooms: 3,
  });
  assert.equal(midRange.length >= 3, true);

  const searchResult = filterProperties(mockProperties, {
    searchQuery: 'Pipeline',
  });
  assert.equal(searchResult.length >= 1, true);
  assert.equal(searchResult[0].locationSlug, 'dunga-gali');
});

test('sortProperties sorts ascending and descending by price', () => {
  const asc = sortProperties(mockProperties, 'price-asc');
  assert.equal(asc[0].priceNumeric <= asc[1].priceNumeric, true);
  assert.equal(asc[0].referenceId, 'GE-DG-102');

  const desc = sortProperties(mockProperties, 'price-desc');
  assert.equal(desc[0].priceNumeric >= desc[1].priceNumeric, true);
  assert.equal(desc[0].referenceId, 'GE-BG-108');
});

test('validateInquiryInput rejects invalid inputs and accepts valid inquiry', () => {
  const invalid = validateInquiryInput({
    fullName: 'A',
    email: 'invalid-email',
    phoneWhatsapp: '123',
    locationInterest: '',
    message: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phoneWhatsapp);
  assert.ok(invalid.errors.message);

  const spam = validateInquiryInput({
    fullName: 'Zain Ali',
    email: 'zain@example.com',
    phoneWhatsapp: '+923312345678',
    locationInterest: 'Wholdings',
    message: 'I would like to schedule a viewing this weekend.',
    honeypot: 'bot-filled',
  });
  assert.equal(spam.valid, false);

  const valid = validateInquiryInput({
    fullName: 'Zain Ali',
    email: 'zain@example.com',
    phoneWhatsapp: '+923312345678',
    locationInterest: 'Wholdings',
    message: 'I would like to schedule a viewing of GE-NG-101 this Saturday.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('buildWhatsAppInquiryUrl includes property name, location, and reference ID', () => {
  const url = buildWhatsAppInquiryUrl({
    whatsappNumber: '+92 331 2345678',
    propertyName: 'Luxury Mountain Villa',
    propertyLocation: 'Wholdings',
    propertyReferenceId: 'GE-NG-101',
    customerName: 'Amina Tariq',
    customerMessage: 'Interested in floor plans.',
  });
  assert.equal(url.startsWith('https://wa.me/923312345678?text='), true);
  const decoded = decodeURIComponent(url.split('text=')[1]);
  assert.equal(decoded.includes('Luxury Mountain Villa'), true);
  assert.equal(decoded.includes('Wholdings'), true);
  assert.equal(decoded.includes('GE-NG-101'), true);
});

test('calculateAcquisitionSchedule computes accurate payment milestones', () => {
  const schedule = calculateAcquisitionSchedule(100, 30, 4);
  assert.equal(schedule.downPaymentMillions, 30);
  assert.equal(schedule.possessionPaymentMillions, 10);
  assert.equal(schedule.remainingMillions, 60);
  assert.equal(schedule.quarterlyInstallmentMillions, 15);
});

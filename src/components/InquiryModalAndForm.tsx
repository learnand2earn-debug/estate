'use client';

import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import {
  GALIYAT_LOCATIONS,
  PROPERTY_CATEGORIES,
  DEFAULT_COMPANY_CONFIG,
} from '@/src/lib/galiyat-data';
import {
  validateInquiryInput,
  buildWhatsAppInquiryUrl,
} from '@/src/lib/property-logic';

interface InquiryFormProps {
  inquiryType?: 'property' | 'investment' | 'general';
  propertyId?: number;
  propertyTitle?: string;
  propertyReferenceId?: string;
  defaultLocation?: string;
  whatsappNumber?: string;
  heading?: string;
  subheading?: string;
}

export function InquiryForm({
  inquiryType = 'property',
  propertyId,
  propertyTitle,
  propertyReferenceId,
  defaultLocation = 'Wholdings',
  whatsappNumber = DEFAULT_COMPANY_CONFIG.whatsappNumber,
  heading = 'Request Private Property Dossier & Viewing',
  subheading = 'Every inquiry is logged directly with our Wholdings advisory desk and can also be dispatched immediately via WhatsApp.',
}: InquiryFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [locationInterest, setLocationInterest] = useState(defaultLocation);
  const [budgetRange, setBudgetRange] = useState('PKR 50M – 150M');
  const [propertyCategory, setPropertyCategory] = useState('Luxury Mountain Villas');
  const [message, setMessage] = useState(
    propertyTitle
      ? `I would like to request architectural floor plans and schedule a viewing for ${propertyTitle} (${propertyReferenceId}).`
      : 'I am interested in exploring luxury mountain properties and investment opportunities in Galiyat.'
  );
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    id?: number;
    whatsappUrl: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateInquiryInput({
      fullName,
      email,
      phoneWhatsapp,
      locationInterest,
      message,
      honeypot,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryType,
          propertyId,
          propertyTitle,
          propertyReferenceId,
          locationInterest,
          fullName,
          email,
          phoneWhatsapp,
          budgetRange,
          propertyCategory,
          message,
          honeypot,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || 'Submission failed.');
      }

      const waUrl = buildWhatsAppInquiryUrl({
        whatsappNumber,
        propertyName: propertyTitle || propertyCategory,
        propertyLocation: locationInterest,
        propertyReferenceId: propertyReferenceId || 'GENERAL-INQUIRY',
        customerName: fullName,
        customerMessage: message,
      });

      setSubmittedData({
        id: data.inquiry?.id,
        whatsappUrl: waUrl,
      });
    } catch (err: any) {
      setServerError(err?.message || 'Could not submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const directWhatsAppUrl = buildWhatsAppInquiryUrl({
    whatsappNumber,
    propertyName: propertyTitle || propertyCategory,
    propertyLocation: locationInterest,
    propertyReferenceId: propertyReferenceId || 'DIRECT-WA',
    customerName: fullName || undefined,
    customerMessage: message || undefined,
  });

  return (
    <div className="bg-[#13241F] border border-[#C7A66A]/25 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <h3 className="font-serif-luxury text-2xl md:text-3xl font-semibold text-white">
          {heading}
        </h3>
        <p className="text-sm text-[#DCE5E0]/75 leading-relaxed">{subheading}</p>
        {propertyTitle && (
          <div className="pt-1 text-xs font-mono-tabular text-[#C7A66A]">
            Selected Property: {propertyTitle} · Ref: {propertyReferenceId}
          </div>
        )}
      </div>

      {submittedData ? (
        <div
          role="status"
          className="p-6 rounded-xl bg-[#102B24] border border-[#C7A66A]/50 space-y-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#C7A66A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-white">
                Inquiry Recorded Successfully
              </h4>
              <p className="text-sm text-[#DCE5E0]/85 leading-relaxed">
                Thank you, <span className="text-white font-medium">{fullName}</span>. Your
                inquiry regarding <span className="text-[#C7A66A]">{locationInterest}</span>{' '}
                has been saved in our advisory registry
                {submittedData.id ? ` (Dispatch #${submittedData.id})` : ''}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={submittedData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open Prefilled WhatsApp Message</span>
            </a>
            <button
              type="button"
              onClick={() => setSubmittedData(null)}
              className="px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-xs text-[#DCE5E0] hover:text-white transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot spam protection */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company-website-hp">Website</label>
            <input
              id="company-website-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`full-name-${inquiryType}`}
                className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
              >
                Full Name *
              </label>
              <input
                id={`full-name-${inquiryType}`}
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g.Sikandar Hayat Khan"
                className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white placeholder:text-[#DCE5E0]/40 focus:outline-none focus:border-[#C7A66A]"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-amber-400">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`email-${inquiryType}`}
                className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
              >
                Email Address *
              </label>
              <input
                id={`email-${inquiryType}`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white placeholder:text-[#DCE5E0]/40 focus:outline-none focus:border-[#C7A66A]"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-amber-400">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`phone-${inquiryType}`}
                className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
              >
                Phone / WhatsApp Number *
              </label>
              <input
                id={`phone-${inquiryType}`}
                type="tel"
                required
                value={phoneWhatsapp}
                onChange={(e) => setPhoneWhatsapp(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white placeholder:text-[#DCE5E0]/40 focus:outline-none focus:border-[#C7A66A]"
              />
              {errors.phoneWhatsapp && (
                <p className="mt-1 text-xs text-amber-400">{errors.phoneWhatsapp}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`location-${inquiryType}`}
                className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
              >
                Interested Location *
              </label>
              <select
                id={`location-${inquiryType}`}
                value={locationInterest}
                onChange={(e) => setLocationInterest(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C7A66A]"
              >
                {GALIYAT_LOCATIONS.map((loc) => (
                  <option key={loc.slug} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
                <option value="Surrounding Galiyat">Surrounding Galiyat Region</option>
              </select>
              {errors.locationInterest && (
                <p className="mt-1 text-xs text-amber-400">{errors.locationInterest}</p>
              )}
            </div>
          </div>

          {inquiryType === 'investment' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="investment-budget"
                  className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
                >
                  Investment Budget Range
                </label>
                <select
                  id="investment-budget"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C7A66A]"
                >
                  <option value="PKR 35M – 75M">PKR 35M – 75M</option>
                  <option value="PKR 75M – 150M">PKR 75M – 150M</option>
                  <option value="PKR 150M – 300M">PKR 150M – 300M</option>
                  <option value="PKR 300M+ Institutional / Resort">
                    PKR 300M+ (Resort / Land Banking)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="investment-category"
                  className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
                >
                  Preferred Property Type
                </label>
                <select
                  id="investment-category"
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C7A66A]"
                >
                  {PROPERTY_CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor={`message-${inquiryType}`}
              className="block text-xs font-medium text-[#DCE5E0] mb-1.5"
            >
              Inquiry Details & Preferred Viewing Dates *
            </label>
            <textarea
              id={`message-${inquiryType}`}
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[#101614] border border-white/15 text-sm text-white placeholder:text-[#DCE5E0]/40 focus:outline-none focus:border-[#C7A66A]"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-amber-400">{errors.message}</p>
            )}
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#C7A66A] text-[#101614] text-xs font-semibold hover:bg-[#d8b87c] transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting Inquiry...' : 'Submit Official Inquiry'}</span>
            </button>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#102B24] border border-[#C7A66A]/40 text-xs font-medium text-white hover:bg-[#193F35] transition-colors whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#C7A66A]" />
              <span>Inquire Directly on WhatsApp</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

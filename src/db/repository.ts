import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { properties, inquiries, users } from './schema.ts';
import { INITIAL_SAMPLE_PROPERTIES, type PropertyRecord } from '../lib/galiyat-data.ts';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || email.split('@')[0],
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database user upsert failed:', error);
    throw new Error('Failed to synchronize user account.', { cause: error });
  }
}

export async function getAllProperties(): Promise<PropertyRecord[]> {
  try {
    let rows = await db.select().from(properties).orderBy(desc(properties.isFeatured), properties.id);

    if (rows.length === 0) {
      // Seed initial sample properties into Cloud SQL on first access
      const inserted = await db
        .insert(properties)
        .values(
          INITIAL_SAMPLE_PROPERTIES.map((item) => ({
            slug: item.slug,
            referenceId: item.referenceId,
            title: item.title,
            subtitle: item.subtitle,
            locationSlug: item.locationSlug,
            locationName: item.locationName,
            propertyType: item.propertyType,
            pricePkr: item.pricePkr,
            priceNumeric: item.priceNumeric,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            areaSqFt: item.areaSqFt,
            areaLabel: item.areaLabel,
            availabilityStatus: item.availabilityStatus,
            isFeatured: item.isFeatured,
            isSample: item.isSample,
            elevationFt: item.elevationFt,
            description: item.description,
            architecturalNotes: item.architecturalNotes,
            amenities: item.amenities,
            galleryVisuals: item.galleryVisuals,
            coordinates: item.coordinates,
          }))
        )
        .onConflictDoNothing()
        .returning();

      rows = inserted.length > 0 ? inserted : await db.select().from(properties);
    }

    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      referenceId: r.referenceId,
      title: r.title,
      subtitle: r.subtitle,
      locationSlug: r.locationSlug,
      locationName: r.locationName,
      propertyType: r.propertyType,
      pricePkr: r.pricePkr,
      priceNumeric: r.priceNumeric,
      bedrooms: r.bedrooms,
      bathrooms: r.bathrooms,
      areaSqFt: r.areaSqFt,
      areaLabel: r.areaLabel,
      availabilityStatus: (r.availabilityStatus as PropertyRecord['availabilityStatus']) || 'Available',
      isFeatured: r.isFeatured,
      isSample: r.isSample,
      elevationFt: r.elevationFt,
      description: r.description,
      architecturalNotes: r.architecturalNotes,
      amenities: Array.isArray(r.amenities) ? r.amenities : [],
      galleryVisuals: Array.isArray(r.galleryVisuals)
        ? (r.galleryVisuals as PropertyRecord['galleryVisuals'])
        : [],
      coordinates: r.coordinates || { x: 0, z: 0 },
    }));
  } catch (error) {
    console.error('Database getAllProperties failed:', error);
    throw new Error('Unable to load properties from database.', { cause: error });
  }
}

export async function getPropertyBySlug(slug: string): Promise<PropertyRecord | null> {
  try {
    const all = await getAllProperties();
    return all.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error('Database getPropertyBySlug failed:', error);
    throw new Error('Unable to load property details.', { cause: error });
  }
}

export async function createPropertyRecord(
  input: Omit<PropertyRecord, 'id'>
): Promise<PropertyRecord> {
  try {
    const result = await db
      .insert(properties)
      .values({
        slug: input.slug,
        referenceId: input.referenceId,
        title: input.title,
        subtitle: input.subtitle,
        locationSlug: input.locationSlug,
        locationName: input.locationName,
        propertyType: input.propertyType,
        pricePkr: input.pricePkr,
        priceNumeric: input.priceNumeric,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        areaSqFt: input.areaSqFt,
        areaLabel: input.areaLabel,
        availabilityStatus: input.availabilityStatus,
        isFeatured: input.isFeatured,
        isSample: input.isSample,
        elevationFt: input.elevationFt,
        description: input.description,
        architecturalNotes: input.architecturalNotes,
        amenities: input.amenities,
        galleryVisuals: input.galleryVisuals,
        coordinates: input.coordinates,
      })
      .returning();

    const r = result[0];
    return {
      ...input,
      id: r.id,
    };
  } catch (error) {
    console.error('Database createPropertyRecord failed:', error);
    throw new Error('Failed to create property listing.', { cause: error });
  }
}

export async function updatePropertyRecord(
  slug: string,
  updates: Partial<Omit<PropertyRecord, 'id' | 'slug'>>
) {
  try {
    const result = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.slug, slug))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database updatePropertyRecord failed:', error);
    throw new Error('Failed to update property listing.', { cause: error });
  }
}

export async function deletePropertyRecord(slug: string) {
  try {
    await db.delete(properties).where(eq(properties.slug, slug));
    return { deleted: true };
  } catch (error) {
    console.error('Database deletePropertyRecord failed:', error);
    throw new Error('Failed to delete property listing.', { cause: error });
  }
}

export async function createInquiryRecord(input: {
  inquiryType: string;
  propertyId?: number;
  propertyTitle?: string;
  propertyReferenceId?: string;
  locationInterest: string;
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  budgetRange?: string;
  propertyCategory?: string;
  message: string;
}) {
  try {
    const result = await db
      .insert(inquiries)
      .values({
        inquiryType: input.inquiryType,
        propertyId: input.propertyId,
        propertyTitle: input.propertyTitle,
        propertyReferenceId: input.propertyReferenceId,
        locationInterest: input.locationInterest,
        fullName: input.fullName,
        email: input.email,
        phoneWhatsapp: input.phoneWhatsapp,
        budgetRange: input.budgetRange,
        propertyCategory: input.propertyCategory,
        message: input.message,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database createInquiryRecord failed:', error);
    throw new Error('Failed to save inquiry.', { cause: error });
  }
}

export async function getAllInquiries() {
  try {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  } catch (error) {
    console.error('Database getAllInquiries failed:', error);
    throw new Error('Failed to retrieve inquiries.', { cause: error });
  }
}

export async function updateInquiryStatus(id: number, status: string) {
  try {
    const result = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Database updateInquiryStatus failed:', error);
    throw new Error('Failed to update inquiry status.', { cause: error });
  }
}

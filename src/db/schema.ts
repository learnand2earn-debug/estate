import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  referenceId: text('reference_id').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  locationSlug: text('location_slug').notNull(),
  locationName: text('location_name').notNull(),
  propertyType: text('property_type').notNull(),
  pricePkr: text('price_pkr').notNull(),
  priceNumeric: integer('price_numeric').notNull(), // In Lakhs or Millions for sorting/filtering
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  areaSqFt: integer('area_sq_ft').notNull(),
  areaLabel: text('area_label').notNull(),
  availabilityStatus: text('availability_status').default('Available').notNull(), // Available | Reserved | Sold
  isFeatured: boolean('is_featured').default(false).notNull(),
  isSample: boolean('is_sample').default(true).notNull(),
  elevationFt: text('elevation_ft').notNull(),
  description: text('description').notNull(),
  architecturalNotes: text('architectural_notes').notNull(),
  amenities: jsonb('amenities').$type<string[]>().notNull(),
  galleryVisuals: jsonb('gallery_visuals').$type<{
    id: string;
    title: string;
    caption: string;
    sceneType: string;
    palette: [string, string, string];
  }[]>().notNull(),
  coordinates: jsonb('coordinates').$type<{ x: number; z: number }>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  inquiryType: text('inquiry_type').default('property').notNull(), // property | investment | general
  propertyId: integer('property_id'),
  propertyTitle: text('property_title'),
  propertyReferenceId: text('property_reference_id'),
  locationInterest: text('location_interest').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phoneWhatsapp: text('phone_whatsapp').notNull(),
  budgetRange: text('budget_range'),
  propertyCategory: text('property_category'),
  message: text('message').notNull(),
  status: text('status').default('New').notNull(), // New | Contacted | Scheduled
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

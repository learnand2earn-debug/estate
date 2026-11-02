import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProperties,
  createPropertyRecord,
  getOrCreateUser,
} from '@/src/db/repository';
import { INITIAL_SAMPLE_PROPERTIES } from '@/src/lib/galiyat-data';
import { getAdminAuth } from '@/src/lib/firebase-admin';

async function verifyAdminOrDemo(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    if (token === 'DEMO_ADMIN_SESSION') {
      return { uid: 'demo-admin', email: 'concierge@wholdings.pk' };
    }
    const adminAuth = await getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    if (decoded.email) {
      await getOrCreateUser(decoded.uid, decoded.email, decoded.name);
    }
    return decoded;
  }
  return null;
}

export async function GET() {
  try {
    const data = await getAllProperties();
    return NextResponse.json({ properties: data, source: 'database' });
  } catch (error) {
    console.error('Fallback to sample properties:', error);
    const fallback = INITIAL_SAMPLE_PROPERTIES.map((p, idx) => ({
      ...p,
      id: idx + 1,
    }));
    return NextResponse.json({ properties: fallback, source: 'fallback' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await verifyAdminOrDemo(req);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.title || !body.locationSlug || !body.pricePkr || !body.propertyType) {
      return NextResponse.json(
        { error: 'Title, location, property category, and price are required.' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      `${body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

    const referenceId =
      body.referenceId || `GE-${body.locationSlug.slice(0, 2).toUpperCase()}-${Math.floor(200 + Math.random() * 700)}`;

    const created = await createPropertyRecord({
      slug,
      referenceId,
      title: body.title,
      subtitle: body.subtitle || `SAMPLE PROPERTY — ${body.propertyType} in ${body.locationName || 'Galiyat'}`,
      locationSlug: body.locationSlug,
      locationName: body.locationName || 'Wholdings',
      propertyType: body.propertyType,
      pricePkr: body.pricePkr,
      priceNumeric: Number(body.priceNumeric) || 85,
      bedrooms: Number(body.bedrooms) || 4,
      bathrooms: Number(body.bathrooms) || 4,
      areaSqFt: Number(body.areaSqFt) || 4500,
      areaLabel: body.areaLabel || `${Number(body.areaSqFt) || 4500} sq. ft.`,
      availabilityStatus: body.availabilityStatus || 'Available',
      isFeatured: Boolean(body.isFeatured),
      isSample: body.isSample !== undefined ? Boolean(body.isSample) : true,
      elevationFt: body.elevationFt || 'Galiyat Ridge Corridor',
      description:
        body.description ||
        'Bespoke mountain property in Galiyat offering panoramic pine and valley vistas.',
      architecturalNotes:
        body.architecturalNotes ||
        'Built with natural Himalayan stone, treated cedar timber, and thermal glazing.',
      amenities: Array.isArray(body.amenities)
        ? body.amenities
        : ['Panoramic Viewing Deck', 'Hydronic Heating', 'Private Parking'],
      galleryVisuals: Array.isArray(body.galleryVisuals) && body.galleryVisuals.length > 0
        ? body.galleryVisuals
        : [
            {
              id: `${slug}-1`,
              title: body.title,
              caption: `Architectural perspective in ${body.locationName || 'Galiyat'}`,
              sceneType: 'villa-sunset',
              palette: ['#102B24', '#C7A66A', '#101614'],
            },
          ],
      coordinates: body.coordinates || { x: -2.0, z: 1.0 },
    });

    return NextResponse.json({ property: created }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/properties error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create property.' },
      { status: 500 }
    );
  }
}

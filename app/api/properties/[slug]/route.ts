import { NextRequest, NextResponse } from 'next/server';
import {
  getPropertyBySlug,
  updatePropertyRecord,
  deletePropertyRecord,
} from '@/src/db/repository';
import { getAdminAuth } from '@/src/lib/firebase-admin';

async function verifyAdminOrDemo(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    if (token === 'DEMO_ADMIN_SESSION') {
      return { uid: 'demo-admin', email: 'concierge@wholdings.pk' };
    }
    const adminAuth = await getAdminAuth();
    return await adminAuth.verifyIdToken(token);
  }
  return null;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const property = await getPropertyBySlug(slug);
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unable to load property.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const adminUser = await verifyAdminOrDemo(req);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const { slug } = await context.params;
    const body = await req.json();
    const updated = await updatePropertyRecord(slug, body);
    return NextResponse.json({ property: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update property.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const adminUser = await verifyAdminOrDemo(req);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const { slug } = await context.params;
    await deletePropertyRecord(slug);
    return NextResponse.json({ deleted: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete property.' },
      { status: 500 }
    );
  }
}

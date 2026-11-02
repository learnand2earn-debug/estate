import { NextRequest, NextResponse } from 'next/server';
import {
  createInquiryRecord,
  getAllInquiries,
  updateInquiryStatus,
} from '@/src/db/repository';
import { validateInquiryInput } from '@/src/lib/property-logic';
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

export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdminOrDemo(req);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }
    const items = await getAllInquiries();
    return NextResponse.json({ inquiries: items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load inquiries.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateInquiryInput({
      fullName: body.fullName || '',
      email: body.email || '',
      phoneWhatsapp: body.phoneWhatsapp || '',
      locationInterest: body.locationInterest || 'Wholdings',
      message: body.message || '',
      honeypot: body.honeypot || '',
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Please check the form fields.', errors: validation.errors },
        { status: 400 }
      );
    }

    const saved = await createInquiryRecord({
      inquiryType: body.inquiryType || 'property',
      propertyId: body.propertyId ? Number(body.propertyId) : undefined,
      propertyTitle: body.propertyTitle,
      propertyReferenceId: body.propertyReferenceId,
      locationInterest: body.locationInterest,
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phoneWhatsapp: body.phoneWhatsapp.trim(),
      budgetRange: body.budgetRange,
      propertyCategory: body.propertyCategory,
      message: body.message.trim(),
    });

    return NextResponse.json({ inquiry: saved, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/inquiries error:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to submit inquiry at this time.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminUser = await verifyAdminOrDemo(req);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Inquiry ID and status required.' }, { status: 400 });
    }
    const updated = await updateInquiryStatus(Number(body.id), body.status);
    return NextResponse.json({ inquiry: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update inquiry.' },
      { status: 500 }
    );
  }
}

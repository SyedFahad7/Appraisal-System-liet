import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/db';
import PrincipalRemarks from '../../../../models/PrincipalRemarks';
import { getAuthFromCookie } from '../../../../lib/auth';

const UpsertSchema = z.object({
  facultyId: z.string(),
  academicYear: z.string(),
  hodAppraisalId: z.string(),
  remarks: z.string().optional(),
  finalRating: z.number().optional(),
  signed: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const facultyId = searchParams.get('facultyId');
  if (facultyId) {
    const item = await PrincipalRemarks.findOne({ facultyId }).sort({ updatedAt: -1 });
    return NextResponse.json(item);
  }
  const items = await PrincipalRemarks.find({}).sort({ updatedAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth || auth.role !== 'Principal') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  await connectToDatabase();
  const { facultyId, academicYear, hodAppraisalId, remarks, finalRating, signed } = parsed.data;
  const doc = await PrincipalRemarks.findOneAndUpdate(
    { facultyId, academicYear },
    { $set: { hodAppraisalId, remarks, finalRating, signed: !!signed, submittedAt: signed ? new Date() : undefined } },
    { new: true, upsert: true }
  );
  return NextResponse.json(doc);
}

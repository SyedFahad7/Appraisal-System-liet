import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/db';
import FacultySelfAppraisal from '../../../../models/FacultySelfAppraisal';
import { getAuthFromCookie } from '../../../../lib/auth';

const UpsertSchema = z.object({
  academicYear: z.string().min(4),
  phases: z.record(z.string(), z.any()),
  attachments: z
    .array(z.object({ filename: z.string(), path: z.string(), size: z.number(), mimeType: z.string() }))
    .optional(),
  signed: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const facultyId = searchParams.get('facultyId');

  await connectToDatabase();

  if (facultyId) {
    if (auth.role === 'Faculty' && facultyId !== auth.sub) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const item = await FacultySelfAppraisal.findOne({ facultyId }).sort({ updatedAt: -1 });
    return NextResponse.json(item);
  }

  if (auth.role !== 'Faculty') return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  const items = await FacultySelfAppraisal.find({ facultyId: auth.sub }).sort({ updatedAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth || auth.role !== 'Faculty') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  await connectToDatabase();
  const { academicYear, phases, attachments, signed } = parsed.data;

  const doc = await FacultySelfAppraisal.findOneAndUpdate(
    { facultyId: auth.sub, academicYear },
    { $set: { phases, attachments: attachments || [], signed: !!signed, submittedAt: signed ? new Date() : undefined } },
    { new: true, upsert: true }
  );

  return NextResponse.json(doc);
}

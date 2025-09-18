import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/db';
import HodAppraisal from '../../../../models/HodAppraisal';
import User from '../../../../models/User';
import { getAuthFromCookie } from '../../../../lib/auth';

const UpsertSchema = z.object({
  facultyId: z.string(),
  academicYear: z.string(),
  scores: z.record(z.string(), z.any()),
  remarks: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const facultyId = searchParams.get('facultyId');

  if (facultyId) {
    const item = await HodAppraisal.findOne({ facultyId }).sort({ updatedAt: -1 });
    return NextResponse.json(item);
  }

  // List by department for HOD; all for Principal
  if (auth.role === 'Principal') {
    const all = await HodAppraisal.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(all);
  }

  if (auth.role !== 'HOD') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const me = await User.findById(auth.sub);
  const items = await HodAppraisal.find({ departmentId: me?.departmentId }).sort({ updatedAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth || auth.role !== 'HOD') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  await connectToDatabase();
  const me = await User.findById(auth.sub);
  if (!me?.departmentId) return NextResponse.json({ error: 'HOD must belong to department' }, { status: 400 });

  const { facultyId, academicYear, scores, remarks } = parsed.data;
  const doc = await HodAppraisal.findOneAndUpdate(
    { facultyId, academicYear },
    { $set: { departmentId: me.departmentId, scores, remarks, submittedAt: new Date() } },
    { new: true, upsert: true }
  );
  return NextResponse.json(doc);
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '../../../lib/db';
import Department from '../../../models/Department';
import { getAuthFromCookie } from '../../../lib/auth';

const CreateDepartmentSchema = z.object({ name: z.string().min(2), code: z.string().optional() });

export async function GET() {
  await connectToDatabase();
  const departments = await Department.find({}).sort({ name: 1 });
  return NextResponse.json(departments.map((d) => ({ id: String(d._id), name: d.name, code: d.code })));
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth || auth.role !== 'Principal') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = CreateDepartmentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  await connectToDatabase();
  const exists = await Department.findOne({ name: parsed.data.name });
  if (exists) return NextResponse.json({ error: 'Department exists' }, { status: 409 });

  const dep = await Department.create(parsed.data);
  return NextResponse.json({ id: String(dep._id), name: dep.name, code: dep.code });
}

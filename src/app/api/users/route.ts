import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectToDatabase } from '../../../lib/db';
import User from '../../../models/User';
import { getAuthFromCookie } from '../../../lib/auth';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function GET() {
  const auth = getAuthFromCookie();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();

  const currentUser = await User.findById(auth.sub);
  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const filter: any = {};
  // Principal can see all, HOD restricted to own department
  if (auth.role === 'HOD') {
    filter.departmentId = currentUser.departmentId;
  }
  const users = await User.find({ role: 'Faculty', ...filter }).sort({ email: 1 });
  return NextResponse.json(
    users.map((u) => ({ id: String(u._id), email: u.email, name: u.name, departmentId: u.departmentId }))
  );
}

export async function POST(req: NextRequest) {
  const auth = getAuthFromCookie();
  if (!auth || (auth.role !== 'HOD' && auth.role !== 'Principal')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, password, name } = parsed.data;
  if (!email.endsWith('@lords.ac.in')) {
    return NextResponse.json({ error: 'Only @lords.ac.in emails allowed' }, { status: 400 });
  }

  await connectToDatabase();

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);

  const departmentId = auth.role === 'HOD' ? (await User.findById(auth.sub))?.departmentId : undefined;
  if (auth.role === 'HOD' && !departmentId) {
    return NextResponse.json({ error: 'HOD must belong to a department' }, { status: 400 });
  }

  const role: 'Faculty' = 'Faculty';
  const user = await User.create({ email, passwordHash, role, name, departmentId });
  return NextResponse.json({ id: String(user._id) });
}

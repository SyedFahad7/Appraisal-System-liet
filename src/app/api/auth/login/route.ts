import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectToDatabase } from '../../../../lib/db';
import User from '../../../../models/User';
import { signJwt, setAuthCookie } from '../../../../lib/auth';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  if (!email.endsWith('@lords.ac.in')) {
    return NextResponse.json({ error: 'Only @lords.ac.in emails allowed' }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email, isActive: true });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = signJwt({ sub: String(user._id), role: user.role, email: user.email });
  setAuthCookie(token);
  return NextResponse.json({ success: true, role: user.role });
}

import { NextResponse } from 'next/server';
import { setAdminCookie, signSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  if (typeof password !== 'string' || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  }

  const payload = `ok:${Date.now()}`;
  const token = signSession(payload, sessionSecret);
  await setAdminCookie(token);

  return NextResponse.json({ ok: true });
}

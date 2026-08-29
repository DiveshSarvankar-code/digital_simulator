import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, createSessionToken, SESSION_COOKIE } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const password = body.password ?? '';
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  let ok: boolean;
  try {
    ok = checkPassword(password);
  } catch {
    return NextResponse.json(
      { error: 'Admin access is not configured. Set ADMIN_PASSWORD and SESSION_SECRET in your hosting environment.' },
      { status: 503 }
    );
  }
  if (!ok) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}

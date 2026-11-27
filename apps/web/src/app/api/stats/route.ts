import { NextResponse } from 'next/server';
import { recordPageView } from '@/lib/stats';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  let body: { path?: unknown; country?: unknown; referrer?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const path = typeof body.path === 'string' ? body.path : '';
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

  const headerCountry = request.headers.get('x-vercel-ip-country');
  await recordPageView(
    path,
    typeof body.country === 'string' ? body.country : headerCountry ?? undefined,
    typeof body.referrer === 'string' ? body.referrer : undefined,
  );
  return NextResponse.json({ ok: true });
}

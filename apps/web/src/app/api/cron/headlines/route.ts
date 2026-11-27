import { NextResponse } from 'next/server';
import { refreshHeadlines } from '@/lib/headlines';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  }
  const count = await refreshHeadlines();
  return NextResponse.json({ ok: true, count });
}

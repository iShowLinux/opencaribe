import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { createChatMessage, getUserById, listChatMessages } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const messages = await listChatMessages(100);
  const names = new Map<string, string>();
  const rows = [];
  for (const message of messages) {
    if (!names.has(message.userId)) {
      const author = await getUserById(message.userId);
      names.set(message.userId, author?.name ?? 'OpenCaribe member');
    }
    rows.push({ id: message.id, name: names.get(message.userId), body: message.body, createdAt: message.createdAt });
  }
  return NextResponse.json({ ok: true, messages: rows });
}

export async function POST(request: Request): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: 'Sign in to chat.' }, { status: 401 });
  let body = '';
  try {
    const payload = (await request.json()) as { body?: unknown };
    body = typeof payload.body === 'string' ? payload.body : '';
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  const message = await createChatMessage(user.id, body);
  if (!message) return NextResponse.json({ ok: false, error: 'Empty message.' }, { status: 400 });
  return NextResponse.json({ ok: true, id: message.id });
}

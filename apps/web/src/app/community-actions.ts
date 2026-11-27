"use server";

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { createForumReply, createForumThread, getForumThread } from '@/lib/store';

export interface ThreadFormState {
  status: 'idle' | 'error' | 'success';
  message?: string;
}

const CATEGORIES = ['events', 'feedback', 'support'] as const;

export async function submitThreadAction(_previous: ThreadFormState, formData: FormData): Promise<ThreadFormState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sign in to post in the community.' };
  const category = String(formData.get('category') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!(CATEGORIES as readonly string[]).includes(category)) return { status: 'error', message: 'Choose a category.' };
  if (title.length < 3 || title.length > 200) return { status: 'error', message: 'Title must be 3–200 characters.' };
  if (body.length < 3 || body.length > 4000) return { status: 'error', message: 'Message must be 3–4000 characters.' };

  const thread = await createForumThread({ authorId: user.id, category: category as 'events' | 'feedback' | 'support', title, body });
  revalidatePath('/community', 'page');
  return { status: 'success', message: thread.id };
}

export async function submitReplyAction(_previous: ThreadFormState, formData: FormData): Promise<ThreadFormState> {
  const user = await getCurrentUser();
  if (!user) return { status: 'error', message: 'Sign in to reply.' };
  const threadId = String(formData.get('threadId') ?? '');
  const body = String(formData.get('body') ?? '').trim();
  if (!threadId || !(await getForumThread(threadId))) return { status: 'error', message: 'That thread no longer exists.' };
  if (body.length < 2 || body.length > 4000) return { status: 'error', message: 'Reply must be 2–4000 characters.' };

  await createForumReply({ threadId, authorId: user.id, body });
  revalidatePath(`/community/${threadId}`, 'page');
  return { status: 'success', message: 'Reply posted.' };
}

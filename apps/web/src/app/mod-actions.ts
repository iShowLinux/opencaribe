"use server";

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { setListingStatus } from '@/lib/listings-store';
import { setUserBanned } from '@/lib/store';

function staff(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>): boolean {
  return user.role === 'admin' || user.role === 'moderator';
}

/** Admins and moderators remove a listing (soft delete -> removed). */
export async function removeListingAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !staff(user)) return;
  const listingId = String(formData.get('listingId') ?? '');
  if (!listingId) return;
  await setListingStatus(listingId, 'removed');
  revalidatePath('/admin', 'page');
  revalidatePath('/', 'layout');
}

/** Admins and moderators suspend or restore a member profile. */
export async function banUserAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !staff(user)) return;
  const userId = String(formData.get('userId') ?? '');
  const ban = String(formData.get('ban') ?? '') === 'true';
  if (!userId || userId === user.id) return;
  await setUserBanned(userId, ban);
  revalidatePath('/admin', 'page');
  revalidatePath('/', 'layout');
}

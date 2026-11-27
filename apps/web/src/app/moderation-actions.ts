'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/session';
import { setListingStatus } from '@/lib/listings-store';

export async function moderateListing(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) return;

  const listingId = String(formData.get('listingId') ?? '');
  const decision = String(formData.get('decision') ?? '');
  if (!listingId || (decision !== 'approve' && decision !== 'reject')) return;

  await setListingStatus(listingId, decision === 'approve' ? 'active' : 'rejected');
  revalidatePath('/admin', 'page');
  revalidatePath('/', 'layout');
}

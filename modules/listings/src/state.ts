import type { ListingStatus } from '@opencaribe/validation';

/** The only server-side authorised state transitions. Never derive these from client input. */
export const LISTING_TRANSITIONS: Record<ListingStatus, readonly ListingStatus[]> = {
  draft: ['pending_review', 'active'],
  pending_review: ['active', 'rejected', 'removed'],
  active: ['sold', 'expired', 'suspended', 'removed'],
  rejected: ['draft', 'pending_review', 'removed'],
  sold: ['active', 'removed'],
  expired: ['draft', 'active', 'removed'],
  suspended: ['active', 'removed'],
  removed: [],
};

export function canTransition(from: ListingStatus, to: ListingStatus): boolean {
  return LISTING_TRANSITIONS[from].includes(to);
}

export class InvalidTransitionError extends Error {
  constructor(from: ListingStatus, to: ListingStatus) {
    super(`Invalid listing transition: ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

export function assertTransition(from: ListingStatus, to: ListingStatus): void {
  if (!canTransition(from, to)) throw new InvalidTransitionError(from, to);
}

export class ForbiddenOperationError extends Error {
  constructor() {
    super('The current user does not own this resource.');
    this.name = 'ForbiddenOperationError';
  }
}

export function assertOwner(actorId: string | undefined, ownerId: string): void {
  if (!actorId || actorId !== ownerId) throw new ForbiddenOperationError();
}

export function computeExpiration(now: Date, days: number): Date {
  const expires = new Date(now.getTime());
  expires.setUTCDate(expires.getUTCDate() + days);
  return expires;
}

export function isExpired(listing: { status: ListingStatus; expiresAt: Date | null }, now = new Date()): boolean {
  if (listing.status !== 'active') return false;
  return listing.expiresAt !== null && listing.expiresAt.getTime() <= now.getTime();
}

/** Only these statuses are publicly visible to guests. */
export function isPubliclyVisible(status: ListingStatus): boolean {
  return status === 'active';
}

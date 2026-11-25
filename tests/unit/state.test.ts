import { describe, expect, it } from 'vitest';
import {
  assertOwner,
  assertTransition,
  canTransition,
  computeExpiration,
  ForbiddenOperationError,
  InvalidTransitionError,
  isExpired,
  isPubliclyVisible,
} from '@opencaribe/listings';

describe('listing state machine', () => {
  it('allows only explicit transitions', () => {
    expect(canTransition('draft', 'pending_review')).toBe(true);
    expect(canTransition('active', 'sold')).toBe(true);
    expect(canTransition('removed', 'active')).toBe(false);
    expect(() => assertTransition('removed', 'active')).toThrow(InvalidTransitionError);
  });

  it('enforces ownership on protected operations', () => {
    expect(() => assertOwner('seller-1', 'seller-1')).not.toThrow();
    expect(() => assertOwner('seller-2', 'seller-1')).toThrow(ForbiddenOperationError);
    expect(() => assertOwner(undefined, 'seller-1')).toThrow(ForbiddenOperationError);
  });

  it('computes expiration in UTC and detects expired active listings', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    const expires = computeExpiration(now, 30);
    expect(expires.toISOString()).toBe('2026-01-31T00:00:00.000Z');
    expect(isExpired({ status: 'active', expiresAt: new Date('2025-12-31T00:00:00Z') }, now)).toBe(true);
    expect(isExpired({ status: 'draft', expiresAt: new Date('2025-12-31T00:00:00Z') }, now)).toBe(false);
  });

  it('publishes only active listings', () => {
    expect(isPubliclyVisible('active')).toBe(true);
    expect(isPubliclyVisible('pending_review')).toBe(false);
    expect(isPubliclyVisible('draft')).toBe(false);
  });
});

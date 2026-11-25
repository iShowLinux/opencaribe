import { describe, expect, it } from 'vitest';
import { allPermissions, can, isPrivilegeEscalation, isPrivilegedRole, requiresMfa } from '@opencaribe/authentication';

describe('role based access control', () => {
  it('lets guests browse but not create listings', () => {
    expect(can('guest', 'listing:read')).toBe(true);
    expect(can('guest', 'listing:create')).toBe(false);
  });

  it('lets users manage only their own listings', () => {
    expect(can('user', 'listing:create')).toBe(true);
    expect(can('user', 'listing:edit_own')).toBe(true);
    expect(can('user', 'listing:moderate')).toBe(false);
  });

  it('scopes moderator permissions without granting role management', () => {
    expect(can('moderator', 'listing:moderate')).toBe(true);
    expect(can('moderator', 'report:resolve')).toBe(true);
    expect(can('moderator', 'user:manage_roles')).toBe(false);
  });

  it('requires MFA for privileged roles', () => {
    expect(requiresMfa('admin')).toBe(true);
    expect(requiresMfa('platform_admin')).toBe(true);
    expect(requiresMfa('moderator')).toBe(false);
    expect(isPrivilegedRole('admin')).toBe(true);
  });

  it('detects client supplied privilege escalation', () => {
    expect(isPrivilegeEscalation('admin')).toBe(true);
    expect(isPrivilegeEscalation('platform_admin')).toBe(true);
    expect(isPrivilegeEscalation('user')).toBe(false);
    expect(allPermissions()).toContain('platform:configure');
  });
});

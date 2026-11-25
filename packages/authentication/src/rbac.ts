export type Role = 'guest' | 'user' | 'moderator' | 'admin' | 'platform_admin';

export type Permission =
  | 'listing:read'
  | 'listing:create'
  | 'listing:edit_own'
  | 'listing:delete_own'
  | 'listing:moderate'
  | 'report:create'
  | 'report:resolve'
  | 'message:send'
  | 'user:manage_roles'
  | 'platform:configure'
  | 'audit:read';

const USER_PERMISSIONS: ReadonlySet<Permission> = new Set<Permission>([
  'listing:read', 'listing:create', 'listing:edit_own', 'listing:delete_own',
  'report:create', 'message:send',
]);

const MODERATOR_PERMISSIONS: ReadonlySet<Permission> = new Set<Permission>([
  ...USER_PERMISSIONS, 'listing:moderate', 'report:resolve', 'audit:read',
]);

const ADMIN_PERMISSIONS: ReadonlySet<Permission> = new Set<Permission>([
  ...MODERATOR_PERMISSIONS, 'user:manage_roles',
]);

const PLATFORM_ADMIN_PERMISSIONS: ReadonlySet<Permission> = new Set<Permission>([
  ...ADMIN_PERMISSIONS, 'platform:configure',
]);

const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  guest: new Set<Permission>(['listing:read']),
  user: USER_PERMISSIONS,
  moderator: MODERATOR_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  platform_admin: PLATFORM_ADMIN_PERMISSIONS,
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

export function isPrivilegedRole(role: Role): boolean {
  return role === 'admin' || role === 'platform_admin';
}

/** Privileged accounts must have verified MFA before their session is trusted. */
export function requiresMfa(role: Role): boolean {
  return isPrivilegedRole(role);
}

/** Roles that may never be granted through public registration or client input. */
export const PRIVILEGED_ROLES: readonly Role[] = ['moderator', 'admin', 'platform_admin'];

export function isPrivilegeEscalation(role: unknown): role is Role {
  return typeof role === 'string' && (PRIVILEGED_ROLES as readonly string[]).includes(role);
}

export function allPermissions(): Permission[] {
  return [...ROLE_PERMISSIONS.platform_admin].sort();
}

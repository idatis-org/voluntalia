import { User } from '@/types/user';

/**
 * Normalize roles input to an array of strings.
 * Accepts a single role string, an array of strings, or undefined/null.
 */
export function normalizeRoles(
  roles?: string | readonly string[] | null
): string[] {
  if (!roles) return [];
  if (typeof roles === 'string') return [roles];
  // roles may be readonly string[]; convert to mutable string[]
  return Array.from(roles).map((r) => String(r));
}

/**
 * Returns true if the user has the exact role provided.
 */
export function hasRole(
  user: Pick<User, 'role'> | null | undefined,
  role: string
): boolean {
  if (!user || !user.role) return false;
  const userRoles: string[] = Array.isArray(user.role)
    ? user.role
    : String(user.role)
        .split(',')
        .map((s) => s.trim());
  return userRoles.includes(role);
}

/**
 * Returns true if the user has any of the provided roles.
 */
export function hasAnyRole(
  user: Pick<User, 'role'> | null | undefined,
  roles?: string | readonly string[] | null
): boolean {
  const wanted = normalizeRoles(roles);
  if (wanted.length === 0) return false;
  if (!user || !user.role) return false;
  const userRoles: string[] = Array.isArray(user.role)
    ? user.role
    : String(user.role)
        .split(',')
        .map((s) => s.trim());
  return wanted.some((r) => userRoles.includes(r));
}

/**
 * Convenience to determine if a route (allowedRoles) is accessible by the user.
 * If allowedRoles is empty or undefined we treat the route as public (accessible).
 */
export function canAccessRoute(
  user: Pick<User, 'role'> | null | undefined,
  allowedRoles?: string | readonly string[] | null
): boolean {
  const allowed = normalizeRoles(allowedRoles);
  if (allowed.length === 0) return true; // public route
  return hasAnyRole(user, allowed);
}

export default {
  normalizeRoles,
  hasRole,
  hasAnyRole,
  canAccessRoute,
};

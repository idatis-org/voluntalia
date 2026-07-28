/**
 * Sistema de Permisos y Roles - VoluntALIA
 * 
 * Este archivo centraliza la configuración de permisos por rol.
 * Usado por componentes de navegación y protección de rutas.
 */

// ============================================================================
// ROLES
// ============================================================================

export const ROLES = {
  COORDINATOR: 'COORDINATOR',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN', // Futuro
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// ============================================================================
// PERMISOS POR RUTA
// ============================================================================

export const ROUTE_PERMISSIONS = {
  DASHBOARD: [ROLES.COORDINATOR, ROLES.VOLUNTEER],
  PROFILE: [ROLES.COORDINATOR, ROLES.VOLUNTEER],
  VOLUNTEERS: [ROLES.COORDINATOR],
  ACTIVITIES: [ROLES.COORDINATOR],
  HOURS: [ROLES.COORDINATOR, ROLES.VOLUNTEER],
  RESOURCES: [ROLES.COORDINATOR],
  NOTIFICATIONS: [ROLES.COORDINATOR],
  SETTINGS: [ROLES.COORDINATOR],
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verifica si un rol es voluntario
 */
export const isVolunteer = (userRole: string | undefined): boolean => {
  return userRole === ROLES.VOLUNTEER;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ROLES,
  ROUTE_PERMISSIONS,
  isVolunteer,
};

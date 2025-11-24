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

export type Role = (typeof ROLES)[keyof typeof ROLES];

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
// ACCIONES POR ROL
// ============================================================================

export const PERMISSIONS = {
  // Gestión de Voluntarios
  VIEW_ALL_VOLUNTEERS: [ROLES.COORDINATOR],
  CREATE_VOLUNTEER: [ROLES.COORDINATOR],
  EDIT_VOLUNTEER: [ROLES.COORDINATOR],
  DELETE_VOLUNTEER: [ROLES.COORDINATOR],

  // Gestión de Actividades
  VIEW_ALL_ACTIVITIES: [ROLES.COORDINATOR],
  CREATE_ACTIVITY: [ROLES.COORDINATOR],
  EDIT_ACTIVITY: [ROLES.COORDINATOR],
  DELETE_ACTIVITY: [ROLES.COORDINATOR],
  VIEW_ASSIGNED_ACTIVITIES: [ROLES.VOLUNTEER],

  // Gestión de Horas
  VIEW_ALL_HOURS: [ROLES.COORDINATOR],
  VIEW_OWN_HOURS: [ROLES.COORDINATOR, ROLES.VOLUNTEER],
  EDIT_ALL_HOURS: [ROLES.COORDINATOR],
  EDIT_OWN_HOURS: [ROLES.VOLUNTEER],

  // Recursos
  VIEW_RESOURCES: [ROLES.COORDINATOR],
  UPLOAD_RESOURCES: [ROLES.COORDINATOR],
  DELETE_RESOURCES: [ROLES.COORDINATOR],

  // Notificaciones
  SEND_NOTIFICATIONS: [ROLES.COORDINATOR],
  RECEIVE_NOTIFICATIONS: [ROLES.COORDINATOR, ROLES.VOLUNTEER],

  // Perfil
  VIEW_OWN_PROFILE: [ROLES.COORDINATOR, ROLES.VOLUNTEER],
  EDIT_OWN_PROFILE: [ROLES.COORDINATOR, ROLES.VOLUNTEER],
  VIEW_OTHER_PROFILES: [ROLES.COORDINATOR],

  // Configuración
  ACCESS_SETTINGS: [ROLES.COORDINATOR],
  MANAGE_ROLES: [ROLES.ADMIN],
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Verifica si un usuario tiene permiso para acceder a una ruta
 */
export const canAccessRoute = (
  userRole: string | undefined,
  route: keyof typeof ROUTE_PERMISSIONS
): boolean => {
  if (!userRole) return false;
  return (ROUTE_PERMISSIONS[route] as readonly string[]).includes(userRole);
};

/**
 * Verifica si un usuario tiene un permiso específico
 */
export const hasPermission = (
  userRole: string | undefined,
  permission: keyof typeof PERMISSIONS
): boolean => {
  if (!userRole) return false;
  return (PERMISSIONS[permission] as readonly string[]).includes(userRole);
};

/**
 * Obtiene todas las rutas permitidas para un rol
 */
export const getAllowedRoutes = (userRole: string | undefined): string[] => {
  if (!userRole) return [];

  return Object.entries(ROUTE_PERMISSIONS)
    .filter(([_, roles]) => (roles as readonly string[]).includes(userRole))
    .map(([route]) => route.toLowerCase().replace('_', '-'));
};

/**
 * Verifica si un rol es coordinador
 */
export const isCoordinator = (userRole: string | undefined): boolean => {
  return userRole === ROLES.COORDINATOR;
};

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
  PERMISSIONS,
  canAccessRoute,
  hasPermission,
  getAllowedRoutes,
  isCoordinator,
  isVolunteer,
};

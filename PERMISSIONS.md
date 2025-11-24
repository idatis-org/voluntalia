# 👥 Sistema de Permisos y Roles - VoluntALIA

## 📋 Roles del Sistema

### 🔵 **COORDINATOR** (Coordinador)

Gestiona la organización, voluntarios y actividades. Tiene acceso completo a todas las funcionalidades administrativas.

### 🟢 **VOLUNTEER** (Voluntario)

Usuario estándar que participa en actividades. Tiene acceso limitado a sus propios datos y actividades asignadas.

### 🔴 **ADMIN** (Administrador)

_Rol futuro - no implementado aún_

---

## 🔐 Matriz de Permisos por Página

| Página            | Ruta             | COORDINATOR             | VOLUNTEER             | Notas                                          |
| ----------------- | ---------------- | ----------------------- | --------------------- | ---------------------------------------------- |
| **Dashboard**     | `/`              | ✅ Acceso total         | ✅ Acceso limitado    | ⚠️ Actualmente no diferencia contenido por rol |
| **Profile**       | `/profile`       | ✅ Su propio perfil     | ✅ Su propio perfil   | Ambos pueden editar su perfil                  |
| **Volunteers**    | `/volunteers`    | ✅ Ver/gestionar todos  | ❌ Sin acceso         | Solo COORDINATOR                               |
| **Activities**    | `/activities`    | ✅ CRUD completo        | ❌ Sin acceso         | Solo COORDINATOR puede crear/editar            |
| **Hours**         | `/hours`         | ✅ Ver todas las horas  | ✅ Ver solo sus horas | Filtrado por usuario                           |
| **Resources**     | `/resources`     | ✅ Gestionar recursos   | ❌ Sin acceso         | Solo COORDINATOR                               |
| **Notifications** | `/notifications` | ✅ Enviar/recibir       | ❌ Sin acceso         | Solo COORDINATOR puede enviar                  |
| **Settings**      | `/settings`      | ✅ Configuración global | ❌ Sin acceso         | Solo COORDINATOR                               |

---

## 🛡️ Componentes de Seguridad

### **ProtectedRoute**

Componente que valida autenticación y roles antes de permitir acceso a rutas.

**Ubicación:** `src/components/ProtectedRoute.tsx`

**Uso:**

```tsx
<ProtectedRoute allowedRoles={['COORDINATOR']}>
  <MiComponente />
</ProtectedRoute>
```

### **Navigation**

El menú de navegación filtra automáticamente las opciones según el rol del usuario.

**Ubicación:** `src/components/Navigation.tsx`

---

## ✅ Verificaciones Implementadas

### 1. **Navigation Component** ✅

- Desktop y Mobile navigation filtran opciones por rol
- Solo muestra enlaces permitidos para cada usuario

### 2. **Protected Routes** ✅

- Todas las rutas sensibles protegidas con `allowedRoles`
- Redirige a `/unauthorized` si no tiene permisos

### 3. **Route Protection in App.tsx** ✅

```tsx
// Ejemplo de rutas protegidas
<Route
  path="/volunteers"
  element={
    <ProtectedRoute allowedRoles={['COORDINATOR']}>
      <Volunteers />
    </ProtectedRoute>
  }
/>
```

---

## ⚠️ Funcionalidades Pendientes

### Dashboard Diferenciado

**Estado:** Pendiente de implementar  
**Descripción:** El Dashboard actualmente muestra el mismo contenido para todos los roles.

**Debería mostrar:**

- **COORDINATOR:** Stats globales, todos los eventos, actividad de todos
- **VOLUNTEER:** Stats personales, eventos inscritos, actividad propia

---

## 🔧 Configuración de Permisos

Los permisos están configurados en:

- `src/config/permissions.ts` - Configuración centralizada
- `src/components/Navigation.tsx` - Filtrado de menú
- `src/App.tsx` - Protección de rutas

---

## 📝 Guía para Desarrolladores

### Agregar una nueva ruta protegida:

1. **En App.tsx:**

```tsx
<Route
  path="/nueva-ruta"
  element={
    <ProtectedRoute allowedRoles={['COORDINATOR', 'VOLUNTEER']}>
      <NuevoComponente />
    </ProtectedRoute>
  }
/>
```

2. **En Navigation.tsx:**

```tsx
{
  name: "Nueva Sección",
  href: "/nueva-ruta",
  icon: IconName,
  roles: ['COORDINATOR', 'VOLUNTEER']
}
```

3. **En permissions.ts:**

```tsx
NUEVA_RUTA: ['COORDINATOR', 'VOLUNTEER'];
```

### Verificar rol en componentes:

```tsx
import { useAuth } from '@/contexts/AuthContext';

const MiComponente = () => {
  const { user } = useAuth();

  const isCoordinator = user?.role === 'COORDINATOR';

  return <>{isCoordinator && <Button>Solo para Coordinadores</Button>}</>;
};
```

---

## 🧪 Testing

### Manual Testing Checklist:

- [ ] Login como COORDINATOR → Verificar acceso a todas las páginas
- [ ] Login como VOLUNTEER → Verificar acceso limitado
- [ ] Intentar acceder a URLs restringidas directamente
- [ ] Verificar que el menú muestre solo opciones permitidas
- [ ] Probar en mobile (menú hamburguesa)

### Endpoints de Testing:

- Login COORDINATOR: `/auth/login` con credenciales de coordinador
- Login VOLUNTEER: `/auth/login` con credenciales de voluntario

---

## 📅 Última Actualización

**Fecha:** 2025-10-06  
**Rama:** ALIA_SP1_VERIFY_role-permissions  
**Estado:** En revisión

---

## 🔗 Referencias

- [AuthContext.tsx](src/contexts/AuthContext.tsx) - Contexto de autenticación
- [ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) - Componente de protección
- [permissions.ts](src/config/permissions.ts) - Configuración de permisos

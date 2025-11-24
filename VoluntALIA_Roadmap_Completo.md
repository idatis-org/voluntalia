# Roadmap y Priorización – VoluntALIA

Este documento consolida el análisis de los dos archivos proporcionados, los MVPs identificados, las tecnologías recomendadas, y el roadmap visual en fases.

---

## 🔹 Análisis del Primer Documento (Parte 1)

La propuesta de la app **VoluntALIA** busca ser una plataforma de gestión de voluntariado con IA generativa.

### MVPs Identificados

1. **Gestión de voluntarios (base de datos + perfiles)**
   - Registro y login de voluntarios y coordinadores.
   - Perfil con datos personales, disponibilidad y competencias.
   - CRUD (crear, leer, actualizar, eliminar) de voluntarios.

2. **Reclutamiento y selección automatizada (IA básica)**
   - Matching entre necesidades de la ONG y perfiles de voluntarios.
   - Recomendaciones simples usando reglas o un modelo inicial de IA.

3. **Gestión de actividades y tareas**
   - Creación de proyectos y actividades.
   - Asignación de voluntarios según disponibilidad y habilidades.
   - Calendario de actividades y recordatorios.

4. **Comunicación interna**
   - Sistema de mensajería básica o notificaciones.
   - Chatbot para responder preguntas frecuentes.

5. **Gestión administrativa y legal**
   - Almacenamiento seguro de documentos.
   - Automatización de contratos básicos.

6. **Panel de seguimiento y métricas**
   - Visualización de participación de voluntarios.
   - Estadísticas básicas de desempeño y compromiso.

### Tecnologías Recomendadas

- **Frontend:** React + Tailwind CSS.
- **Backend:** Node.js con Express o Python con FastAPI.
- **Base de datos:** PostgreSQL o MongoDB.
- **IA:** Rasa, Botpress o API de OpenAI para chatbot.
- **Infraestructura:** Docker, Vercel (frontend), Railway/Heroku (backend).

---

## 🔹 Análisis del Segundo Documento (Parte 2)

Este documento introduce wireframes y flujos de pantalla, confirmando la arquitectura de la aplicación.

### Wireframes incluidos

- **Pantalla 1:** Chatbot y login.
- **Pantalla 2:** Dashboard del coordinador y gestión legal.
- **Pantalla 3:** Perfil del voluntario y comunicaciones.
- **Pantalla 4:** Evaluación de desempeño.

### Refinamiento de MVPs

1. Autenticación y roles de usuario.
2. Chatbot básico.
3. Dashboard del coordinador.
4. Gestión administrativa/legal.
5. Perfil del voluntario.
6. Comunicaciones internas.
7. Evaluación de desempeño.

---

## 🔹 Roadmap por Fases (MVPs y dependencias)

**Fase 1 – Fundamentos**

- Autenticación y control de roles (voluntario, coordinador, legal).
- Dashboard inicial del coordinador (vista general).

**Fase 2 – Comunicación y Asistente**

- Chatbot FAQ (respuestas básicas).
- Sistema de notificaciones internas.

**Fase 3 – Gestión Administrativa y Legal**

- Subida/almacenamiento seguro de documentos.
- Automatización básica de contratos.

**Fase 4 – Gestión de Actividades y Voluntarios**

- CRUD de actividades y asignación a voluntarios.
- Perfil editable del voluntario.

**Fase 5 – Evaluación y Métricas**

- Registro de desempeño (coordinador).
- Visualización de resultados y feedback (voluntario).

**Fase 6 – IA Avanzada (Escalado)**

- Matching inteligente voluntario ↔ actividad (ML/IA).
- Chatbot con IA generativa.
- Predicción de abandono de voluntarios.

---

## 🔹 Tabla de Prioridad (Esfuerzo vs. Impacto)

| MVP                            | Descripción                                | Impacto  | Esfuerzo | Prioridad         |
| ------------------------------ | ------------------------------------------ | -------- | -------- | ----------------- |
| Autenticación + roles          | Login, permisos según perfil               | ⭐⭐⭐⭐ | ⭐⭐     | **Alta**          |
| Dashboard coordinador          | Vista general de voluntarios y actividades | ⭐⭐⭐   | ⭐⭐     | **Alta**          |
| Chatbot FAQ básico             | Respuestas automáticas simples             | ⭐⭐⭐   | ⭐       | **Alta**          |
| Notificaciones internas        | Comunicación voluntarios ↔ coordinador    | ⭐⭐⭐   | ⭐⭐     | **Media-Alta**    |
| Gestión legal                  | Documentos y contratos automáticos         | ⭐⭐⭐⭐ | ⭐⭐⭐   | **Media**         |
| CRUD voluntarios + actividades | Gestión central del sistema                | ⭐⭐⭐⭐ | ⭐⭐⭐   | **Alta**          |
| Perfil voluntario              | Datos personales + historial               | ⭐⭐⭐   | ⭐⭐     | **Media**         |
| Evaluación de desempeño        | Feedback y métricas                        | ⭐⭐⭐   | ⭐⭐     | **Media**         |
| IA Matching + Predicción       | IA generativa y ML                         | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Baja (futuro)** |

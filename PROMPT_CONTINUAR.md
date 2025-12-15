# Contexto para Nueva Sesión: Arreglo de Admin y Mejoras UI

Estoy trabajando en "Cinema Pergamino", un sistema de gestión de cines (Next.js 14, Tailwind, Framer Motion, Backend Node/Prisma).

**Estado Actual:**
Hemos realizado un overhaul visual del `/admin` con un diseño "glassmorphism" premium, Command Palette (Cmd+K) y nuevos componentes.

**Bug Crítico a Resolver:**
En `/admin/salas`, al intentar cambiar una sala de "Numerada" (`ASSIGNED`) a "General/Sin Numerar" (`GENERAL`) y guardar, **el cambio no persiste**.
- Frontend: `/app/(admin)/admin/salas/page.tsx`
- Mutation: `lib/queries/rooms.ts`
- Se intentó cambiar el payload a `seating_mode` (snake_case) pero no funcionó, se revirtió a `seatingMode`.
- **Tarea**: Investigar el BACKEND (`/backend/src/controllers/room.controller.ts` o similar) para ver qué propiedad espera exactamente, o si hay un error de lógica al guardar.

**Siguientes Pasos (Roadmap):**
1.  **Fix Bug Salas**: Asegurar que se guarde el modo "General".
2.  **Modales Mobile-First**: Revisar que los nuevos modales (ya implementados con Framer Motion) se vean perfectos en celular (centrados, width correcto).
3.  **Holistic Polish**: Continuar unificando estilos en el admin.

**Archivos Clave:**
- Frontend: `app/(admin)/admin/salas/page.tsx`, `lib/queries/rooms.ts`, `components/ui/Modal.tsx`
- Backend: `backend/src` (necesitarás explorar para encontrar el controlador de rooms).

Por favor, ayúdame primero a **debuggear el backend** para arreglar el guardado de la sala, y luego seguimos con las mejoras visuales.

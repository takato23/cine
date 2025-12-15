# Documentación Cinema Pergamino

Bienvenido a la documentación completa del proyecto Cinema Pergamino. Esta documentación cubre todos los aspectos del desarrollo de la webapp, desde los requisitos del producto hasta las guías técnicas de implementación.

---

## 📚 Índice de Documentación

### 1. [Product Requirements Document (PRD)](./prd.md)
Documento de requisitos del producto que define:
- Visión general y objetivos
- User stories completas para todas las funcionalidades
- Flujos principales de usuario
- Requisitos funcionales y no funcionales
- Métricas de éxito
- Roadmap futuro

**Úsalo para:**
- Entender qué debe hacer la aplicación
- Definir nuevas features
- Validar implementaciones

---

### 2. [Guía de Diseño y Estilo](./design-guidelines.md)
Guía completa de diseño visual que incluye:
- Paleta de colores (primario, secundario, neutros, estados)
- Tipografía (fuentes, escalas, pesos)
- Espaciado y sistema de diseño
- Bordes y radios
- Sombras
- Componentes UI (botones, cards, badges, inputs, etc.)
- Iconografía
- Layout y grid
- Estados visuales
- Responsive breakpoints
- Ejemplos de implementación en Tailwind

**Úsalo para:**
- Mantener consistencia visual
- Implementar nuevos componentes
- Aplicar estilos correctamente

---

### 3. [Guía de Animaciones y Microinteracciones](./animation-guidelines.md)
Guía detallada sobre animaciones que cubre:
- Principios de animación
- Duración y timing
- Curvas de easing
- Transformaciones y propiedades
- Casos de uso específicos (home, detalle, asientos, confitería, checkout)
- Estados de carga
- Modales y overlays
- Navegación
- Feedback de errores
- Implementación en Tailwind
- Preferencias de usuario (prefers-reduced-motion)
- Mejores prácticas

**Úsalo para:**
- Implementar animaciones consistentes
- Mejorar la experiencia de usuario
- Mantener performance óptima

---

### 4. [Lineamientos Técnicos](./tech-guidelines.md)
Guía técnica completa que incluye:
- Stack tecnológico
- Estructura del proyecto
- Next.js App Router
- Gestión de estado (Zustand + React Query)
- Cliente API (Axios)
- Tipos TypeScript
- Componentes y estructura
- Configuración de Tailwind
- Accesibilidad
- Performance
- Manejo de errores
- Variables de entorno
- Checklist de implementación

**Úsalo para:**
- Entender la arquitectura del proyecto
- Implementar nuevas features siguiendo las convenciones
- Resolver dudas técnicas

---

## 🎯 Cómo Usar Esta Documentación

### Para Desarrolladores Nuevos

1. **Empieza con el PRD** para entender qué hace la aplicación
2. **Revisa los Lineamientos Técnicos** para entender cómo está estructurado
3. **Consulta la Guía de Diseño** cuando implementes componentes UI
4. **Revisa la Guía de Animaciones** cuando agregues interacciones

### Para Diseñadores

1. **Revisa el PRD** para entender los flujos de usuario
2. **Usa la Guía de Diseño** como referencia para mantener consistencia
3. **Consulta la Guía de Animaciones** para entender las microinteracciones

### Para Product Managers

1. **Usa el PRD** como fuente de verdad para requisitos
2. **Consulta las métricas de éxito** definidas en el PRD
3. **Revisa el roadmap** para planificación futura

---

## 🔄 Actualización de Documentación

Esta documentación debe actualizarse cuando:
- Se agregan nuevas features (actualizar PRD)
- Se cambian estilos o componentes (actualizar Guía de Diseño)
- Se agregan nuevas animaciones (actualizar Guía de Animaciones)
- Se cambia la arquitectura o stack (actualizar Lineamientos Técnicos)

**Principio:** La documentación debe reflejar el estado actual del proyecto.

---

## 📝 Convenciones

### Nomenclatura

- **Componentes:** PascalCase (ej: `MovieCard.tsx`)
- **Utilidades:** camelCase (ej: `formatDate.ts`)
- **Hooks:** `use` + PascalCase (ej: `useMovies.ts`)
- **Tipos:** PascalCase (ej: `Movie.ts`)
- **Rutas:** minúsculas con guiones (ej: `/pelicula/[id]`)

### Colores

- **Primario:** `#d7123a` (rojo acción)
- **Secundario:** `#f5b400` (amarillo ratings)
- **Fondo:** `#14090b` (oscuro vino)

### Animaciones

- **Duración rápida:** 120ms
- **Duración normal:** 200ms
- **Duración lenta:** 300ms
- **Easing estándar:** `ease-in-out`

---

## 🚀 Quick Start

### Para empezar a desarrollar:

1. Lee el [PRD](./prd.md) para entender los requisitos
2. Revisa la [estructura del proyecto](./tech-guidelines.md#2-estructura-del-proyecto)
3. Consulta la [guía de diseño](./design-guidelines.md) al crear componentes
4. Aplica [animaciones](./animation-guidelines.md) según los casos de uso

### Para implementar una nueva feature:

1. Agrega la user story al PRD
2. Diseña los componentes según la guía de diseño
3. Implementa siguiendo los lineamientos técnicos
4. Agrega animaciones según la guía de animaciones
5. Actualiza la documentación si es necesario

---

## 📞 Contacto y Soporte

Para preguntas o sugerencias sobre la documentación, contacta al equipo de desarrollo.

---

**Última actualización:** 2024  
**Versión de documentación:** 1.0


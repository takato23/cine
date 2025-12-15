# Console cleanup (dev)

Este documento resume los warnings/errores de consola reportados y cómo quedaron mitigados desde el código fuente (sin tocar archivos generados).

## Estado de auditoría

En `frontend/` no hay referencias directas a `Supabase`, `Realtime`, `AudioContext`, `ScriptProcessorNode`, `GeminiLiveManager` o `new WebSocket(...)` (excluyendo `node_modules`).  
Por eso, parte de los mensajes reportados pueden provenir de SDKs externos agregados fuera de `frontend/` o de integraciones futuras. Aun así, se consolidó una arquitectura de integraciones opt‑in para evitar inicializaciones automáticas y spam.

## Cambios implementados (resumen)

- Integraciones centralizadas: `frontend/lib/integrations/*`
- Provider único de arranque (sin side effects si flags OFF): `frontend/components/providers/IntegrationsProvider.tsx`
- Página de configuración para activar audio/mic explícitamente: `frontend/app/(public)/(site)/settings/page.tsx`
- Supabase Realtime opt‑in con backoff y límite de reintentos: `frontend/lib/integrations/supabase/realtime.ts`
- Wrapper de WebSocket con guards (no enviar si no está OPEN): `frontend/lib/integrations/ws.ts`

## 1) “using deprecated parameters… pass a single object instead”

**Origen típico:** inicializaciones de SDK con firma antigua (por ejemplo: `init(a, b)` en lugar de `init({ ... })`).  
**En este repo:** no se encontró el string en el código fuente de `frontend/` ni referencias directas al SDK que lo emite.

**Cómo actuar si reaparece:**
- Aislar la inicialización en `frontend/lib/integrations/*`.
- Cambiar a la firma “un solo objeto” según la doc del SDK.
- Evitar que corra en import-time: inicialización lazy desde un `Provider` o desde un `onClick`.

## 2) Supabase Realtime: WebSocket falla continuamente

**Problema:** conexiones `wss://<project>.supabase.co/realtime/...` fallando con retry infinito generan ruido.

**Mitigación implementada:**
- No se conecta nunca por defecto.
- Solo se intenta conectar si:
  - `NEXT_PUBLIC_FF_SUPABASE_REALTIME=true`
  - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` existen y son válidas
- Retry controlado con backoff + límite (default 5 intentos) y toasts no intrusivos (rate-limited).
- Desconecta al ocultar la pestaña para evitar loops de reconexión en background.

Archivos:
- `frontend/lib/integrations/supabase/config.ts`
- `frontend/lib/integrations/supabase/client.ts`
- `frontend/lib/integrations/supabase/realtime.ts`
- `frontend/components/providers/IntegrationsProvider.tsx`

## 3) Audio: “The AudioContext was not allowed to start… after a user gesture”

**Problema:** crear/resumir `AudioContext` al montar componentes dispara el warning.

**Mitigación implementada:**
- Se creó un “Audio Gate” persistido y opt‑in: `frontend/lib/integrations/audio/gate.ts`
- `AudioContext` y permisos de micrófono se solicitan únicamente tras un click en `/settings`.

Archivos:
- `frontend/lib/integrations/audio/gate.ts`
- `frontend/app/(public)/(site)/settings/page.tsx`

## 4) “[Deprecation] ScriptProcessorNode is deprecated. Use AudioWorkletNode instead.”

**En este repo:** no hay uso propio de `ScriptProcessorNode` en `frontend/`.  
**Riesgo real:** algunos SDKs de audio/streaming lo usan internamente.

**Mitigación recomendada (y aplicada como política):**
- Encapsular integraciones de audio/voz detrás de `NEXT_PUBLIC_FF_GEMINI_LIVE=false` por defecto.
- No inicializar automáticamente; iniciar solo luego de user gesture (Audio Gate).

Archivos:
- `frontend/lib/integrations/geminiLive.ts`

## 5) “WebSocket is already in CLOSING or CLOSED state.”

**Problema:** se intenta `send()` cuando el socket no está `OPEN`, o se reconecta sin lifecycle robusto.

**Mitigación implementada:**
- Wrapper `SafeWebSocket` con guards: solo envía si `readyState === WebSocket.OPEN` y maneja reconexión con backoff y límites.

Archivos:
- `frontend/lib/integrations/ws.ts`

## 6) Framer Motion: “Target ref is defined but not hydrated” (`useScroll`)

**Problema:** en dev (React Strict Mode + App Router), `useScroll({ target: ref })` puede ejecutarse antes de que el `ref.current` esté disponible, disparando el invariant de Motion.

**Mitigación implementada:**
- Se agregó `useHydrated()` para diferir el uso de `target` hasta después de la hidratación.

Archivos:
- `frontend/lib/hooks/useHydrated.ts`
- `frontend/components/ui/CutoutHero.tsx`
- `frontend/app/(public)/(site)/pelicula/[id]/page.tsx`

## Flags / env requeridos

Ver `frontend/env.example`.

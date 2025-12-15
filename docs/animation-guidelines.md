# Guía de Animaciones y Microinteracciones
## Cinema Pergamino - Webapp

**Versión:** 1.0  
**Última actualización:** 2024

---

## 1. Principios de Animación

### 1.1 Filosofía General

Las animaciones en Cinema Pergamino deben:
- **Ser sutiles y naturales**: No distraer del contenido
- **Proporcionar feedback claro**: Confirmar acciones del usuario
- **Mejorar la comprensión**: Ayudar a entender cambios de estado
- **Mantener rendimiento**: 60fps en todos los dispositivos
- **Respetar preferencias**: Reducir animaciones si el usuario lo prefiere

### 1.2 Regla de Oro

> "Las animaciones deben sentirse instantáneas pero no abruptas"

---

## 2. Duración y Timing

### 2.1 Duraciones Estándar

```css
/* Microinteracciones (hover, tap, focus) */
--duration-fast: 120ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

/* Transiciones de página */
--duration-page: 250ms;

/* Animaciones complejas */
--duration-complex: 400ms;

/* Animaciones de entrada/salida */
--duration-enter: 300ms;
--duration-exit: 200ms;
```

### 2.2 Uso por Tipo de Acción

| Acción | Duración | Razón |
|--------|----------|-------|
| Hover en botones | 120ms | Feedback inmediato |
| Click/Tap | 100ms | Respuesta instantánea |
| Cambio de estado | 200ms | Perceptible pero rápido |
| Transición de página | 250ms | Suave sin ser lenta |
| Modal/Overlay | 300ms | Entrada visible |
| Loading spinner | Indefinido | Hasta completar |

---

## 3. Curvas de Easing

### 3.1 Curvas Estándar

```css
/* Easing estándar (entrada y salida suave) */
--ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Easing de entrada (aceleración) */
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);

/* Easing de salida (desaceleración) */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);

/* Easing de entrada y salida (suave) */
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);

/* Easing con rebote (solo casos especiales) */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 3.2 Uso por Contexto

**Interacciones del Usuario (Hover, Click):**
- `ease-out` o `ease-in-out`
- Sensación de respuesta inmediata

**Transiciones de Estado:**
- `ease-in-out`
- Cambios suaves y naturales

**Entradas de Elementos:**
- `ease-out`
- Elementos aparecen con energía

**Salidas de Elementos:**
- `ease-in`
- Elementos desaparecen rápidamente

**Animaciones de Carga:**
- `ease-in-out` o `linear`
- Movimiento continuo y predecible

---

## 4. Transformaciones y Propiedades

### 4.1 Propiedades Animables (Performance)

**Excelente (GPU-accelerated):**
- `transform` (translate, scale, rotate)
- `opacity`

**Bueno:**
- `filter` (blur, brightness)
- `backdrop-filter`

**Evitar (causan reflow):**
- `width`, `height`, `top`, `left`
- `margin`, `padding`
- `border-width`

### 4.2 Transformaciones Comunes

```css
/* Escala (hover) */
transform: scale(1.02);

/* Escala (click) */
transform: scale(0.98);

/* Elevación (sombra) */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Desplazamiento */
transform: translateY(-2px);

/* Rotación (solo casos específicos) */
transform: rotate(5deg);
```

---

## 5. Casos de Uso Específicos

### 5.1 Home / Cartelera

#### Hero Section (Película Destacada)
```css
/* Fade in al cargar */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero {
  animation: fadeIn 400ms ease-out;
}
```

#### Cards de Películas (Scroll Horizontal)
```css
/* Scroll suave */
.scroll-container {
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
}

.movie-card {
  scroll-snap-align: start;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}
```

#### Badge "ESTRENO"
```css
/* Pulso sutil (opcional) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.badge-estreno {
  animation: pulse 2s ease-in-out infinite;
}
```

### 5.2 Detalle de Película

#### Transición de Página
```css
/* Fade entre páginas */
.page-transition {
  animation: fadeIn 250ms ease-out;
}
```

#### Tabs de Fechas
```css
.tab {
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}

.tab-active {
  background-color: var(--primary-500);
  color: white;
  transform: scale(1.02);
}
```

#### Chips de Horarios
```css
.time-chip {
  transition: all 200ms ease-out;
}

.time-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.time-chip:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### Botón "Ver Tráiler"
```css
.trailer-button {
  transition: all 200ms ease-out;
}

.trailer-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(215, 18, 58, 0.3);
}

.trailer-button:active {
  transform: scale(0.98);
}
```

### 5.3 Selección de Asientos

#### Mapa de Asientos
```css
/* Entrada del mapa */
.seat-map {
  animation: fadeInUp 300ms ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Selección de Asiento
```css
.seat {
  transition: all 150ms ease-out;
  cursor: pointer;
}

/* Asiento disponible */
.seat.available:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

/* Asiento seleccionado */
.seat.selected {
  animation: selectSeat 300ms ease-out;
}

@keyframes selectSeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Número de orden en asiento seleccionado */
.seat-number {
  animation: popIn 200ms ease-out;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Asiento ocupado (feedback visual) */
.seat.occupied {
  cursor: not-allowed;
  filter: grayscale(0.8);
}
```

#### Actualización de Resumen
```css
.selection-summary {
  transition: all 200ms ease-out;
}

.selection-summary.updated {
  animation: highlight 400ms ease-out;
}

@keyframes highlight {
  0%, 100% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(215, 18, 58, 0.1);
  }
}
```

### 5.4 Confitería

#### Banners de Promoción
```css
.promo-banner {
  animation: slideInRight 400ms ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

#### Agregar Producto al Carrito
```css
.product-card {
  transition: transform 200ms ease-out;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```

#### Selector de Cantidad
```css
.quantity-button {
  transition: all 150ms ease-out;
}

.quantity-button:hover {
  transform: scale(1.1);
  background-color: var(--primary-600);
}

.quantity-button:active {
  transform: scale(0.95);
}

/* Animación al cambiar cantidad */
.quantity-value {
  transition: transform 150ms ease-out;
}

.quantity-value.updated {
  animation: bounce 300ms ease-out;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
```

#### Badge de Carrito
```css
.cart-badge {
  animation: popIn 200ms ease-out;
}

.cart-badge.updated {
  animation: bounce 300ms ease-out;
}
```

#### Barra de Total (Sticky)
```css
.total-bar {
  transition: transform 300ms ease-out;
}

.total-bar.hidden {
  transform: translateY(100%);
}

.total-bar.visible {
  transform: translateY(0);
}
```

### 5.5 Checkout / Resumen de Compra

#### Countdown Timer
```css
.timer {
  transition: color 200ms ease-out;
}

.timer.warning {
  animation: pulse 1s ease-in-out infinite;
  color: var(--warning);
}

.timer.critical {
  animation: pulse 500ms ease-in-out infinite;
  color: var(--error);
}
```

#### QR Code
```css
.qr-code {
  animation: fadeIn 400ms ease-out;
}

.qr-code.loading {
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

#### Confirmación de Pago
```css
.payment-success {
  animation: successPop 500ms ease-out;
}

@keyframes successPop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 6. Estados de Carga

### 6.1 Skeleton Loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 6.2 Spinner

```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### 6.3 Progress Bar

```css
.progress-bar {
  transition: width 300ms ease-out;
}
```

---

## 7. Modales y Overlays

### 7.1 Apertura de Modal

```css
.modal-overlay {
  animation: fadeIn 200ms ease-out;
}

.modal-content {
  animation: slideUp 300ms ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 7.2 Cierre de Modal

```css
.modal-overlay.closing {
  animation: fadeOut 200ms ease-in;
}

.modal-content.closing {
  animation: slideDown 200ms ease-in;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(50px);
  }
}
```

---

## 8. Navegación

### 8.1 Transición entre Páginas

```css
/* Fade entre páginas */
.page-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 250ms ease-out, transform 250ms ease-out;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 200ms ease-in, transform 200ms ease-in;
}
```

### 8.2 Menú de Navegación Inferior

```css
.nav-item {
  transition: all 200ms ease-out;
}

.nav-item.active {
  transform: translateY(-2px);
}

.nav-item.active::after {
  animation: slideIn 200ms ease-out;
}

@keyframes slideIn {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
```

---

## 9. Feedback de Errores

### 9.1 Mensaje de Error

```css
.error-message {
  animation: shake 400ms ease-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
```

### 9.2 Input con Error

```css
.input-error {
  animation: errorPulse 300ms ease-out;
  border-color: var(--error);
}

@keyframes errorPulse {
  0%, 100% {
    border-color: var(--error);
  }
  50% {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
}
```

---

## 10. Implementación en Tailwind CSS

### 10.1 Configuración de Transiciones

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        'fast': '120ms',
        'normal': '200ms',
        'slow': '300ms',
        'complex': '400ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(50px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        bounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 200ms ease-in',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'bounce': 'bounce 300ms ease-out',
        'shake': 'shake 400ms ease-out',
      },
    },
  },
}
```

### 10.2 Ejemplos de Uso

```html
<!-- Botón con hover -->
<button class="transition-all duration-fast ease-out hover:scale-105 hover:shadow-md active:scale-95">
  Comprar
</button>

<!-- Card con animación de entrada -->
<div class="animate-fade-in">
  <!-- contenido -->
</div>

<!-- Skeleton loading -->
<div class="animate-shimmer bg-bg-secondary rounded-lg h-48"></div>

<!-- Input con error -->
<input class="animate-shake border-error" />
```

---

## 11. Preferencias de Usuario

### 11.1 Respetar `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 11.2 Implementación en Tailwind

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    function({ addBase }) {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
      })
    },
  ],
}
```

---

## 12. Mejores Prácticas

### 12.1 Performance

1. **Usar `transform` y `opacity`**: Estas propiedades son GPU-accelerated
2. **Evitar animar `width` y `height`**: Causan reflow
3. **Limitar animaciones simultáneas**: Máximo 2-3 por elemento
4. **Usar `will-change` con precaución**: Solo cuando sea necesario

### 12.2 Accesibilidad

1. **Respetar `prefers-reduced-motion`**: Siempre
2. **No depender solo de animaciones**: El contenido debe ser comprensible sin ellas
3. **Mantener duraciones razonables**: No más de 500ms para acciones críticas

### 12.3 Consistencia

1. **Usar las mismas duraciones**: Para acciones similares
2. **Mantener curvas de easing consistentes**: Mismo tipo de movimiento
3. **Documentar animaciones personalizadas**: Para referencia futura

---

## 13. Recursos Adicionales

- [CSS Animations - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Framer Motion](https://www.framer.com/motion/) (alternativa para React)
- [React Spring](https://www.react-spring.dev/) (alternativa para React)
- [Material Design Motion](https://material.io/design/motion/)


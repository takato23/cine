# Guía de Diseño y Estilo
## Cinema Pergamino - Webapp

**Versión:** 1.0  
**Última actualización:** 2024

---

## 1. Paleta de Colores

### 1.1 Colores Principales

#### Fondo (Background)
```css
--bg-primary: #14090b;      /* Fondo principal oscuro vino */
--bg-secondary: #2a1b1f;   /* Cards y elementos secundarios */
--bg-tertiary: #0d0809;     /* Headers y elementos sticky */
--bg-overlay: rgba(0, 0, 0, 0.7); /* Overlays y modales */
```

#### Primario (Acción)
```css
--primary-50: #fef2f2;
--primary-100: #fee2e2;
--primary-200: #fecaca;
--primary-300: #fca5a5;
--primary-400: #f87171;
--primary-500: #d7123a;     /* Rojo acción principal */
--primary-600: #b91c1c;
--primary-700: #991b1b;
--primary-800: #7f1d1d;
--primary-900: #5c1515;
```

#### Secundario (Acentos)
```css
--secondary-50: #fffbeb;
--secondary-100: #fef3c7;
--secondary-200: #fde68a;
--secondary-300: #fcd34d;
--secondary-400: #fbbf24;
--secondary-500: #f5b400;    /* Amarillo ratings y VIP */
--secondary-600: #d97706;
--secondary-700: #b45309;
--secondary-800: #92400e;
--secondary-900: #78350f;
```

#### Neutros (Texto y Elementos)
```css
--neutral-50: #f7f2f4;      /* Texto primario claro */
--neutral-100: #e8e0e3;
--neutral-200: #d9ced2;
--neutral-300: #c7bfc4;      /* Texto secundario */
--neutral-400: #a89fa5;
--neutral-500: #8a7f86;
--neutral-600: #6b6168;
--neutral-700: #4d444a;
--neutral-800: #2f282c;
--neutral-900: #1a1417;
```

#### Estados
```css
--success: #2ecc71;         /* Verde éxito */
--warning: #f39c12;         /* Naranja alerta */
--error: #e74c3c;           /* Rojo error */
--info: #3498db;            /* Azul información */
```

### 1.2 Uso de Colores

**Primario (Rojo `#d7123a`):**
- Botones de acción principal
- Enlaces activos
- Badges de "ESTRENO"
- Estados seleccionados
- Elementos de navegación activos
- Precios y totales destacados

**Secundario (Amarillo `#f5b400`):**
- Ratings de películas (estrellas)
- Asientos VIP disponibles
- Badges de promoción
- Elementos destacados

**Neutros:**
- Texto principal: `#f7f2f4`
- Texto secundario: `#c7bfc4`
- Fondos de cards: `#2a1b1f`
- Bordes sutiles: `#4d444a`

**Estados:**
- Éxito: Confirmaciones, operaciones exitosas
- Alerta: Advertencias, tiempo restante bajo
- Error: Errores, estados inválidos
- Info: Información adicional, tooltips

---

## 2. Tipografía

### 2.1 Familia de Fuentes

**Fuente Principal:** Inter
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

**Fuente Alternativa (Fallback):**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 2.2 Escala Tipográfica

```css
/* Títulos */
--text-4xl: 2.25rem;    /* 36px - Títulos principales */
--text-3xl: 1.875rem;   /* 30px - Títulos grandes */
--text-2xl: 1.5rem;     /* 24px - Títulos sección */
--text-xl: 1.25rem;     /* 20px - Títulos cards */

/* Cuerpo */
--text-lg: 1.125rem;    /* 18px - Texto destacado */
--text-base: 1rem;      /* 16px - Texto base */
--text-sm: 0.875rem;    /* 14px - Texto secundario */
--text-xs: 0.75rem;     /* 12px - Texto pequeño, badges */
```

### 2.3 Pesos de Fuente

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### 2.4 Altura de Línea

```css
--leading-tight: 1.25;    /* Títulos */
--leading-normal: 1.5;    /* Texto base */
--leading-relaxed: 1.75;  /* Texto largo */
```

### 2.5 Uso de Tipografía

**Títulos de Página:**
- Tamaño: `text-3xl` o `text-4xl`
- Peso: `font-bold`
- Color: `text-neutral-50`

**Títulos de Sección:**
- Tamaño: `text-2xl`
- Peso: `font-bold`
- Color: `text-neutral-50`

**Títulos de Cards:**
- Tamaño: `text-xl`
- Peso: `font-semibold`
- Color: `text-neutral-50`

**Texto de Cuerpo:**
- Tamaño: `text-base`
- Peso: `font-normal`
- Color: `text-neutral-50` o `text-neutral-300`

**Texto Secundario:**
- Tamaño: `text-sm`
- Peso: `font-normal`
- Color: `text-neutral-300`

**Badges y Etiquetas:**
- Tamaño: `text-xs`
- Peso: `font-semibold` o `font-bold`
- Color: Según contexto (blanco en badges de color)

---

## 3. Espaciado

### 3.1 Sistema de Espaciado (8px base)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 3.2 Uso de Espaciado

**Padding de Cards:**
- Pequeño: `p-4` (16px)
- Mediano: `p-6` (24px)
- Grande: `p-8` (32px)

**Gap entre Elementos:**
- Muy pequeño: `gap-2` (8px)
- Pequeño: `gap-4` (16px)
- Mediano: `gap-6` (24px)
- Grande: `gap-8` (32px)

**Márgenes de Sección:**
- Entre secciones: `mb-12` o `mb-16` (48px o 64px)
- Entre elementos relacionados: `mb-6` (24px)

---

## 4. Bordes y Radios

### 4.1 Radio de Bordes

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Elementos pequeños */
--radius-md: 0.5rem;     /* 8px - Botones, inputs */
--radius-lg: 0.75rem;    /* 12px - Cards */
--radius-xl: 1rem;       /* 16px - Cards grandes, modales */
--radius-2xl: 1.5rem;    /* 24px - Elementos destacados */
--radius-full: 9999px;   /* Círculos, pills */
```

### 4.2 Uso de Radios

**Botones:**
- Botones estándar: `rounded-md` o `rounded-lg`
- Botones pill: `rounded-full`

**Cards:**
- Cards estándar: `rounded-lg`
- Cards grandes: `rounded-xl`

**Badges:**
- Badges rectangulares: `rounded-md`
- Badges pill: `rounded-full`

**Inputs:**
- Inputs estándar: `rounded-md`

### 4.3 Bordes

```css
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 3px;
```

**Colores de Borde:**
- Borde sutil: `border-neutral-700`
- Borde destacado: `border-primary-500`
- Borde de error: `border-error`

---

## 5. Sombras

### 5.1 Sistema de Sombras

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

### 5.2 Sombras con Color (Tema Oscuro)

```css
--shadow-primary: 0 4px 14px 0 rgba(215, 18, 58, 0.15);
--shadow-secondary: 0 4px 14px 0 rgba(245, 180, 0, 0.15);
```

### 5.3 Uso de Sombras

**Cards:**
- Cards estándar: `shadow-md`
- Cards elevadas: `shadow-lg`
- Cards destacadas: `shadow-xl`

**Botones:**
- Botones normales: `shadow-sm` o sin sombra
- Botones hover: `shadow-md`
- Botones activos: `shadow-inner`

**Modales y Overlays:**
- Modales: `shadow-2xl`

---

## 6. Componentes UI

### 6.1 Botones

#### Botón Primario
```css
background-color: var(--primary-500);
color: white;
padding: 0.75rem 1.5rem;
border-radius: var(--radius-md);
font-weight: 600;
font-size: var(--text-base);
```

**Estados:**
- Hover: `background-color: var(--primary-600)`, `shadow-md`
- Active: `background-color: var(--primary-700)`, `shadow-inner`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`

#### Botón Secundario
```css
background-color: transparent;
color: var(--primary-500);
border: 2px solid var(--primary-500);
padding: 0.75rem 1.5rem;
border-radius: var(--radius-md);
```

#### Botón Terciario (Texto)
```css
background-color: transparent;
color: var(--neutral-300);
padding: 0.5rem 1rem;
border-radius: var(--radius-md);
```

**Tamaños:**
- Pequeño: `py-2 px-4 text-sm`
- Mediano: `py-3 px-6 text-base` (default)
- Grande: `py-4 px-8 text-lg`

### 6.2 Cards

#### Card de Película
```css
background-color: var(--bg-secondary);
border-radius: var(--radius-lg);
overflow: hidden;
box-shadow: var(--shadow-md);
```

**Estructura:**
- Imagen: Aspect ratio 2:3, `object-cover`
- Contenido: Padding `p-4` o `p-6`
- Hover: `transform: scale(1.05)`, `shadow-lg`

#### Card de Producto (Confitería)
```css
background-color: var(--bg-secondary);
border-radius: var(--radius-lg);
padding: var(--space-4);
box-shadow: var(--shadow-sm);
```

### 6.3 Badges y Tags

#### Badge "ESTRENO"
```css
background-color: var(--primary-500);
color: white;
padding: 0.25rem 0.75rem;
border-radius: var(--radius-md);
font-size: var(--text-xs);
font-weight: 700;
text-transform: uppercase;
```

#### Badge de Rating
```css
background-color: rgba(0, 0, 0, 0.6);
color: var(--secondary-500);
padding: 0.25rem 0.5rem;
border-radius: var(--radius-md);
font-size: var(--text-xs);
```

#### Badge de Fecha
```css
background-color: white;
color: var(--bg-primary);
padding: 0.5rem 1rem;
border-radius: var(--radius-md);
font-size: var(--text-sm);
font-weight: 600;
```

### 6.4 Inputs

#### Input Estándar
```css
background-color: var(--bg-secondary);
color: var(--neutral-50);
border: 1px solid var(--neutral-700);
border-radius: var(--radius-md);
padding: 0.75rem 1rem;
font-size: var(--text-base);
```

**Estados:**
- Focus: `border-color: var(--primary-500)`, `outline: none`, `ring-2 ring-primary-500/20`
- Error: `border-color: var(--error)`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`

### 6.5 Tabs

#### Tab Activo
```css
background-color: var(--primary-500);
color: white;
padding: 0.5rem 1rem;
border-radius: var(--radius-md);
font-weight: 600;
```

#### Tab Inactivo
```css
background-color: transparent;
color: var(--neutral-300);
padding: 0.5rem 1rem;
border-radius: var(--radius-md);
```

### 6.6 Selector de Cantidad

```css
/* Contenedor */
display: flex;
align-items: center;
gap: 0.5rem;

/* Botón - */
background-color: var(--bg-tertiary);
color: var(--neutral-50);
border: none;
border-radius: var(--radius-md);
width: 2rem;
height: 2rem;

/* Número */
background-color: var(--bg-tertiary);
color: var(--neutral-50);
padding: 0.5rem 1rem;
border-radius: var(--radius-md);
min-width: 3rem;
text-align: center;

/* Botón + */
background-color: var(--primary-500);
color: white;
border: none;
border-radius: var(--radius-md);
width: 2rem;
height: 2rem;
```

### 6.7 Rating (Estrellas)

```css
/* Estrella llena */
color: var(--secondary-500);
fill: var(--secondary-500);

/* Estrella vacía */
color: var(--neutral-600);
fill: none;
stroke: var(--neutral-600);
```

### 6.8 Barra de Navegación Inferior

```css
background-color: var(--bg-tertiary);
border-top: 1px solid var(--neutral-800);
padding: 0.75rem 0;
position: fixed;
bottom: 0;
left: 0;
right: 0;
```

**Item Activo:**
```css
color: var(--primary-500);
border-bottom: 2px solid var(--primary-500);
```

**Item Inactivo:**
```css
color: var(--neutral-400);
```

### 6.9 Barra de Total (Sticky Bottom)

```css
background-color: var(--primary-500);
color: white;
padding: 1rem 1.5rem;
border-radius: var(--radius-xl) var(--radius-xl) 0 0;
position: sticky;
bottom: 0;
box-shadow: var(--shadow-xl);
```

---

## 7. Iconografía

### 7.1 Librería de Iconos

**Librería Principal:** Lucide React
- Iconos consistentes y modernos
- Tamaños estándar: 16px, 20px, 24px
- Stroke width: 2px (default)

### 7.2 Iconos Principales

- **Navegación:** `ArrowLeft`, `ArrowRight`, `Home`, `ShoppingCart`, `Ticket`
- **Películas:** `Film`, `Star`, `Play`, `Heart`, `Share`
- **Asientos:** `Armchair` (custom o similar)
- **Confitería:** `Utensils`, `Coffee`, `ShoppingBag`
- **Pago:** `Lock`, `CreditCard`, `QrCode`
- **Información:** `Info`, `Calendar`, `Clock`, `MapPin`

### 7.3 Tamaños de Iconos

```css
--icon-xs: 0.75rem;    /* 12px */
--icon-sm: 1rem;       /* 16px */
--icon-md: 1.25rem;     /* 20px */
--icon-lg: 1.5rem;     /* 24px */
--icon-xl: 2rem;       /* 32px */
```

---

## 8. Layout y Grid

### 8.1 Contenedores

**Contenedor Principal:**
```css
max-width: 100%;
padding: 0 1rem;
```

**Contenedor de Sección:**
```css
max-width: 100%;
padding: 1.5rem 1rem;
```

### 8.2 Grid de Películas

**Grid Horizontal (Scroll):**
```css
display: flex;
gap: 1rem;
overflow-x: auto;
scroll-snap-type: x mandatory;
```

**Card de Película:**
```css
min-width: 140px;
max-width: 180px;
scroll-snap-align: start;
```

### 8.3 Grid de Productos

**Grid Responsive:**
```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
gap: 1rem;
```

---

## 9. Estados Visuales

### 9.1 Estados de Interacción

**Hover:**
- Cards: `transform: scale(1.02)`, `shadow-lg`
- Botones: `background-color` más oscuro, `shadow-md`
- Enlaces: `color: var(--primary-400)`

**Active/Pressed:**
- Botones: `transform: scale(0.98)`, `shadow-inner`
- Cards: `transform: scale(0.99)`

**Focus:**
- Inputs: `ring-2 ring-primary-500/20`, `border-primary-500`
- Botones: `ring-2 ring-primary-500/20`

**Disabled:**
- `opacity: 0.5`
- `cursor: not-allowed`
- `pointer-events: none`

### 9.2 Estados de Contenido

**Loading:**
- Skeletons con animación shimmer
- Spinners para acciones específicas

**Empty State:**
- Mensaje claro
- Ilustración o icono
- Acción sugerida

**Error State:**
- Mensaje de error en rojo
- Icono de error
- Acción para reintentar

---

## 10. Responsive Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile grande */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop pequeño */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Desktop grande */
```

**Estrategia:** Mobile-first
- Diseño base para móviles (320px+)
- Mejoras progresivas en breakpoints mayores

---

## 11. Ejemplos de Implementación Tailwind

### 11.1 Configuración Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          // ... resto de la paleta
          500: '#d7123a',
          // ...
        },
        secondary: {
          // ... paleta secundaria
          500: '#f5b400',
        },
        neutral: {
          // ... paleta neutra
        },
        success: '#2ecc71',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db',
      },
      backgroundColor: {
        'bg-primary': '#14090b',
        'bg-secondary': '#2a1b1f',
        'bg-tertiary': '#0d0809',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
    },
  },
}
```

### 11.2 Clases de Utilidad Comunes

```html
<!-- Botón Primario -->
<button class="bg-primary-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-600 hover:shadow-md active:bg-primary-700 transition-all duration-200">
  Comprar Entradas
</button>

<!-- Card de Película -->
<div class="bg-bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
  <!-- contenido -->
</div>

<!-- Badge ESTRENO -->
<span class="bg-primary-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase">
  ESTRENO
</span>
```

---

## 12. Accesibilidad

### 12.1 Contraste

- Texto sobre fondo oscuro: mínimo 4.5:1 (WCAG AA)
- Texto grande: mínimo 3:1
- Elementos interactivos: contraste claro

### 12.2 Navegación por Teclado

- Todos los elementos interactivos deben ser focusables
- Orden lógico de tabulación
- Indicadores de foco visibles

### 12.3 ARIA Labels

- Botones sin texto: `aria-label` descriptivo
- Estados: `aria-selected`, `aria-disabled`, `aria-expanded`
- Regiones: `aria-label` en secciones importantes

---

## 13. Recursos Adicionales

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Inter Font](https://rsms.me/inter/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)


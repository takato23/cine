# Product Requirements Document (PRD)
## Cinema Pergamino - Webapp

**Versión:** 1.0  
**Fecha:** 2024  
**Autor:** Equipo de Desarrollo

---

## 1. Visión General

### 1.1 Propósito
Cinema Pergamino es una webapp de gestión y venta de entradas de cine que permite a los usuarios explorar la cartelera, seleccionar asientos, comprar entradas y productos de confitería, todo con un diseño moderno y experiencia de usuario optimizada para dispositivos móviles.

### 1.2 Objetivos del Producto
- Proporcionar una experiencia fluida para la compra de entradas de cine
- Facilitar la selección de asientos con visualización clara del estado de disponibilidad
- Integrar la venta de productos de confitería en el flujo de compra
- Ofrecer un diseño atractivo y moderno con tema oscuro
- Garantizar pagos seguros mediante integración con Mercado Pago

### 1.3 Público Objetivo
- Usuarios de 13+ años que buscan comprar entradas de cine
- Usuarios que prefieren realizar compras desde dispositivos móviles
- Clientes que valoran una experiencia visual atractiva y fácil de usar

---

## 2. User Stories

### 2.1 Cartelera (Home)

**US-001: Ver películas en cartelera**
- **Como** usuario
- **Quiero** ver las películas disponibles actualmente en cartelera
- **Para** poder elegir qué película ver
- **Criterios de aceptación:**
  - Mostrar películas con estado "En Cartelera"
  - Mostrar poster, título, duración y rating
  - Permitir scroll horizontal para ver más películas
  - Mostrar badge "ESTRENO" si corresponde

**US-002: Ver películas próximamente**
- **Como** usuario
- **Quiero** ver las películas que se estrenarán próximamente
- **Para** planificar futuras visitas al cine
- **Criterios de aceptación:**
  - Mostrar películas con estado "Próximamente"
  - Mostrar fecha de estreno en formato "DD MMM"
  - Permitir scroll horizontal

**US-003: Ver película destacada (Hero)**
- **Como** usuario
- **Quiero** ver una película destacada con información completa
- **Para** conocer detalles de la película principal
- **Criterios de aceptación:**
  - Mostrar imagen de fondo de alta calidad
  - Mostrar título, género, duración y clasificación
  - Mostrar botón "Comprar Entradas" prominente
  - Mostrar badge "ESTRENO" si corresponde

**US-004: Navegar a detalle de película**
- **Como** usuario
- **Quiero** hacer clic en una película
- **Para** ver más información y horarios disponibles
- **Criterios de aceptación:**
  - Al hacer clic en cualquier película, navegar a su página de detalle
  - La navegación debe ser fluida y rápida

### 2.2 Detalle de Película

**US-005: Ver información completa de película**
- **Como** usuario
- **Quiero** ver todos los detalles de una película
- **Para** decidir si quiero verla
- **Criterios de aceptación:**
  - Mostrar poster/imagen destacada
  - Mostrar título, duración, género, clasificación
  - Mostrar sinopsis completa (con opción "Leer más")
  - Mostrar director e idioma
  - Mostrar botón "Ver Tráiler"
  - Mostrar botón de favoritos

**US-006: Ver horarios disponibles**
- **Como** usuario
- **Quiero** ver los horarios disponibles para una película
- **Para** elegir cuándo verla
- **Criterios de aceptación:**
  - Mostrar pestañas de días (Hoy, Mañana, etc.)
  - Mostrar nombre de la sala y formato (2D, 3D, IMAX)
  - Mostrar horarios disponibles con estado (disponible/agotado)
  - Mostrar precio general
  - Mostrar método de pago (Mercado Pago)

**US-007: Seleccionar horario**
- **Como** usuario
- **Quiero** seleccionar un horario disponible
- **Para** proceder con la compra de entradas
- **Criterios de aceptación:**
  - Al hacer clic en un horario disponible, mostrar botón "Seleccionar Asientos"
  - Los horarios agotados deben estar deshabilitados visualmente
  - Al hacer clic en "Seleccionar Asientos", navegar a la selección de asientos

### 2.3 Selección de Asientos

**US-008: Ver mapa de asientos**
- **Como** usuario
- **Quiero** ver el mapa de asientos de la sala
- **Para** elegir dónde sentarme
- **Criterios de aceptación:**
  - Mostrar pantalla en la parte superior
  - Mostrar filas identificadas con letras (A, B, C, etc.)
  - Mostrar asientos con estados visuales distintos:
    - Disponible (estándar): gris
    - Disponible (VIP): dorado/amarillo
    - Ocupado: azul oscuro
    - Seleccionado: rojo con número de orden
  - Mostrar leyenda de estados

**US-009: Seleccionar asientos**
- **Como** usuario
- **Quiero** seleccionar múltiples asientos
- **Para** comprar entradas para mí y acompañantes
- **Criterios de aceptación:**
  - Al hacer clic en asiento disponible, marcarlo como seleccionado
  - Mostrar número de orden en asientos seleccionados
  - Permitir deseleccionar asientos
  - Actualizar resumen de selección en tiempo real
  - Mostrar total a pagar actualizado

**US-010: Ver resumen de selección**
- **Como** usuario
- **Quiero** ver un resumen de mi selección
- **Para** confirmar antes de continuar
- **Criterios de aceptación:**
  - Mostrar cantidad de entradas seleccionadas
  - Mostrar números de asientos y tipo (VIP/General)
  - Mostrar total a pagar
  - Mostrar botón "Continuar a Candy Bar" o "Continuar a Pago"

### 2.4 Confitería (Candy Bar)

**US-011: Ver productos de confitería**
- **Como** usuario
- **Quiero** ver los productos disponibles en confitería
- **Para** agregar snacks a mi compra
- **Criterios de aceptación:**
  - Mostrar categorías: Todos, Combos, Bebidas, Pochoclos
  - Mostrar productos con imagen, nombre, descripción y precio
  - Mostrar promociones destacadas (banners)
  - Permitir filtrar por categoría

**US-012: Agregar productos al carrito**
- **Como** usuario
- **Quiero** agregar productos de confitería a mi compra
- **Para** completar mi experiencia en el cine
- **Criterios de aceptación:**
  - Mostrar selector de cantidad (+/-) para cada producto
  - Actualizar cantidad en tiempo real
  - Mostrar total acumulado en barra inferior
  - Mostrar badge con cantidad de items en carrito

**US-013: Ver promociones**
- **Como** usuario
- **Quiero** ver las promociones activas
- **Para** aprovechar ofertas especiales
- **Criterios de aceptación:**
  - Mostrar banners de promociones destacadas
  - Mostrar badges de promoción en productos
  - Aplicar descuentos automáticamente al total

**US-014: Continuar al checkout**
- **Como** usuario
- **Quiero** continuar al resumen de compra
- **Para** finalizar mi compra
- **Criterios de aceptación:**
  - Mostrar total a pagar en barra inferior fija
  - Al hacer clic en "Continuar", navegar al resumen de compra
  - Mantener selección de asientos y productos

### 2.5 Resumen de Compra y Pago

**US-015: Ver resumen completo de compra**
- **Como** usuario
- **Quiero** ver un resumen completo de mi compra
- **Para** verificar antes de pagar
- **Criterios de aceptación:**
  - Mostrar detalles de la película (título, fecha, hora, sala)
  - Mostrar asientos seleccionados
  - Mostrar productos de confitería agregados
  - Mostrar desglose de precios (entradas, productos, cargo por servicio)
  - Mostrar total a pagar destacado

**US-016: Ver tiempo restante para pagar**
- **Como** usuario
- **Quiero** ver cuánto tiempo tengo para completar el pago
- **Para** saber si debo apurarme
- **Criterios de aceptación:**
  - Mostrar countdown en minutos y segundos
  - Actualizar en tiempo real
  - Mostrar advertencia visual cuando quede poco tiempo

**US-017: Pagar con Mercado Pago**
- **Como** usuario
- **Quiero** pagar con Mercado Pago
- **Para** completar mi compra de forma segura
- **Criterios de aceptación:**
  - Mostrar botón de Mercado Pago
  - Mostrar código QR para escanear
  - Mostrar instrucciones de pago
  - Procesar pago de forma segura
  - Confirmar pago exitoso

**US-018: Compartir o cancelar orden**
- **Como** usuario
- **Quiero** compartir o cancelar mi orden
- **Para** coordinar con otros o cancelar si es necesario
- **Criterios de aceptación:**
  - Mostrar opción "Compartir orden"
  - Mostrar opción "Cancelar pedido"
  - Confirmar cancelación antes de ejecutarla

---

## 3. Flujos Principales

### 3.1 Flujo de Compra de Entradas

```
1. Usuario llega a la home (cartelera)
   ↓
2. Usuario selecciona una película
   ↓
3. Usuario ve detalle de película y horarios
   ↓
4. Usuario selecciona día y horario
   ↓
5. Usuario selecciona asientos
   ↓
6. Usuario puede agregar productos de confitería (opcional)
   ↓
7. Usuario ve resumen de compra
   ↓
8. Usuario paga con Mercado Pago
   ↓
9. Usuario recibe confirmación
```

### 3.2 Flujo Alternativo: Solo Confitería

```
1. Usuario navega a "Confitería" desde el menú inferior
   ↓
2. Usuario explora productos y promociones
   ↓
3. Usuario agrega productos al carrito
   ↓
4. Usuario continúa al checkout
   ↓
5. Usuario paga con Mercado Pago
   ↓
6. Usuario recibe confirmación
```

### 3.3 Flujo de Exploración

```
1. Usuario explora cartelera
   ↓
2. Usuario ve películas "En Cartelera"
   ↓
3. Usuario ve películas "Próximamente"
   ↓
4. Usuario puede ver tráileres
   ↓
5. Usuario puede marcar películas como favoritas
```

---

## 4. Requisitos Funcionales

### 4.1 Navegación
- Menú inferior fijo con 3 secciones: Cartelera, Confitería, Entradas
- Navegación hacia atrás desde cualquier pantalla
- Breadcrumbs opcionales en pantallas profundas

### 4.2 Búsqueda y Filtros
- Filtro por categoría en confitería (Todos, Combos, Bebidas, Pochoclos)
- Filtro por fecha en horarios (Hoy, Mañana, etc.)
- Búsqueda de películas (futuro)

### 4.3 Estados y Feedback
- Estados de carga (skeletons) mientras se cargan datos
- Estados de error con mensajes claros
- Feedback visual en todas las interacciones (hover, click, selección)
- Confirmaciones para acciones críticas (cancelar orden)

### 4.4 Responsive Design
- Diseño mobile-first
- Optimizado para pantallas pequeñas (320px+)
- Adaptación a tablets y desktop (futuro)

---

## 5. Requisitos No Funcionales

### 5.1 Performance
- Tiempo de carga inicial < 3 segundos
- Transiciones fluidas (60fps)
- Lazy loading de imágenes
- Optimización de imágenes (WebP, responsive)

### 5.2 Accesibilidad
- Contraste mínimo WCAG AA
- Navegación por teclado
- Etiquetas ARIA apropiadas
- Textos alternativos en imágenes

### 5.3 Seguridad
- Pagos seguros con Mercado Pago
- Validación de datos en frontend y backend
- Protección contra XSS y CSRF
- HTTPS obligatorio

### 5.4 Compatibilidad
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Android Chrome 80+

---

## 6. Integraciones

### 6.1 Mercado Pago
- Integración para procesamiento de pagos
- Generación de códigos QR
- Webhooks para confirmación de pagos
- Manejo de estados de pago (pendiente, aprobado, rechazado)

### 6.2 Backend API
- Endpoints para películas, horarios, asientos
- Endpoints para productos de confitería
- Endpoints para órdenes y pagos
- Autenticación y autorización

---

## 7. Métricas de Éxito

### 7.1 Métricas de Negocio
- Tasa de conversión (visitas → compras)
- Tiempo promedio de compra
- Abandono de carrito
- Tasa de finalización de pago

### 7.2 Métricas Técnicas
- Tiempo de carga de página
- Tasa de error
- Tiempo de respuesta de API
- Uptime del servicio

---

## 8. Roadmap Futuro

### Fase 2
- Sistema de favoritos
- Historial de compras
- Notificaciones push
- Programa de fidelidad

### Fase 3
- Búsqueda avanzada de películas
- Recomendaciones personalizadas
- Reseñas y calificaciones
- Compartir en redes sociales

---

## 9. Glosario

- **Cartelera**: Lista de películas actualmente en exhibición
- **Próximamente**: Películas que se estrenarán en el futuro
- **Sala**: Espacio físico donde se proyecta la película
- **Asiento VIP**: Asiento con características premium (mejor ubicación, más cómodo)
- **Confitería/Candy Bar**: Área de venta de snacks y bebidas
- **Combo**: Paquete que incluye múltiples productos con descuento
- **Mercado Pago**: Plataforma de pagos online utilizada para procesar transacciones

---

## 10. Referencias

- Mockups de diseño (imágenes de referencia)
- Documentación técnica del backend
- Documentación de API de Mercado Pago
- Guías de diseño y animación (ver `design-guidelines.md` y `animation-guidelines.md`)


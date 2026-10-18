# Manual de Identidad Visual: DexNR (Noir Room)

**Concepto:** Minimalismo técnico, oscuro y estilizado (*Flat Noir*).  
**Filosofía de diseño:** Cero *glows* (resplandores), cero sombras difuminadas en la interfaz. La profundidad y el estilo se logran mediante **contrastes de color planos**, **bordes nítidos de 1px** y una **jerarquía tipográfica fuerte**. El único elemento orgánico/visual es el agujero negro del fondo en la Landing; toda la interfaz que flota sobre él es estrictamente *flat*, geométrica y precisa.

---

## 1. Paleta de Colores (Flat Dark)

Al no usar sombras ni brillos, la diferencia entre el fondo y las tarjetas depende de saltos sutiles de luminosidad en los grises oscuros y de los bordes sólidos.

### Fondos (Superficies)
| Rol | Color | Hex | Uso específico |
| :--- | :--- | :--- | :--- |
| **Bg Base (Noir)** | Negro Azulado Profundo | `#07080A` | Fondo principal de toda la web y área `Main` de Docs. |
| **Bg Elevated** | Gris Carbón Frío | `#0E1015` | Fondo de tarjetas, buscador, Sidebar y bloques de pasos. |
| **Bg Sunken** | Negro Puro | `#000000` | Bloques de código, *callouts* o contenedores de capturas. |
| **Bg Hover** | Gris Oscuro Sólido | `#161922` | Cambio de color plano al pasar el ratón sobre tarjetas o botones. |

### Bordes (La clave del estilo Flat)
| Rol | Color | Hex | Uso específico |
| :--- | :--- | :--- | :--- |
| **Border Subtle** | Gris Pizarra Oscuro | `#1C2029` | Línea divisoria de 1px para tarjetas, Sidebar, Navbar y TOC. |
| **Border Hover** | Gris Medio | `#2E3440` | Borde de tarjetas secundarias en estado `hover`. |
| **Border Accent** | Cyan / Azul Rey Claro | `#00D8FF` | Borde sólido de 1px para elementos activos o seleccionados. |

### Textos y Acentos
| Rol | Color | Hex | Uso específico |
| :--- | :--- | :--- | :--- |
| **Text Primary** | Blanco Puro | `#FFFFFF` | Títulos (`H1`, `H2`, `H3`), enlaces activos y texto principal. |
| **Text Body** | Gris Claro Neutro | `#A1A7B3` | Párrafos de tutoriales y explicaciones largas (descansa la vista). |
| **Text Muted** | Gris Apagado | `#5A6270` | Enlaces inactivos del Sidebar/TOC, fechas, etiquetas secundarias. |
| **Accent Primary** | Cyan Eléctrico Plano | `#00D8FF` | Indicadores activos, badges, iconos puntuales y detalles de 1px-2px. |
| **Accent Secondary**| Azul Rey Claro | `#3B82F6` | Enlaces dentro del texto de los tutoriales o acento secundario. |
| **Accent Surface** | Azul Ultra Oscuro | `#081C24` | Fondo plano para etiquetas (badges) o alertas informativas. |

---

## 2. Tipografía

El contraste entre una fuente pesada/geométrica y una fuente de lectura limpia define el carácter de **DexNR**.

### Títulos y Branding: `Montserrat`
* **Peso principal:** `Black (900)`
* **Regla de oro:** Usar `letter-spacing: -0.03em` (tracking negativo) en títulos grandes para que se vea compacta, moderna y editorial.
* **Uso de mayúsculas:** 
  * **Hero de la Landing:** Puede ir en MAYÚSCULAS para máximo impacto.
  * **Títulos de Tutoriales (`H1`):** Usar *Sentence case* (mayúscula solo al inicio) para facilitar la lectura rápida de temas variados.
* **Subtítulos (`H2`, `H3`):** Bajar a `Montserrat Bold (700)` con `letter-spacing: -0.02em`.

### Cuerpo de Texto y UI: `Inter` (o `Plus Jakarta Sans`)
* **Peso normal:** `Regular (400)` para párrafos de los tutoriales (`16px`, altura de línea `1.65`).
* **Peso UI:** `Medium (500)` para enlaces del Sidebar, TOC y botones (`14px`).

### Código y Atajos: `JetBrains Mono`
* Para comandos de consola, rutas de archivos en Windows/Android y atajos de teclado (ej. `Cmd + K`, `Win + R`).

---

## 3. Reglas de Componentes (100% Flat)

### Botones
* **Primario (Flat Solid):** Fondo `#00D8FF` (Cyan), texto `#07080A` (Negro) en `Inter SemiBold`, `border-radius: 6px`. En `hover`, cambia de forma plana a `#38E2FF` (sin sombras).
* **Secundario (Flat Outline):** Fondo `#0E1015`, borde sólido `1px solid #1C2029`, texto `#FFFFFF`. En `hover`, el borde cambia instantáneamente a `1px solid #00D8FF` y el fondo a `#161922`.

### Tarjetas de Categorías / Tutoriales
* **Estructura:** Fondo `#0E1015`, borde `1px solid #1C2029`, `border-radius: 8px`, padding interno amplio (`24px`).
* **Interacción (`hover`):** Sin elevación ni brillo. El borde cambia de `#1C2029` a `#00D8FF` (o `#3B82F6`) y el icono interior pasa de gris `#5A6270` a `#00D8FF`.
* **Badges de categoría (JUEGOS, ANDROID, PC):** Pastillas rectangulares (`border-radius: 4px`), fondo plano `#081C24`, borde `1px solid #00D8FF`, texto en `Montserrat Bold` de `10px` en mayúsculas con `letter-spacing: 0.08em` color `#00D8FF`.

---

## 4. Diseño de la Landing Page

1. **Fondo del Agujero Negro:**
   * Se mantiene como el único elemento artístico en el fondo del Hero. Para integrarlo al estilo *flat* de la UI, asegúrate de que hacia los bordes inferiores se funda completamente con el color base `#07080A`.
2. **Navbar Superior:**
   * Altura `64px`, fondo sólido `#07080A` (o transparente en el tope), separado del contenido únicamente por una línea inferior `1px solid #1C2029`.
   * Logo **DexNR** a la izquierda en `Montserrat Black` (`20px`): "Dex" en `#FFFFFF` y "NR" en `#00D8FF`.
3. **Hero Section:**
   * Título principal en `Montserrat Black` (`48px` a `64px`), color blanco puro `#FFFFFF` sólido.
   * **Buscador Flat (`Cmd + K`):** Caja grande centrada o alineada a la izquierda, fondo `#0E1015`, borde `1px solid #1C2029`, `border-radius: 8px`. El badge `Cmd + K` a la derecha tiene fondo `#07080A` y borde `#1C2029`. Cuando el usuario hace clic (`focus`), el borde del buscador cambia a `1px solid #00D8FF` sin ningún resplandor exterior.
4. **Grid de Categorías:**
   * Cuadrícula limpia de 3 o 4 columnas con separación (`gap`) de `16px`. Tarjetas con iconos geométricos de línea fina (`stroke-width: 1.5px`).

---

## 5. Diseño de la Vista de Docs (Tutoriales)

La vista se divide en 3 columnas separadas por líneas verticales continuas de `1px solid #1C2029`. El agujero negro aquí no está presente; el fondo es `#07080A` puro.

### A. Sidebar Izquierdo (Ancho: `260px`)
* **Grupos de secciones:** Títulos en `Montserrat Bold` (`11px`, mayúsculas, color `#5A6270`, `letter-spacing: 0.08em`).
* **Lista de enlaces:** Fuente `Inter Medium` (`14px`), color `#A1A7B3`.
* **Estado Activo (Flat):** 
  * El enlace activo tiene texto `#FFFFFF`.
  * Fondo de fila plano en `#0E1015`.
  * A la izquierda del enlace, una **barra vertical sólida de `2px` de ancho** en color `#00D8FF` (sin difuminar).

### B. Main - Contenido del Tutorial (Ancho máx. de lectura: `760px` centrado)
* **Encabezado del artículo:**
  * Arriba del título: Badge plano con la categoría (ej. `WINDOWS` o `MÓVIL`).
  * Título `H1` en `Montserrat Black` (`36px`), color `#FFFFFF`, seguido de una línea divisoria `1px solid #1C2029`.
* **Pasos Numerados (Signature Style de DexNR):**
  * Para explicar tutoriales paso a paso, coloca el número a la izquierda (`01`, `02`, `03`) en `Montserrat Black` (`28px`), color plano `#1C2029` (gris muy oscuro para que sea minimalista) o `#00D8FF` si quieres más contraste.
* **Cajas de Descarga / Recomendación de Apps:**
  * Contenedor con fondo `#0E1015`, borde izquierdo grueso de `3px solid #00D8FF` y el resto de los bordes en `1px solid #1C2029`. Adentro va el nombre del programa/juego, peso o plataforma, y un botón *flat* de descarga a la derecha.
* **Capturas de Pantalla (Móvil / PC):**
  * Nunca pongas la imagen suelta. Colócala dentro de un marco contenedor con `padding: 16px`, fondo `#000000` (negro puro) y borde `1px solid #1C2029` (`border-radius: 8px`). Así cualquier captura blanca o colorida de un teléfono o juego se verá enmarcada y ordenada dentro del estilo *Noir*.

### C. TOC Derecho - "En esta página" (Ancho: `220px`)
* **Título:** `EN ESTA PÁGINA` en `Montserrat Bold` (`11px`, color `#FFFFFF`, `letter-spacing: 0.08em`).
* **Barra de seguimiento Flat:**
  * Una línea vertical continua a la izquierda de `1px solid #1C2029`.
  * La sección que el usuario está leyendo actualmente cambia su tramo de línea a `2px solid #00D8FF` y el texto pasa de `#5A6270` a `#00D8FF` (todo mediante cortes limpios, sin puntos brillantes).

---

## 6. Variables CSS Base (Listas para copiar)

```css
:root {
  /* Fondos */
  --bg-noir: #07080A;
  --bg-surface: #0E1015;
  --bg-sunken: #000000;
  --bg-hover: #161922;

  /* Bordes (100% Flat) */
  --border-subtle: #1C2029;
  --border-hover: #2E3440;
  --border-accent: #00D8FF;

  /* Textos */
  --text-primary: #FFFFFF;
  --text-body: #A1A7B3;
  --text-muted: #5A6270;

  /* Acentos */
  --accent-cyan: #00D8FF;
  --accent-blue: #3B82F6;
  --accent-surface: #081C24;

  /* Tipografía */
  --font-display: 'Montserrat', sans-serif;
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radios */
  --radius-sm: 4px;
  --radius-md: 8px;
}
```
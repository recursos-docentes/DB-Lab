# E-R Constructor Pro — UTU 2026

Herramienta interactiva para practicar diagramas **Entidad-Relación** (notación Chen) en el aula.  
Diseñada por **Prof. Elizabeth Izquierdo** con asistencia de Claude — [licencia CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

🌐 **Demo en vivo:** https://recursos-docentes.github.io/merTutor/

---

## ¿Cómo funciona?

- El alumno elige un nivel desde `index.html`.
- Se abre `er-designer.html` con el diagrama prearmado pero con los nombres **en blanco**.
- Se selecciona una palabra del banco y se hace clic en el nodo correspondiente.
- Al pulsar **Corregir Diagrama** se muestra la calificación sobre 10.
- Se puede guardar el diagrama completo como **PNG**.

---

## Agregar un nuevo ejercicio

Todo está en `er-designer.html`, dentro del array `exercises` (cerca de la línea 327).  
Cada ejercicio es un objeto JavaScript. Seguí este esquema:

```js
{
    title: "Caso N: Nombre del ejercicio",

    description: `HTML con el enunciado del problema. Usá <strong> para resaltar conceptos.`,

    hint: "Sugerencia pedagógica visible al pulsar 'Ver pista de diseño'.",

    // Palabras que se muestran en el banco (se mezclan al azar).
    // Incluí todas las respuestas correctas + las cardinalidades que uses (1, N, M).
    wordBank: ["ENTIDAD_A", "ENTIDAD_B", "relacion", "Atrib1", "Atrib2", "1", "N"],

    nodes: [
        // ── Entidad (rectángulo azul) ──────────────────────────────────
        { id: "e1", type: "entity", correctValue: "ENTIDAD_A", x: 20, y: 50, w: 120, h: 52 },

        // ── Relación (rombo rosa) ──────────────────────────────────────
        { id: "r1", type: "relation", correctValue: "relacion", x: 50, y: 50, w: 85, h: 85 },

        // ── Atributo simple (óvalo verde) ──────────────────────────────
        { id: "a1", type: "attribute", isKey: false, correctValue: "Atrib1", x: 20, y: 22, w: 85, h: 40 },

        // ── Atributo clave PK (óvalo con texto subrayado) ──────────────
        { id: "pk1", type: "attribute", isKey: true, correctValue: "Id", x: 10, y: 22, w: 75, h: 40 },

        // ── Atributo multivaluado (óvalo con borde doble) ──────────────
        { id: "mv1", type: "attribute", isMultivalued: true, correctValue: "Teléfonos", x: 30, y: 22, w: 90, h: 42 },

        // ── Atributo derivado / calculado (óvalo con borde punteado) ───
        { id: "dv1", type: "attribute", isDerived: true, correctValue: "Edad", x: 40, y: 22, w: 75, h: 40 },

        // ── Cardinalidad (círculo flotante sobre la línea) ─────────────
        { id: "c1", type: "cardinality", correctValue: "1", x: 35, y: 50, w: 30, h: 30 },
        { id: "c2", type: "cardinality", correctValue: "N", x: 65, y: 50, w: 30, h: 30 },

        // ── Triángulo ISA — especialización, sin input interactivo ──────
        { id: "isa1", type: "isa", x: 28, y: 62, w: 70, h: 56 }
    ],

    connections: [
        // Cada par { from, to } dibuja una línea entre los dos nodos.
        // Usá los `id` definidos en nodes[].
        { from: "pk1", to: "e1"   },   // atributo PK → entidad
        { from: "a1",  to: "e1"   },   // atributo → entidad
        { from: "e1",  to: "r1"   },   // entidad ↔ relación
        { from: "r1",  to: "e2"   },
        { from: "e1",  to: "isa1" },   // entidad → triángulo ISA
        { from: "isa1","to": "e3" },   // ISA → subentidad

        // Atributo COMPUESTO: los componentes se conectan al atributo padre,
        // no a la entidad directamente.
        { from: "comp1",         to: "nombre_completo" },
        { from: "comp2",         to: "nombre_completo" },
        { from: "nombre_completo", to: "e1"            }
    ]
}
```

### Posicionamiento de nodos

| Propiedad | Descripción |
|-----------|-------------|
| `x` | Centro horizontal en **%** del ancho del canvas (mínimo 1060 px). |
| `y` | Centro vertical en **%** de la altura del canvas (540 px). |
| `w` | Ancho del nodo en **px**. Guía: entidad 110–120 · relación 80–90 · atributo 75–110 · cardinalidad 30. |
| `h` | Alto del nodo en **px**. Guía: entidad 52 · relación igual a `w` · atributo 38–44 · cardinalidad 30. |

**Distribución vertical típica:**

```
  y ≈  6%  →  atributos componentes (nivel muy alto, p.ej. Primer_nom)
  y ≈ 15%  →  atributo compuesto padre / atributos secundarios
  y ≈ 22%  →  atributos principales (PK, etc.)
  y ≈ 45%  →  entidades y relaciones  ← fila principal
  y ≈ 72%  →  atributos de relación / atributos multivaluados
  y ≈ 79%  →  segunda fila de atributos inferiores
```

### Registrar el ejercicio en el selector

En `er-designer.html`, buscá el `<select id="exercise-select">` y agregá:

```html
<option value="N">🏷️ Nombre del caso</option>
```

Donde `N` es el índice del ejercicio en el array (empieza en `0`).

### Registrar el ejercicio en la página de inicio

En `index.html`, podés cambiar el `href` de la tarjeta de nivel para que apunte al nuevo ejercicio:

```html
<a href="er-designer.html?ejercicio=N" ...>
```

---

## Estructura de archivos

```
logicTutor/
├── index.html        ← Página de bienvenida (niveles Básico / Medio / Experto)
├── er-designer.html  ← Aplicación principal con todos los ejercicios
└── README.md         ← Este archivo
```

---

## Ejercicios disponibles

| # | Caso | Nivel | Características |
|---|------|-------|----------------|
| 0 | Taller Mecánico | Básico | 3 entidades, N:M, atributos de relación |
| 1 | Biblioteca Escolar | Básico | 2 entidades, N:M, atributos de relación |
| 2 | Tienda Online | Básico | 2 entidades, 1:N simple |
| 3 | Red Social | Medio | ISA, subentidades, multivaluado |
| 4 | Plataforma Streaming | Básico | Atributo compuesto, multivaluado, 3 entidades |

---

## Tecnologías

- **Tailwind CSS** (CDN) — estilos
- **html2canvas 1.4.1** (CDN) — exportación PNG
- JavaScript vanilla — sin frameworks ni dependencias de build

---

## Licencia

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Podés usar, adaptar y redistribuir con atribución y bajo la misma licencia.

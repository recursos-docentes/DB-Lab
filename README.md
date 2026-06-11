# DB-Lab — UTU 2026

Herramienta interactiva para practicar diagramas **Entidad-Relación** (notación Chen) en el aula.  
Diseñada por **Prof. Elizabeth Izquierdo** con asistencia de Claude — [licencia CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

🌐 **Demo en vivo:** https://recursos-docentes.github.io/DB-Lab/

---

## Flujo de aprendizaje (3 etapas)

Cada ejercicio tiene tres etapas accesibles desde los botones superiores:

| Etapa | Descripción |
|-------|-------------|
| 📋 **Analizar el problema** | El estudiante lee el enunciado completo y clasifica cada término (entidad, atributo, relación) desde un panel lateral. Incluye subtipificación (clave, simple, multivaluado, compuesto, de relación, derivado; fuerte/débil). |
| 🔗 **Diseño E-R** | Arma el diagrama colocando los nombres en los nodos vacíos. Puede validar y guardar como PNG. |
| 📊 **Pasaje a tablas** | *(Próximamente)* Convierte el modelo a tablas relacionales. |

---

## Modos de uso

### 📚 Ejercitación (por defecto)
- Cada etapa permite **hasta 3 intentos**. Al agotar los intentos, el botón se bloquea y los elementos quedan en solo lectura (fichas del analizador, banco de palabras e inputs del diagrama).
- El historial de puntajes (Intento 1 / 2 / 3) se muestra en el banner de feedback y se incluye al pie del PNG al guardar.
- Para avanzar al Diseño E-R se requiere al menos **50% correcto** en el análisis (o haber agotado los 3 intentos).

### 📝 Evaluación
Activado por el docente mediante el parámetro `?ex=1` en la URL. **No hay ningún indicador visible** en pantalla.

```
er-designer.html?ejercicio=2&ex=1
```

- Cada botón de corrección (análisis y diagrama) se puede usar **una sola vez**.
- Al evaluar, se habilita automáticamente el siguiente tab sin importar el puntaje.
- El modo persiste en `sessionStorage` aunque el estudiante refresque la página.

---

## Funcionalidades del análisis de texto

- **Fichas de términos** a clasificar en un panel lateral (el enunciado queda limpio y legible).
- **Dos pasos** para atributos: primero elegir "Atributo", luego el subtipo.
  - Subtipos disponibles: Simple, Clave, De relación, Compuesto, Multivaluado, Derivado.
  - Los subtipos se muestran **solo si existen en ese ejercicio** (opciones dinámicas).
  - En ejercicios básicos (0–2) **no se pregunta subtipo**: solo Entidad / Atributo / Relación.
- **Tres pasos** para atributos compuestos: identifica el tipo, luego selecciona los componentes.
- **Entidades:** si el ejercicio solo tiene entidades fuertes, se clasifican directo sin preguntar subtipo.
- **Estado persistente:** al cambiar al tab de Diseño E-R y volver, la clasificación se mantiene.
- **Historial de intentos:** muestra el puntaje de cada intento (hasta 3) en el banner y en el PNG exportado.
- **Ver respuestas:** después de 2 intentos fallidos en modo ejercitación.

---

## Accesibilidad y soporte para estudiantes con dificultades

| Función | Descripción |
|---------|-------------|
| 📖 **Conceptos E-R** | Modal con teoría sobre entidades, atributos, relaciones, cardinalidad, totalidad y más. |
| 📚 **Glosario** | Modal con formas SVG y definición de cada concepto E-R. |
| ? **Tutorial** | Modal de 4 pasos automático en el primer uso, reabrble con `?`. |
| 💡 **Ver respuestas** | Aparece tras 2 intentos fallidos en modo ejercitación. |
| ⬆️ **Comparación de intentos** | Muestra si mejoró, empeoró o se mantuvo respecto al intento anterior. |

---

## Estructura de archivos

```
merTutor-main/
├── index.html               ← Página de inicio con ejercicios por concepto
├── er-designer.html         ← Aplicación principal (Analizar → Diseño E-R → Tablas)
├── exercises.js             ← Datos: exercises[], analyzeData[], analyzeConfig[]
├── script.js                ← UI: variables globales, loadExercise(), canvas render
├── diagram.js               ← Diagrama: drawCrispConnectors(), validación, PNG
├── analysis.js              ← Análisis: modo eval, panel de clasificación
├── styles.css               ← Estilos personalizados
├── add-exercise-wizard.html ← Asistente para crear nuevos ejercicios
└── README.md                ← Este archivo
```

> **Nota sobre caché:** Los archivos JS se cargan con `?t=2` en `er-designer.html` e `index.html`. Al subir cambios que los estudiantes no ven reflejados, incrementar ese número.

---

## Ejercicios disponibles

| Índice | Caso | Concepto | Estado |
|--------|------|---------|--------|
| 0 | 🔧 Taller Mecánico | Atributos especiales (relación) | ✅ |
| 1 | 📚 Biblioteca Escolar | Atributos especiales (relación) | ✅ |
| 2 | 🛒 Tienda Online | Relaciones simples | ✅ |
| 3 | 🌐 Red Social | Generalización/ISA | ✅ |
| 4 | Plataforma Streaming | Atributos especiales | ✅ |
| 5 | 🏥 Sistema Hospitalario | Relaciones simples | ✅ |
| 6 | Institución educativa | Atributos especiales | ✅ |
| 7 | Colegio | Totalidad / Participación | ✅ |
| 8 | Película | Entidad débil | ✅ |
| 9 | Fútbol | Autorelación | ✅ |

---

## Agregar un nuevo ejercicio

### Método rápido: Asistente visual

Abrir `add-exercise-wizard.html` en el navegador. Genera automáticamente el código para los 4 bloques que hay que pegar.

Para autorelación, la sintaxis en el campo de relaciones es:
```
juega_con | CLUB | CLUB | >locatario | >visitante | FechaPartido
```
(entidad1 = entidad2, roles con prefijo `>`, atributos de relación al final)

---

### Método manual

#### Paso 1 — Código del ejercicio (`exercises.js`)

Agregar al final del array `exercises[]` en `exercises.js`, antes del `];` y separado por coma:

```js
{
    title: "Nombre del ejercicio",
    description: `HTML con el enunciado.`,
    hint: "Sugerencia pedagógica.",
    wordBank: ["ENTIDAD_A", "ENTIDAD_B", "relacion", "Atrib1", "1", "N"],
    nodes: [
        { id: "e1", type: "entity",      correctValue: "ENTIDAD_A",  x: 20, y: 50, w: 110, h: 52 },
        { id: "r1", type: "relation",    correctValue: "relacion",   x: 50, y: 50, w: 80,  h: 80 },
        { id: "a1", type: "attribute",   isKey: false, correctValue: "Atrib1", x: 20, y: 22, w: 92, h: 40 },
        { id: "pk", type: "attribute",   isKey: true,  correctValue: "Id",     x: 10, y: 22, w: 92, h: 40 },
        { id: "mv", type: "attribute",   isMultivalued: true, correctValue: "Tags", x: 30, y: 22, w: 92, h: 40 },
        { id: "dv", type: "attribute",   isDerived: true,     correctValue: "Edad", x: 40, y: 22, w: 92, h: 40 },
        { id: "c1", type: "cardinality", correctValue: "1",  x: 35, y: 50, w: 30, h: 30 },
        { id: "c2", type: "cardinality", correctValue: "N",  x: 65, y: 50, w: 30, h: 30 },
        { id: "t1", type: "totalidad",   correctValue: "S",  x: 32, y: 45, w: 28, h: 24 }
    ],
    connections: [
        { from: "pk", to: "e1" },
        { from: "a1", to: "e1" },
        { from: "e1", to: "r1" },
        { from: "r1", to: "e2" }
    ],
    // METADATOS
    concept: "relaciones_simples",
    availableFor: ["class", "home", "eval"],
    enabled: true
}
```

##### Posicionamiento de nodos

| Propiedad | Descripción |
|-----------|-------------|
| `x` | Centro horizontal en **%** del canvas (canvas = 1060 px). |
| `y` | Centro vertical en **%** del canvas (canvas = 540 px). |
| `w` / `h` | Tamaño en px. Guía: entidad 110 · relación 80 (autorelación 100) · atributo 92 · cardinalidad 30. |

```
y ≈  6%  →  sub-atributos de compuesto
y ≈ 22%  →  atributos principales (PK, etc.)
y ≈ 45%  →  entidades y relaciones  ← fila principal
y ≈ 72%  →  atributos de relación / multivaluados
```

##### Autorelación

Entidad y relación comparten la misma `y`. El rombo usa `w: 100, h: 100`. Las conexiones llevan `role`. Las cardinalidades van en `y: 20` (superior) y `y: 40` (inferior):

```js
{ id: "e_0",   type: "entity",      correctValue: "CLUB",      x: 30, y: 30, w: 110, h: 52 },
{ id: "r_1",   type: "relation",    correctValue: "juega_con", x: 60, y: 30, w: 100, h: 100 },
{ id: "c_top", type: "cardinality", correctValue: "N",         x: 43, y: 20, w: 30,  h: 30 },
{ id: "c_bot", type: "cardinality", correctValue: "N",         x: 43, y: 40, w: 30,  h: 30 },
// Conexiones
{ from: "e_0", to: "r_1", role: "locatario" },
{ from: "r_1", to: "e_0", role: "visitante" },
```

##### Totalidad (participación)

Nodos `type: "totalidad"` con `correctValue: "S"` (total) o `"N"` (parcial). Posicionar entre la entidad y la relación. El diagrama dibuja el círculo doble automáticamente al validar.

##### Visibilidad (`enabled`)

- `enabled: true` → aparece en `index.html`
- `enabled: false` → accesible desde `er-designer.html` pero no en la página de inicio

---

#### Paso 2 — Análisis de términos (`exercises.js`)

Agregar al array `analyzeData[]` en la **misma posición** que el ejercicio. Cada elemento es un string o un objeto término:

```js
{ word: "término", type: "entidad|atributo|relacion", entityType: "fuerte|débil", attrType: "simple|clave|compuesto|multivaluado|derivado|relacion" }
```

**Reglas:**
- `entityType` → siempre en entidades (`"fuerte"` o `"débil"`).
- `attrType` → siempre en atributos.

```js
[
    "Un hospital desea registrar sus médicos y pacientes.\n\n",
    "• De cada ", { word:"Médico", type:"entidad", entityType:"fuerte" }, " se guarda ",
    { word:"matricula", type:"atributo", attrType:"clave" }, ", ",
    { word:"nombre",    type:"atributo", attrType:"simple" }, ".\n",
    "• Un médico puede ", { word:"atender", type:"relacion" }, " muchos pacientes.\n"
]
```

> ⚠️ **Importante:** `exercises[]`, `analyzeData[]` y `analyzeConfig[]` deben tener exactamente el mismo número de entradas alineadas por índice. Una **coma faltante** entre entradas rompe el array en JavaScript sin error visible — verificar con la consola del navegador si algo no carga.

---

#### Paso 3 — Configuración (`exercises.js`)

Agregar al array `analyzeConfig[]` en la misma posición:

```js
{ requireSubtypes: true }   // true → pide subtipo de atributo | false → no pide
```

---

#### Paso 4 — Selectores en `er-designer.html`

Agregar la misma opción en **los dos** `<select>` del archivo (`exercise-select` y `analyze-select`):

```html
<option value="9">⚽ Fútbol</option>
```

El `value` debe ser el índice del ejercicio en `exercises[]`.

---

#### Paso 5 — Página de inicio (`index.html`)

Si `enabled: true` y `concept` está definido con una sección activa, el botón aparece automáticamente. No se requiere código adicional.

Secciones activas en `index.html`:

| `concept` | Sección visible |
|-----------|----------------|
| `relaciones_simples` | Entidades, atributos y relaciones |
| `atributos_especiales` | Atributos especiales |
| `participacion` | Totalidad (participación) |
| `autorelacion` | Autorelación |
| `generalizacion` | Generalización/Categorización (ISA) |
| `entidad_debil` | Entidades débiles |

---

## Tecnologías

- **Tailwind CSS** (CDN) — estilos
- **html2canvas 1.4.1** (CDN) — exportación PNG
- JavaScript vanilla — sin frameworks ni dependencias de build

---

## Licencia

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Podés usar, adaptar y redistribuir con atribución y bajo la misma licencia.

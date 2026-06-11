# 📚 Guía: Agregar Nuevos Ejercicios a DB-Lab

## Estructura del proyecto

```
merTutor-main/
├── index.html               ← Página de inicio (ejercicios por concepto)
├── er-designer.html         ← Aplicación principal
├── exercises.js             ← ⭐ DATOS: exercises[], analyzeData[], analyzeConfig[]
├── script.js                ← UI: loadExercise(), canvas render
├── diagram.js               ← Diagrama: conectores, validación, PNG
├── analysis.js              ← Análisis: clasificación de términos
├── styles.css               ← Estilos personalizados
└── add-exercise-wizard.html ← Asistente para crear ejercicios
```

> **Todos los datos de ejercicios van en `exercises.js`**, no en `script.js`.

---

## Método 1: Asistente visual (recomendado)

Abrir `add-exercise-wizard.html` en el navegador y completar los 3 pasos.

### Paso 1 — Información general
- **Título**, **descripción**, **pista**, **concepto**
- **Casilla "Ejercicio activo"**: desmarcada → `enabled: false` (no aparece en inicio)
- **Subtipos**: marcar si el ejercicio tiene atributos compuestos, multivaluados, derivados o ISA

### Paso 2 — Entidades y relaciones

**Formato de entidades:**
```
ENTIDAD | clave_pk | atributo1 | atributo2 | ...
```
Marcar `(débil)` al final si es entidad débil. Marcar `(clave!)` después de un atributo para indicar clave compuesta.

**Formato de relaciones (normal):**
```
nombre_relacion | Entidad1 | Entidad2 | attr_relacion1
```

**Formato de autorelación** (entidad1 = entidad2, roles con `>`):
```
juega_con | CLUB | CLUB | >locatario | >visitante | FechaPartido
```

**Totalidad** (participación total): agregar `!` al nombre de la entidad en la relación:
```
trabaja_en | EMPLEADO! | DEPARTAMENTO | Fecha_inicio
```

### Paso 3 — Código generado

El asistente genera 4 bloques para copiar:

| Bloque | Dónde pegar |
|--------|-------------|
| 📝 Código del ejercicio | Al final de `exercises[]` en `exercises.js` |
| 📊 Análisis de términos | Al final de `analyzeData[]` en `exercises.js` |
| ⚙️ Configuración | Al final de `analyzeConfig[]` en `exercises.js` |
| 🔽 Opción HTML | En los dos `<select>` de `er-designer.html` |

> **Importante al pegar:** separar con coma del bloque anterior y **no dejar comas sueltas** entre entradas. Una coma extra o faltante crea un "agujero" en el array sin error visible.

---

## Método 2: Manual

### 1. Agregar el ejercicio en `exercises.js`

Al final del array `exercises[]`, antes del `];`, separado por coma:

```js
{
    title: "🏥 Sistema Hospitalario",
    description: `Enunciado en HTML. Usar <strong> para destacar conceptos.`,
    hint: "Sugerencia visible al pulsar 'Ver pista'.",
    wordBank: ["PACIENTE", "MÉDICO", "atiende", "Cédula", "Nombre", "1", "N"],
    nodes: [
        // Entidades
        { id: "e_0", type: "entity", correctValue: "PACIENTE", x: 20, y: 50, w: 110, h: 52 },
        { id: "e_1", type: "entity", correctValue: "MÉDICO",   x: 75, y: 50, w: 110, h: 52 },

        // Relación normal
        { id: "r_0", type: "relation", correctValue: "atiende", x: 50, y: 50, w: 80, h: 80 },

        // Cardinalidades
        { id: "c_0", type: "cardinality", correctValue: "N", x: 35, y: 50, w: 30, h: 30 },
        { id: "c_1", type: "cardinality", correctValue: "1", x: 65, y: 50, w: 30, h: 30 },

        // Atributos
        { id: "a_0", type: "attribute", isKey: true,  correctValue: "Cédula",  x: 10, y: 25, w: 92, h: 40 },
        { id: "a_1", type: "attribute", isKey: false, correctValue: "Nombre",  x: 20, y: 25, w: 92, h: 40 },

        // Atributo multivaluado
        { id: "a_2", type: "attribute", isMultivalued: true, correctValue: "Teléfonos", x: 30, y: 72, w: 92, h: 40 },

        // Atributo derivado
        { id: "a_3", type: "attribute", isDerived: true, correctValue: "Edad", x: 40, y: 25, w: 92, h: 40 },

        // Totalidad (S = participación total, N = parcial)
        { id: "t_0_left",  type: "totalidad", correctValue: "S", x: 32, y: 45, w: 28, h: 24 },
        { id: "t_0_right", type: "totalidad", correctValue: "N", x: 62, y: 45, w: 28, h: 24 },
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "e_0", to: "r_0" },
        { from: "r_0", to: "e_1" },
        { from: "c_0", to: "r_0" },
        { from: "c_1", to: "r_0" },
    ],
    // METADATOS
    concept: "relaciones_simples",
    availableFor: ["class", "home", "eval"],
    enabled: true
}
```

#### Tipos de nodo

| `type` | Forma visual | Propiedades especiales |
|--------|-------------|----------------------|
| `entity` | Rectángulo | `isWeak: true` para entidad débil |
| `relation` | Diamante | `isDoubleRelation: true`, `totalityLeft/Right: true` |
| `attribute` | Óvalo | `isKey`, `isMultivalued`, `isDerived` |
| `cardinality` | Círculo | — |
| `totalidad` | Botón S/N | `correctValue: "S"` o `"N"` |
| `isa` | Triángulo ISA | — |

#### Posicionamiento

| `y` aprox. | Zona |
|------------|------|
| 6% | Sub-atributos de compuesto |
| 22% | Atributos principales (PK, etc.) |
| **45–50%** | **Fila principal: entidades y relaciones** |
| 72% | Atributos de relación / multivaluados |

- `x` e `y` son porcentajes del canvas (1060 × 540 px).
- `w` / `h` en px: entidad 110, relación 80 (autorelación 100), atributo 92, cardinalidad 30.

#### Autorelación

Entidad y relación comparten la misma `y`. Rombo con `w: 100, h: 100`. Conexiones con `role`. Cardinalidades en `y: 20` (superior) y `y: 40` (inferior):

```js
{ id: "e_0",   type: "entity",      correctValue: "CLUB",      x: 30, y: 30, w: 110, h: 52 },
{ id: "r_1",   type: "relation",    correctValue: "juega_con", x: 60, y: 30, w: 100, h: 100 },
{ id: "c_top", type: "cardinality", correctValue: "N",         x: 43, y: 20, w: 30,  h: 30 },
{ id: "c_bot", type: "cardinality", correctValue: "N",         x: 43, y: 40, w: 30,  h: 30 },
// Conexiones con roles
{ from: "e_0", to: "r_1", role: "locatario" },
{ from: "r_1", to: "e_0", role: "visitante" },
```

---

### 2. Agregar en `analyzeData[]`

En la **misma posición** que el ejercicio en `exercises[]`. Cada elemento es un string de texto o un objeto término clickeable:

```js
[
    "Texto introductorio del enunciado.\n\n",
    "• De cada ", {word:"PACIENTE", type:"entidad", entityType:"fuerte"}, " se guarda ",
    {word:"Cédula", type:"atributo", attrType:"clave"}, ", ",
    {word:"Nombre", type:"atributo", attrType:"simple"}, ".\n",
    "• Un paciente puede ", {word:"atiende", type:"relacion"}, " muchos médicos.\n"
]
```

**Campos de cada objeto:**

| Campo | Valores posibles |
|-------|-----------------|
| `type` | `"entidad"`, `"atributo"`, `"relacion"` |
| `entityType` | `"fuerte"`, `"débil"` (obligatorio si `type:"entidad"`) |
| `attrType` | `"simple"`, `"clave"`, `"compuesto"`, `"multivaluado"`, `"derivado"`, `"relacion"` (obligatorio si `type:"atributo"`) |

**⚠️ Convención de nombres — OBLIGATORIA en todo `analyzeData[]`:**

| Tipo | Regla | Ejemplos ✅ | Ejemplos ❌ |
|------|-------|------------|------------|
| `entidad` | TODO EN MAYÚSCULAS, singular | `CLIENTE`, `LIBRO`, `MÉDICO` | `Cliente`, `Libros`, `medico` |
| `atributo` | Primera letra mayúscula | `Nombre`, `FechaNac`, `Id_socio` | `nombre`, `fechaNac`, `id_socio` |
| `relacion` | todo en minúsculas | `préstamo`, `dicta`, `tiene` | `Préstamo`, `TIENE` |

Para atributos compuestos, listar los sub-atributos inline y agregar `components`:
```js
{word:"NombreCom", type:"atributo", attrType:"compuesto", components:["Nom","Ape1","Ape2"]},
" (compuesto por ", {word:"Nom", type:"atributo", attrType:"simple"}, ", ",
{word:"Ape1", type:"atributo", attrType:"simple"}, " y ",
{word:"Ape2", type:"atributo", attrType:"simple"}, "), "
```

> ⚠️ `exercises[]`, `analyzeData[]` y `analyzeConfig[]` deben tener **exactamente el mismo número de entradas**. Una coma faltante entre entradas rompe el array sin error visible — verificar con la consola del navegador (`F12 → Console`) si algo no carga.

---

### 3. Agregar en `analyzeConfig[]`

En la misma posición:

```js
{ requireSubtypes: false }
// true  → el analizador pide subtipo de atributo (simple/clave/compuesto/etc.)
// false → solo pide Entidad / Atributo / Relación
```

---

### 4. Actualizar los selectores en `er-designer.html`

Agregar la misma opción en **los dos `<select>`** del archivo (`exercise-select` y `analyze-select`), con el índice correcto:

```html
<option value="10">🏥 Sistema Hospitalario</option>
```

---

### 5. Página de inicio (`index.html`)

Si `enabled: true` y `concept` tiene una sección activa, el botón aparece automáticamente. No se requiere código adicional.

| `concept` | Sección en index.html |
|-----------|----------------------|
| `relaciones_simples` | Entidades, atributos y relaciones |
| `atributos_especiales` | Atributos especiales |
| `participacion` | Totalidad (participación) |
| `autorelacion` | Autorelación |
| `generalizacion` | Generalización/Categorización (ISA) |
| `entidad_debil` | Entidades débiles |

---

## Activar / desactivar ejercicios

```js
// METADATOS del ejercicio en exercises.js
concept: "entidad_debil",
enabled: true    // ← true: visible en index.html | false: oculto
```

- `enabled: false` → no aparece en `index.html` pero sigue accesible desde `er-designer.html` por el selector.
- Útil para preparar ejercicios sin que los estudiantes los vean.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| El ejercicio no aparece en el selector | `<option>` no agregado en `er-designer.html` | Agregar en los dos `<select>` |
| No aparece en `index.html` | `enabled: false` o `concept` no definido | Verificar metadatos |
| El analizador muestra el ejercicio anterior | Coma faltante o extra en `analyzeData[]` | Abrir consola (`F12`), buscar SyntaxError |
| Diseño muestra el ejercicio anterior | Coma faltante o extra en `exercises[]` | Ídem |
| Los nodos se superponen | `x`/`y` muy cercanos | Aumentar separación entre nodos |
| Las líneas de conexión no aparecen | `id` incorrecto en `connections` | Verificar que los `id` coincidan |
| Respuestas no se validan | `correctValue` no coincide | Comparar exactamente con `wordBank` |
| Cambios no se reflejan en el navegador | Caché del navegador | Incrementar `?t=N` en los `<script>` de `er-designer.html` e `index.html` |

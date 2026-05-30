# E-R Constructor Pro — UTU 2026

Herramienta interactiva para practicar diagramas **Entidad-Relación** (notación Chen) en el aula.  
Diseñada por **Prof. Elizabeth Izquierdo** con asistencia de Claude — [licencia CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

🌐 **Demo en vivo:** https://recursos-docentes.github.io/merTutor/

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
- El botón "Validar clasificación" se puede usar múltiples veces.
- Para avanzar al Diseño E-R se requiere al menos **50% correcto** en el análisis.

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
  - En ejercicios básicos (0–2) **no se pregunta subtipo**: solo Entidad / Atributo / Relación, para reducir la carga cognitiva.
- **Tres pasos** para atributos compuestos: identifica el tipo, luego selecciona los atributos que lo componen. Los componentes quedan grises y se excluyen de la validación individual.
- **Entidades:** si el ejercicio solo tiene entidades fuertes, se clasifican directo sin preguntar.
- **Estado persistente:** al cambiar al tab de Diseño E-R y volver, la clasificación se mantiene.
- **Rastreo de progreso:** compara el resultado actual con el intento anterior (guardado en `localStorage`).
- **Ver respuestas:** después de 2 intentos fallidos en modo ejercitación aparece el botón "💡 Ver respuestas correctas".

---

## Accesibilidad y soporte para estudiantes con dificultades

| Función | Descripción |
|---------|-------------|
| 📖 **Glosario** | Modal con formas SVG y definición de cada concepto E-R. Accesible desde las instrucciones o el tutorial. |
| ? **Tutorial** | Modal de 4 pasos que se muestra automáticamente en el primer uso. Se puede reabrir con el botón `?` en el nav. |
| ⊙ **Alto contraste** | Botón visible en la barra de navegación para activar modo alto contraste. |
| 💡 **Ver respuestas** | Aparece tras 2 intentos fallidos en modo ejercitación para desbloquear al estudiante. |
| ⬆️ **Comparación de intentos** | Al validar, muestra si mejoró, empeoró o se mantuvo respecto al intento anterior. |

---

## Agregar un nuevo ejercicio

### Paso 1 — Datos del diagrama

En `er-designer.html`, agregá un objeto al array `exercises`:

```js
{
    title: "Caso N: Nombre del ejercicio",
    description: `HTML con el enunciado. Usá <strong> para resaltar conceptos.`,
    hint: "Sugerencia pedagógica visible al pulsar 'Ver pista de diseño'.",
    wordBank: ["ENTIDAD_A", "ENTIDAD_B", "relacion", "Atrib1", "Atrib2", "1", "N"],
    nodes: [
        { id: "e1", type: "entity",      correctValue: "ENTIDAD_A",  x: 20, y: 50, w: 120, h: 52 },
        { id: "r1", type: "relation",    correctValue: "relacion",   x: 50, y: 50, w: 85,  h: 85 },
        { id: "a1", type: "attribute",   isKey: false, correctValue: "Atrib1",   x: 20, y: 22, w: 85, h: 40 },
        { id: "pk", type: "attribute",   isKey: true,  correctValue: "Id",       x: 10, y: 22, w: 75, h: 40 },
        { id: "mv", type: "attribute",   isMultivalued: true, correctValue: "Tags", x: 30, y: 22, w: 90, h: 42 },
        { id: "c1", type: "cardinality", correctValue: "1",  x: 35, y: 50, w: 30, h: 30 },
        { id: "c2", type: "cardinality", correctValue: "N",  x: 65, y: 50, w: 30, h: 30 },
        { id: "isa1", type: "isa",                           x: 28, y: 62, w: 70, h: 56 }
    ],
    connections: [
        { from: "pk", to: "e1" }, { from: "a1", to: "e1" },
        { from: "e1", to: "r1" }, { from: "r1", to: "e2" }
    ]
}
```

#### Posicionamiento de nodos

| Propiedad | Descripción |
|-----------|-------------|
| `x` | Centro horizontal en **%** del canvas (mín. 1060 px). |
| `y` | Centro vertical en **%** del canvas (540 px). |
| `w` / `h` | Tamaño en px. Guía: entidad 110–120 · relación 80–90 · atributo 75–110 · cardinalidad 30. |

```
y ≈  6%  →  sub-atributos de compuesto
y ≈ 22%  →  atributos principales (PK, etc.)
y ≈ 45%  →  entidades y relaciones  ← fila principal
y ≈ 72%  →  atributos de relación / multivaluados
```

#### Reglas de validación
- **Atributo clave (`isKey: true`):** match exacto en su slot.
- **Atributos no-clave:** orden libre dentro del mismo nodo padre.
- **Cardinalidades:** match exacto. Solo se usa `N` (no `M`).

---

### Paso 2 — Datos de análisis de texto

En el array `analyzeData`, agregá un array en la posición del índice del nuevo ejercicio.  
Cada elemento es un **string** (texto plano) o un **objeto** (término clickeable):

```js
{ word: "término", type: "entidad|atributo|relacion", entityType: "fuerte|débil", attrType: "simple|clave|compuesto|multivaluado|derivado|relacion", components: ["comp1","comp2"] }
```

- `entityType` → siempre incluirlo en entidades (`"fuerte"` o `"débil"`).
- `attrType` → siempre incluirlo en atributos.
- `components` → solo en atributos con `attrType:"compuesto"`, lista de palabras que lo componen.

**Ejemplo:**
```js
[
    "Un hospital desea registrar sus médicos y pacientes.\n\n",
    "• Datos de ", { word:"Médico", type:"entidad", entityType:"fuerte" }, ": ",
    { word:"matricula", type:"atributo", attrType:"clave" }, ", ",
    { word:"nombre",    type:"atributo", attrType:"simple" }, ".\n",
    "• Un médico puede ", { word:"atender", type:"relacion" }, " muchos pacientes."
]
```

---

### Paso 3 — Selectores del designer

En `er-designer.html`, agregá la misma opción en **ambos** `<select>`:

```html
<option value="5">🏥 Hospital</option>
```

---

### Paso 4 — Página de inicio

En `index.html`, agregá un botón dentro de la tarjeta de nivel correspondiente:

```html
<button onclick="selectEx(this, 5, ['Concepto nuevo A', 'Concepto nuevo B'])"
    class="ex-btn text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-700 flex items-center gap-2.5 transition">
    <span>🏥</span> Hospital
</button>
```

El tercer argumento de `selectEx` son los **conceptos nuevos** que introduce el ejercicio.

---

## Estructura de archivos

```
merTutor/
├── index.html        ← Página de bienvenida (niveles Básico / Medio / Experto)
├── er-designer.html  ← Aplicación principal con todos los ejercicios
├── serve.pl          ← Servidor local para desarrollo (Perl)
└── README.md         ← Este archivo
```

---

## Ejercicios disponibles

| Índice | Caso | Nivel | Conceptos nuevos |
|--------|------|-------|-----------------|
| 0 | Taller Mecánico | Básico | Relación N:N, Atributo de relación |
| 1 | Biblioteca Escolar | Básico | Refuerzo N:N y atributo de relación |
| 2 | Tienda Online | Básico | Relación 1:N, Entidades y atributos, PK |
| 3 | Red Social | Medio | Especialización ISA, Herencia |
| 4 | Plataforma Streaming | Básico | Atributo compuesto, Atributo multivaluado |

---

## Tecnologías

- **Tailwind CSS** (CDN) — estilos
- **html2canvas 1.4.1** (CDN) — exportación PNG
- JavaScript vanilla — sin frameworks ni dependencias de build

---

## Licencia

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Podés usar, adaptar y redistribuir con atribución y bajo la misma licencia.

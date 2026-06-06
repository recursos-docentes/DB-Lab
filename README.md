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
| 📖 **Conceptos E-R** | Modal con teoría sobre entidades, atributos, relaciones, cardinalidad, totalidad y más. Accesible con el botón `📖` en el nav (sticky, siempre visible). |
| 📚 **Glosario** | Modal con formas SVG y definición de cada concepto E-R. Accesible desde las instrucciones. |
| ? **Tutorial** | Modal de 4 pasos que se muestra automáticamente en el primer uso. Se puede reabrir con el botón `?` en el nav (sticky, siempre visible). |
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
        { id: "isa1", type: "isa",                           x: 28, y: 62, w: 70, h: 56 },
        // Totalidad (participación): S = total, N = parcial. Sin DOM en canvas — usa panel de botones.
        { id: "t_0_left",  type: "totalidad", correctValue: "N", x: 32, y: 65, w: 28, h: 24 },
        { id: "t_0_right", type: "totalidad", correctValue: "S", x: 42, y: 65, w: 28, h: 24 }
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
- **Totalidad:** el estudiante marca S o N en el panel de botones (no en el canvas). Al validar, los círculos se dibujan automáticamente sobre el vértice del rombo correspondiente a las participaciones totales correctas. Posicionar los nodos `totalidad` entre la relación y la entidad que representan (en coordenadas %) para que la detección visual sea correcta.

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

En `index.html`, agregá un enlace dentro de la sección de concepto correspondiente:

```html
<a href="er-designer.html?ejercicio=5" class="px-4 py-3 bg-teal-600/20 border border-teal-500/40 hover:bg-teal-600/40 rounded-xl text-sm font-semibold text-white transition flex items-center gap-2.5">
    <span>🏥</span> Hospital
</a>
```

El enlace debe usar el parámetro `?ejercicio=X` donde X es el índice del ejercicio en el array `exercises` de `script.js`.

---

## Estructura de archivos

```
DB-Lab/
├── index.html        ← Página de inicio con ejercicios por concepto
├── er-designer.html  ← Aplicación principal con 3 etapas (Analizar, Diseño E-R, etc.)
├── script.js         ← Lógica de ejercicios, validación, canvas
├── styles.css        ← Estilos personalizados
├── add-exercise-wizard.html ← Asistente para crear nuevos ejercicios
├── serve.pl          ← Servidor local para desarrollo (Perl)
└── README.md         ← Este archivo
```

---

## Ejercicios disponibles

| Índice | Caso | Concepto | Dificultad |
|--------|------|---------|-----------|
| 0 | Taller Mecánico | Atributos especiales (relación) | Intermedio |
| 1 | Biblioteca Escolar | Atributos especiales (relación) | Intermedio |
| 2 | Tienda Online | Relaciones simples | Básico |
| 3 | Red Social | Generalización/ISA | Avanzado |
| 4 | Plataforma Streaming | Atributos especiales | Intermedio |
| 5 | Sistema Hospitalario | Relaciones simples | Básico |
| 6 | Institución educativa | Atributos especiales | Intermedio |
| 7 | Colegio | Totalidad / Participación | Avanzado |

---

## Tecnologías

- **Tailwind CSS** (CDN) — estilos
- **html2canvas 1.4.1** (CDN) — exportación PNG
- JavaScript vanilla — sin frameworks ni dependencias de build

---

---

## 🚀 Planes Futuros

### **Migración a Firebase** (próximas fases)

#### Fase 1: Preparación
- [x] Agregar metadatos a ejercicios (concepto, disponibilidad)
- [ ] Reorganizar index por conceptos E-R (en lugar de niveles)
- [ ] Diseñar estructura de BD Firestore

#### Fase 2: Configurar Firebase
- [ ] Crear proyecto Firebase
- [ ] Configurar Firestore con ejercicios
- [ ] Agregar autenticación profesor/estudiante
- [ ] Migrar a Firebase Hosting

#### Fase 3: Integración
- [ ] Reescribir carga de ejercicios desde Firestore
- [ ] Crear **Panel de Profesor** para habilitar/deshabilitar ejercicios
- [ ] Control de disponibilidad: clase, casa, evaluación
- [ ] Cargar dinámicamente qué ejercicios ve cada usuario

#### Fase 4: Seguridad
- [ ] Reglas Firestore para proteger evaluaciones
- [ ] Tests de seguridad

#### Beneficios
- Ejercicios configurables sin editar código
- Disponibilidad controlada (algunos solo para evaluaciones)
- Separación profesor/estudiante
- Escalable para múltiples aulas

---

## Licencia

[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Podés usar, adaptar y redistribuir con atribución y bajo la misma licencia.

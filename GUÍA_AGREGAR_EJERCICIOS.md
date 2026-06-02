# 📚 Guía: Agregar Nuevos Ejercicios a merTutor

## Estructura del Proyecto (Refactorizado)

Ahora el código está separado en 3 archivos para mayor mantenibilidad:

```
merTutor-main/
├── er-designer.html          ← HTML puro (estructura)
├── styles.css                ← CSS puro (estilos)
├── script.js                 ← JavaScript puro (lógica)
├── add-exercise-wizard.html  ← 🆕 Asistente para agregar ejercicios
├── index.html                ← Página de bienvenida
└── README.md
```

## Método 1: Usar el Asistente Interactivo 🧙 (Recomendado)

### Paso 1: Abrir el Asistente
Abre `add-exercise-wizard.html` en tu navegador.

### Paso 2: Completar 3 pasos simples

#### **Paso 1️⃣: Información General**
- **Título**: "🏥 Sistema Hospitalario" 
- **Descripción**: Describe el caso (puedes usar HTML: `<strong>`, `<em>`, etc.)
- **Pista**: Consejo para resolver el ejercicio
- **Requisitos**: Marca si necesita subtipos (compuestos/multivaluados/ISA)

#### **Paso 2️⃣: Entidades y Atributos**

**Formato de Entidades:**
```
NOMBRE_ENTIDAD | clave_primaria | atributo1 | atributo2 | ...
```

Ejemplo:
```
PACIENTE | Cédula | Nombre | Teléfono
MÉDICO | Matrícula | Nombre | Especialidad
CONSULTA | Número | Fecha | Diagnóstico
```

**Formato de Relaciones:**
```
nombre_relacion | Entidad1 | Entidad2 | attr1 | attr2
```

Ejemplo:
```
realiza | PACIENTE | CONSULTA | Fecha_consulta
atiende | MÉDICO | PACIENTE
```

#### **Paso 3️⃣: Copiar Código Generado**

El asistente genera 3 bloques de código:

1. **`exercises.push({...})`** → Copiar al **final de `exercises[]`** en `script.js`
2. **`analyzeData.push([...])`** → Copiar al **final de `analyzeData[]`** en `script.js`
3. **`{requireSubtypes: ...}`** → Copiar al **final de `analyzeConfig[]`** en `script.js`

### Paso 3: Actualizar el HTML

Abre `er-designer.html` y busca los `<select>` (hay 2):

1. **En el nav de "Analizar el problema"** (búsqueda: `analyze-select`)
```html
<select id="analyze-select">
    <option value="0">🔧 Taller Mecánico</option>
    ...
    <option value="5">🏥 Sistema Hospitalario</option>  ← AGREGAR
</select>
```

2. **En el panel izquierdo de "Diseño E-R"** (búsqueda: `exercise-select`)
```html
<select id="exercise-select">
    <option value="0">🔧 Taller Mecánico (N:M con atributos)</option>
    ...
    <option value="5">🏥 Sistema Hospitalario</option>  ← AGREGAR
</select>
```

**Importante:** Usa el **índice correcto** (en este ejemplo: 5, porque ya hay 5 ejercicios con índices 0-4)

### Paso 4: Probar

1. Abre `er-designer.html` en el navegador
2. Selecciona tu nuevo ejercicio en el dropdown
3. ¡Debería funcionar! 🎉

---

## Método 2: Editar Manualmente (Avanzado)

Si prefieres no usar el asistente, puedes editar directamente `script.js`.

### Estructura de un Ejercicio Completo

```javascript
{
    title: "🏥 Sistema Hospitalario",
    description: `Un hospital desea gestionar...<br><br>
        • De cada <strong>Paciente</strong>...`,
    hint: "Recuerda que Cédula es la clave primaria...",
    wordBank: ["PACIENTE", "MÉDICO", "Cédula", "Nombre", ...],
    nodes: [
        // Entidades (rectangulares)
        { id: "e_0", type: "entity", correctValue: "PACIENTE", x: 10, y: 45, w: 110, h: 52 },
        { id: "e_1", type: "entity", correctValue: "MÉDICO",   x: 25, y: 45, w: 110, h: 52 },
        
        // Relaciones (diamantes)
        { id: "r_0", type: "relation", correctValue: "realiza", x: 40, y: 45, w: 80, h: 80 },
        
        // Cardinalidades (círculos)
        { id: "c_0", type: "cardinality", correctValue: "N", x: 20, y: 45, w: 30, h: 30 },
        { id: "c_1", type: "cardinality", correctValue: "1", x: 35, y: 45, w: 30, h: 30 },
        
        // Atributos (óvalos)
        { id: "a_0", type: "attribute", isKey: true, 
          correctValue: "Cédula", x: 8, y: 25, w: 92, h: 40 },
        { id: "a_1", type: "attribute", isKey: false,
          correctValue: "Nombre", x: 15, y: 25, w: 78, h: 40 },
    ],
    connections: [
        { from: "a_0", to: "e_0" },  // Cédula → PACIENTE
        { from: "a_1", to: "e_0" },  // Nombre → PACIENTE
        { from: "e_0", to: "r_0" },  // PACIENTE → realiza
        { from: "r_0", to: "e_1" },  // realiza → MÉDICO
    ]
}
```

### Tipos de Nodos

| Tipo | Forma | Campos Especiales |
|------|-------|-------------------|
| `entity` | Rectángulo | — |
| `relation` | Diamante | — |
| `attribute` | Óvalo | `isKey`, `isMultivalued`, `isDerived` |
| `cardinality` | Círculo | — |

### Posicionamiento (%)

- **x**: 0-100% (de izquierda a derecha del canvas)
- **y**: 0-100% (de arriba a abajo del canvas)
- **w, h**: pixels (ancho y alto del elemento)

**Guía de Y:**
- ~6%: sub-atributos (dentro de atributos compuestos)
- ~22%: atributos superiores
- ~45%: fila principal (entidades, relaciones, cardinalidades)
- ~72%: atributos inferiores, multivaluados

---

## Análisis de Texto (analyzeData)

Estructura de segmentos:

```javascript
analyzeData[index] = [
    "Texto plano inicial.\n\n",
    { word: "Paciente", type: "entidad", entityType: "fuerte" },
    " tiene ",
    { word: "Cédula", type: "atributo", attrType: "clave" },
    " y ",
    { word: "Nombre", type: "atributo", attrType: "simple" },
    "."
]
```

### Tipos Disponibles

**Para Entidades:**
```javascript
{ word: "PACIENTE", type: "entidad", entityType: "fuerte" }
// entityType: "fuerte" | "débil"
```

**Para Atributos:**
```javascript
{ word: "Cédula", type: "atributo", attrType: "clave" }
// attrType: "simple" | "clave" | "compuesto" | "multivaluado" | "derivado" | "relacion"

// Si es compuesto, incluir componentes:
{ 
    word: "Nombre_completo", 
    type: "atributo", 
    attrType: "compuesto",
    components: ["Primer_nom", "Primer_ape"]
}
```

**Para Relaciones:**
```javascript
{ word: "realiza", type: "relacion" }
```

---

## Configuración (analyzeConfig)

```javascript
analyzeConfig[index] = {
    requireSubtypes: false  // true si hay atributos especiales o ISA
}
```

---

## Ejemplo Completo: Sistema de Biblioteca 📚

### Ejercicio Original (#1)
```javascript
{
    title: "📚 Biblioteca Escolar",
    description: `Se desea diseñar el esquema para el control de los libros prestados...
        • Cada <strong>Socio</strong> tiene...`,
    hint: "Un socio puede solicitar múltiples préstamos...",
    wordBank: ["SOCIO", "LIBRO", "PRÉSTAMO", "id_socio", "isbn", ...],
    // ... nodes y connections
}
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| El ejercicio no aparece en el dropdown | Verificar que el índice en `<option>` sea correcto |
| Los nodos se superponen | Ajustar `x` e `y` (aumentar separación) |
| Las líneas de conexión no se ven | Verificar que `connections` sea válido |
| Respuestas no se validan | Asegurar que `correctValue` coincida exactamente |

---

## 🎯 Próximas Mejoras

- [ ] Generador visual de posiciones (drag-and-drop)
- [ ] Preview del ejercicio en el asistente
- [ ] Importar/exportar ejercicios en JSON
- [ ] Sistema de plantillas para ejercicios comunes

---

**¿Preguntas?** Revisa el archivo `README.md` principal o consulta los ejercicios existentes como referencia.

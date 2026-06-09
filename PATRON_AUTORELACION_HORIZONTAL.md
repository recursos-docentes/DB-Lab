# Patrón: Autorelación Horizontal

## Descripción
Patrón para renderizar autorelaciones donde la entidad y la relación están alineadas horizontalmente (mismo eje Y).

## Ejercicio Referencia
- **Ejercicio 9: Empleados (Autorelación)**
- Relación: EMPLEADO supervisa EMPLEADO

## Configuración de Nodos

### Entidad
```javascript
{ id: "e_0", type: "entity", correctValue: "EMPLEADO", x: 50, y: 50, w: 110, h: 52 }
```

### Relación (Rombo)
```javascript
{ id: "r_0", type: "relation", correctValue: "supervisa", x: 75, y: 50, w: 80, h: 80 }
```
**Nota:** Mismo `y: 50` que la entidad para alineación horizontal

### Cardinalidades
```javascript
{ id: "c_0_1", type: "cardinality", correctValue: "1", x: 70, y: 60, w: 30, h: 30 },  // supervisor - más abajo
{ id: "c_0_n", type: "cardinality", correctValue: "N", x: 70, y: 40, w: 30, h: 30 }   // subordinado - más arriba
```
**Regla de posicionamiento:**
- `x: 70` (entre la entidad en 50 y la relación en 75)
- Cardinalidad "supervisor" (1): `y: 60` (más abajo que el centro)
- Cardinalidad "subordinado" (N): `y: 40` (más arriba que el centro)
- Diferencia vertical: 20% para no tapar los roles "supervisor" y "subordinado"

### Conexiones
```javascript
connections: [
    { from: "e_0", to: "r_0", role: "supervisor" },
    { from: "r_0", to: "e_0", role: "subordinado" }
]
```
**Nota:** Las conexiones de cardinalidad se ELIMINAN (no se dibuja línea desde c_0_1/c_0_n al rombo)

## Cálculo de Líneas (en script.js)

### Detección de Autorelación
```javascript
const isAutoRelation = (typeMap[from] === 'entity' && typeMap[to] === 'relation' &&
    cur.connections.some(c => c.from === to && c.to === from)) ||
    (typeMap[from] === 'relation' && typeMap[to] === 'entity' &&
    cur.connections.some(c => c.from === to && c.to === from));
```

### Puntos de Conexión
- **Línea supervisor** (arriba): Del centro superior del rectángulo al vértice superior del rombo
- **Línea subordinado** (abajo): Del vértice inferior del rombo al centro inferior del rectángulo, bajada -2px

```javascript
if (typeMap[from] === 'entity') {
    p1 = { x: ca.x, y: ca.y + ca.hh };  // lado inferior del rectángulo
    p2 = { x: cb.x, y: cb.y + cb.hh - 2 };  // vértice inferior rombo, -2px
} else {
    p1 = { x: ca.x, y: ca.y + ca.hh - 2 };  // vértice inferior rombo, -2px
    p2 = { x: cb.x, y: cb.y + cb.hh };  // lado inferior del rectángulo
}
```

## Resultado Visual
- Dos líneas grises que conectan horizontal/diagonalmente
- Roles "supervisor" y "subordinado" etiquetados en las líneas
- Cardinalidades 1 y N posicionadas sin tapar los textos
- Sin líneas verdes de cardinalidad

## Parámetros Ajustables
- **Separación cardinalidad:** Cambiar de y: 40/60 a otros valores si la entidad/relación cambia de tamaño
- **Offset línea subordinado:** El `-2` puede ajustarse si el vértice no toca perfectamente

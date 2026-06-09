# Cambios en la Detección y Visualización de Autorelaciones

## Archivos Modificados
- `script.js` (función `drawCrispConnectors`)

## Cambios Realizados

### 1. Detección Mejorada de Autorelaciones (líneas 1111-1115)
- Ahora detecta autorelaciones en **ambas direcciones**:
  - `entity → relation` seguida de `relation → entity`
  - `relation → entity` seguida de `entity → relation`
- La detección busca si existe una conexión inversa entre los mismos dos elementos

### 2. Cálculo de Puntos para Autorelaciones (líneas 1119-1140)
- Cuando se detecta una autorelación y existe un `role`:
  - **Para role="supervisor"**: La línea sale/entra por el vértice **superior** del rombo
    - Punto en el rectángulo: `(ca.x, ca.y - ca.hh)` → centro del lado superior
    - Punto en el rombo: `(cb.x, cb.y - cb.hh)` → vértice superior
  - **Para role="subordinado"**: La línea sale/entra por el vértice **inferior** del rombo
    - Punto en el rombo: `(ca.x, ca.y + ca.hh)` → vértice inferior
    - Punto en el rectángulo: `(cb.x, cb.y + cb.hh)` → centro del lado inferior

### 3. Visualización con Color Distintivo (líneas 1151-1155)
- Las autorelaciones ahora se renderizan en **naranja (#f97316)** en lugar de gris
- Esto permite verificar visualmente si la autorelación se está detectando correctamente
- El ancho de la línea se aumentó ligeramente a 2.5px para mejor visibilidad

### 4. Debug Console (línea 1120)
- Se agregó `console.log` para verificar cuándo se detectan autorelaciones
- Aparecerá en la consola del navegador: `"Autorelación detectada: e_0 ↔ r_0, role: supervisor"`

## Cómo Probar

1. Abre el ejercicio 9 (Empleados): `er-designer.html?ejercicio=9`
2. Haz clic en el tab "Diseño E-R" 
3. Verifica que las líneas de la autorelación sean **naranjas**
4. Las líneas deben:
   - Salir del centro superior del rectángulo EMPLEADO hacia el vértice superior del rombo supervisa
   - Salir del vértice inferior del rombo supervisa hacia el centro inferior del rectángulo EMPLEADO
5. Abre la consola del navegador (F12) para ver los mensajes de debug

## Notas Técnicas
- Los cálculos usan `ca.hh` (media altura del elemento HTML) como offset
- Los valores de x, y en los nodos del ejercicio están en **porcentaje** del canvas, pero `center()` devuelve píxeles
- Las transformaciones CSS (`translate(-50%, -50%)`) centr an los elementos, por lo que los cálculos son correctos

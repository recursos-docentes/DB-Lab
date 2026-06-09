// ── Dibujar conectores con recorte a bordes de figura ────
function drawCrispConnectors() {
    const cur    = exercises[activeExercise];
    const svg    = document.getElementById('svg-connectors');
    const svgTop = document.getElementById('svg-top');
    const canvas = document.getElementById('er-canvas');
    svg.innerHTML = "";
    if (svgTop) svgTop.innerHTML = "";
    const cr = canvas.getBoundingClientRect();
    // Mapa id → tipo de nodo
    const typeMap = {};
    cur.nodes.forEach(n => { typeMap[n.id] = n.type; });
    // Centro del elemento en coordenadas del canvas
    function center(el) {
        const r = el.getBoundingClientRect();
        return {
            x:  (r.left + r.width  / 2) - cr.left + canvas.scrollLeft,
            y:  (r.top  + r.height / 2) - cr.top  + canvas.scrollTop,
            hw: r.width  / 2,
            hh: r.height / 2
        };
    }
    // Punto en el borde de la figura, en dirección al objetivo
    function edgePoint(c, tx, ty, type) {
        const dx  = tx - c.x;
        const dy  = ty - c.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.5) return { x: c.x, y: c.y };
        const ndx = dx / len;
        const ndy = dy / len;
        let t;
        if (type === 'attribute' || type === 'cardinality') {
            // Elipse
            t = 1 / Math.sqrt((ndx / c.hw) ** 2 + (ndy / c.hh) ** 2);
        } else if (type === 'relation') {
            // Rombo (norma L1)
            t = 1 / (Math.abs(ndx) / c.hw + Math.abs(ndy) / c.hh);
        } else {
            // Rectángulo / ISA
            const tx2 = c.hw / Math.abs(ndx || 1e-9);
            const ty2 = c.hh / Math.abs(ndy || 1e-9);
            t = Math.min(tx2, ty2);
        }
        return { x: c.x + ndx * t, y: c.y + ndy * t };
    }
    // Pre-computar autorelaciones: relId → { cardIds[] }
    const autoRelCards = new Map();
    cur.connections.forEach(({ from, to }) => {
        if (typeMap[from] === 'entity' && typeMap[to] === 'relation' &&
            cur.connections.some(c => c.from === to && c.to === from)) {
            if (!autoRelCards.has(to)) {
                const cardIds = cur.connections
                    .filter(c => c.to === to && typeMap[c.from] === 'cardinality')
                    .map(c => c.from);
                autoRelCards.set(to, { cardIds, used: 0 });
            }
        }
    });

    cur.connections.forEach(({ from, to, role }) => {
        const a = document.getElementById(from);
        const b = document.getElementById(to);
        if (!a || !b) return;
        const ca = center(a);
        const cb = center(b);

        // ── Detectar autorelación (entidad ↔ relación ↔ misma entidad) ──
        const isAutoFromEntity   = typeMap[from] === 'entity'   && typeMap[to] === 'relation' &&
            cur.connections.some(c => c.from === to   && c.to === from);
        const isAutoFromRelation = typeMap[from] === 'relation' && typeMap[to] === 'entity'   &&
            cur.connections.some(c => c.from === to   && c.to === from);

        // Conexión de cardinalidad hacia autorelación: no dibujar línea (se gestiona sobre las líneas)
        if (typeMap[from] === 'cardinality' && typeMap[to] === 'relation' && autoRelCards.has(to)) return;
        if (typeMap[from] === 'relation' && typeMap[to] === 'cardinality' && autoRelCards.has(from)) return;

        let p1, p2;
        if (isAutoFromEntity) {
            // Entidad → Relación: centro-top entidad → vértice superior rombo
            p1 = { x: ca.x, y: ca.y - ca.hh };
            p2 = { x: cb.x, y: cb.y - cb.hh };
        } else if (isAutoFromRelation) {
            // Relación → Entidad: vértice inferior rombo → centro-bottom entidad
            p1 = { x: ca.x, y: ca.y + ca.hh };
            p2 = { x: cb.x, y: cb.y + cb.hh };
        } else {
            p1 = edgePoint(ca, cb.x, cb.y, typeMap[from]);
            p2 = edgePoint(cb, ca.x, ca.y, typeMap[to]);
        }

        // Las cardinalidades de autorelación se posicionan con x,y del ejercicio (igual que cualquier nodo).
        // Solo se omite dibujar la línea cardinalidad→rombo (ya filtrado arriba).

        // ── Línea de autorelación: va en svgTop (z-20) para atravesar la cardinalidad ──
        const lineTarget = svg;  // siempre svg-connectors (z-0): los nodos HTML quedan por encima

        // ── Etiqueta de rol en svgTop — cerca del rombo, más allá de la cardinalidad ──
        if (role && (isAutoFromEntity || isAutoFromRelation) && svgTop) {
            // t=0.68/0.32: un poco alejado del rombo, hacia la entidad
            const rt = isAutoFromEntity ? 0.68 : 0.32;
            const mx = p1.x + (p2.x - p1.x) * rt;
            const my = p1.y + (p2.y - p1.y) * rt;
            const offset = isAutoFromEntity ? -10 : 10;
            const lbl = document.createElementNS("http://www.w3.org/2000/svg", "text");
            lbl.setAttribute("x", mx - 30);
            lbl.setAttribute("y", my + offset);
            lbl.setAttribute("text-anchor", "start");
            lbl.setAttribute("font-size", "10");
            lbl.setAttribute("font-weight", "600");
            lbl.setAttribute("fill", "#475569");
            lbl.setAttribute("font-family", "sans-serif");
            lbl.textContent = role;
            svgTop.appendChild(lbl);
        }

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
        const isAttr = typeMap[from] === 'attribute' || typeMap[to] === 'attribute';
        line.setAttribute("stroke",         isAttr ? "#10b981" : "#94a3b8");
        line.setAttribute("stroke-width",   isAttr ? "1.5"     : "2");
        line.setAttribute("stroke-linecap", "round");
        lineTarget.appendChild(line);

        // Dibujar círculos de totalidad solo si no hay nodos de totalidad pendientes
        // (si hay nodos de totalidad, el estudiante debe completarlos)
        const toNode = cur.nodes.find(n => n.id === to);
        const fromNode = cur.nodes.find(n => n.id === from);

        // Verificar si hay nodos de totalidad en este ejercicio
        const hasTotalityNodes = cur.nodes.some(n => n.type === 'totalidad');

        if (!hasTotalityNodes) {
            // Solo dibujar círculos si NO hay nodos de totalidad para completar
            if (toNode?.type === 'relation' && fromNode?.type !== 'relation' && toNode.totalityLeft) {
                // Totalidad en el lado izquierdo del rombo (donde viene ent1)
                const relEl = document.getElementById(to);
                const rel = center(relEl);
                const entityEl = document.getElementById(from);
                const entity = center(entityEl);
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                // Calcular vértice basado en dirección hacia la entidad
                const dx = entity.x - rel.x;
                const dy = entity.y - rel.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ndx = len > 0 ? dx / len : 1;
                const ndy = len > 0 ? dy / len : 0;
                circle.setAttribute("cx", rel.x + ndx * rel.hw);
                circle.setAttribute("cy", rel.y + ndy * rel.hh);
                circle.setAttribute("r", "3.5");
                circle.setAttribute("fill", "#000000");
                svg.appendChild(circle);
            } else if (fromNode?.type === 'relation' && toNode?.type !== 'relation' && fromNode.totalityRight) {
                // Totalidad en el lado derecho del rombo (donde va ent2)
                const relEl = document.getElementById(from);
                const rel = center(relEl);
                const entityEl = document.getElementById(to);
                const entity = center(entityEl);
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                // Calcular vértice basado en dirección hacia la entidad
                const dx = entity.x - rel.x;
                const dy = entity.y - rel.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ndx = len > 0 ? dx / len : 1;
                const ndy = len > 0 ? dy / len : 0;
                circle.setAttribute("cx", rel.x + ndx * rel.hw);
                circle.setAttribute("cy", rel.y + ndy * rel.hh);
                circle.setAttribute("r", "3.5");
                circle.setAttribute("fill", "#000000");
                svg.appendChild(circle);
            }
        }
    });

    // ── Círculos de totalidad post-validación ──────────────
    // Se dibujan en svg-top (z-20) para que queden por encima de los nodos
    if (_totalidadCorrectMap) {
        const targetSvg = svgTop || svg;
        targetSvg.querySelectorAll('.totalidad-circle').forEach(c => c.remove());
        cur.nodes.forEach(n => {
            if (n.type !== 'totalidad') return;
            const userVal   = (n.userValue || '').toUpperCase();
            const isCorrect = _totalidadCorrectMap[n.id] === true;
            if (userVal !== 'S' || !isCorrect) return;

            const match = n.id.match(/t_(.+?)_(left|right)/);
            if (!match) return;
            const relId = `r_${match[1]}`;

            const relEl = document.getElementById(relId);
            if (!relEl) return;
            const rel = center(relEl);

            // Encontrar la entidad conectada más cercana al nodo de totalidad
            let entityEl = null;
            let minDist  = Infinity;
            cur.connections.forEach(conn => {
                const otherId = conn.from === relId ? conn.to : (conn.to === relId ? conn.from : null);
                if (!otherId) return;
                const otherNode = cur.nodes.find(nd => nd.id === otherId);
                if (otherNode?.type !== 'entity') return;
                const dist = Math.hypot(otherNode.x - n.x, otherNode.y - n.y);
                if (dist < minDist) { minDist = dist; entityEl = document.getElementById(otherId); }
            });
            if (!entityEl) return;

            const entity = center(entityEl);
            const dx = entity.x - rel.x;
            const dy = entity.y - rel.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 0.5) return;
            const ndx = dx / len;
            const ndy = dy / len;
            const t = 1 / (Math.abs(ndx) / rel.hw + Math.abs(ndy) / rel.hh);

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", rel.x + ndx * t);
            circle.setAttribute("cy", rel.y + ndy * t);
            circle.setAttribute("r", "5");
            circle.setAttribute("fill", "#1e293b");
            circle.classList.add('totalidad-circle');
            targetSvg.appendChild(circle);
        });
    }
}
// ── Reiniciar ────────────────────────────────────────────
function resetExercise() {
    const cur = exercises[activeExercise];
    cur.nodes.forEach(n => {
        // Limpiar inputs del diagrama
        const el = document.getElementById(`input-${n.id}`);
        if (el) { el.value = ""; el.classList.remove('input-correct', 'input-incorrect'); }
        // Restaurar borde de cardinalidad
        if (n.type === 'cardinality') {
            const container = document.getElementById(n.id);
            if (container) {
                container.classList.remove('border-emerald-500', 'border-rose-500', 'border-transparent');
                container.classList.add('border-slate-600');
            }
        }
        // Limpiar userValue de totalidad
        if (n.type === 'totalidad') { n.userValue = undefined; }
    });
    _totalidadCorrectMap = null; // limpiar mapa para que drawCrispConnectors no redibuje
    // Eliminar círculos de totalidad del SVG
    document.querySelectorAll('.totalidad-circle').forEach(c => c.remove());
    document.getElementById('feedback-alert').classList.add('hidden');
    const gb = document.getElementById('grade-box');
    gb.innerText = "--";
    gb.className = "text-2xl font-black text-slate-400 italic";
    // Resetear colores de botones del panel de totalidad
    document.querySelectorAll('.totalidad-btn').forEach(btn => {
        btn.className = 'totalidad-btn px-3 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded';
    });
}
// ── Siguiente ejercicio ──────────────────────────────────
function nextExercise() {
    loadExercise((activeExercise + 1) % exercises.length);
}
// ── Corregir ─────────────────────────────────────────────

// Seleccionar opción en totalidad
function selectTotalidad(nodeId, value) {
    const cur = exercises[activeExercise];
    const node = cur.nodes.find(n => n.id === nodeId);
    if (!node) return;
    node.userValue = value;
    // Mostrar selección visual (azul cuando seleccionado)
    document.querySelectorAll(`.totalidad-btn[data-nodeid="${nodeId}"]`).forEach(btn => {
        const isSelected = btn.getAttribute('data-value') === value;
        btn.classList.toggle('bg-blue-600', isSelected);
        btn.classList.toggle('border-blue-500', isSelected);
        btn.classList.toggle('bg-slate-700', !isSelected);
        btn.classList.toggle('border-slate-600', !isSelected);
    });
}

// Renderizar panel de totalidad
// Layout por relación: [S][N]  ◆ relación ◆  [S][N]
function renderTotalidadPanel(exercise) {
    const panel = document.getElementById('totalidad-panel');
    const questions = document.getElementById('totalidad-questions');
    if (!panel || !questions) return;

    const totalidadByRelation = {};
    exercise.nodes.forEach(n => {
        if (n.type === 'totalidad') {
            const match = n.id.match(/t_(.+?)_(left|right)/);
            if (match) {
                const relIndex = match[1], side = match[2];
                if (!totalidadByRelation[relIndex]) totalidadByRelation[relIndex] = {};
                totalidadByRelation[relIndex][side] = n;
            }
        }
    });

    if (Object.keys(totalidadByRelation).length === 0) {
        panel.classList.add('hidden');
        return;
    }

    panel.classList.remove('hidden');
    questions.innerHTML = '';

    function btnGroup(node) {
        if (!node) return '<div class="w-20"></div>';
        return `
            <div class="flex gap-1">
                <button class="totalidad-btn w-9 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded hover:bg-violet-800 hover:border-violet-500 transition"
                    onclick="selectTotalidad('${node.id}','S')" data-nodeid="${node.id}" data-value="S">S</button>
                <button class="totalidad-btn w-9 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 hover:border-slate-500 transition"
                    onclick="selectTotalidad('${node.id}','N')" data-nodeid="${node.id}" data-value="N">N</button>
            </div>`;
    }

    Object.entries(totalidadByRelation).forEach(([relIndex, sides]) => {
        const rel = exercise.nodes.find(n => n.type === 'relation' && n.id === `r_${relIndex}`);
        if (!rel) return;

        const row = document.createElement('div');
        row.className = 'flex items-center justify-center gap-3 bg-slate-800/50 px-4 py-2.5 rounded-lg border border-violet-700/40';
        row.innerHTML = `
            ${btnGroup(sides.left)}
            <span class="text-sm font-bold text-violet-300 whitespace-nowrap">◆ ${rel.correctValue} ◆</span>
            ${btnGroup(sides.right)}
        `;
        questions.appendChild(row);
    });
}

function checkAnswers() {
    const cur   = exercises[activeExercise];
    const total = cur.nodes.filter(n => !!n.correctValue).length;
    // Map: attrId → parentId (from connections where the attr is the "from" side)
    const parentMap = {};
    cur.connections.forEach(({ from, to }) => {
        const fromNode = cur.nodes.find(n => n.id === from);
        if (fromNode?.type === 'attribute') parentMap[from] = to;
    });
    // Group attribute nodes by parent
    const attrGroups = {};
    cur.nodes.forEach(n => {
        if (n.type !== 'attribute' || !n.correctValue) return;
        const parent = parentMap[n.id] ?? '__orphan__';
        (attrGroups[parent] = attrGroups[parent] ?? []).push(n.id);
    });
    // Build correctness map:
    // - key attributes (isKey:true): exact match required
    // - non-key attributes within same parent: order-independent
    const correctMap = {};
    Object.values(attrGroups).forEach(nodeIds => {
        // Separate key nodes from non-key nodes
        const keyIds    = nodeIds.filter(id => cur.nodes.find(n => n.id === id).isKey);
        const nonKeyIds = nodeIds.filter(id => !cur.nodes.find(n => n.id === id).isKey);
        // Key attrs: exact match
        keyIds.forEach(id => {
            const node = cur.nodes.find(n => n.id === id);
            const el   = document.getElementById(`input-${id}`);
            const val  = el ? el.value.trim().toLowerCase() : '';
            correctMap[id] = val === node.correctValue.toLowerCase();
        });
        // Non-key attrs: order-independent pool
        const pool = nonKeyIds.map(id => cur.nodes.find(n => n.id === id).correctValue.toLowerCase());
        nonKeyIds.forEach(id => {
            const el  = document.getElementById(`input-${id}`);
            const val = el ? el.value.trim().toLowerCase() : '';
            const idx = pool.indexOf(val);
            if (idx !== -1) { pool.splice(idx, 1); correctMap[id] = true; }
            else correctMap[id] = false;
        });
    });
    // Non-attribute nodes: exact match OR flexible entity order
    const entities = cur.nodes.filter(n => n.type === 'entity' && n.correctValue);
    cur.nodes.forEach(n => {
        if (!n.correctValue || n.type === 'attribute') return;
        const el = document.getElementById(`input-${n.id}`);
        if (!el) return;

        if (n.type === 'totalidad') {
            // Para totalidad: acepta "S" (Sí) o "N" (No) según lo definido en correctValue
            const val = el.value.trim().toUpperCase();
            correctMap[n.id] = val === n.correctValue;
        } else {
            correctMap[n.id] = el.value.trim().toLowerCase() === n.correctValue.toLowerCase();
        }
    });
    // Si hay exactamente 2 entidades y ambas son incorrectas, intentar intercambiar
    if (entities.length === 2) {
        const [e1, e2] = entities;
        const e1_correct = correctMap[e1.id];
        const e2_correct = correctMap[e2.id];
        // Si ambas son incorrectas, intenta intercambiar valores
        if (!e1_correct && !e2_correct) {
            const el1 = document.getElementById(`input-${e1.id}`);
            const el2 = document.getElementById(`input-${e2.id}`);
            if (el1 && el2) {
                const v1 = el1.value.trim().toLowerCase();
                const v2 = el2.value.trim().toLowerCase();
                if (v1 === e2.correctValue.toLowerCase() && v2 === e1.correctValue.toLowerCase()) {
                    correctMap[e1.id] = true;
                    correctMap[e2.id] = true;
                    // Revalidar atributos con padres intercambiados
                    const allKeyValues = [];
                    Object.entries(attrGroups).forEach(([parentId, nodeIds]) => {
                        if (parentId !== e1.id && parentId !== e2.id) return;
                        nodeIds.forEach(id => {
                            const node = cur.nodes.find(n => n.id === id);
                            if (node?.isKey) allKeyValues.push(node.correctValue.toLowerCase());
                        });
                    });
                    Object.entries(attrGroups).forEach(([parentId, nodeIds]) => {
                        if (parentId !== e1.id && parentId !== e2.id) return; // solo padres entidades
                        const swappedParent = parentId === e1.id ? e2.id : e1.id;
                        const swappedAttrGroup = attrGroups[swappedParent] || [];
                        // Mezclar los dos grupos de atributos para validación flexible
                        const allAttrNodeIds = [...nodeIds, ...swappedAttrGroup];
                        const keyIds = allAttrNodeIds.filter(id => cur.nodes.find(n => n.id === id).isKey);
                        const nonKeyIds = allAttrNodeIds.filter(id => !cur.nodes.find(n => n.id === id).isKey);
                        // Revalidar claves como pool combinado
                        const keyPool = [...allKeyValues];
                        keyIds.forEach(id => {
                            const el = document.getElementById(`input-${id}`);
                            if (!el) return;
                            const val = el.value.trim().toLowerCase();
                            const idx = keyPool.indexOf(val);
                            if (idx !== -1) { keyPool.splice(idx, 1); correctMap[id] = true; }
                        });
                        // Revalidar no-claves como pool combinado
                        const nonKeyPool = nonKeyIds.map(id => cur.nodes.find(n => n.id === id).correctValue.toLowerCase());
                        nonKeyIds.forEach(id => {
                            const el = document.getElementById(`input-${id}`);
                            if (!el) return;
                            const val = el.value.trim().toLowerCase();
                            const idx = nonKeyPool.indexOf(val);
                            if (idx !== -1) { nonKeyPool.splice(idx, 1); correctMap[id] = true; }
                        });
                    });
                }
            }
        }
    }
    // Apply styles and count
    let hits = 0;
    cur.nodes.forEach(n => {
        if (!n.correctValue) return;
        const el = document.getElementById(`input-${n.id}`);
        if (!el) return;
        const ok = correctMap[n.id] ?? false;
        el.classList.toggle('input-correct',   ok);
        el.classList.toggle('input-incorrect', !ok);
        if (ok) hits++;
    });
    drawCrispConnectors();
    // Calificación /10
    const grade     = Math.round((hits / total) * 10);
    const approved  = grade >= 6;
    const gb        = document.getElementById('grade-box');
    gb.innerText    = `${grade}/10`;
    gb.className    = `text-2xl font-black italic ${approved ? 'text-emerald-500' : 'text-rose-500'}`;
    // Feedback en pantalla
    const fb  = document.getElementById('feedback-alert');
    fb.classList.remove(
        'hidden',
        'bg-emerald-950','text-emerald-300','border-emerald-700',
        'bg-amber-950', 'text-amber-300', 'border-amber-700'
    );
    const pct = Math.round((hits / total) * 100);
    const msg = hits === total
        ? `🎉 ¡Perfecto! Completaste el modelo E-R de <strong>"${cur.title}"</strong> — ${grade}/10`
        : `👀 <strong>${hits} de ${total}</strong> correctas (${pct}%) — Calificación: <strong>${grade}/10</strong>. Revisá las marcas rojas.`;
    fb.classList.add(
        ...(hits === total
            ? ['bg-emerald-950','text-emerald-300','border-emerald-700']
            : ['bg-amber-950',  'text-amber-300', 'border-amber-700'])
    );
    fb.innerHTML = `<span class="text-sm">${msg}</span>`;
    requestAnimationFrame(drawCrispConnectors);
    if (evalMode) {
        const btn = document.querySelector('button[onclick="checkAnswers()"]');
        if (btn) {
            btn.disabled = true;
            btn.className = 'w-full py-3.5 bg-slate-700/50 text-slate-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700';
            btn.textContent = '✓ Diagrama registrado';
        }
    }
}

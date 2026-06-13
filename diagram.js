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
                if (!['entity','aggregation'].includes(otherNode?.type)) return;
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
    _totalidadCorrectMap = null;
    document.querySelectorAll('.totalidad-circle').forEach(c => c.remove());
    document.getElementById('feedback-alert').classList.add('hidden');
    const gb = document.getElementById('grade-box');
    gb.innerText = "--";
    gb.className = "text-2xl font-black text-slate-400 italic";
    // Resetear colores de botones del panel de totalidad
    document.querySelectorAll('.totalidad-btn').forEach(btn => {
        btn.className = 'totalidad-btn px-3 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded';
    });
    // Resetear contadores de intentos del diagrama
    diagramAttemptScores = [];
    // Limpiar palabra seleccionada
    highlightedWord = null;
    const ss = document.getElementById('selection-status');
    if (ss) ss.innerText = "";
    document.querySelectorAll('#word-bank .word-tag').forEach(b => b.classList.remove('ring-2','ring-yellow-400','bg-yellow-900/40'));
    // Re-habilitar botón Corregir y actualizar banco de palabras
    if (typeof _resetCorregirBtn === 'function') _resetCorregirBtn();
    if (typeof updateWordBankVisuals === 'function') updateWordBankVisuals();
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

        // Buscar entidades conectadas: left = entidad → relación, right = relación → entidad
        const leftConn   = exercise.connections.find(c => c.to === rel.id &&
            exercise.nodes.find(n => n.id === c.from)?.type === 'entity');
        const rightConn  = exercise.connections.find(c => c.from === rel.id &&
            exercise.nodes.find(n => n.id === c.to)?.type === 'entity');
        const leftEntity  = leftConn  ? exercise.nodes.find(n => n.id === leftConn.from)  : null;
        const rightEntity = rightConn ? exercise.nodes.find(n => n.id === rightConn.to)   : null;

        // Para relaciones horizontales, ordenar por x para que coincida con el diagrama
        const dx = Math.abs((leftEntity?.x ?? 0) - (rightEntity?.x ?? 0));
        const dy = Math.abs((leftEntity?.y ?? 0) - (rightEntity?.y ?? 0));
        const isHorizontal = dx > dy;
        const needsSwap = isHorizontal && leftEntity && rightEntity && leftEntity.x > rightEntity.x;

        const labelA = needsSwap ? rightEntity?.correctValue : leftEntity?.correctValue;
        const labelB = needsSwap ? leftEntity?.correctValue  : rightEntity?.correctValue;
        const nodeA  = needsSwap ? sides.right : sides.left;
        const nodeB  = needsSwap ? sides.left  : sides.right;

        const row = document.createElement('div');
        row.className = 'flex items-center justify-center gap-3 bg-slate-800/50 px-4 py-2.5 rounded-lg border border-violet-700/40';
        row.innerHTML = `
            <div class="flex flex-col items-center gap-1">
                <span class="text-[10px] text-slate-400 font-semibold">${labelA ?? ''}</span>
                ${btnGroup(nodeA)}
            </div>
            <span class="text-sm font-bold text-violet-300 whitespace-nowrap">◆ ${rel.correctValue} ◆</span>
            <div class="flex flex-col items-center gap-1">
                <span class="text-[10px] text-slate-400 font-semibold">${labelB ?? ''}</span>
                ${btnGroup(nodeB)}
            </div>
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

        if (n.type === 'totalidad') {
            // Totalidad se valida desde userValue (botones del panel inferior)
            const val = (n.userValue || '').toUpperCase();
            correctMap[n.id] = val === n.correctValue.toUpperCase();
        } else {
            const el = document.getElementById(`input-${n.id}`);
            if (!el) return;
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
    const totalidadMap = {};
    cur.nodes.forEach(n => {
        if (!n.correctValue) return;
        const ok = correctMap[n.id] ?? false;
        if (n.type === 'totalidad') {
            // Colorear botones S/N del panel inferior
            totalidadMap[n.id] = ok;
            document.querySelectorAll(`.totalidad-btn[data-nodeid="${n.id}"]`).forEach(btn => {
                const isSelected = btn.getAttribute('data-value') === (n.userValue || '').toUpperCase();
                btn.classList.remove('bg-emerald-700','border-emerald-500','bg-rose-700','border-rose-500','bg-blue-600','border-blue-500','bg-slate-700','border-slate-600');
                if (isSelected) {
                    btn.classList.add(ok ? 'bg-emerald-700' : 'bg-rose-700', ok ? 'border-emerald-500' : 'border-rose-500');
                } else {
                    btn.classList.add('bg-slate-700','border-slate-600');
                }
            });
            if (ok) hits++;
        } else {
            const el = document.getElementById(`input-${n.id}`);
            if (!el) return;
            el.classList.toggle('input-correct',   ok);
            el.classList.toggle('input-incorrect', !ok);
            if (ok) hits++;
        }
    });
    _totalidadCorrectMap = Object.keys(totalidadMap).length > 0 ? totalidadMap : null;
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
    // Registrar intento
    if (!evalMode) {
        diagramAttemptScores.push({ hits, total, grade });
        const histHtml = diagramAttemptScores
            .map((s, i) => `<span class="font-bold">Intento ${i+1}:</span> ${s.grade}/10`)
            .join(' &nbsp;|&nbsp; ');
        fb.innerHTML = `<span class="text-sm">${msg}</span><div class="mt-1.5 text-xs text-slate-300">${histHtml}</div>`;
        if (diagramAttemptScores.length >= 3) {
            const btn = document.querySelector('button[onclick="checkAnswers()"]');
            if (btn) {
                btn.disabled = true;
                btn.className = 'w-full py-3.5 bg-slate-700/50 text-slate-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700';
                btn.textContent = '✓ Máximo 3 intentos';
            }
            // Congelar banco de palabras restantes
            document.querySelectorAll('#word-bank button').forEach(b => {
                b.disabled = true;
                b.classList.add('opacity-40', 'cursor-not-allowed');
                b.onclick = null;
            });
            // Deshabilitar inputs del canvas
            document.querySelectorAll('#diagram-nodes input').forEach(inp => {
                inp.disabled = true;
            });
        }
    } else {
        fb.innerHTML = `<span class="text-sm">${msg}</span>`;
    }
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

// ── Guardar diagrama como PNG ─────────────────────────────
async function saveAsPNG() {
    const btn = document.getElementById('png-btn');
    const canvasEl = document.getElementById('er-canvas');
    const cur = exercises[activeExercise];
    if (btn) { btn.textContent = '⏳ Generando…'; btn.disabled = true; }

    const SCALE = 2;
    const cr = canvasEl.getBoundingClientRect();
    const W  = cr.width;
    const H  = cr.height;

    const off = document.createElement('canvas');
    off.width  = W * SCALE;
    off.height = H * SCALE;
    const ctx = off.getContext('2d');
    ctx.scale(SCALE, SCALE);

    // Fondo con puntos
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#c8d5e8';
    for (let x = 11; x < W; x += 22)
        for (let y = 11; y < H; y += 22) {
            ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        }

    const typeMap = {};
    cur.nodes.forEach(n => typeMap[n.id] = n.type);

    function elC(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left-cr.left+r.width/2, y: r.top-cr.top+r.height/2,
                 hw: r.width/2, hh: r.height/2,
                 l: r.left-cr.left, t: r.top-cr.top, w: r.width, h: r.height };
    }
    function edgePt(c, tx, ty, type) {
        const dx=tx-c.x, dy=ty-c.y, len=Math.sqrt(dx*dx+dy*dy);
        if (len<0.5) return {x:c.x,y:c.y};
        const nx=dx/len, ny=dy/len;
        let t;
        if (type==='attribute'||type==='cardinality')
            t = 1/Math.sqrt((nx/c.hw)**2+(ny/c.hh)**2);
        else if (type==='relation')
            t = 1/(Math.abs(nx)/c.hw+Math.abs(ny)/c.hh);
        else
            t = Math.min(c.hw/Math.abs(nx||1e-9), c.hh/Math.abs(ny||1e-9));
        return {x:c.x+nx*t, y:c.y+ny*t};
    }

    // ── Detectar autorelaciones ───────────────────────────
    const autoRelIds = new Set();
    cur.connections.forEach(({from, to}) => {
        if (typeMap[from]==='entity' && typeMap[to]==='relation' &&
            cur.connections.some(c => c.from===to && c.to===from))
            autoRelIds.add(to);
    });

    // ── Conectores ────────────────────────────────────────
    ctx.lineCap = 'round';
    cur.connections.forEach(({from, to, role}) => {
        // Omitir líneas card↔autorelación (se posicionan por x,y)
        if (typeMap[from]==='cardinality' && autoRelIds.has(to)) return;
        if (typeMap[to]==='cardinality'   && autoRelIds.has(from)) return;

        const aEl=document.getElementById(from), bEl=document.getElementById(to);
        if (!aEl||!bEl) return;
        const ca=elC(aEl), cb=elC(bEl);

        const isAutoEnt = typeMap[from]==='entity'   && autoRelIds.has(to);
        const isAutoRel = typeMap[from]==='relation' && autoRelIds.has(from) && typeMap[to]==='entity';

        let p1, p2;
        if (isAutoEnt) {
            // entidad → top del rombo
            p1 = {x: ca.x, y: ca.y - ca.hh};
            p2 = {x: cb.x, y: cb.y - cb.hh};
        } else if (isAutoRel) {
            // bottom del rombo → entidad
            p1 = {x: ca.x, y: ca.y + ca.hh};
            p2 = {x: cb.x, y: cb.y + cb.hh};
        } else {
            p1 = edgePt(ca,cb.x,cb.y,typeMap[from]);
            p2 = edgePt(cb,ca.x,ca.y,typeMap[to]);
        }

        const isAttr = typeMap[from]==='attribute'||typeMap[to]==='attribute';
        ctx.strokeStyle = isAttr ? '#10b981' : '#94a3b8';
        ctx.lineWidth   = isAttr ? 1.5 : 2;
        ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();

        // Etiqueta de rol
        if (role && (isAutoEnt || isAutoRel)) {
            const rt = isAutoEnt ? 0.68 : 0.32;
            const mx = p1.x + (p2.x-p1.x)*rt;
            const my = p1.y + (p2.y-p1.y)*rt + (isAutoEnt ? -10 : 10);
            ctx.save();
            ctx.fillStyle='#475569'; ctx.font='600 10px sans-serif';
            ctx.textAlign='start'; ctx.textBaseline='middle';
            ctx.fillText(role, mx-30, my);
            ctx.restore();
        }
    });

    // ── Nodos ─────────────────────────────────────────────
    cur.nodes.forEach(n => {
        if (n.type==='totalidad') return;
        const el=document.getElementById(n.id); if (!el) return;
        const c=elC(el);
        const inp=document.getElementById('input-'+n.id);
        const val=inp?inp.value:'';
        const ok=inp&&inp.classList.contains('input-correct');
        const bad=inp&&inp.classList.contains('input-incorrect');
        const tc = ok?'#059669': bad?'#dc2626':'#1e293b';

        ctx.save();
        if (n.type==='entity') {
            ctx.fillStyle='#eff6ff'; ctx.strokeStyle='#3b82f6'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.rect(c.l,c.t,c.w,c.h); ctx.fill(); ctx.stroke();
            if (n.isWeak) {
                ctx.beginPath(); ctx.rect(c.l+3,c.t+3,c.w-6,c.h-6); ctx.stroke();
            }
        } else if (n.type==='relation') {
            ctx.fillStyle='#fdf2f8'; ctx.strokeStyle='#db2777'; ctx.lineWidth=3.5;
            ctx.beginPath();
            ctx.moveTo(c.x,c.t); ctx.lineTo(c.l+c.w,c.y);
            ctx.lineTo(c.x,c.t+c.h); ctx.lineTo(c.l,c.y);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            if (n.isDoubleRelation) {
                const m=8; ctx.lineWidth=2.5;
                ctx.beginPath();
                ctx.moveTo(c.x,c.t+m); ctx.lineTo(c.l+c.w-m,c.y);
                ctx.lineTo(c.x,c.t+c.h-m); ctx.lineTo(c.l+m,c.y);
                ctx.closePath(); ctx.stroke();
            }
        } else if (n.type==='attribute') {
            ctx.fillStyle='#f0fdf4';
            ctx.strokeStyle = n.isMultivalued ? '#059669' : '#10b981';
            ctx.lineWidth=2;
            if (n.isDerived) ctx.setLineDash([4,4]);
            ctx.beginPath(); ctx.ellipse(c.x,c.y,c.hw,c.hh,0,0,Math.PI*2);
            ctx.fill(); ctx.stroke();
            if (n.isMultivalued) {
                ctx.lineWidth=1.5;
                ctx.beginPath(); ctx.ellipse(c.x,c.y,c.hw-4,c.hh-4,0,0,Math.PI*2); ctx.stroke();
            }
            ctx.setLineDash([]);
        } else if (n.type==='cardinality') {
            ctx.fillStyle='#ffffff';
            ctx.beginPath(); ctx.arc(c.x,c.y,Math.min(c.hw,c.hh)-1,0,Math.PI*2);
            ctx.fill();
        } else if (n.type==='isa') {
            ctx.fillStyle='#ffffff'; ctx.strokeStyle='#475569'; ctx.lineWidth=3;
            ctx.beginPath();
            ctx.moveTo(c.x,c.t+2); ctx.lineTo(c.l+c.w-2,c.t+c.h-2); ctx.lineTo(c.l+2,c.t+c.h-2);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle='#64748b'; ctx.font='bold 8px sans-serif';
            ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText('ISA',c.x,c.y+6);
            ctx.restore(); return;
        } else if (n.type==='aggregation') {
            ctx.strokeStyle='#94a3b8'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.rect(c.l,c.t,c.w,c.h);
            ctx.stroke();
            ctx.restore(); return;
        }

        // Texto
        const fs = n.type==='cardinality' ? 13 : 10;
        const fw = n.type==='cardinality' ? '800' : '700';
        ctx.fillStyle = val ? tc : '#cbd5e1';
        ctx.font = fw+' '+fs+'px "Plus Jakarta Sans",sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        const label = val || '?';
        ctx.fillText(label, c.x, c.y);
        if (val && n.isKey) {
            const tw = ctx.measureText(val).width;
            const uy = c.y + fs/2 + 1;
            if (n.isDashed) {
                ctx.save();
                ctx.setLineDash([3,3]);
                ctx.strokeStyle = tc;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(c.x-tw/2, uy+0.5);
                ctx.lineTo(c.x+tw/2, uy+0.5);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            } else {
                ctx.fillRect(c.x-tw/2, uy, tw, 1);
            }
        }
        ctx.restore();
    });

    // ── Círculos de totalidad ─────────────────────
    cur.nodes.forEach(n => {
        if (n.type !== 'totalidad') return;
        const userVal = (n.userValue || '').toUpperCase();
        if (userVal !== 'S') return;
        {
            const match = n.id.match(/t_(.+?)_(left|right)/);
            if (!match) return;
            const relEl = document.getElementById('r_' + match[1]);
            if (!relEl) return;
            const rel = elC(relEl);

            let entityEl = null, minDist = Infinity;
            cur.connections.forEach(conn => {
                const otherId = conn.from === 'r_'+match[1] ? conn.to
                              : conn.to   === 'r_'+match[1] ? conn.from : null;
                if (!otherId) return;
                const otherNode = cur.nodes.find(nd => nd.id === otherId);
                if (!['entity','aggregation'].includes(otherNode?.type)) return;
                const dist = Math.hypot(otherNode.x - n.x, otherNode.y - n.y);
                if (dist < minDist) { minDist = dist; entityEl = document.getElementById(otherId); }
            });
            if (!entityEl) return;

            const ent = elC(entityEl);
            const dx = ent.x - rel.x, dy = ent.y - rel.y;
            const len = Math.sqrt(dx*dx + dy*dy);
            if (len < 0.5) return;
            const ndx = dx/len, ndy = dy/len;
            const t = 1 / (Math.abs(ndx)/rel.hw + Math.abs(ndy)/rel.hh);

            ctx.save();
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(rel.x + ndx*t, rel.y + ndy*t, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    });

    // ── Historial de intentos (banda inferior) ────────────
    const hasHistory = (diagramAttemptScores.length > 0) || (analysisAttemptScores.length > 0);
    if (hasHistory && !evalMode) {
        const bandH = 28;
        // Ampliar canvas
        const oldData = ctx.getImageData(0, 0, W*SCALE, H*SCALE);
        off.height = (H + bandH) * SCALE;
        ctx.putImageData(oldData, 0, 0);
        ctx.scale(SCALE, SCALE);  // redimensionar resetea el transform — re-aplicar
        // Fondo de la banda
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, H, W, bandH);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.stroke();
        // Texto
        ctx.font = 'bold 9px "Plus Jakarta Sans",sans-serif';
        ctx.textBaseline = 'middle';
        const y = H + bandH / 2;
        let x = 12;
        if (diagramAttemptScores.length > 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Diseño E-R:', x, y);
            x += ctx.measureText('Diseño E-R:').width + 6;
            diagramAttemptScores.forEach((s, i) => {
                if (i > 0) { ctx.fillStyle = '#475569'; ctx.fillText('|', x, y); x += ctx.measureText('|').width + 6; }
                ctx.fillStyle = s.grade >= 6 ? '#34d399' : '#f87171';
                ctx.fillText(`Int.${i+1}: ${s.grade}/10`, x, y);
                x += ctx.measureText(`Int.${i+1}: ${s.grade}/10`).width + 8;
            });
            x += 10;
        }
        if (analysisAttemptScores.length > 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Análisis:', x, y);
            x += ctx.measureText('Análisis:').width + 6;
            analysisAttemptScores.forEach((s, i) => {
                if (i > 0) { ctx.fillStyle = '#475569'; ctx.fillText('|', x, y); x += ctx.measureText('|').width + 6; }
                ctx.fillStyle = s.pct >= 60 ? '#34d399' : '#f87171';
                ctx.fillText(`Int.${i+1}: ${s.hits}/${s.total}`, x, y);
                x += ctx.measureText(`Int.${i+1}: ${s.hits}/${s.total}`).width + 8;
            });
        }
    }

    // ── RNE (banda inferior si hay texto — aplica a cualquier ejercicio) ──────
    {
        const rneText = (localStorage.getItem('rne_' + activeExercise) || '').trim();
        if (rneText) {
            const curH = off.height / SCALE;
            // Medir y partir el texto en líneas
            ctx.font = '10px "Plus Jakarta Sans",sans-serif';
            const maxW = W - 24;
            const words = ('RNE: ' + rneText).split('');
            // wrap char a char para manejar símbolos matemáticos correctamente
            const lines = [];
            let line = '';
            for (const ch of ('RNE: ' + rneText).split(' ')) {
                const test = line ? line + ' ' + ch : ch;
                if (ctx.measureText(test).width > maxW && line) {
                    lines.push(line); line = ch;
                } else { line = test; }
            }
            if (line) lines.push(line);
            const rneH = lines.length * 16 + 18;
            const oldD2 = ctx.getImageData(0, 0, W*SCALE, off.height);
            off.height = (curH + rneH) * SCALE;
            ctx.putImageData(oldD2, 0, 0);
            ctx.scale(SCALE, SCALE);
            // Fondo de la banda RNE
            ctx.fillStyle = '#042f3d';
            ctx.fillRect(0, curH, W, rneH);
            ctx.strokeStyle = '#164e63';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, curH); ctx.lineTo(W, curH); ctx.stroke();
            // Texto
            ctx.fillStyle = '#67e8f9';
            ctx.font = '10px "Plus Jakarta Sans",sans-serif';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            lines.forEach((l, i) => ctx.fillText(l, 12, curH + 9 + i * 16));
        }
    }

    // Descarga
    try {
        const nombre = exercises[activeExercise].title.replace(/[^a-zA-Z0-9]/g,'_');
        const link=document.createElement('a');
        link.download='ER_'+nombre+'.png';
        link.href=off.toDataURL('image/png');
        link.click();
    } catch(err) {
        console.error('PNG error:',err);
        alert('No se pudo generar la imagen.');
    } finally {
        if (btn) { btn.textContent='🖼️ Guardar como PNG'; btn.disabled=false; }
    }
}

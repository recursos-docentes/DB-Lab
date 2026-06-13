let activeExercise  = 0;
let highlightedWord = null;
let analysisAttempts = 0;
let diagramAttemptScores  = [];  // [{hits, total, grade}] — se resetea al cambiar ejercicio
let analysisAttemptScores = [];  // [{hits, total, pct}]   — ídem
let usedWords = new Set();     // Palabras ya colocadas en el diagrama
let wordClassifications = {};
let wordAttrTypes = {};
let wordEntityTypes = {};
let wordCompounds = {};        // idx → [component words]
let selectedComponents = new Set();
let activeWordIdx = null;
let evalMode = false;  // false = ejercitación, true = evaluación
let _totalidadCorrectMap = null; // establecido por checkAnswers, leído por drawCrispConnectors
let textZoom = 100;    // zoom level for consigna (tab análisis)
let descZoom = 100;    // zoom level for descripción (tab diseño)
// ── Control de zoom para la consigna (tab análisis) ──────
function zoomText(direction) {
    const minZoom = 80;
    const maxZoom = 150;
    const step = 10;
    textZoom = Math.max(minZoom, Math.min(maxZoom, textZoom + (direction * step)));
    const textEl = document.getElementById('analyze-text');
    if (textEl) {
        textEl.style.fontSize = (textZoom / 100) + 'em';
    }
    const levelEl = document.getElementById('zoom-level');
    if (levelEl) {
        levelEl.textContent = textZoom + '%';
    }
}
// ── Control de zoom para la descripción (tab diseño) ─────
function zoomDescription(direction) {
    const minZoom = 80;
    const maxZoom = 150;
    const step = 10;
    descZoom = Math.max(minZoom, Math.min(maxZoom, descZoom + (direction * step)));
    const descEl = document.getElementById('problem-description');
    if (descEl) {
        descEl.style.fontSize = (descZoom / 100) + 'em';
    }
    const levelEl = document.getElementById('desc-zoom-level');
    if (levelEl) {
        levelEl.textContent = descZoom + '%';
    }
}
window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('selection-status')) return; // solo en er-designer.html
    _initMode();
    document.addEventListener('click', hidePopup);
    // Fecha de hoy en la cabecera de impresión
    const hoy = new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dateEl = document.getElementById('exam-date');
    if (dateEl) dateEl.value = hoy;
    // Generar opciones de ejercicios dinámicamente desde el array exercises
    ['exercise-select', 'analyze-select'].forEach(selId => {
        const sel = document.getElementById(selId);
        if (!sel) return;
        sel.innerHTML = exercises.map((ex, i) =>
            `<option value="${i}">${ex.title}</option>`
        ).join('');
    });
    // Leer parámetro ?ejercicio=N de la URL (viene desde index.html)
    const params   = new URLSearchParams(window.location.search);
    const ejercicio = parseInt(params.get('ejercicio') ?? '0');
    const inicio    = isNaN(ejercicio) ? 0 : Math.max(0, Math.min(ejercicio, exercises.length - 1));
    loadExercise(inicio);
    window.addEventListener('resize', drawCrispConnectors);
    if (!localStorage.getItem('ert_tutorial_seen')) showTutorial();
});
// ── Divisor redimensionable ──────────────────────────────
(function initResizer() {
    const handle    = document.getElementById('resize-handle');
    const leftPanel = document.getElementById('left-panel');
    if (!handle || !leftPanel) return;
    let dragging = false, startX = 0, startW = 0;
    handle.addEventListener('mousedown', e => {
        dragging = true;
        startX   = e.clientX;
        startW   = leftPanel.offsetWidth;
        document.body.style.cursor     = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const newW = Math.max(220, Math.min(startW + (e.clientX - startX), window.innerWidth * 0.55));
        leftPanel.style.width = newW + 'px';
    });
    document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        document.body.style.cursor     = '';
        document.body.style.userSelect = '';
        requestAnimationFrame(drawCrispConnectors);
    });
})();
// ── Accesibilidad ────────────────────────────────────────
function toggleAccessibility() {
    document.body.classList.toggle('high-contrast-mode');
}
function toggleHint() {
    document.getElementById('hint-box').classList.toggle('hidden');
}
// ── Avisos del ejercicio (panel anclado al nav) ──────────
let _noticesTimeout = null;  // usado también en setStage (analysis.js)

function showExerciseToasts(exercise) {
    const content = document.getElementById('notices-content');
    const btn     = document.getElementById('notices-btn');
    const wrapper = document.getElementById('notices-wrapper');
    if (!content) return;

    const notices = [];
    if (exercise.nodes.some(n => n.type === 'totalidad')) {
        notices.push({
            icon: '🔵',
            text: '<strong>Este ejercicio tiene participación total.</strong> Al completar el diagrama, recordar marcar la totalidad en el panel inferior.',
            border: '#7c3aed', bg: 'rgba(46,16,101,0.55)', color: '#ede9fe'
        });
    }
    // Detectar RNE: campo explícito tiene precedencia; si no, inferir por concepto
    const rneConceptos = ['autorelacion', 'generalizacion', 'agregacion'];
    const hasRNE = exercise.rne != null || rneConceptos.includes(exercise.concept);
    if (hasRNE) {
        notices.push({
            icon: '📋',
            text: '<strong>Este ejercicio requiere RNE.</strong> Al terminar el diagrama, no olvidar escribir las Restricciones No Estructurales.',
            border: '#0891b2', bg: 'rgba(8,51,68,0.70)', color: '#cffafe'
        });
    }

    // Vaciar contenido (ocultar wrapper hasta que se vaya al tab de diseño)
    content.innerHTML = '';
    if (wrapper) wrapper.classList.add('hidden');

    if (notices.length === 0) return;

    // Poblar contenido del panel
    notices.forEach(n => {
        const div = document.createElement('div');
        div.style.cssText = `background:${n.bg};border:1px solid ${n.border};color:${n.color};
            border-radius:8px;padding:10px 12px;display:flex;align-items:flex-start;
            gap:8px;font-size:12px;line-height:1.6;`;
        div.innerHTML = `<span style="font-size:1.25em;flex-shrink:0;margin-top:1px;">${n.icon}</span><span>${n.text}</span>`;
        content.appendChild(div);
    });

    // Color del botón: cyan si tiene RNE, violeta si solo totalidad
    if (btn) {
        btn.style.borderColor = hasRNE ? '#0891b2' : '#7c3aed';
        btn.style.color       = hasRNE ? '#67e8f9' : '#c4b5fd';
    }
    // La visibilidad del wrapper la maneja setStage() en analysis.js
}

function toggleNoticesPanel() {
    const panel = document.getElementById('notices-panel');
    if (!panel) return;
    // Si se abre manualmente, cancelar el auto-cierre
    if (!panel.classList.contains('hidden') && _noticesTimeout) {
        clearTimeout(_noticesTimeout); _noticesTimeout = null;
    }
    panel.classList.toggle('hidden');
}

// ── Cargar ejercicio ─────────────────────────────────────
function loadExercise(index) {
    activeExercise  = parseInt(index);
    highlightedWord = null;
    usedWords.clear();  // Limpiar palabras usadas al cargar nuevo ejercicio
    document.getElementById('selection-status').innerText = "";
    document.getElementById('exercise-select').value = index;
    const asel = document.getElementById('analyze-select');
    if (asel) asel.value = index;
    document.getElementById('progress-indicator').innerText = `${activeExercise + 1} de ${exercises.length}`;
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('feedback-alert').classList.add('hidden');
    // Resetear calificación
    const gb = document.getElementById('grade-box');
    gb.innerText = "--";
    gb.className = "text-2xl font-black text-slate-400 italic";
    const cur = exercises[activeExercise];
    document.getElementById('problem-description').innerHTML = cur.description;
    document.getElementById('hint-box').innerHTML = `<strong>Guía del docente:</strong> ${cur.hint}`;
    // Mostrar instrucciones de totalidad si el ejercicio tiene nodos de totalidad
    const hasTotalityNodes = cur.nodes.some(n => n.type === 'totalidad');
    const totalidadInstructions = document.getElementById('totalidad-instructions');
    if (totalidadInstructions) {
        totalidadInstructions.classList.toggle('hidden', !hasTotalityNodes);
    }
    // Banco de palabras: mezclado, estilo dark
    const bank = document.getElementById('word-bank');
    bank.innerHTML = "";
    const shuffled = [...cur.wordBank].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => {
        const btn = document.createElement('button');
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300 word-tag";
        btn.innerText = word;
        btn.onclick = () => selectWord(word, btn);
        bank.appendChild(btn);
    });
    renderInteractiveCanvas(cur);
    renderTotalidadPanel(cur);
    renderRNEPanel(cur);
    updateWordBankVisuals();
    renderAnalysisPanel(activeExercise);
    _resetCorregirBtn();
    diagramAttemptScores  = [];
    analysisAttemptScores = [];
    showExerciseToasts(cur);
    setStage('analyze');
}
// ── Actualizar estado visual de palabras usadas ──────────
function updateWordBankVisuals() {
    const cur = exercises[activeExercise];
    // Contar cuántas veces aparece cada palabra en el word-bank
    const wordCounts = {};
    cur.wordBank.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    // Contar cuántas veces está cada palabra en inputs llenos
    const filledCounts = {};
    document.querySelectorAll('.diagram-input').forEach(inp => {
        if (inp.value && inp.value !== "") {
            const word = inp.value;
            filledCounts[word] = (filledCounts[word] || 0) + 1;
        }
    });
    // Marcar como gris solo si se usó la cantidad máxima de veces
    document.getElementById('word-bank').querySelectorAll('button').forEach(b => {
        const word = b.innerText;
        const maxAllowed = wordCounts[word] || 0;
        const used = filledCounts[word] || 0;
        if (used >= maxAllowed) {
            // Gris si se usó todas las veces disponibles
            b.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-500 word-tag opacity-50";
            b.disabled = true;
        } else {
            // Normal si hay más disponibles
            b.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300 word-tag";
            b.disabled = false;
        }
    });
}
// ── Seleccionar palabra del banco ────────────────────────
function selectWord(word, el) {
    const cur = exercises[activeExercise];
    // Contar cuántas veces está permitida esta palabra
    const maxAllowed = cur.wordBank.filter(w => w === word).length;
    // Contar cuántas veces ya está usada
    const used = Array.from(document.querySelectorAll('.diagram-input'))
        .filter(inp => inp.value === word).length;
    // No permitir si ya se usó todas las veces
    if (used >= maxAllowed) return;
    highlightedWord = word;
    document.getElementById('selection-status').innerText = `📝 Pegarás: "${word}"`;
    // Quitar selección anterior y actualizar colores
    updateWordBankVisuals();
    el.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-white bg-emerald-600 word-tag-selected";
}
// ── Renderizar el canvas interactivo ─────────────────────
function renderInteractiveCanvas(exercise) {
    const container = document.getElementById('diagram-nodes');
    container.innerHTML = "";
    exercise.nodes.forEach(node => {
        if (node.type === 'totalidad') return;   // se manejan en el panel inferior
        const el = document.createElement('div');
        el.id = node.id;
        el.style.cssText = `
            left: ${node.x}%;
            top: ${node.y}%;
            width: ${node.w}px;
            height: ${node.h}px;
            position: absolute;
            transform: translate(-50%, -50%);
        `;
        let html = "";
        if (node.type === "entity") {
            el.className = "bg-blue-50 border-2 border-blue-500 shadow-md flex justify-center items-center p-2 z-20 relative";
            const innerRect = node.isWeak
                ? `<div class="absolute inset-[3px] border-2 border-blue-500 pointer-events-none"></div>`
                : '';
            html = innerRect + `
                <input type="text" id="input-${node.id}" placeholder="?"
                    class="diagram-input w-full h-full text-xs text-center leading-none border-none bg-transparent relative z-10"
                    onclick="fillSlot('${node.id}')" readonly>
            `;
        } else if (node.type === "relation") {
            el.className = "relative flex justify-center items-center z-20";
            const innerDiamond = node.isDoubleRelation
                ? `<polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#db2777" stroke-width="3" stroke-linejoin="round"/>`
                : '';
            html = `
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="50,3 97,50 50,97 3,50" fill="#fdf2f8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
                    ${innerDiamond}
                </svg>
                <div class="relative z-30 flex items-center justify-center text-center w-full h-full">
                    <input type="text" id="input-${node.id}" placeholder="?"
                        class="diagram-input w-10/12 h-full text-[11px] text-center leading-none border-none bg-transparent"
                        onclick="fillSlot('${node.id}')" readonly>
                </div>
            `;
        } else if (node.type === "attribute") {
            let borderClass, inputExtra;
            if (node.isKey) {
                borderClass = "border-2 border-emerald-500";
                inputExtra  = node.isDashed ? "underline decoration-dashed" : "underline";
            } else if (node.isMultivalued) {
                borderClass = "border-double border-[4px] border-emerald-600";
                inputExtra  = "";
            } else if (node.isDerived) {
                borderClass = "border-2 border-dashed border-emerald-500";
                inputExtra  = "";
            } else {
                borderClass = "border-2 border-emerald-500";
                inputExtra  = "";
            }
            el.className = `bg-emerald-50 rounded-[50%] shadow-sm flex justify-center items-center z-20 ${borderClass}`;
            html = `
                <input type="text" id="input-${node.id}" placeholder="?"
                    class="diagram-input w-11/12 h-11/12 text-[10px] text-center leading-none border-none bg-transparent ${inputExtra}"
                    onclick="fillSlot('${node.id}')" readonly>
            `;
        } else if (node.type === "cardinality") {
            el.className = "bg-white border-2 border-slate-600 rounded-full flex items-center justify-center shadow-md z-30 overflow-hidden";
            html = `
                <input type="text" id="input-${node.id}" placeholder="?"
                    class="diagram-input w-full h-full text-sm font-extrabold text-center uppercase border-none bg-transparent"
                    onclick="fillSlot('${node.id}')" readonly>
            `;
        } else if (node.type === "totalidad") {
            el.className = "bg-white border-2 border-slate-600 rounded-lg flex items-center justify-center shadow-md z-30 overflow-hidden";
            html = `
                <input type="text" id="input-${node.id}" placeholder="S/N" maxlength="1"
                    class="diagram-input w-full h-full text-xs font-bold text-center uppercase border-none bg-transparent"
                    title="Escribir S (Sí) o N (No)">
            `;
        } else if (node.type === "isa") {
            el.className = "relative z-20 pointer-events-none";
            html = `
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="50,4 96,96 4,96" fill="white" stroke="#475569" stroke-width="5" stroke-linejoin="round"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center pb-2">
                    <span class="text-[9px] font-extrabold text-slate-500 tracking-widest select-none" style="margin-top:18px;">ISA</span>
                </div>
            `;
        } else if (node.type === "aggregation") {
            el.className = "z-10 pointer-events-none";
            el.style.border = "2px solid #94a3b8";
            el.style.borderRadius = "4px";
            html = "";
        }
        el.innerHTML = html;
        container.appendChild(el);
    });
    setTimeout(drawCrispConnectors, 150);
}
// ── Panel de Totalidad ────────────────────────────────────
function renderTotalidadPanel(exercise) {
    const panel     = document.getElementById('totalidad-panel');
    const questions = document.getElementById('totalidad-questions');
    if (!panel || !questions) return;

    const totalidadNodes = exercise.nodes.filter(n => n.type === 'totalidad');
    if (totalidadNodes.length === 0) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    questions.innerHTML = '';

    // Agrupar por índice de relación (formato id: t_{idx}_{left|right})
    const groups = {};
    totalidadNodes.forEach(n => {
        const m = n.id.match(/t_(.+?)_(left|right)/);
        if (!m) return;
        if (!groups[m[1]]) groups[m[1]] = {};
        groups[m[1]][m[2]] = n;
    });

    Object.keys(groups).sort().forEach(relIdx => {
        const relNode   = exercise.nodes.find(n => n.id === `r_${relIdx}`);
        const relName   = relNode?.correctValue || `r_${relIdx}`;
        const leftConn  = exercise.connections.find(c => c.to === `r_${relIdx}` && !c.from.startsWith('c_'));
        const rightConn = exercise.connections.find(c => c.from === `r_${relIdx}` && !c.to.startsWith('c_'));
        const leftNode  = leftConn  ? exercise.nodes.find(n => n.id === leftConn.from)  : null;
        const rightNode = rightConn ? exercise.nodes.find(n => n.id === rightConn.to)   : null;

        function sideLabel(node) {
            if (!node) return '?';
            if (node.type === 'aggregation') return '(agregación)';
            return node.correctValue || node.id;
        }

        const relDiv = document.createElement('div');
        relDiv.className = 'flex flex-col gap-1.5 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50';

        const relTitle = document.createElement('p');
        relTitle.className = 'text-xs font-bold text-violet-300 mb-1';
        relTitle.textContent = `Relación: ${relName}`;
        relDiv.appendChild(relTitle);

        ['left', 'right'].forEach(side => {
            const tNode = groups[relIdx][side];
            if (!tNode) return;
            const label = side === 'left' ? sideLabel(leftNode) : sideLabel(rightNode);

            const row = document.createElement('div');
            row.className = 'flex items-center gap-2';

            const lbl = document.createElement('span');
            lbl.className = 'text-xs text-slate-300 flex-1 truncate';
            lbl.textContent = label;
            row.appendChild(lbl);

            ['S', 'N'].forEach(val => {
                const btn = document.createElement('button');
                btn.className = 'totalidad-btn px-3 py-1 text-xs font-extrabold border rounded-lg transition-all active:scale-95 bg-slate-700 border-slate-600 text-white';
                btn.textContent = val;
                btn.setAttribute('data-nodeid', tNode.id);
                btn.setAttribute('data-value', val);
                btn.onclick = () => {
                    tNode.userValue = val;
                    document.querySelectorAll(`.totalidad-btn[data-nodeid="${tNode.id}"]`).forEach(b => {
                        const active = b.getAttribute('data-value') === val;
                        b.classList.remove('bg-blue-600','border-blue-500','bg-slate-700','border-slate-600');
                        b.classList.add(active ? 'bg-blue-600' : 'bg-slate-700', active ? 'border-blue-500' : 'border-slate-600');
                    });
                };
                row.appendChild(btn);
            });

            relDiv.appendChild(row);
        });

        questions.appendChild(relDiv);
    });
}
// ── Panel de Restricciones No Estructurales (RNE) ─────────
const RNE_HINTS = {
    autorelacion:  'Auto-relación: expresar que una instancia no puede relacionarse consigo misma. ' +
                   'Ej: ∀ x ∈ ENTIDAD → (x,x) ∉ relacion',
    generalizacion:'Categorización: indicar si las subclases son disjuntas (A ∩ B = ∅) ' +
                   'y/o si la cobertura es total (SUPER = A ∪ B).',
    agregacion:    'Agregación: para que exista la relación externa, debe existir la tupla en la relación base. ' +
                   'Ej: ∀ a ∈ ENT_A, ∀ b ∈ ENT_B, ∀ c ∈ ENT_C, ((a,b),c) ∈ rel_externa si (a,b) ∈ rel_base',
    basica:        'Restricción de dominio: expresar la condición que deben cumplir los valores ' +
                   'de los atributos. Ej: Salario > 0,  Fecha_nac ≤ fecha_actual,  Edad ≥ 18'
};

function renderRNEPanel(exercise) {
    const panel      = document.getElementById('rne-panel');
    const hintEl     = document.getElementById('rne-hint');
    const ta         = document.getElementById('rne-textarea');
    const cb         = document.getElementById('rne-toggle-cb');
    const toggleRow  = document.getElementById('rne-toggle-row');
    if (!panel) return;

    // Mostrar siempre el toggle (setStage lo oculta/muestra según tab)
    if (toggleRow) toggleRow.classList.remove('hidden');

    // Determinar si es RNE estructural (auto-activa) o requiere toggle manual
    const rneConceptos = ['autorelacion', 'generalizacion', 'agregacion'];
    const isStructural = exercise.rne != null
        ? !['basica'].includes(exercise.rne)
        : rneConceptos.includes(exercise.concept);

    // Tipo de RNE para el hint
    const rneType = exercise.rne != null
        ? exercise.rne
        : (rneConceptos.includes(exercise.concept) ? exercise.concept : 'basica');

    // Estado activo: estructural siempre activo, básica según toggle guardado o texto existente
    const savedToggle = localStorage.getItem('rne_active_' + activeExercise);
    const savedText   = (localStorage.getItem('rne_' + activeExercise) || '').trim();
    const isActive    = isStructural || savedToggle === '1' || savedText.length > 0;

    if (cb) cb.checked = isActive;

    if (isActive) {
        panel.classList.remove('hidden');
        if (hintEl) hintEl.textContent = RNE_HINTS[rneType] || RNE_HINTS.basica;
        if (ta) ta.value = localStorage.getItem('rne_' + activeExercise) || '';
    } else {
        panel.classList.add('hidden');
    }
}

function onRneToggle() {
    const cb     = document.getElementById('rne-toggle-cb');
    const panel  = document.getElementById('rne-panel');
    const hintEl = document.getElementById('rne-hint');
    const ta     = document.getElementById('rne-textarea');
    if (!cb || !panel) return;

    const cur = exercises[activeExercise];
    if (cb.checked) {
        panel.classList.remove('hidden');
        localStorage.setItem('rne_active_' + activeExercise, '1');
        // Hint para básica si no hay rne estructural
        const rneConceptos = ['autorelacion', 'generalizacion', 'agregacion'];
        const rneType = (cur.rne != null && !['basica'].includes(cur.rne))
            ? cur.rne
            : (rneConceptos.includes(cur.concept) ? cur.concept : 'basica');
        if (hintEl) hintEl.textContent = RNE_HINTS[rneType] || RNE_HINTS.basica;
        if (ta) ta.value = localStorage.getItem('rne_' + activeExercise) || '';
        if (ta) ta.focus();
    } else {
        panel.classList.add('hidden');
        localStorage.removeItem('rne_active_' + activeExercise);
    }
}

function saveRNE() {
    const ta = document.getElementById('rne-textarea');
    if (ta) localStorage.setItem('rne_' + activeExercise, ta.value);
}

function insertRNEChar(char) {
    const ta = document.getElementById('rne-textarea');
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + char + ta.value.slice(e);
    ta.selectionStart = ta.selectionEnd = s + char.length;
    ta.focus();
    saveRNE();
}

// ── Pegar palabra en un slot ──────────────────────────────
function fillSlot(nodeId) {
    const inp = document.getElementById(`input-${nodeId}`);
    if (!inp) return;
    const cur  = exercises[activeExercise];
    const node = cur?.nodes.find(n => n.id === nodeId);
    // Si ya tiene valor: devolver al banco
    if (inp.value) {
        inp.value = '';
        inp.classList.remove('input-correct', 'input-incorrect');
        if (node?.type === 'cardinality') {
            const container = document.getElementById(nodeId);
            if (container) {
                container.classList.remove('border-transparent', 'border-emerald-500', 'border-rose-500');
                container.classList.add('border-slate-600');
            }
        }
        updateWordBankVisuals();
        return;
    }
    // Si está vacío: colocar palabra seleccionada
    if (highlightedWord === null) return;
    inp.value = highlightedWord;
    inp.classList.remove('input-correct', 'input-incorrect');
    if (node?.type === 'cardinality') {
        const container = document.getElementById(nodeId);
        if (container) {
            container.classList.remove('border-slate-600', 'border-emerald-500', 'border-rose-500');
            container.classList.add('border-transparent');
        }
    }
    highlightedWord = null;
    document.getElementById('selection-status').innerText = "";
    updateWordBankVisuals();
}
// ── Dibujar conectores con recorte a bordes de figura ────
// ── Conceptos ─────────────────────────────────────────────
function showConcepts() { document.getElementById('concepts-modal').classList.remove('hidden'); }
function closeConcepts() { document.getElementById('concepts-modal').classList.add('hidden'); }

// ── Glosario ──────────────────────────────────────────────
function showGlossary() { document.getElementById('glossary-modal').classList.remove('hidden'); }
function closeGlossary() { document.getElementById('glossary-modal').classList.add('hidden'); }

// ── Tutorial ──────────────────────────────────────────────
let _tutorialStep = 0;
function showTutorial() {
    _tutorialStep = 0;
    _renderTutorialStep();
    document.getElementById('tutorial-modal').classList.remove('hidden');
}
function closeTutorial() {
    document.getElementById('tutorial-modal').classList.add('hidden');
    localStorage.setItem('ert_tutorial_seen', '1');
}
function nextTutorialStep() {
    const steps = document.querySelectorAll('.tutorial-step');
    if (_tutorialStep >= steps.length - 1) { closeTutorial(); return; }
    _tutorialStep++;
    _renderTutorialStep();
}
function _renderTutorialStep() {
    const steps = document.querySelectorAll('.tutorial-step');
    const dots  = document.querySelectorAll('[data-dot]');
    steps.forEach((s, i) => s.classList.toggle('hidden', i !== _tutorialStep));
    dots.forEach((d, i)  => d.className = `w-2 h-2 rounded-full ${i === _tutorialStep ? 'bg-indigo-500' : 'bg-slate-600'}`);
    const btn = document.getElementById('tutorial-next-btn');
    btn.textContent = _tutorialStep === steps.length - 1 ? '\u00a1Comenzar! \ud83d\ude80' : 'Siguiente \u2192';
}

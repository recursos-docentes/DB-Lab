let activeExercise  = 0;
let highlightedWord = null;
let analysisAttempts = 0;
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
    _initMode();
    document.addEventListener('click', hidePopup);
    // Fecha de hoy en la cabecera de impresión
    const hoy = new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dateEl = document.getElementById('exam-date');
    if (dateEl) dateEl.value = hoy;
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
    updateWordBankVisuals();
    renderAnalysisPanel(activeExercise);
    _resetCorregirBtn();
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
        if (node.type === 'totalidad') return;
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
            // Entidad débil: doble borde (borde exterior + borde interior)
            if (node.isWeak) {
                el.className = "bg-blue-50 border-2 border-blue-500 shadow-md flex justify-center items-center p-2 z-20";
                html = `
                    <div class="absolute inset-[3px] border-2 border-blue-500 pointer-events-none"></div>
                    <input type="text" id="input-${node.id}" placeholder="?"
                        class="diagram-input w-full h-full text-xs text-center leading-none border-none bg-transparent relative z-10"
                        onclick="fillSlot('${node.id}')" readonly>
                `;
            } else {
                el.className = "bg-blue-50 border-2 border-blue-500 shadow-md flex justify-center items-center p-2 z-20";
                html = `
                    <input type="text" id="input-${node.id}" placeholder="?"
                        class="diagram-input w-full h-full text-xs text-center leading-none border-none bg-transparent"
                        onclick="fillSlot('${node.id}')" readonly>
                `;
            }
        } else if (node.type === "relation") {
            el.className = "relative flex justify-center items-center z-20";
            // Autorelación: rombo un 25% más grande (se escala desde el centro)
            const isAutoRel = exercise.connections.some(c => c.from === node.id &&
                exercise.connections.some(c2 => c2.from === c.to && c2.to === node.id));
            if (isAutoRel) {
                el.style.transform = 'translate(-50%, -50%) scale(1.25)';
            }
            // Relación identificadora (entidad débil): doble rombo
            if (node.isDoubleRelation) {
                html = `
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="50,3 97,50 50,97 3,50" fill="#fdf2f8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
                        <polygon points="50,12 88,50 50,88 12,50" fill="none" stroke="#db2777" stroke-width="2.5" stroke-linejoin="round"/>
                    </svg>
                    <div class="relative z-30 flex items-center justify-center text-center w-full h-full">
                        <input type="text" id="input-${node.id}" placeholder="?"
                            class="diagram-input w-10/12 h-full text-[11px] text-center leading-none border-none bg-transparent"
                            onclick="fillSlot('${node.id}')" readonly>
                    </div>
                `;
            } else {
                html = `
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="50,3 97,50 50,97 3,50" fill="#fdf2f8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
                    </svg>
                    <div class="relative z-30 flex items-center justify-center text-center w-full h-full">
                        <input type="text" id="input-${node.id}" placeholder="?"
                            class="diagram-input w-10/12 h-full text-[11px] text-center leading-none border-none bg-transparent"
                            onclick="fillSlot('${node.id}')" readonly>
                    </div>
                `;
            }
        } else if (node.type === "attribute") {
            let borderClass, inputExtra;
            if (node.isKey) {
                borderClass = "border-2 border-emerald-500";
                inputExtra  = "underline";
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
        }
        el.innerHTML = html;
        container.appendChild(el);
    });
    setTimeout(drawCrispConnectors, 150);
}
// ── Pegar palabra en un slot ──────────────────────────────
function fillSlot(nodeId) {
    if (highlightedWord === null) return;
    const inp = document.getElementById(`input-${nodeId}`);
    if (!inp) return;
    inp.value = highlightedWord;
    inp.classList.remove('input-correct', 'input-incorrect');

    // Cardinalidades: ocultar borde del círculo al llenarlo
    const cur  = exercises[activeExercise];
    const node = cur?.nodes.find(n => n.id === nodeId);
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

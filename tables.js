// tables.js — Lógica interactiva "Pasaje a tablas" para DB-Lab v3
// renderTablesPanel(exerciseIdx) es llamado desde analysis.js cuando se entra al tab
// Licencia CC BY-SA 4.0 — Diseñada por Prof. Elizabeth Izquierdo con asistencia de Claude

// ── Reglas relacionales (7 opciones que el estudiante debe elegir) ────────────
const REL_RULES = [
    {
        id: 'multivaluado',
        text: 'Atributo multivaluado → tabla aparte con FK a la entidad + el valor (PK compuesta)',
        generatesTable: true,
        icon: '≡'
    },
    {
        id: 'entidad_debil',
        text: 'Entidad débil → su clave es compuesta: FK de la entidad fuerte + clave parcial propia',
        generatesTable: true,
        icon: '⛓'
    },
    {
        id: 'nn',
        text: 'N:N → tabla intermedia con PK compuesta (FKs de ambas entidades)',
        generatesTable: true,
        icon: '⊗'
    },
    {
        id: '1n_total',
        text: '1:N con totalidad del lado N → FK en la tabla del lado N (sin nueva tabla)',
        generatesTable: false,
        icon: '→'
    },
    {
        id: '1n_sintot',
        text: '1:N sin totalidad → nueva tabla (PK = clave del lado N)',
        generatesTable: true,
        icon: '⊕'
    },
    {
        id: 'auto_nn',
        text: 'Autorelación N:N → tabla intermedia con dos roles distintos para la misma entidad',
        generatesTable: true,
        icon: '↺'
    },
    {
        id: 'agg_total',
        text: 'Agregación con totalidad → FK en la tabla del lado N de la agregación',
        generatesTable: false,
        icon: '◈'
    }
];

// ── Estado de la sesión de tablas ─────────────────────────────────────────────
let _tabExIdx    = -1;   // índice del ejercicio activo
let _tabData     = null; // tablesData[exerciseIdx]
let _tabPhase    = 0;    // 0=entidades 1=relaciones 2=completo
let _tabRelIdx   = 0;    // índice de relación actual (fase 1)
let _tabRelPhase = 0;    // 0=selección regla, 1=completar tabla/FK
let _tabEntSlots = {};   // clave "ti_fi" → valor ingresado
let _tabRelSlots = {};   // clave "ri_fi" → valor ingresado
let _tabFKAdd    = {};   // {tableName: [{name,fkTo}]} FKs acumuladas de relaciones sin tabla
let _tabRelDone  = [];   // booleano por relación: ¿fue completada correctamente?
let _tabEntAttempts = []; // [{hits, total}] — intentos de "Validar entidades"
let _tabRelAttempts = {}; // { relIdx: [{hits, total}] } — intentos por relación
let _tabFKAttempts  = []; // [{matched, total, pct}] — intentos de "Validar restricciones FK"
let _tabFKTableCorrect = {}; // { relIdx: bool } — ¿ya eligió bien la tabla del FK placement?
let _tabFKOptionOrder  = {}; // { relIdx: [tabla1, tabla2] } — orden mezclado de opciones, estable por relación

// ── Punto de entrada principal ────────────────────────────────────────────────
function renderTablesPanel(exerciseIdx) {
    const container = document.getElementById('stage-tables');
    if (!container) return;

    if (!tablesData || !tablesData[exerciseIdx]) {
        container.innerHTML = `
            <div class="flex items-center justify-center flex-1 p-8">
                <div class="text-center">
                    <span class="text-5xl block mb-4">📊</span>
                    <p class="text-slate-400 text-sm">No hay datos de pasaje a tablas para este ejercicio.</p>
                </div>
            </div>`;
        return;
    }

    _tabExIdx    = exerciseIdx;
    _tabData     = tablesData[exerciseIdx];
    _tabPhase    = 0;
    _tabRelIdx   = 0;
    _tabRelPhase = 0;
    _tabEntSlots = {};
    _tabRelSlots = {};
    _tabFKAdd    = {};
    _tabRelDone  = _tabData.relations.map(() => false);
    _tabEntAttempts = [];
    _tabRelAttempts = {};
    _tabFKAttempts  = [];
    _tabFKTableCorrect = {};
    _tabFKOptionOrder  = {};

    _renderTablesShell(container);
    _renderPhase();
}

// ── Shell permanente (barra superior + área de contenido) ─────────────────────
function _renderTablesShell(container) {
    container.innerHTML = `
    <div class="flex flex-col flex-1 w-full max-w-[1400px] mx-auto p-4 gap-4" style="min-height:640px;">

        <!-- Barra superior -->
        <div class="no-print flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3">
            <span class="text-indigo-300 font-extrabold text-sm">📊 Pasaje a tablas</span>
            <span id="tab-ex-title" class="text-slate-400 text-xs">— ${_tabData.title}</span>
            <div class="ml-auto flex items-center gap-2">
                <!-- Subir / cambiar imagen de referencia MER -->
                <label title="Subir o cambiar la imagen MER de referencia"
                    class="px-3 py-1.5 bg-amber-800/40 hover:bg-amber-700/50 border border-amber-700/40 rounded-lg text-xs text-amber-200 font-semibold transition flex items-center gap-1.5 cursor-pointer">
                    <span id="tab-mer-upload-text">🖼️ Subir MER</span>
                    <input type="file" accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                        class="hidden" onchange="handleMerRefImage(event)">
                </label>
                <!-- Imagen de referencia MER -->
                <button onclick="_tabToggleMerPanel()" id="btn-show-mer"
                    class="hidden px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 font-semibold transition flex items-center gap-1.5">
                    🖼️ Ver MER
                </button>
                <!-- Guardar progreso -->
                <button onclick="_tabSaveJSON()" title="Descarga un archivo .json con el progreso actual"
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 font-semibold transition">
                    💾 Guardar
                </button>
                <!-- Exportar PDF -->
                <button onclick="_tabExportPDF()" title="Exportar como PDF"
                    class="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 rounded-lg text-xs text-white font-semibold transition flex items-center gap-1.5">
                    📄 PDF
                </button>
            </div>
        </div>

        <!-- Panel de imagen MER de referencia (colapsable) -->
        <div id="tab-mer-panel" class="hidden bg-slate-900 border border-amber-700/40 rounded-2xl p-3">
            <div class="flex items-center justify-between mb-2">
                <span class="text-amber-300 text-xs font-bold">🖼️ Imagen MER de referencia</span>
                <button onclick="_tabToggleMerPanel()" class="text-slate-500 hover:text-slate-300 text-sm">✕</button>
            </div>
            <img id="tab-mer-img" src="" alt="MER de referencia"
                class="max-w-full rounded-xl border border-slate-700" style="max-height:400px;">
        </div>

        <!-- Indicador de fases -->
        <div class="no-print flex items-center gap-2">
            ${['Entidades', 'Relaciones', 'Esquema completo'].map((ph, i) => `
                <div id="tab-phase-${i}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition
                    ${i === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}">
                    <span>${i + 1}</span><span>${ph}</span>
                </div>
                ${i < 2 ? '<span class="text-slate-600 text-xs">→</span>' : ''}
            `).join('')}
        </div>

        <!-- Contenido principal de la fase -->
        <div id="tab-phase-content" class="flex-1 flex flex-col gap-4"></div>

    </div>`;

    // Sincronizar botón "Ver MER" si hay imagen de referencia
    _tabSyncMerButton();
}

// ── Sincronizar botón MER con imagen global ───────────────────────────────────
function _tabSyncMerButton() {
    const btn = document.getElementById('btn-show-mer');
    const uploadText = document.getElementById('tab-mer-upload-text');
    const url = window.merRefImageUrl || '';
    if (btn) btn.classList.toggle('hidden', !url);
    if (uploadText) uploadText.textContent = url ? '✓ Cambiar MER' : '🖼️ Subir MER';
}

function _tabToggleMerPanel() {
    const panel = document.getElementById('tab-mer-panel');
    const img   = document.getElementById('tab-mer-img');
    if (!panel || !img) return;
    const url = window.merRefImageUrl || '';
    if (!url) return;
    img.src = url;
    panel.classList.toggle('hidden');
}

// ── Despachar fase actual ─────────────────────────────────────────────────────
function _renderPhase() {
    // Actualizar indicadores de fase
    for (let i = 0; i < 3; i++) {
        const el = document.getElementById(`tab-phase-${i}`);
        if (!el) continue;
        const active = i === _tabPhase;
        const done   = i < _tabPhase;
        el.className = `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition
            ${active ? 'bg-indigo-600 text-white' : done ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-500'}`;
    }

    const content = document.getElementById('tab-phase-content');
    if (!content) return;
    content.innerHTML = '';

    if (_tabPhase === 0) _renderPhaseEntities(content);
    else if (_tabPhase === 1) _renderPhaseRelations(content);
    else _renderPhaseComplete(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 0 — Entidades
// ─────────────────────────────────────────────────────────────────────────────
function _renderPhaseEntities(container) {
    const data = _tabData;

    // Construir banco de palabras (todos los campos de todas las entidades)
    const allFields = [];
    data.entityTables.forEach(tbl => {
        tbl.fields.forEach(f => {
            allFields.push(f.name);
        });
    });
    // Mezclar
    const shuffled = [...allFields].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="bg-amber-950/30 border border-amber-700/40 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed">
            <strong>Fase 1 — Entidades:</strong> Completar la notación relacional de cada entidad.
            Hacer clic en una palabra del banco y luego en el casillero donde corresponde.
            <br><span class="text-amber-300/70">Notación: <code>TABLA(<u>PK</u>, campo1, campo2)</code> — los campos PK van subrayados y primero.</span>
        </div>

        <!-- Banco de palabras -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Banco de palabras</p>
            <div id="tab-word-bank" class="flex flex-wrap gap-2">
                ${shuffled.map(w => `
                    <button data-word="${_esc(w)}" onclick="_tabSelectWord(this.dataset.word)"
                        class="tab-word px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95">
                        ${_esc(w)}
                    </button>`).join('')}
            </div>
        </div>

        <!-- Tablas de entidades -->
        <div class="grid gap-4 ${data.entityTables.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-' + data.entityTables.length}">
            ${data.entityTables.map((tbl, ti) => _renderEntityTableUI(tbl, ti)).join('')}
        </div>

        <!-- Botón validar -->
        <div class="flex gap-3">
            <button id="btn-validate-ent" onclick="_tabValidateEntities()"
                class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm transition active:scale-[0.98] shadow-lg">
                📝 Validar entidades
            </button>
        </div>
        <div id="tab-ent-feedback" class="hidden p-4 rounded-2xl text-sm font-bold border"></div>
    `;

    _tabSelectedWord = null;
    _tabRefreshWordBank();
}

// ── Banco de palabras (fase Entidades): refresca selección y disponibilidad ───
function _tabRefreshWordBank() {
    const data = _tabData;
    if (!data) return;
    const allFields = [];
    data.entityTables.forEach(tbl => tbl.fields.forEach(f => allFields.push(f.name)));
    const counts = {};
    allFields.forEach(w => counts[w] = (counts[w] || 0) + 1);
    const used = {};
    Object.values(_tabEntSlots).forEach(w => { used[w] = (used[w] || 0) + 1; });

    document.querySelectorAll('#tab-word-bank .tab-word').forEach(b => {
        const word = b.dataset.word;
        const usedUp = (used[word] || 0) >= (counts[word] || 0);
        const selected = _tabSelectedWord === word;
        b.disabled = usedUp;
        b.className = 'tab-word px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ' +
            (usedUp ? 'bg-slate-800 border border-slate-700 text-slate-600 opacity-50 cursor-not-allowed' :
             selected ? 'bg-amber-600 border border-amber-500 text-white' :
             'bg-amber-800/40 border border-amber-700/40 text-amber-200 hover:bg-amber-700/50');
    });
}

function _renderEntityTableUI(tbl, ti) {
    return `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
            <div class="text-center">
                <span class="text-indigo-300 font-extrabold text-sm">${_esc(_pluralize(tbl.name))}</span>
                ${tbl.note ? `<p class="text-slate-500 text-[10px] mt-1 leading-relaxed">${_esc(tbl.note)}</p>` : ''}
            </div>
            <div class="flex flex-wrap gap-1.5 justify-center items-start">
                ${tbl.fields.map((f, fi) => {
                    const label = fi === 0 ? 'PK ▼' : '';
                    const labelColor = fi === 0 ? 'text-pink-400' : 'text-slate-500';
                    return `
                        <div class="flex flex-col items-center">
                            <span class="text-[9px] font-bold ${labelColor} h-3 leading-3 block mb-0.5">${label}</span>
                            <button id="tab-slot-${ti}-${fi}" onclick="_tabFillSlot(${ti}, ${fi})"
                                class="tab-slot min-w-[80px] px-2 py-1.5 rounded-lg border-2 border-dashed border-slate-600 text-xs text-slate-500 hover:border-indigo-500 transition font-mono"
                                data-ti="${ti}" data-fi="${fi}">
                                ?
                            </button>
                        </div>`;
                }).join('')}
            </div>
        </div>`;
}

let _tabSelectedWord = null;

function _tabSelectWord(word) {
    _tabSelectedWord = (_tabSelectedWord === word) ? null : word;
    _tabRefreshWordBank();
}

function _tabFillSlot(ti, fi) {
    const btn = document.getElementById(`tab-slot-${ti}-${fi}`);
    if (!btn) return;
    const key = `${ti}_${fi}`;

    // Si el casillero ya tiene una palabra: un clic la devuelve al banco (igual que en Diseño E-R)
    if (_tabEntSlots[key]) {
        delete _tabEntSlots[key];
        btn.textContent = '?';
        btn.className = 'tab-slot min-w-[80px] px-2 py-1.5 rounded-lg border-2 border-dashed border-slate-600 text-xs text-slate-500 hover:border-indigo-500 transition font-mono';
        _tabRefreshWordBank();
        return;
    }

    if (!_tabSelectedWord) return;
    _tabEntSlots[key] = _tabSelectedWord;
    btn.textContent = _tabSelectedWord;
    btn.className = 'tab-slot min-w-[80px] px-2 py-1.5 rounded-lg border-2 border-amber-500 bg-amber-900/30 text-xs text-amber-200 font-bold font-mono transition cursor-pointer';
    _tabSelectedWord = null;
    _tabRefreshWordBank();
}

function _tabValidateEntities() {
    const data = _tabData;
    let allOk  = true;
    let errors = 0;
    const total = data.entityTables.reduce((n, tbl) => n + tbl.fields.length, 0);

    data.entityTables.forEach((tbl, ti) => {
        const pkSet    = new Set(tbl.fields.filter(f => f.isPK).map(f => f.name));
        const nonPkSet = new Set(tbl.fields.filter(f => !f.isPK).map(f => f.name));
        const pkZone   = tbl.fields.filter(f => f.isPK).length;

        tbl.fields.forEach((fld, fi) => {
            const btn = document.getElementById(`tab-slot-${ti}-${fi}`);
            if (!btn) return;
            const w   = _tabEntSlots[`${ti}_${fi}`];
            // Zona PK: índices 0..pkZone-1; resto: no-PK
            const ok  = w !== undefined && (fi < pkZone ? pkSet.has(w) : nonPkSet.has(w));
            if (ok) {
                btn.className = 'tab-slot min-w-[80px] px-2 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-900/30 text-xs text-emerald-200 font-bold font-mono transition';
            } else {
                btn.className = 'tab-slot min-w-[80px] px-2 py-1.5 rounded-lg border-2 border-rose-500 bg-rose-900/30 text-xs text-rose-300 font-bold font-mono transition';
                allOk = false;
                errors++;
            }
        });
    });

    const fb = document.getElementById('tab-ent-feedback');
    if (!fb) return;
    fb.classList.remove('hidden');

    // Registrar intento
    const hits = total - errors;
    _tabEntAttempts.push({ hits, total });
    const histHtml = _tabEntAttempts
        .map((s, i) => `<span class="font-bold">Intento ${i+1}:</span> ${s.hits}/${s.total}`)
        .join(' &nbsp;|&nbsp; ');
    const histBlock = `<div class="mt-2 pt-2 border-t border-slate-700/30 text-[11px] opacity-80">${histHtml}</div>`;

    if (allOk) {
        fb.className = 'p-4 rounded-2xl text-sm font-bold border bg-emerald-900/40 border-emerald-700 text-emerald-300';
        fb.innerHTML = `✅ ¡Correcto! Todas las entidades están bien completadas. Avanzar a la siguiente fase.${histBlock}`;
        // Avanzar
        setTimeout(() => {
            _tabPhase = 1;
            _tabRelIdx = 0;
            _tabRelPhase = 0;
            _renderPhase();
        }, 1200);
    } else if (_tabEntAttempts.length >= 3) {
        // Máximo de intentos: revelar la respuesta correcta y avanzar igual (no trancar al estudiante)
        data.entityTables.forEach((tbl, ti) => {
            tbl.fields.forEach((fld, fi) => {
                const btn = document.getElementById(`tab-slot-${ti}-${fi}`);
                if (!btn) return;
                _tabEntSlots[`${ti}_${fi}`] = fld.name;
                btn.textContent = fld.name;
                btn.className = 'tab-slot min-w-[80px] px-2 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-900/30 text-xs text-emerald-200 font-bold font-mono transition';
            });
        });
        fb.className = 'p-4 rounded-2xl text-sm font-bold border bg-amber-900/40 border-amber-700 text-amber-200';
        fb.innerHTML = `🔎 Máximo de intentos alcanzado — así se completan las entidades correctamente. Avanzar a la siguiente fase.${histBlock}`;
        setTimeout(() => {
            _tabPhase = 1;
            _tabRelIdx = 0;
            _tabRelPhase = 0;
            _renderPhase();
        }, 2200);
    } else {
        fb.className = 'p-4 rounded-2xl text-sm font-bold border bg-rose-900/40 border-rose-700 text-rose-300';
        fb.innerHTML = `❌ Hay ${errors} campo(s) incorrectos. Los casilleros marcados en rojo no corresponden a la zona correcta (PK o atributo). Revisar y reintentar.${histBlock}`;
    }
}

// ── Registro de intentos por relación (fase Relaciones) ───────────────────────
// kind: 'rule' (selección de regla) | 'fill' (completar tabla o confirmar FK)
function _tabRelLog(relIdx, kind, hits, total) {
    if (!_tabRelAttempts[relIdx]) _tabRelAttempts[relIdx] = { rule: [], fill: [] };
    _tabRelAttempts[relIdx][kind].push({ hits, total });
}
function _tabRelCount(relIdx, kind) {
    return ((_tabRelAttempts[relIdx] || {})[kind] || []).length;
}
function _tabRelHistHtml(relIdx, kind, label) {
    const list = (_tabRelAttempts[relIdx] || {})[kind] || [];
    if (list.length === 0) return '';
    const inner = list.map((s, i) => `Int.${i+1}: ${s.hits}/${s.total}`).join(' &nbsp;|&nbsp; ');
    return `<div class="mt-2 pt-2 border-t border-slate-700/30 text-[11px] opacity-80"><span class="font-bold">${label}:</span> ${inner}</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 1 — Relaciones
// ─────────────────────────────────────────────────────────────────────────────
function _renderPhaseRelations(container) {
    const data = _tabData;

    if (_tabRelIdx >= data.relations.length) {
        // Todas las relaciones completadas → avanzar a fase completa
        _tabPhase = 2;
        _renderPhase();
        return;
    }

    const rel     = data.relations[_tabRelIdx];
    const total   = data.relations.length;
    const current = _tabRelIdx + 1;

    container.innerHTML = `
        <div class="bg-amber-950/30 border border-amber-700/40 rounded-2xl p-4 text-xs text-amber-200 leading-relaxed">
            <strong>Fase 2 — Relaciones:</strong> Relación <strong>${current} de ${total}</strong>.
            Seleccionar la regla de pasaje que corresponde a la relación <strong class="text-white">"${_esc(rel.name)}"</strong>.
        </div>

        <!-- Tarjeta de la relación -->
        <div class="bg-slate-900 border border-indigo-800/50 rounded-2xl p-5 flex flex-col gap-3">
            <div class="flex items-center gap-3">
                <span class="text-2xl">🔗</span>
                <div>
                    <p class="text-white font-extrabold text-lg">"${_esc(rel.name)}"</p>
                    <p class="text-slate-400 text-xs">${_esc(rel.cardHint)}</p>
                </div>
            </div>

            ${_tabRelPhase === 0 ? _renderRuleSelector(rel) : _renderRelSubUI(rel)}
        </div>

        <div id="tab-rel-feedback" class="hidden p-4 rounded-2xl text-sm font-bold border"></div>
    `;
    _tabRelRefreshWordBank();
}

function _renderRuleSelector(rel) {
    return `
        <div class="border-t border-slate-800 pt-3">
            <p class="text-xs text-slate-400 font-bold mb-3">Seleccionar la regla de pasaje que aplica:</p>
            <div class="flex flex-col gap-2">
                ${REL_RULES.map(rule => `
                    <button onclick="_tabSelectRule('${rule.id}')"
                        class="w-full text-left px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-indigo-500 transition text-xs text-slate-300 flex items-start gap-3 group">
                        <span class="text-lg flex-shrink-0 group-hover:scale-110 transition">${rule.icon}</span>
                        <span>${_esc(rule.text)}</span>
                    </button>`).join('')}
            </div>
        </div>`;
}

function _tabSelectRule(ruleId) {
    const rel = _tabData.relations[_tabRelIdx];
    const fb  = document.getElementById('tab-rel-feedback');
    const ri  = _tabRelIdx;

    if (ruleId === rel.ruleId) {
        // Correcto
        _tabRelLog(ri, 'rule', 1, 1);
        if (fb) {
            fb.classList.remove('hidden');
            fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-emerald-900/40 border-emerald-700 text-emerald-300';
            fb.innerHTML = `✅ ¡Correcto! ${rel.ruleHint || ''}${_tabRelHistHtml(ri, 'rule', 'Regla')}`;
        }
        _tabRelPhase = 1;
        // Re-renderizar con el sub-UI
        setTimeout(() => _renderPhase(), 700);
    } else {
        // Incorrecto
        _tabRelLog(ri, 'rule', 0, 1);
        const chosen = REL_RULES.find(r => r.id === ruleId);

        if (_tabRelCount(ri, 'rule') >= 3) {
            // Máximo de intentos: revelar la regla correcta y avanzar igual (no trancar al estudiante)
            const correctRule = REL_RULES.find(r => r.id === rel.ruleId);
            if (fb) {
                fb.classList.remove('hidden');
                fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-amber-900/40 border-amber-700 text-amber-200';
                fb.innerHTML = `🔎 Máximo de intentos alcanzado. La regla correcta era: "${correctRule?.text}". ${rel.ruleHint || ''}${_tabRelHistHtml(ri, 'rule', 'Regla')}`;
            }
            _tabRelPhase = 1;
            setTimeout(() => _renderPhase(), 1600);
        } else {
            if (fb) {
                fb.classList.remove('hidden');
                fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-rose-900/40 border-rose-700 text-rose-300';
                fb.innerHTML = `❌ No es esa regla. Elegiste: "${chosen?.text}". Pensar en la cardinalidad y si hay totalidad en el MER. Reintentar.${_tabRelHistHtml(ri, 'rule', 'Regla')}`;
            }
        }
    }
}

function _renderRelSubUI(rel) {
    const rule = REL_RULES.find(r => r.id === rel.ruleId);
    if (!rule) return '';

    if (rel.generatesTable) {
        return _renderRelTableFill(rel, rule);
    } else {
        return _renderFKPlacement(rel, rule);
    }
}

function _renderRelTableFill(rel, rule) {
    const allFields = rel.tableFields.map(f => f.name);
    const shuffled  = [...allFields].sort(() => Math.random() - 0.5);
    const ri        = _tabRelIdx;

    return `
        <div class="border-t border-slate-800 pt-3 flex flex-col gap-3">
            <div class="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-3 text-xs text-emerald-300">
                ✅ Regla correcta: <strong>${_esc(rule.text)}</strong>
            </div>

            <p class="text-xs text-slate-400 font-bold">Completar la tabla que genera esta relación:</p>

            <!-- Banco palabras -->
            <div id="tab-rel-word-bank" class="flex flex-wrap gap-1.5">
                ${shuffled.map(w => `
                    <button data-word="${_esc(w)}" onclick="_tabRelSelectWord(this.dataset.word)"
                        class="tab-rel-word px-2.5 py-1 rounded-lg text-xs font-bold transition">
                        ${_esc(w)}
                    </button>`).join('')}
            </div>

            <!-- Tabla a completar -->
            <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                <p class="text-center text-indigo-300 font-extrabold text-sm mb-3">${_esc(_pluralizeRelTableName(rel.ruleId, rel.tableName))}</p>
                <div class="flex flex-wrap gap-2 justify-center items-start">
                    ${rel.tableFields.map((f, fi) => `
                        <div class="flex flex-col items-center gap-1">
                            <span class="text-[9px] ${f.isPK ? 'text-pink-400' : 'text-slate-500'} font-bold h-3 leading-3 block">${f.isPK ? 'PK' : ''}</span>
                            <button id="tab-rel-slot-${ri}-${fi}" onclick="_tabRelFillSlot(${ri}, ${fi})"
                                class="tab-rel-slot min-w-[90px] px-2 py-1.5 rounded-lg border-2 border-dashed border-slate-600 text-xs text-slate-500 hover:border-amber-500 transition font-mono">
                                ?
                            </button>
                        </div>`).join('')}
                </div>
            </div>

            <button id="btn-validate-rel-${ri}" onclick="_tabValidateRelTable(${ri})"
                class="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition active:scale-95">
                ✔ Validar tabla
            </button>
        </div>`;
}

function _renderFKPlacement(rel, rule) {
    const fp = rel.fkPlacement;
    const ri = _tabRelIdx;

    if (!_tabFKTableCorrect[ri]) {
        // Preguntar: todavía no reveló la tabla correcta
        const correctTable = fp.targetTable;
        const otherTable   = fp.fkFields[0]?.fkTo;
        if (!_tabFKOptionOrder[ri]) {
            _tabFKOptionOrder[ri] = [correctTable, otherTable].filter(Boolean).sort(() => Math.random() - 0.5);
        }
        return `
            <div class="border-t border-slate-800 pt-3 flex flex-col gap-3">
                <div class="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-3 text-xs text-emerald-300">
                    ✅ Regla correcta: <strong>${_esc(rule.text)}</strong>
                </div>
                <div class="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 text-xs flex flex-col gap-3">
                    <p class="text-indigo-300 font-bold">¿En qué tabla se agrega la FK?</p>
                    <div class="flex flex-wrap gap-2">
                        ${_tabFKOptionOrder[ri].map(t => `
                            <button onclick="_tabSelectFKTable('${_esc(t)}')"
                                class="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-indigo-500 transition text-xs text-slate-200 font-bold">
                                ${_esc(_pluralize(t))}
                            </button>`).join('')}
                    </div>
                </div>
            </div>`;
    }

    // Ya eligió la tabla correcta: mostrar el detalle de la FK y confirmar
    return `
        <div class="border-t border-slate-800 pt-3 flex flex-col gap-3">
            <div class="bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-3 text-xs text-emerald-300">
                ✅ Regla correcta: <strong>${_esc(rule.text)}</strong>
            </div>

            <div class="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 text-xs">
                <p class="text-indigo-300 font-bold mb-2">¿En qué tabla se agrega la FK?</p>
                <p class="text-white font-extrabold text-base mb-1">Tabla: <span class="text-indigo-300">${_esc(_pluralize(fp.targetTable))}</span> ✓</p>
                <p class="text-slate-400">${_esc(fp.reason)}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                    ${fp.fkFields.map(f => `
                        <span class="px-2.5 py-1 bg-blue-900/50 border border-blue-700/50 rounded-lg text-blue-300 font-bold text-xs">
                            + ${_esc(f.name)} <span class="text-blue-400/60 text-[10px]">FK→${_esc(_pluralize(f.fkTo))}</span>
                        </span>`).join('')}
                </div>
            </div>

            <!-- Acumular FK para la fase completa -->
            <button onclick="_tabConfirmFKPlacement(${ri})"
                class="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition active:scale-95">
                ✔ Confirmar — agregar FK a ${_esc(_pluralize(fp.targetTable))}
            </button>
        </div>`;
}

function _tabSelectFKTable(choice) {
    const ri  = _tabRelIdx;
    const rel = _tabData.relations[ri];
    const fp  = rel.fkPlacement;
    const fb  = document.getElementById('tab-rel-feedback');
    const correct = choice === fp.targetTable;

    _tabRelLog(ri, 'fill', correct ? 1 : 0, 1);

    if (correct) {
        _tabFKTableCorrect[ri] = true;
        if (fb) {
            fb.classList.remove('hidden');
            fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-emerald-900/40 border-emerald-700 text-emerald-300';
            fb.innerHTML = `✅ ¡Correcto!${_tabRelHistHtml(ri, 'fill', 'Tabla')}`;
        }
        _renderPhase();
    } else if (_tabRelCount(ri, 'fill') >= 3) {
        // Máximo de intentos: revelar y continuar (no trancar al estudiante)
        _tabFKTableCorrect[ri] = true;
        if (fb) {
            fb.classList.remove('hidden');
            fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-amber-900/40 border-amber-700 text-amber-200';
            fb.innerHTML = `🔎 Máximo de intentos alcanzado. La FK va en ${_esc(_pluralize(fp.targetTable))}.${_tabRelHistHtml(ri, 'fill', 'Tabla')}`;
        }
        _renderPhase();
    } else {
        if (fb) {
            fb.classList.remove('hidden');
            fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-rose-900/40 border-rose-700 text-rose-300';
            fb.innerHTML = `❌ No es ahí. Pensar en cuál es el lado "N" (o el que recibe la totalidad). Reintentar.${_tabRelHistHtml(ri, 'fill', 'Tabla')}`;
        }
    }
}

let _tabRelSelectedWord = null;

function _tabRelSelectWord(word) {
    _tabRelSelectedWord = (_tabRelSelectedWord === word) ? null : word;
    _tabRelRefreshWordBank();
}

function _tabRelFillSlot(ri, fi) {
    const btn = document.getElementById(`tab-rel-slot-${ri}-${fi}`);
    if (!btn) return;
    if (!_tabRelSlots[ri]) _tabRelSlots[ri] = {};

    // Si el casillero ya tiene una palabra: un clic la devuelve al banco (igual que en Diseño E-R)
    if (_tabRelSlots[ri][fi] !== undefined) {
        delete _tabRelSlots[ri][fi];
        btn.textContent = '?';
        btn.className = 'tab-rel-slot min-w-[90px] px-2 py-1.5 rounded-lg border-2 border-dashed border-slate-600 text-xs text-slate-500 hover:border-amber-500 transition font-mono';
        _tabRelRefreshWordBank();
        return;
    }

    if (!_tabRelSelectedWord) return;
    _tabRelSlots[ri][fi] = _tabRelSelectedWord;
    btn.textContent = _tabRelSelectedWord;
    btn.className = 'tab-rel-slot min-w-[90px] px-2 py-1.5 rounded-lg border-2 border-amber-500 bg-amber-900/30 text-xs text-amber-200 font-bold font-mono transition cursor-pointer';
    _tabRelSelectedWord = null;
    _tabRelRefreshWordBank();
}

// ── Banco de palabras (fase Relaciones): refresca selección y disponibilidad ──
function _tabRelRefreshWordBank() {
    const bank = document.getElementById('tab-rel-word-bank');
    if (!bank) return;
    const rel = _tabData.relations[_tabRelIdx];
    if (!rel) return;
    const allFields = rel.tableFields.map(f => f.name);
    const counts = {};
    allFields.forEach(w => counts[w] = (counts[w] || 0) + 1);
    const used = {};
    Object.values(_tabRelSlots[_tabRelIdx] || {}).forEach(w => { used[w] = (used[w] || 0) + 1; });

    bank.querySelectorAll('.tab-rel-word').forEach(b => {
        const word = b.dataset.word;
        const usedUp = (used[word] || 0) >= (counts[word] || 0);
        const selected = _tabRelSelectedWord === word;
        b.disabled = usedUp;
        b.className = 'tab-rel-word px-2.5 py-1 rounded-lg text-xs font-bold transition ' +
            (usedUp ? 'bg-slate-800 border border-slate-700 text-slate-600 opacity-50 cursor-not-allowed' :
             selected ? 'bg-amber-600 border border-amber-500 text-white' :
             'bg-amber-800/40 border border-amber-700/40 text-amber-200 hover:bg-amber-700/50');
    });
}

function _tabValidateRelTable(ri) {
    const rel     = _tabData.relations[ri];
    const slots   = _tabRelSlots[ri] || {};
    const pkFields  = rel.tableFields.filter(f => f.isPK).map(f => f.name);
    const nonPk     = rel.tableFields.filter(f => !f.isPK).map(f => f.name);
    const pkZone    = pkFields.length;
    let   errors    = 0;

    rel.tableFields.forEach((f, fi) => {
        const btn = document.getElementById(`tab-rel-slot-${ri}-${fi}`);
        if (!btn) return;
        const w   = slots[fi];
        const ok  = fi < pkZone
            ? (new Set(pkFields)).has(w)
            : (new Set(nonPk)).has(w);
        if (ok) {
            btn.className = 'tab-rel-slot min-w-[90px] px-2 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-900/30 text-xs text-emerald-200 font-bold font-mono';
        } else {
            btn.className = 'tab-rel-slot min-w-[90px] px-2 py-1.5 rounded-lg border-2 border-rose-500 bg-rose-900/30 text-xs text-rose-300 font-bold font-mono';
            errors++;
        }
    });

    const fb = document.getElementById('tab-rel-feedback');
    if (!fb) return;
    fb.classList.remove('hidden');

    const total = rel.tableFields.length;
    const hits  = total - errors;
    _tabRelLog(ri, 'fill', hits, total);
    const histHtml = _tabRelHistHtml(ri, 'fill', 'Tabla');

    if (errors === 0) {
        _tabRelDone[ri] = true;
        fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-emerald-900/40 border-emerald-700 text-emerald-300';
        fb.innerHTML = `✅ Tabla correcta. Avanzar a la siguiente relación.${histHtml}`;
        setTimeout(() => _tabNextRelation(), 1000);
    } else if (_tabRelCount(ri, 'fill') >= 3) {
        // Máximo de intentos: revelar la tabla correcta y avanzar igual (no trancar al estudiante)
        rel.tableFields.forEach((f, fi) => {
            const btn = document.getElementById(`tab-rel-slot-${ri}-${fi}`);
            if (!btn) return;
            if (!_tabRelSlots[ri]) _tabRelSlots[ri] = {};
            _tabRelSlots[ri][fi] = f.name;
            btn.textContent = f.name;
            btn.className = 'tab-rel-slot min-w-[90px] px-2 py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-900/30 text-xs text-emerald-200 font-bold font-mono';
        });
        _tabRelDone[ri] = true;
        fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-amber-900/40 border-amber-700 text-amber-200';
        fb.innerHTML = `🔎 Máximo de intentos alcanzado — así se completa la tabla correctamente. Avanzar a la siguiente relación.${histHtml}`;
        setTimeout(() => _tabNextRelation(), 1800);
    } else {
        fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-rose-900/40 border-rose-700 text-rose-300';
        fb.innerHTML = `❌ Hay ${errors} campo(s) incorrectos en la zona equivocada. Los PK van primero.${histHtml}`;
    }
}

function _tabConfirmFKPlacement(ri) {
    const rel = _tabData.relations[ri];
    const fp  = rel.fkPlacement;
    // Acumular FK en _tabFKAdd
    if (!_tabFKAdd[fp.targetTable]) _tabFKAdd[fp.targetTable] = [];
    fp.fkFields.forEach(f => {
        _tabFKAdd[fp.targetTable].push(f);
    });
    _tabRelDone[ri] = true;
    const fb = document.getElementById('tab-rel-feedback');
    if (fb) {
        fb.classList.remove('hidden');
        fb.className = 'p-3 rounded-2xl text-xs font-bold border bg-emerald-900/40 border-emerald-700 text-emerald-300';
        fb.innerHTML = `✅ FK registrada en ${_esc(_pluralize(fp.targetTable))}. Avanzar.`;
    }
    setTimeout(() => _tabNextRelation(), 900);
}

function _tabNextRelation() {
    _tabRelIdx++;
    _tabRelPhase = 0;
    if (_tabRelIdx >= _tabData.relations.length) {
        _tabPhase = 2;
    }
    _renderPhase();
}

// ─────────────────────────────────────────────────────────────────────────────
// FASE 2 — Esquema completo
// ─────────────────────────────────────────────────────────────────────────────
function _renderPhaseComplete(container) {
    const data  = _tabData;

    // Construir esquema final con FKs acumuladas
    const allTables = _buildFinalSchema(data);
    // Construir restricciones FK esperadas
    const expectedConstraints = _buildExpectedConstraints(data);

    container.innerHTML = `
        <div class="bg-emerald-950/30 border border-emerald-700/40 rounded-2xl p-4 text-xs text-emerald-200 leading-relaxed">
            <strong>Fase 3 — Esquema completo:</strong> Visualizar el modelo relacional resultante.
            Escribir las restricciones de clave foránea (FK) en la caja de texto.
            <br>Formato: <code class="text-white">TABLA.campo FK TABLA2.campo</code> — una por línea.
        </div>

        <!-- Esquema completo (solo lectura, para verificar) -->
        <div id="tab-schema-display" class="flex flex-col gap-3">
            ${allTables.map(t => _renderFinalTableCard(t)).join('')}
        </div>

        <!-- FK Constraints input -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <p class="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Restricciones de integridad referencial (FK)
            </p>
            <p class="text-xs text-slate-500">
                Escribir una restricción por línea. Ejemplo: <code class="text-slate-300">PEDIDO.Id_cliente FK CLIENTE.Id_cliente</code>
            </p>
            <textarea id="tab-fk-input" rows="8"
                class="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="Escribir las restricciones FK aquí...&#10;TABLA1.campo FK TABLA2.campo"></textarea>
            <button id="btn-validate-fk" onclick="_tabValidateFKConstraints()"
                class="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition active:scale-95">
                ✔ Validar restricciones FK
            </button>
            <div id="tab-fk-feedback" class="hidden"></div>
        </div>

        <!-- Botón exportar -->
        <div class="flex gap-3">
            <button onclick="_tabExportPDF()"
                class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2">
                📄 Exportar PDF
            </button>
        </div>
    `;
}

function _buildFinalSchema(data) {
    const tables = [];

    // Tablas de entidades + FKs acumuladas de relaciones 1:N
    data.entityTables.forEach(tbl => {
        const extraFKs = _tabFKAdd[tbl.name] || [];
        tables.push({
            name:   tbl.name,
            fields: [...tbl.fields, ...extraFKs.map(f => ({ ...f, isFK: true }))],
            isRelation: false,
            note: tbl.note || ''
        });
    });

    // Tablas de relaciones que generan tabla
    data.relations.forEach(rel => {
        if (rel.generatesTable) {
            tables.push({
                name:   rel.tableName,
                fields: rel.tableFields,
                isRelation: true,
                ruleId: rel.ruleId,
                note: rel.tableNote || ''
            });
        }
    });

    return tables;
}

function _buildExpectedConstraints(data) {
    const constraints = [];

    // FKs de tablas de entidades (definidas en entityTables)
    data.entityTables.forEach(tbl => {
        tbl.fields.forEach(f => {
            if (f.isFK && f.fkTo) {
                // Encontrar campo PK de la tabla referenciada
                const refTbl = data.entityTables.find(t => t.name === f.fkTo);
                const refPK  = refTbl?.fields.find(rf => rf.isPK);
                const refField = f.fkRefField || (refPK ? refPK.name : f.name);
                constraints.push(`${_pluralize(tbl.name)}.${f.name} FK ${_pluralize(f.fkTo)}.${refField}`);
            }
        });
    });

    // FKs acumuladas de relaciones 1:N sin tabla
    data.relations.forEach(rel => {
        if (!rel.generatesTable && rel.fkPlacement) {
            rel.fkPlacement.fkFields.forEach(f => {
                const refTbl  = data.entityTables.find(t => t.name === f.fkTo);
                const refPK   = refTbl?.fields.find(rf => rf.isPK);
                const refField = refPK ? refPK.name : f.name;
                constraints.push(`${_pluralize(rel.fkPlacement.targetTable)}.${f.name} FK ${_pluralize(f.fkTo)}.${refField}`);
            });
        }
    });

    // FKs de tablas de relación que generan tabla
    data.relations.forEach(rel => {
        if (rel.generatesTable) {
            rel.tableFields.forEach(f => {
                if (f.isFK && f.fkTo) {
                    const refTbl  = data.entityTables.find(t => t.name === f.fkTo);
                    const refPK   = refTbl?.fields.find(rf => rf.isPK);
                    const refField = f.fkRefField || (refPK ? refPK.name : f.name);
                    constraints.push(`${_pluralizeRelTableName(rel.ruleId, rel.tableName)}.${f.name} FK ${_pluralize(f.fkTo)}.${refField}`);
                }
            });
        }
    });

    return constraints;
}

function _renderFinalTableCard(t) {
    const displayName = t.isRelation ? _pluralizeRelTableName(t.ruleId, t.name) : _pluralize(t.name);

    const renderField = (f) => {
        let cls = 'font-mono text-xs ';
        if (f.isPK)    cls += 'underline font-bold text-pink-300';
        else if (f.isFK) cls += 'text-blue-300 font-semibold';
        else             cls += 'text-slate-300';
        // No se revela a qué tabla referencia la FK: eso se pide en el ejercicio de restricciones, más abajo.
        return `<span class="${cls}">${_esc(f.name)}</span>`;
    };

    const allFields = [...t.fields];

    return `
        <div class="bg-slate-900 border ${t.isRelation ? 'border-violet-800/50' : 'border-slate-700'} rounded-2xl p-4">
            <div class="flex items-center gap-2 mb-3">
                <span class="text-lg">${t.isRelation ? '⊗' : '▤'}</span>
                <span class="font-extrabold text-white text-sm">${_esc(displayName)}</span>
                ${t.isRelation ? '<span class="text-[10px] text-violet-400 font-bold uppercase tracking-wide">tabla de relación</span>' : ''}
            </div>
            <div class="font-mono text-xs bg-slate-800/60 rounded-xl p-3 leading-relaxed">
                <span class="text-white font-bold">${_esc(displayName)}</span><span class="text-slate-400">(</span>${allFields.map(f => renderField(f)).join('<span class="text-slate-500">, </span>')}<span class="text-slate-400">)</span>
            </div>
            ${t.note ? `<p class="text-[10px] text-slate-500 mt-2">${_esc(t.note)}</p>` : ''}
        </div>`;
}

function _tabValidateFKConstraints() {
    const data        = _tabData;
    const expected    = _buildExpectedConstraints(data);
    const rawInput    = (document.getElementById('tab-fk-input')?.value || '');
    const lines       = rawInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const stripAccents = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

    // Mapa de nombres de tabla (singular Y plural) → forma canónica (la esperada, en plural)
    // Así "CLIENTE" y "CLIENTES", o "realiza" y "realizan", se consideran equivalentes.
    const canonicalMap = {};
    data.entityTables.forEach(tbl => {
        const canon = stripAccents(_pluralize(tbl.name)).toUpperCase();
        canonicalMap[stripAccents(tbl.name).toUpperCase()] = canon;
        canonicalMap[canon] = canon;
    });
    data.relations.forEach(rel => {
        if (rel.generatesTable) {
            const canon = stripAccents(_pluralizeRelTableName(rel.ruleId, rel.tableName)).toUpperCase();
            canonicalMap[stripAccents(rel.tableName).toUpperCase()] = canon;
            canonicalMap[canon] = canon;
        }
    });

    const normalize = s => {
        let out = s.toUpperCase().trim()
                   .normalize('NFD').replace(/[̀-ͯ]/g, '')
                   .replace(/\s+/g, ' ');
        // Unificar nombre de tabla (singular/plural) a su forma canónica, antes del punto
        out = out.replace(/([A-ZÑ_]+)(?=\.)/g, w => canonicalMap[w] || w);
        return out;
    };

    const expectedNorm = expected.map(normalize);
    const inputNorm    = lines.map(normalize);

    // Encontrar cuáles coinciden y cuáles faltan o son incorrectas
    const matched   = new Set();
    const unmatched = [];

    inputNorm.forEach((line, i) => {
        const idx = expectedNorm.findIndex((e, ei) => e === line && !matched.has(ei));
        if (idx !== -1) {
            matched.add(idx);
        } else {
            unmatched.push(lines[i]);
        }
    });

    const missing = expected.filter((_, i) => !matched.has(i));
    const allOk   = missing.length === 0 && unmatched.length === 0;

    const fb = document.getElementById('tab-fk-feedback');
    if (!fb) return;
    fb.classList.remove('hidden');

    // Registrar intento
    const pct = expected.length > 0 ? Math.round((matched.size / expected.length) * 100) : 100;
    _tabFKAttempts.push({ matched: matched.size, total: expected.length, pct });
    const histHtml = _tabFKAttempts
        .map((s, i) => `<span class="font-bold">Intento ${i+1}:</span> ${s.matched}/${s.total}`)
        .join(' &nbsp;|&nbsp; ');
    const histBlock = `<div class="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">${histHtml}</div>`;

    if (allOk) {
        fb.className = 'p-4 rounded-2xl text-xs font-bold border bg-emerald-900/40 border-emerald-700 text-emerald-300';
        fb.innerHTML = `✅ ¡Perfecto! Las ${expected.length} restricciones FK son correctas.${histBlock}`;
    } else {
        fb.className = 'p-4 rounded-2xl text-xs font-bold border bg-amber-900/40 border-amber-700 text-amber-200';
        let html = '';
        if (matched.size > 0) {
            html += `<p class="text-emerald-300 mb-2">✅ ${matched.size} restricción(es) correcta(s).</p>`;
        }
        if (unmatched.length > 0) {
            html += `<p class="text-rose-300 mb-1">❌ No reconocidas (${unmatched.length}):</p>`;
            unmatched.forEach(u => {
                html += `<p class="font-mono bg-rose-900/30 px-2 py-0.5 rounded mb-0.5">${_esc(u)}</p>`;
            });
        }
        if (missing.length > 0) {
            if (_tabFKAttempts.length >= 3) {
                html += `<p class="text-amber-300 mt-2 mb-1">⚠ Faltan (${missing.length}):</p>`;
                missing.forEach(m => {
                    html += `<p class="font-mono bg-amber-900/30 px-2 py-0.5 rounded mb-0.5 text-slate-300">${_esc(m)}</p>`;
                });
            } else {
                html += `<p class="text-amber-300 mt-2">⚠ Faltan ${missing.length} restricción(es). Revisar y reintentar.</p>`;
            }
        }
        fb.innerHTML = html + histBlock;
    }

    // Máximo 3 intentos (igual que en Diseño E-R)
    if (_tabFKAttempts.length >= 3) {
        const btn = document.getElementById('btn-validate-fk');
        if (btn) {
            btn.disabled = true;
            btn.className = 'py-3 bg-slate-700/50 text-slate-400 font-bold rounded-xl text-sm cursor-not-allowed border border-slate-700';
            btn.textContent = '✓ Máximo 3 intentos';
        }
        const ta = document.getElementById('tab-fk-input');
        if (ta) ta.disabled = true;
    }
}

// ── PDF Export (iframe — evita bloqueo de popup) ──────────────────────────────
function _tabExportPDF() {
    const data   = _tabData;
    const schema = _buildFinalSchema(data);
    const constr = _buildExpectedConstraints(data);

    const fieldStr = (f) => {
        let s = f.name;
        if (f.isPK) s = `<u><strong>${s}</strong></u>`;
        if (f.isFK) s = `<span style="color:#3b82f6">${s}</span>`;
        return s;
    };

    const tablesHTML = schema.map(t => {
        const displayName = t.isRelation ? _pluralizeRelTableName(t.ruleId, t.name) : _pluralize(t.name);
        return `
        <div style="margin-bottom:16px;break-inside:avoid;">
            <div style="font-family:monospace;font-size:12px;line-height:1.6;
                        border:1px solid #e5e7eb;border-radius:8px;padding:12px;
                        background:${t.isRelation ? '#f5f3ff' : '#f9fafb'};">
                <strong>${displayName}</strong>(${t.fields.map(fieldStr).join(', ')})
            </div>
            ${t.note ? `<p style="font-size:10px;color:#6b7280;margin:4px 0 0 4px;">${t.note}</p>` : ''}
        </div>`;
    }).join('');

    const constrHTML = constr.map(c => `
        <p style="font-family:monospace;font-size:11px;margin:2px 0;color:#374151;">${c}</p>`).join('');

    const merImageHTML = window.merRefImageUrl
        ? `<h2>Modelo E-R de referencia</h2>
           <img src="${window.merRefImageUrl}" style="max-width:100%;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;">`
        : '';

    const attemptLines = [];
    if (_tabEntAttempts.length > 0) {
        attemptLines.push(`Entidades: ${_tabEntAttempts.map((s, i) => `Int.${i+1}: ${s.hits}/${s.total}`).join(' &nbsp;|&nbsp; ')}`);
    }
    data.relations.forEach(rel => {
        const idx = data.relations.indexOf(rel);
        const a   = _tabRelAttempts[idx];
        if (!a) return;
        const parts = [];
        if (a.rule.length > 0) parts.push(`Regla: ${a.rule.map((s, i) => `Int.${i+1}: ${s.hits}/${s.total}`).join(' | ')}`);
        if (a.fill.length > 0) parts.push(`Tabla/FK: ${a.fill.map((s, i) => `Int.${i+1}: ${s.hits}/${s.total}`).join(' | ')}`);
        if (parts.length > 0) attemptLines.push(`"${rel.name}" — ${parts.join(' &nbsp;·&nbsp; ')}`);
    });
    if (_tabFKAttempts.length > 0) {
        attemptLines.push(`Restricciones FK: ${_tabFKAttempts.map((s, i) => `Int.${i+1}: ${s.matched}/${s.total}`).join(' &nbsp;|&nbsp; ')}`);
    }
    const attemptsHTML = attemptLines.length > 0
        ? `<div class="meta">${attemptLines.map(l => `<p style="margin:2px 0;">${l}</p>`).join('')}</div>`
        : '';

    const html = `<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<title>Pasaje a Tablas — ${data.title}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; color: #1f2937; margin: 20px 30px; }
  h1   { font-size: 18px; margin-bottom: 4px; }
  h2   { font-size: 13px; color: #4b5563; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin: 16px 0 8px; }
  .meta { font-size: 11px; color: #6b7280; margin-bottom: 16px; }
  @media print { body { margin: 10mm 15mm; } img { break-inside: avoid; } }
</style>
</head><body>
<h1>Pasaje a Tablas</h1>
<p class="meta">Ejercicio: ${data.title} &nbsp;|&nbsp; DB-Lab — Prof. Elizabeth Izquierdo | CC BY-SA 4.0</p>
${attemptsHTML}
${merImageHTML}
<h2>Modelo Relacional</h2>
${tablesHTML}
<h2>Restricciones de integridad referencial (FK)</h2>
${constrHTML}
</body></html>`;

    // El diálogo "Guardar como PDF" del navegador usa el <title> de la página principal
    // (no el del iframe), así que lo cambiamos temporalmente para sugerir un buen nombre de archivo.
    const oldTitle = document.title;
    const safeName = 'DB_Lab_' + data.title
        .replace(/[\u{1F000}-\u{1FFFF}\u{2190}-\u{2BFF}\u{FE0F}]/gu, '')
        .trim()
        .replace(/\s+/g, '_');
    document.title = safeName;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:200%;bottom:200%;width:0;height:0;border:0;';
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
            document.title = oldTitle;
        }, 600);
    }, 350);
}

// ── Guardar estado ─────────────────────────────────────────────────────────────
function _tabSaveJSON() {
    const state = {
        version: 3,
        exerciseIdx: _tabExIdx,
        phase:       _tabPhase,
        relIdx:      _tabRelIdx,
        relPhase:    _tabRelPhase,
        entSlots:    _tabEntSlots,
        relSlots:    _tabRelSlots,
        fkAdd:       _tabFKAdd,
        relDone:     _tabRelDone
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `tablas_ex${_tabExIdx}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
}

// ── Utilidades ────────────────────────────────────────────────────────────────
// Pluralización de sustantivo, para nombre de entidad → nombre de tabla (CLIENTE → CLIENTES)
function _pluralize(name) {
    if (!name) return name;
    const accentMap = { 'Á':'A', 'É':'E', 'Í':'I', 'Ó':'O', 'Ú':'U', 'á':'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u' };
    const last      = name.slice(-1);
    const lastUpper = last.toUpperCase();
    const suffix    = (last === lastUpper) ? 'S' : 's'; // preservar mayús/minúsculas del nombre original
    if ('AEIOUÁÉÍÓÚ'.includes(lastUpper)) return name + suffix;
    if (lastUpper === 'Z') return name.slice(0, -1) + (suffix === 'S' ? 'CES' : 'ces');
    if (lastUpper === 'N' || lastUpper === 'S') {
        const prev = name.slice(-2, -1);
        if (accentMap[prev]) return name.slice(0, -2) + accentMap[prev] + last + (suffix === 'S' ? 'ES' : 'es');
    }
    return name + (suffix === 'S' ? 'ES' : 'es');
}

// Pluralización de nombre de relación (verbo en 3ª persona singular → 3ª persona plural: realiza → realizan)
// Los nombres de relación que son sustantivos (ej. "préstamo") se pluralizan como sustantivo.
function _pluralizeRelation(name) {
    if (!name) return name;
    const last      = name.slice(-1);
    const lastLower = last.toLowerCase();
    if (lastLower === 'o') return _pluralize(name); // sustantivo (ej. préstamo → préstamos)
    if (lastLower === 'a' || lastLower === 'e') {
        return name + (last === last.toUpperCase() ? 'N' : 'n'); // verbo: +N (realiza → realizan)
    }
    return name; // formas compuestas/irregulares (ej. juega_en): no se modifica
}

// Nombre de tabla generada por una relación: verbo (realiza→realizan) o, si viene de un
// atributo multivaluado o de una entidad débil, sustantivo (Actor→Actores, ESTANTERÍA→ESTANTERÍAS),
// ya que ahí no hay ningún verbo que conjugar.
const _NOUN_RULE_IDS = ['multivaluado', 'entidad_debil'];
function _pluralizeRelTableName(ruleId, name) {
    return _NOUN_RULE_IDS.includes(ruleId) ? _pluralize(name) : _pluralizeRelation(name);
}

function _esc(s) {
    if (!s) return '';
    return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;');
}

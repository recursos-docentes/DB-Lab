// tables.js — Pestaña "Pasaje a Tablas" v3 — Flujo guiado con selección de reglas
// Diseñada por Prof. Elizabeth Izquierdo con asistencia de Claude — CC BY-SA 4.0

// ── Reglas del Modelo Relacional (mostradas todas al alumno) ─────────────────
const REL_RULES = [
    { id:'nn',        text:'N:N → tabla intermedia con PK compuesta (FKs de ambas entidades)',       generatesTable:true  },
    { id:'1n_total',  text:'1:N con totalidad del lado N → FK en tabla del lado N, sin nueva tabla', generatesTable:false },
    { id:'1n_sintot', text:'1:N sin totalidad → nueva tabla (PK = clave del lado N)',                generatesTable:true  },
    { id:'auto_nn',   text:'Autorelación N:N → tabla intermedia con roles distintos para cada FK',   generatesTable:true  },
    { id:'agg_total', text:'Agregación con totalidad → FK en la tabla del lado N de la agregación',  generatesTable:false },
];

// ══════════════════════════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ══════════════════════════════════════════════════════════════════════════════

let tabPhase        = 'entities';
let tabExIdx        = 0;

// — Fase entidades —
let tabEntWB        = [];
let tabEntSlots     = {};
let tabEntSelWB     = null;
let tabEntAttempts  = 0;
let tabEntRevealed  = false;

// — Fase relaciones —
let tabRelIdx       = 0;
let tabRuleAttempts = 0;
let tabRelWB        = [];
let tabRelSlots     = {};
let tabRelSelWB     = null;
let tabRelAttempts  = 0;
let tabRelRevealed  = false;
let tabFKAttempts   = 0;

// — FK acumuladas de relaciones que NO generan tabla —
let tabFKAdditions  = {};

// — Imagen MER —
let tabMerImageUrl  = null;

// ══════════════════════════════════════════════════════════════════════════════
// PUNTO DE ENTRADA
// ══════════════════════════════════════════════════════════════════════════════

function renderTablesPanel(exIdx) {
    const data  = (typeof tablesData !== 'undefined') ? tablesData[exIdx] : null;
    const stage = document.getElementById('stage-tables');
    if (!stage) return;

    if (!data) {
        stage.innerHTML = `<div class="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <span style="font-size:3rem">📊</span>
          <h2 class="text-xl font-extrabold text-white">Pasaje a Tablas</h2>
          <p class="text-slate-400 text-sm max-w-xs">Este ejercicio no tiene datos de pasaje a tablas disponibles.</p>
        </div>`;
        return;
    }

    tabPhase       = 'entities';
    tabExIdx       = exIdx;
    tabEntWB       = [];
    tabEntSlots    = {};
    tabEntSelWB    = null;
    tabEntAttempts = 0;
    tabEntRevealed = false;
    tabRelIdx      = 0;
    tabRuleAttempts = 0;
    tabFKAdditions = {};

    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            tabEntWB.push({ word: fld.name, used: false });
            tabEntSlots[`${ti}_${fi}`] = null;
        });
    });
    _tabShuffle(tabEntWB);

    stage.innerHTML = _buildShellHTML(data, exIdx);
    _renderEntityPhase(data);
}

// ══════════════════════════════════════════════════════════════════════════════
// SHELL HTML
// ══════════════════════════════════════════════════════════════════════════════

function _buildShellHTML(data, exIdx) {
    const title = (typeof exercises !== 'undefined' && exercises[exIdx])
        ? exercises[exIdx].title : 'Pasaje a Tablas';
    return `
<div class="flex flex-col gap-0 w-full max-w-[1600px] mx-auto pb-10" id="tab-root">

  <div class="flex items-center justify-between flex-wrap gap-2 px-4 py-3 bg-slate-900/70 border-b border-slate-800 sticky top-0 z-10">
    <div>
      <h2 class="text-sm font-extrabold text-white">${title} — Pasaje a Tablas</h2>
      <p id="tab-phase-label" class="text-[10px] text-slate-500 mt-0.5">Fase 1: Entidades</p>
    </div>
    <div class="flex gap-2 flex-wrap">
      <label class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer" title="Subir imagen PNG/JPG del MER">
        🖼️ Imagen MER
        <input type="file" accept="image/png,image/jpeg,image/gif,image/webp,.png,.jpg,.jpeg,.gif" class="hidden" onchange="handleMerImage(this)">
      </label>
      <button onclick="exportTablesProgress()" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition" title="Guardar progreso como JSON">💾 Guardar JSON</button>
      <label class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer" title="Cargar progreso desde archivo JSON">
        📂 Cargar JSON
        <input type="file" accept=".json,application/json" class="hidden" onchange="importTablesProgress(this)">
      </label>
      <button onclick="renderTablesPanel(tabExIdx)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-lg transition" title="Reiniciar todo">🔄 Reiniciar</button>
    </div>
  </div>

  <div id="tab-img-wrap" class="hidden px-4 pt-3">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-2 flex items-start gap-2">
      <img id="tab-mer-img" src="" alt="MER" class="max-h-64 rounded-lg object-contain flex-1 w-0">
      <button onclick="document.getElementById('tab-img-wrap').classList.add('hidden')"
              class="text-slate-500 hover:text-white text-xs leading-none mt-0.5 flex-shrink-0">✕</button>
    </div>
  </div>

  <div id="tab-phase-content" class="px-4 pt-4"></div>
  <div id="tab-feedback" class="hidden mx-4 mt-3 rounded-xl border p-3 text-sm"></div>
</div>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// FASE 1: ENTIDADES
// ══════════════════════════════════════════════════════════════════════════════

function _renderEntityPhase(data) {
    document.getElementById('tab-phase-label').textContent = 'Fase 1 de 2: Entidades → Tablas';
    document.getElementById('tab-feedback')?.classList.add('hidden');

    const grid = data.entityTables.map((tbl, ti) => {
        const srcLabel = { entity:'Entidad', weak:'Entidad débil', isa:'ISA', multivalued:'Multivaluado' }[tbl.sourceType] || 'Entidad';
        const pkCount  = tbl.fields.filter(f => f.isPK).length;
        const rows = tbl.fields.map((fld, fi) => {
            const icon = fld.isPK ? '🔑' : fld.isFK ? '🔗' : '·';
            const hint = fld.isPK && fld.isFK ? 'PK·FK' : fld.isPK ? 'PK' : fld.isFK ? 'FK' : '';
            return `<div class="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800/60 cursor-pointer hover:bg-slate-800/40" onclick="clickEntSlot(${ti},${fi})">
              <span class="text-xs w-4 text-center">${icon}</span>
              <span id="eslot-${ti}-${fi}" class="font-mono text-xs flex-1 text-slate-600 italic">▢</span>
              <span class="text-[9px] text-slate-600 font-mono">${hint}</span>
            </div>`;
        }).join('');
        return `<div class="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden">
  <div class="px-3 py-2 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between gap-2">
    <span class="font-mono font-bold text-white text-sm">${tbl.name}</span>
    <span class="text-[9px] font-bold text-indigo-300 bg-indigo-900/40 border border-indigo-700/40 px-1.5 py-0.5 rounded-full">${srcLabel}</span>
  </div>
  <p class="text-[9px] text-slate-500 px-3 pt-1.5 pb-0.5 leading-tight">${tbl.note}</p>
  <div class="border-t border-slate-800 mt-1">
    <div class="grid grid-cols-[20px_1fr_auto] text-[9px] font-bold text-slate-700 uppercase tracking-wide px-3 py-1 bg-slate-800/40">
      <span></span><span>Campo</span><span>Tipo</span>
    </div>${rows}
  </div>
</div>`;
    }).join('');

    document.getElementById('tab-phase-content').innerHTML = `
<div class="flex flex-col gap-3">
  <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Banco de campos</p>
    <div id="tab-ent-wb" class="flex flex-wrap gap-1.5 min-h-[28px]"></div>
  </div>
  <p class="text-xs text-slate-500">Seleccionar un campo y hacer clic en el slot. 🔑 PK va siempre primero; el resto en cualquier orden.</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">${grid}</div>
  <div class="flex gap-2 pt-1">
    <button onclick="validateEntities()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition">✔ Verificar entidades</button>
  </div>
</div>`;

    _refreshEntWB();
}

function _refreshEntWB() {
    const el = document.getElementById('tab-ent-wb');
    if (!el) return;
    if (tabEntWB.every(w => w.used)) {
        el.innerHTML = '<span class="text-slate-500 text-xs italic">Todos los campos asignados.</span>';
        return;
    }
    el.innerHTML = tabEntWB.map((item, idx) => {
        if (item.used) return `<span class="px-2 py-0.5 rounded-md text-xs text-slate-700 line-through">${item.word}</span>`;
        const sel = tabEntSelWB === idx;
        return `<button onclick="selectEntWord(${idx})" class="px-2.5 py-0.5 rounded-md text-xs font-semibold border transition
            ${sel ? 'bg-yellow-400 text-slate-900 border-yellow-300 ring-2 ring-yellow-300'
                  : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'}">${item.word}</button>`;
    }).join('');
}

function selectEntWord(idx) {
    if (tabEntRevealed || tabEntWB[idx]?.used) return;
    tabEntSelWB = (tabEntSelWB === idx) ? null : idx;
    _refreshEntWB();
    _refreshEntSlots();
}

function clickEntSlot(ti, fi) {
    if (tabEntRevealed) return;
    const key    = `${ti}_${fi}`;
    const placed = tabEntSlots[key];
    if (placed) {
        const wbi = tabEntWB.findIndex(w => w.word === placed && w.used);
        if (wbi !== -1) tabEntWB[wbi].used = false;
        tabEntSlots[key] = null;
        tabEntSelWB = null;
        _refreshEntWB(); _refreshEntSlots();
        return;
    }
    if (tabEntSelWB === null) return;
    tabEntWB[tabEntSelWB].used = true;
    tabEntSlots[key] = tabEntWB[tabEntSelWB].word;
    tabEntSelWB = null;
    _refreshEntWB(); _refreshEntSlots();
}

function _refreshEntSlots() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            const el   = document.getElementById(`eslot-${ti}-${fi}`);
            if (!el) return;
            const word = tabEntSlots[`${ti}_${fi}`];
            const canDrop = tabEntSelWB !== null && !word && !tabEntRevealed;
            if (word) { el.textContent = word; el.className = 'font-mono text-xs flex-1 text-yellow-300 font-bold'; }
            else { el.textContent = canDrop ? '← aquí' : '▢'; el.className = `font-mono text-xs flex-1 ${canDrop ? 'text-indigo-400 italic' : 'text-slate-600 italic'}`; }
        });
    });
}

function validateEntities() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    const total  = Object.keys(tabEntSlots).length;
    const filled = Object.values(tabEntSlots).filter(v => v !== null).length;
    if (filled < total) { _showTabFeedback('warning', `⚠️ Quedan ${total - filled} campo(s) sin asignar.`); return; }

    let hits = 0;
    // Validación por zonas: PK primero (cualquier orden entre PKs), resto en cualquier orden
    data.entityTables.forEach((tbl, ti) => {
        const pkSet    = new Set(tbl.fields.filter(f => f.isPK).map(f => f.name));
        const nonPkSet = new Set(tbl.fields.filter(f => !f.isPK).map(f => f.name));
        const pkZone   = tbl.fields.filter(f => f.isPK).length;
        tbl.fields.forEach((fld, fi) => {
            const w  = tabEntSlots[`${ti}_${fi}`];
            const ok = w !== null && (fi < pkZone ? pkSet.has(w) : nonPkSet.has(w));
            if (ok) hits++;
            const el = document.getElementById(`eslot-${ti}-${fi}`);
            if (el && w) el.className = `font-mono text-xs flex-1 font-bold ${ok ? 'text-green-300' : 'text-red-300'}`;
        });
    });

    tabEntAttempts++;
    const pct = Math.round(hits / total * 100);
    if (hits === total) {
        _showTabFeedback('success', `🎉 ¡Perfecto! Todas las tablas de entidades están correctas.
          <button onclick="proceedToRelations()" class="ml-3 px-3 py-1 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xs transition">Continuar → Relaciones</button>`);
    } else {
        let html = `<span class="font-bold">${hits}/${total} correctos (${pct}%).</span> 🔑 PK en slots iniciales; el resto en cualquier orden.`;
        if (tabEntAttempts >= 2) html += ` <button onclick="revealEntAnswers()" class="ml-2 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg text-xs">💡 Ver respuestas</button>`;
        html += ` <button onclick="proceedToRelations()" class="ml-2 px-2 py-0.5 bg-indigo-700 text-indigo-100 font-semibold rounded-lg text-xs">Continuar igual →</button>`;
        _showTabFeedback('error', html);
    }
}

function revealEntAnswers() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    tabEntRevealed = true;
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            tabEntSlots[`${ti}_${fi}`] = fld.name;
            const el = document.getElementById(`eslot-${ti}-${fi}`);
            if (el) { el.textContent = fld.name; el.className = 'font-mono text-xs flex-1 text-green-300 font-bold'; }
        });
    });
    tabEntWB.forEach(w => w.used = true);
    _refreshEntWB();
    _showTabFeedback('info', '✓ Respuestas reveladas. <button onclick="proceedToRelations()" class="ml-2 px-2 py-0.5 bg-indigo-700 text-indigo-100 font-semibold rounded-lg text-xs">Continuar →</button>');
}

function proceedToRelations() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            if (!tabEntSlots[`${ti}_${fi}`]) tabEntSlots[`${ti}_${fi}`] = fld.name;
        });
    });
    tabPhase = 'relations'; tabRelIdx = 0; tabRuleAttempts = 0; tabFKAdditions = {};
    document.getElementById('tab-feedback')?.classList.add('hidden');
    _renderRelationPhase(tablesData[tabExIdx]);
}

// ══════════════════════════════════════════════════════════════════════════════
// FASE 2: RELACIONES
// ══════════════════════════════════════════════════════════════════════════════

function _renderRelationPhase(data) {
    const rel   = data.relations[tabRelIdx];
    const total = data.relations.length;
    document.getElementById('tab-phase-label').textContent = `Fase 2 de 2: Relaciones (${tabRelIdx + 1}/${total})`;
    document.getElementById('tab-feedback')?.classList.add('hidden');

    tabRuleAttempts = 0; tabRelWB = []; tabRelSlots = {}; tabRelSelWB = null;
    tabRelAttempts = 0; tabRelRevealed = false; tabFKAttempts = 0;

    const rulesHTML = REL_RULES.map(rule => `
      <button onclick="selectRelRule('${rule.id}')" id="rule-btn-${rule.id}"
        class="text-left px-3 py-2 rounded-lg text-xs border transition bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-indigo-900/50 hover:border-indigo-500 hover:text-indigo-200">
        ${rule.text}
      </button>`).join('');

    document.getElementById('tab-phase-content').innerHTML = `
<div class="flex flex-col gap-3">
  <div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
    <div class="flex items-center gap-3 flex-wrap">
      <span class="text-2xl font-mono font-black text-white">${rel.name}</span>
      <span class="text-xs text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-mono">${rel.cardHint}</span>
    </div>
    <div>
      <p class="text-xs font-bold text-slate-300 mb-2">Reglas del modelo relacional — ¿cuál aplica a esta relación?</p>
      <div class="flex flex-col gap-1.5" id="tab-rule-btns">${rulesHTML}</div>
    </div>
    <div id="tab-rel-sub"></div>
  </div>
  <div id="tab-rel-progress" class="text-[10px] text-slate-600"></div>
</div>`;

    _updateRelProgress(data);
}

function _updateRelProgress(data) {
    const el = document.getElementById('tab-rel-progress');
    if (!el || tabRelIdx === 0) return;
    el.innerHTML = '<span class="text-slate-700">Procesadas: </span>'
        + data.relations.slice(0, tabRelIdx).map(r => `<span class="mr-2">✓ ${r.name}</span>`).join('');
}

function selectRelRule(ruleId) {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];

    document.querySelectorAll('#tab-rule-btns button').forEach(b => { b.disabled = true; });
    const clicked = document.getElementById(`rule-btn-${ruleId}`);

    if (ruleId === rel.ruleId) {
        if (clicked) clicked.style.cssText = 'background:rgba(22,101,52,.6);border-color:#16a34a;color:#bbf7d0';
        const rule = REL_RULES.find(r => r.id === ruleId);
        if (rule?.generatesTable) _renderRelTableFill(data, rel);
        else                       _renderFKPlacement(data, rel);
    } else {
        tabRuleAttempts++;
        if (clicked) clicked.style.cssText = 'background:rgba(127,29,29,.6);border-color:#dc2626;color:#fca5a5;opacity:.7';
        const correctRule = REL_RULES.find(r => r.id === rel.ruleId);
        const hint = tabRuleAttempts >= 2
            ? ` La regla correcta es: <strong>${correctRule?.text || rel.ruleId}</strong>.`
            : ' Revisar la cardinalidad y las condiciones de la relación.';
        _showTabFeedback('error', `✗ Regla incorrecta.${hint}`);
        setTimeout(() => {
            document.querySelectorAll('#tab-rule-btns button').forEach(b => {
                if (!b.style.cssText.includes('127,29,29') && !b.style.cssText.includes('22,101,52')) b.disabled = false;
            });
        }, 1400);
    }
}

// ── Sub-UI: llenar tabla de relación ──────────────────────────────────────────

function _renderRelTableFill(data, rel) {
    document.getElementById('tab-feedback')?.classList.add('hidden');
    tabRelWB = []; tabRelSlots = {};
    rel.tableFields.forEach((fld, fi) => { tabRelWB.push({ word: fld.name, used: false }); tabRelSlots[fi] = null; });
    _tabShuffle(tabRelWB);

    const rows = rel.tableFields.map((fld, fi) => {
        const icon = fld.isPK ? '🔑' : fld.isFK ? '🔗' : '·';
        const hint = fld.isPK && fld.isFK ? 'PK·FK' : fld.isPK ? 'PK' : fld.isFK ? 'FK' : '';
        return `<div class="flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800/60 cursor-pointer hover:bg-slate-800/40" onclick="clickRelSlot(${fi})">
          <span class="text-xs w-4 text-center">${icon}</span>
          <span id="rslot-${fi}" class="font-mono text-xs flex-1 text-slate-600 italic">▢</span>
          <span class="text-[9px] text-slate-600 font-mono">${hint}</span>
        </div>`;
    }).join('');

    document.getElementById('tab-rel-sub').innerHTML = `
<div class="flex flex-col gap-2 pt-2 border-t border-slate-700/40 mt-1">
  <p class="text-xs text-green-400 font-bold">✓ Correcto — esta relación genera tabla. Completar los campos:</p>
  <p class="text-[10px] text-slate-500">${rel.tableNote}</p>
  <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-2">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Banco de campos</p>
    <div id="tab-rel-wb" class="flex flex-wrap gap-1.5 min-h-[24px]"></div>
  </div>
  <div class="bg-slate-950/60 border border-slate-700 rounded-xl overflow-hidden">
    <div class="px-3 py-2 bg-slate-800/80 border-b border-slate-700 flex items-center gap-2">
      <span class="font-mono font-bold text-white text-sm">${rel.tableName}</span>
      <span class="text-[9px] text-emerald-300 bg-emerald-900/30 border border-emerald-700/40 px-1.5 py-0.5 rounded-full font-bold">Tabla nueva</span>
    </div>
    <div class="border-t border-slate-800">
      <div class="grid grid-cols-[20px_1fr_auto] text-[9px] font-bold text-slate-700 uppercase tracking-wide px-3 py-1 bg-slate-800/40">
        <span></span><span>Campo</span><span>Tipo</span>
      </div>${rows}
    </div>
  </div>
  <p class="text-[10px] text-slate-600">🔑 PK en los primeros slots; el resto en cualquier orden.</p>
  <button onclick="validateRelTable()" class="self-start px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition">✔ Verificar tabla</button>
</div>`;
    _refreshRelWB();
}

function _refreshRelWB() {
    const el = document.getElementById('tab-rel-wb');
    if (!el) return;
    if (tabRelWB.every(w => w.used)) { el.innerHTML = '<span class="text-slate-500 text-xs italic">Todos los campos asignados.</span>'; return; }
    el.innerHTML = tabRelWB.map((item, idx) => {
        if (item.used) return `<span class="px-2 py-0.5 rounded-md text-xs text-slate-700 line-through">${item.word}</span>`;
        const sel = tabRelSelWB === idx;
        return `<button onclick="selectRelWord(${idx})" class="px-2.5 py-0.5 rounded-md text-xs font-semibold border transition
            ${sel ? 'bg-yellow-400 text-slate-900 border-yellow-300 ring-2 ring-yellow-300'
                  : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'}">${item.word}</button>`;
    }).join('');
}

function selectRelWord(idx) {
    if (tabRelRevealed || tabRelWB[idx]?.used) return;
    tabRelSelWB = (tabRelSelWB === idx) ? null : idx;
    _refreshRelWB(); _refreshRelSlots();
}

function clickRelSlot(fi) {
    if (tabRelRevealed) return;
    const placed = tabRelSlots[fi];
    if (placed) {
        const wbi = tabRelWB.findIndex(w => w.word === placed && w.used);
        if (wbi !== -1) tabRelWB[wbi].used = false;
        tabRelSlots[fi] = null; tabRelSelWB = null;
        _refreshRelWB(); _refreshRelSlots(); return;
    }
    if (tabRelSelWB === null) return;
    tabRelWB[tabRelSelWB].used = true;
    tabRelSlots[fi] = tabRelWB[tabRelSelWB].word;
    tabRelSelWB = null;
    _refreshRelWB(); _refreshRelSlots();
}

function _refreshRelSlots() {
    const rel = tablesData[tabExIdx].relations[tabRelIdx];
    rel.tableFields.forEach((fld, fi) => {
        const el = document.getElementById(`rslot-${fi}`);
        if (!el) return;
        const word = tabRelSlots[fi];
        const canDrop = tabRelSelWB !== null && !word;
        if (word) { el.textContent = word; el.className = 'font-mono text-xs flex-1 text-yellow-300 font-bold'; }
        else { el.textContent = canDrop ? '← aquí' : '▢'; el.className = `font-mono text-xs flex-1 ${canDrop ? 'text-indigo-400 italic' : 'text-slate-600 italic'}`; }
    });
}

function validateRelTable() {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];
    const total  = rel.tableFields.length;
    const filled = Object.values(tabRelSlots).filter(v => v !== null).length;
    if (filled < total) { _showTabFeedback('warning', `⚠️ Quedan ${total - filled} campo(s) sin asignar.`); return; }

    const pkSet    = new Set(rel.tableFields.filter(f => f.isPK).map(f => f.name));
    const nonPkSet = new Set(rel.tableFields.filter(f => !f.isPK).map(f => f.name));
    const pkZone   = rel.tableFields.filter(f => f.isPK).length;
    let hits = 0;
    rel.tableFields.forEach((fld, fi) => {
        const w  = tabRelSlots[fi];
        const ok = w !== null && (fi < pkZone ? pkSet.has(w) : nonPkSet.has(w));
        if (ok) hits++;
        const el = document.getElementById(`rslot-${fi}`);
        if (el) el.className = `font-mono text-xs flex-1 font-bold ${ok ? 'text-green-300' : 'text-red-300'}`;
    });

    tabRelAttempts++;
    const pct = Math.round(hits / total * 100);
    if (hits === total) {
        _showTabFeedback('success', `🎉 ¡Correcto! Tabla "${rel.tableName}" completada.
          <button onclick="advanceRelation()" class="ml-2 px-3 py-0.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xs">Siguiente →</button>`);
    } else {
        let html = `<span class="font-bold">${hits}/${total} correctos (${pct}%).</span> PK en primeros slots; resto en cualquier orden.`;
        if (tabRelAttempts >= 2) html += ` <button onclick="revealRelTable()" class="ml-2 px-2 py-0.5 bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs">💡 Ver respuestas</button>`;
        html += ` <button onclick="advanceRelation()" class="ml-2 px-2 py-0.5 bg-indigo-700 text-indigo-100 font-semibold rounded-lg text-xs">Continuar →</button>`;
        _showTabFeedback('error', html);
    }
}

function revealRelTable() {
    const rel = tablesData[tabExIdx].relations[tabRelIdx];
    tabRelRevealed = true;
    rel.tableFields.forEach((fld, fi) => {
        tabRelSlots[fi] = fld.name;
        tabRelWB.forEach(w => { if (w.word === fld.name) w.used = true; });
        const el = document.getElementById(`rslot-${fi}`);
        if (el) { el.textContent = fld.name; el.className = 'font-mono text-xs flex-1 text-green-300 font-bold'; }
    });
    _refreshRelWB();
    _showTabFeedback('info', `✓ Respuestas reveladas.
      <button onclick="advanceRelation()" class="ml-2 px-3 py-0.5 bg-indigo-700 text-indigo-100 font-bold rounded-lg text-xs">Siguiente →</button>`);
}

// ── Sub-UI: elegir dónde va la FK ─────────────────────────────────────────────

function _renderFKPlacement(data, rel) {
    document.getElementById('tab-feedback')?.classList.add('hidden');
    const fp = rel.fkPlacement;
    const tableNames = data.entityTables.map(t => t.name);

    document.getElementById('tab-rel-sub').innerHTML = `
<div class="flex flex-col gap-2 pt-2 border-t border-slate-700/40 mt-1">
  <p class="text-xs text-green-400 font-bold">✓ Correcto — esta relación no genera tabla. ¿En qué tabla se agrega la clave foránea?</p>
  <div class="flex flex-wrap gap-2" id="tab-fk-btns">
    ${tableNames.map(name => `<button onclick="chooseFKTarget('${name}')"
        class="px-4 py-2 rounded-xl text-sm font-bold border transition bg-slate-700 border-slate-600 text-slate-200 hover:bg-indigo-900/40 hover:border-indigo-500 hover:text-indigo-200">
        ${name}</button>`).join('')}
  </div>
</div>`;
}

function chooseFKTarget(tableName) {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];
    const fp   = rel.fkPlacement;
    const ok   = tableName === fp.targetTable;

    document.querySelectorAll('#tab-fk-btns button').forEach(b => { b.disabled = true; });
    const clickedBtn = [...document.querySelectorAll('#tab-fk-btns button')].find(b => b.textContent.trim() === tableName);

    if (ok) {
        if (clickedBtn) clickedBtn.style.cssText = 'background:rgba(22,101,52,.6);border-color:#16a34a;color:#bbf7d0';
        if (!tabFKAdditions[fp.targetTable]) tabFKAdditions[fp.targetTable] = [];
        fp.fkFields.forEach(f => tabFKAdditions[fp.targetTable].push(f));
        const fkList = fp.fkFields.map(f => `<code class="text-yellow-300 font-bold">${f.name}</code> FK → ${f.fkTo}`).join(', ');
        _showTabFeedback('success', `✓ Correcto. Se agrega ${fkList} a <strong>${fp.targetTable}</strong>. ${fp.reason}
          <button onclick="advanceRelation()" class="ml-2 px-3 py-0.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xs">Siguiente →</button>`);
    } else {
        tabFKAttempts++;
        if (clickedBtn) clickedBtn.style.cssText = 'background:rgba(127,29,29,.6);border-color:#dc2626;color:#fca5a5;opacity:.6';
        let hint = 'Revisar: ¿cuál es la tabla del lado N de la relación?';
        if (tabFKAttempts >= 2) {
            hint = `La respuesta correcta es <strong>${fp.targetTable}</strong>. ${fp.reason}`;
            if (!tabFKAdditions[fp.targetTable]) tabFKAdditions[fp.targetTable] = [];
            fp.fkFields.forEach(f => tabFKAdditions[fp.targetTable].push(f));
        }
        _showTabFeedback('error', `✗ Incorrecto. ${hint}
          ${tabFKAttempts >= 2 ? `<button onclick="advanceRelation()" class="ml-2 px-2 py-0.5 bg-indigo-700 text-indigo-100 font-semibold rounded-lg text-xs">Continuar →</button>` : ''}`);
        if (tabFKAttempts < 2) {
            document.querySelectorAll('#tab-fk-btns button').forEach(b => {
                if (!b.style.cssText.includes('127,29,29')) b.disabled = false;
            });
        }
    }
}

function advanceRelation() {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];
    if (!rel.generatesTable && rel.fkPlacement && !tabFKAdditions[rel.fkPlacement.targetTable]) {
        tabFKAdditions[rel.fkPlacement.targetTable] = [...rel.fkPlacement.fkFields];
    }
    tabRelIdx++;
    if (tabRelIdx >= data.relations.length) { tabPhase = 'complete'; _renderCompletePhase(data); }
    else                                     { _renderRelationPhase(data); }
}

// ══════════════════════════════════════════════════════════════════════════════
// FASE 3: ESQUEMA COMPLETO
// ══════════════════════════════════════════════════════════════════════════════

function _renderCompletePhase(data) {
    document.getElementById('tab-phase-label').textContent = '✓ Modelo relacional completo';
    document.getElementById('tab-feedback')?.classList.add('hidden');

    const allTables  = _buildFinalTables(data);
    const fkExpected = _buildAllFKConstraints(allTables);

    const tableBlocks = allTables.map(tbl => {
        const fieldStr = tbl.fields.map(f => {
            let n = f.name;
            if (f.isPK && f.isFK) n = `<u><span class="text-indigo-300">${n}</span></u>`;
            else if (f.isPK)       n = `<u>${n}</u>`;
            else if (f.isFK)       n = `<span class="text-indigo-300">${n}</span>`;
            return n;
        }).join(', ');
        const color = tbl.isRelation          ? 'text-emerald-300 border-emerald-800/40'
            : tbl.sourceType === 'weak'        ? 'text-amber-300 border-amber-800/40'
            : tbl.sourceType === 'isa'         ? 'text-sky-300 border-sky-800/40'
            : tbl.sourceType === 'multivalued' ? 'text-purple-300 border-purple-800/40'
            :                                    'text-white border-slate-700';
        return `<div class="font-mono text-sm px-3 py-1.5 rounded-lg border bg-slate-900/60 ${color}">
          <span class="font-extrabold">${tbl.name}</span>(<span class="text-slate-300">${fieldStr}</span>)
        </div>`;
    }).join('');

    const fkInputsHTML = fkExpected.length > 0
        ? fkExpected.map((_, i) => `
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-600 w-5 text-right shrink-0">${i+1}.</span>
            <input id="fk-input-${i}" type="text" placeholder="TABLA.campo FK TABLA2.campo"
                   class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition"
                   spellcheck="false" autocomplete="off">
          </div>`).join('')
        : '<p class="text-xs text-slate-600 italic">Este ejercicio no tiene restricciones de integridad referencial.</p>';

    document.getElementById('tab-phase-content').innerHTML = `
<div class="flex flex-col gap-4">
  <div class="flex items-center gap-3">
    <span class="text-2xl">🎉</span>
    <div>
      <h3 class="text-base font-extrabold text-white">Modelo Relacional Completo</h3>
      <p class="text-xs text-slate-500">PK: subrayada · FK: azul · PK+FK: ambos.</p>
    </div>
  </div>

  <div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col gap-1.5">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Esquema</p>
    ${tableBlocks}
  </div>

  <div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
    <div>
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Restricciones de integridad referencial</p>
      <p class="text-xs text-slate-500 mt-0.5">Escribir cada restricción en formato: <code class="text-slate-300 bg-slate-800 px-1 rounded">TABLA.campo FK TABLA2.campo</code></p>
    </div>
    <div class="flex flex-col gap-2" id="fk-inputs-wrap">${fkInputsHTML}</div>
    ${fkExpected.length > 0 ? `
    <div class="flex gap-2 flex-wrap mt-1">
      <button onclick="validateFKConstraints()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition">✔ Verificar restricciones</button>
      <button onclick="revealFKConstraints()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition">💡 Ver respuestas</button>
      <button onclick="exportPDF()" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition">📄 Exportar PDF</button>
    </div>
    <div id="fk-val-result"></div>` : `
    <button onclick="exportPDF()" class="self-start px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition">📄 Exportar PDF</button>`}
  </div>
</div>`;
}

function validateFKConstraints() {
    const data      = tablesData[tabExIdx];
    const allTables = _buildFinalTables(data);
    const expected  = _buildAllFKConstraints(allTables);
    const normExp   = expected.map(_normFK);
    const used      = new Array(expected.length).fill(false);
    let correct     = 0;

    for (let i = 0; i < expected.length; i++) {
        const input = document.getElementById(`fk-input-${i}`);
        if (!input) continue;
        const val = _normFK(input.value);
        if (!val) { input.style.cssText = ''; continue; }
        const matchIdx = normExp.findIndex((e, j) => !used[j] && e === val);
        if (matchIdx !== -1) {
            used[matchIdx] = true; correct++;
            input.style.cssText = 'border-color:#22c55e;color:#86efac';
        } else {
            input.style.cssText = 'border-color:#ef4444;color:#fca5a5';
        }
    }

    const result = document.getElementById('fk-val-result');
    if (!result) return;
    const n = expected.length;
    if (correct === n) {
        result.innerHTML = `<p class="text-green-400 text-xs font-bold mt-1">🎉 ¡Todas las restricciones son correctas! <button onclick="exportPDF()" class="ml-2 px-2 py-0.5 bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs">📄 Exportar PDF</button></p>`;
    } else {
        const missing = expected.filter((_, j) => !used[j]).map(c => `<code class="text-yellow-300">${c}</code>`);
        result.innerHTML = `<p class="text-yellow-300 text-xs font-semibold mt-1">${correct}/${n} correctas.${missing.length ? ` Faltan o son incorrectas: ${missing.join(', ')}` : ''}</p>`;
    }
}

function revealFKConstraints() {
    const data      = tablesData[tabExIdx];
    const allTables = _buildFinalTables(data);
    const expected  = _buildAllFKConstraints(allTables);
    expected.forEach((c, i) => {
        const input = document.getElementById(`fk-input-${i}`);
        if (input) { input.value = c; input.style.cssText = 'border-color:#22c55e;color:#86efac'; }
    });
    const result = document.getElementById('fk-val-result');
    if (result) result.innerHTML = `<p class="text-slate-400 text-xs mt-1">✓ Respuestas reveladas. <button onclick="exportPDF()" class="ml-2 px-2 py-0.5 bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs">📄 Exportar PDF</button></p>`;
}

function exportPDF() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    const allTables = _buildFinalTables(data);
    const fkList    = _buildAllFKConstraints(allTables);
    const title     = (typeof exercises !== 'undefined' && exercises[tabExIdx]?.title)
        ? exercises[tabExIdx].title : `Ejercicio ${tabExIdx + 1}`;

    const tableRows = allTables.map(tbl => {
        const fields = tbl.fields.map(f => {
            if (f.isPK && f.isFK) return `<u><i>${f.name}</i></u>`;
            if (f.isPK)  return `<u>${f.name}</u>`;
            if (f.isFK)  return `<i>${f.name}</i>`;
            return f.name;
        }).join(', ');
        return `<div style="margin:5px 0;font-family:'Courier New',monospace;font-size:13px"><b>${tbl.name}</b>(${fields})</div>`;
    }).join('');

    const fkRows = fkList.length
        ? fkList.map(c => `<div style="margin:3px 0;font-family:'Courier New',monospace;font-size:12px;color:#222">${c}</div>`).join('')
        : '<div style="color:#888;font-style:italic;font-size:11px">Sin restricciones de integridad referencial.</div>';

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Pasaje a Tablas — ${title}</title>
<style>body{font-family:Arial,sans-serif;padding:24px;color:#111;max-width:900px;margin:0 auto}
h1{font-size:18px;margin:0 0 4px}
p.sub{font-size:11px;color:#666;margin:0 0 16px}
h2{font-size:12px;font-weight:bold;color:#444;border-bottom:1px solid #ddd;padding-bottom:3px;margin:18px 0 8px}
.footer{margin-top:30px;font-size:9px;color:#aaa}
@media print{body{padding:10px}}</style></head><body>
<h1>Modelo Relacional — ${title}</h1>
<p class="sub">PK: <u>subrayado</u> &nbsp;|&nbsp; FK: <i>cursiva</i> &nbsp;|&nbsp; PK+FK: <u><i>ambos</i></u></p>
<h2>Esquema</h2>${tableRows}
<h2>Restricciones de integridad referencial</h2>${fkRows}
<div class="footer">Diseñada por Prof. Elizabeth Izquierdo con asistencia de Claude — CC BY-SA 4.0</div>
</body></html>`;

    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 300); }
    else   { alert('El navegador bloqueó la ventana emergente. Permitir popups para esta función.'); }
}

// ══════════════════════════════════════════════════════════════════════════════
// CONSTRUCCIÓN DEL ESQUEMA FINAL
// ══════════════════════════════════════════════════════════════════════════════

function _buildFinalTables(data) {
    const result = [];
    data.entityTables.forEach(tbl => {
        const extraFKs = tabFKAdditions[tbl.name] || [];
        result.push({ name: tbl.name, sourceType: tbl.sourceType, isRelation: false, fields: [...tbl.fields, ...extraFKs] });
    });
    data.relations.forEach(rel => {
        if (!rel.generatesTable) return;
        result.push({ name: rel.tableName, sourceType: 'relation', isRelation: true, fields: rel.tableFields || [] });
    });
    return result;
}

function _buildAllFKConstraints(allTables) {
    const constraints = [];
    allTables.forEach(tbl => {
        tbl.fields.forEach(f => {
            if (!f.isFK || !f.fkTo) return;
            const refField = f.fkRefField || _findPKField(f.fkTo, allTables, f.name);
            constraints.push(`${tbl.name}.${f.name} FK ${f.fkTo}.${refField}`);
        });
    });
    return constraints;
}

function _findPKField(parentName, allTables, fallback) {
    const parent = allTables.find(t => t.name === parentName);
    if (!parent) return fallback;
    const exact = parent.fields.find(f => f.isPK && f.name === fallback);
    if (exact) return exact.name;
    const first = parent.fields.find(f => f.isPK);
    return first ? first.name : fallback;
}

function _normFK(s) {
    return (s || '').trim().replace(/\s+/g, ' ').toUpperCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// ══════════════════════════════════════════════════════════════════════════════
// IMAGEN MER
// ══════════════════════════════════════════════════════════════════════════════

function handleMerImage(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        tabMerImageUrl = e.target.result;
        const wrap = document.getElementById('tab-img-wrap');
        const img  = document.getElementById('tab-mer-img');
        if (wrap && img) { img.src = tabMerImageUrl; wrap.classList.remove('hidden'); }
    };
    reader.readAsDataURL(file);
    input.value = '';
}

// ══════════════════════════════════════════════════════════════════════════════
// EXPORTAR / IMPORTAR JSON
// ══════════════════════════════════════════════════════════════════════════════

function exportTablesProgress() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    const payload = {
        version: 3, ejercicio: tabExIdx + 1, phase: tabPhase,
        entitySlots: tabEntSlots, fkAdditions: tabFKAdditions,
        relIdx: tabRelIdx, relSlots: tabRelSlots
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const exTitle = (typeof exercises !== 'undefined' && exercises[tabExIdx]?.title)
        ? exercises[tabExIdx].title.replace(/\s+/g, '_') : `ejercicio_${tabExIdx + 1}`;
    a.href = url; a.download = `pasaje_tablas_${exTitle}.json`; a.click();
    URL.revokeObjectURL(url);
}

function importTablesProgress(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const p = JSON.parse(e.target.result);
            if (!p.ejercicio) { alert('Archivo JSON no reconocido.'); return; }
            const exIdx = p.ejercicio - 1;
            if (exIdx !== tabExIdx) {
                if (!confirm(`El progreso es del ejercicio ${p.ejercicio} y el actual es el ${tabExIdx + 1}. ¿Cargar de todas formas?`)) return;
            }
            tabEntSlots    = p.entitySlots  || {};
            tabFKAdditions = p.fkAdditions  || {};
            tabRelIdx      = p.relIdx       || 0;
            tabRelSlots    = p.relSlots     || {};
            tabPhase       = p.phase        || 'entities';
            const data = tablesData[tabExIdx];
            if (!data) return;
            if (tabPhase === 'complete')       { _renderCompletePhase(data); }
            else if (tabPhase === 'relations') { _renderRelationPhase(data); }
            else {
                _renderEntityPhase(data);
                data.entityTables.forEach((tbl, ti) => {
                    tbl.fields.forEach((fld, fi) => {
                        const w = tabEntSlots[`${ti}_${fi}`];
                        if (w) {
                            const wbi = tabEntWB.findIndex(wb => wb.word === w && !wb.used);
                            if (wbi !== -1) tabEntWB[wbi].used = true;
                            const el = document.getElementById(`eslot-${ti}-${fi}`);
                            if (el) { el.textContent = w; el.className = 'font-mono text-xs flex-1 text-yellow-300 font-bold'; }
                        }
                    });
                });
                _refreshEntWB();
            }
            _showTabFeedback('success', `✓ Progreso del ejercicio ${p.ejercicio} cargado.`);
        } catch (err) { alert('Error al leer el archivo JSON: ' + err.message); }
    };
    reader.readAsText(file);
    input.value = '';
}

// ══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ══════════════════════════════════════════════════════════════════════════════

function _showTabFeedback(type, html) {
    const fb = document.getElementById('tab-feedback');
    if (!fb) return;
    const styles = {
        success: 'bg-green-950/60 border-green-700/50 text-green-200',
        error:   'bg-red-950/60 border-red-700/50 text-red-200',
        warning: 'bg-yellow-950/60 border-yellow-700/50 text-yellow-200',
        info:    'bg-slate-800/80 border-slate-600/50 text-slate-200'
    };
    fb.className = `rounded-xl border p-3 text-sm ${styles[type] || styles.info}`;
    fb.innerHTML = html;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function _tabShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

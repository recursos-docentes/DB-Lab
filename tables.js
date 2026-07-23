// tables.js — Pestaña "Pasaje a Tablas" v2 — Flujo guiado paso a paso
// Diseñada por Prof. Elizabeth Izquierdo con asistencia de Claude — CC BY-SA 4.0

// ══════════════════════════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ══════════════════════════════════════════════════════════════════════════════

let tabPhase        = 'entities'; // 'entities' | 'relations' | 'complete'
let tabExIdx        = 0;

// — Fase entidades —
let tabEntWB        = [];   // [{ word, used }] banco de palabras de entidades
let tabEntSlots     = {};   // { "ti_fi": word | null }
let tabEntSelWB     = null; // índice seleccionado del banco
let tabEntAttempts  = 0;
let tabEntRevealed  = false;

// — Fase relaciones —
let tabRelIdx       = 0;    // relación actual (0-based)
let tabDecision     = null; // 'yes' | 'no' — decisión del estudiante para la relación actual
let tabDecAttempts  = 0;    // intentos fallidos de decisión sí/no
let tabRelWB        = [];   // banco de palabras para tabla de relación
let tabRelSlots     = {};   // { "fi": word | null }
let tabRelSelWB     = null;
let tabRelAttempts  = 0;
let tabRelRevealed  = false;
let tabFKAttempts   = 0;    // intentos para elegir tabla destino FK
let tabFKRevealed   = false;
let tabFKChosen     = null; // tabla elegida (caso no-genera)

// FK acumuladas de relaciones que NO generan tabla
let tabFKAdditions  = {};   // { tableName: [{name, isFK, fkTo, fkRefField?}] }

// — Imagen MER —
let tabMerImageUrl  = null;
let tabImgVisible   = false;

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

    // Resetear estado
    tabPhase       = 'entities';
    tabExIdx       = exIdx;
    tabEntWB       = [];
    tabEntSlots    = {};
    tabEntSelWB    = null;
    tabEntAttempts = 0;
    tabEntRevealed = false;
    tabRelIdx      = 0;
    tabDecision    = null;
    tabDecAttempts = 0;
    tabFKAdditions = {};

    // Construir banco de palabras de entidades
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            tabEntWB.push({ word: fld.name, used: false });
            tabEntSlots[`${ti}_${fi}`] = null;
        });
    });
    _tabShuffle(tabEntWB);

    // Renderizar contenedor principal
    stage.innerHTML = _buildShellHTML(data, exIdx);

    // Mostrar fase entidades
    _renderEntityPhase(data);
}

// ══════════════════════════════════════════════════════════════════════════════
// SHELL HTML (persistente entre fases)
// ══════════════════════════════════════════════════════════════════════════════

function _buildShellHTML(data, exIdx) {
    const title = (typeof exercises !== 'undefined' && exercises[exIdx])
        ? exercises[exIdx].title : 'Pasaje a Tablas';
    return `
<div class="flex flex-col gap-0 w-full max-w-[1600px] mx-auto pb-10" id="tab-root">

  <!-- Barra superior -->
  <div class="flex items-center justify-between flex-wrap gap-2 px-4 py-3 bg-slate-900/70 border-b border-slate-800 sticky top-0 z-10">
    <div>
      <h2 class="text-sm font-extrabold text-white">${title} — Pasaje a Tablas</h2>
      <p id="tab-phase-label" class="text-[10px] text-slate-500 mt-0.5">Fase 1: Entidades</p>
    </div>
    <div class="flex gap-2">
      <label class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer" title="Subir imagen del MER para referencia">
        🖼️ MER
        <input type="file" accept="image/*" class="hidden" onchange="handleMerImage(this)">
      </label>
      <button onclick="exportTablesProgress()" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition" title="Exportar progreso a JSON">💾 Exportar</button>
      <label class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer" title="Importar progreso desde JSON">
        📂 Importar
        <input type="file" accept=".json" class="hidden" onchange="importTablesProgress(this)">
      </label>
      <button onclick="renderTablesPanel(tabExIdx)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-lg transition" title="Reiniciar todo">🔄</button>
    </div>
  </div>

  <!-- Panel imagen MER -->
  <div id="tab-img-wrap" class="hidden px-4 pt-3">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-2 flex items-start gap-2">
      <img id="tab-mer-img" src="" alt="MER" class="max-h-64 rounded-lg object-contain flex-1 w-0">
      <button onclick="document.getElementById('tab-img-wrap').classList.add('hidden')"
              class="text-slate-500 hover:text-white text-xs leading-none mt-0.5 flex-shrink-0">✕</button>
    </div>
  </div>

  <!-- Contenido de fase (se reemplaza en cada transición) -->
  <div id="tab-phase-content" class="px-4 pt-4"></div>

  <!-- Feedback -->
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
        const sourceLabel = { entity:'Entidad', weak:'Entidad débil', isa:'Categorización (ISA)', multivalued:'Atrib. multivaluado' }[tbl.sourceType] || 'Entidad';
        const rows = tbl.fields.map((fld, fi) => {
            const icon = fld.isPK && fld.isFK ? '🔑' : fld.isPK ? '🔑' : fld.isFK ? '🔗' : '·';
            const hint = fld.isPK && fld.isFK ? 'PK · FK' : fld.isPK ? 'PK' : fld.isFK ? 'FK' : '';
            return `<div class="tab-ent-slot flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800/60 cursor-pointer transition hover:bg-slate-800/40"
                         onclick="clickEntSlot(${ti},${fi})">
              <span class="text-xs w-4 text-center select-none">${icon}</span>
              <span id="eslot-${ti}-${fi}" class="font-mono text-xs flex-1 text-slate-600 italic">▢</span>
              <span class="text-[9px] text-slate-600 font-mono">${hint}</span>
            </div>`;
        }).join('');
        return `
<div class="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden">
  <div class="px-3 py-2 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between gap-2">
    <span class="font-mono font-bold text-white text-sm">${tbl.name}</span>
    <span class="text-[9px] font-bold text-indigo-300 bg-indigo-900/40 border border-indigo-700/40 px-1.5 py-0.5 rounded-full">${sourceLabel}</span>
  </div>
  <p class="text-[9px] text-slate-500 px-3 pt-1.5 pb-0.5 leading-tight">${tbl.note}</p>
  <div class="border-t border-slate-800 mt-1">
    <div class="grid grid-cols-[20px_1fr_auto] text-[9px] font-bold text-slate-700 uppercase tracking-wide px-3 py-1 bg-slate-800/40">
      <span></span><span>Campo</span><span>Tipo</span>
    </div>
    ${rows}
  </div>
</div>`;
    }).join('');

    document.getElementById('tab-phase-content').innerHTML = `
<div class="flex flex-col gap-3">
  <!-- Banco de palabras -->
  <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Banco de campos</p>
    <div id="tab-ent-wb" class="flex flex-wrap gap-1.5 min-h-[28px]"></div>
  </div>
  <!-- Instrucción -->
  <p class="text-xs text-slate-500">Seleccionar un campo del banco y luego hacer clic en el slot correspondiente. Clic en un slot ocupado devuelve el campo al banco.</p>
  <!-- Tablas de entidades -->
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
    ${grid}
  </div>
  <!-- Botones -->
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
        if (item.used) return `<span class="px-2 py-0.5 rounded-md text-xs text-slate-700 line-through select-none">${item.word}</span>`;
        const sel = tabEntSelWB === idx;
        return `<button onclick="selectEntWord(${idx})"
          class="px-2.5 py-0.5 rounded-md text-xs font-semibold border transition
            ${sel ? 'bg-yellow-400 text-slate-900 border-yellow-300 ring-2 ring-yellow-300'
                  : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'}"
        >${item.word}</button>`;
    }).join('');
}

function selectEntWord(idx) {
    if (tabEntRevealed) return;
    if (tabEntWB[idx]?.used) return;
    tabEntSelWB = (tabEntSelWB === idx) ? null : idx;
    _refreshEntWB();
    _refreshEntSlots();
}

function clickEntSlot(ti, fi) {
    if (tabEntRevealed) return;
    const key    = `${ti}_${fi}`;
    const placed = tabEntSlots[key];

    if (placed) {
        // Devolver al banco
        const wbi = tabEntWB.findIndex(w => w.word === placed && w.used);
        if (wbi !== -1) tabEntWB[wbi].used = false;
        tabEntSlots[key] = null;
        tabEntSelWB = null;
        _refreshEntWB();
        _refreshEntSlots();
        return;
    }
    if (tabEntSelWB === null) return;
    tabEntWB[tabEntSelWB].used = true;
    tabEntSlots[key] = tabEntWB[tabEntSelWB].word;
    tabEntSelWB = null;
    _refreshEntWB();
    _refreshEntSlots();
}

function _refreshEntSlots() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            const el = document.getElementById(`eslot-${ti}-${fi}`);
            if (!el) return;
            const word = tabEntSlots[`${ti}_${fi}`];
            const canDrop = tabEntSelWB !== null && !word && !tabEntRevealed;
            if (word) {
                el.textContent = word;
                el.className = 'font-mono text-xs flex-1 text-yellow-300 font-bold';
            } else {
                el.textContent = canDrop ? '← aquí' : '▢';
                el.className = `font-mono text-xs flex-1 ${canDrop ? 'text-indigo-400 italic' : 'text-slate-600 italic'}`;
            }
        });
    });
}

function validateEntities() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    const total  = Object.keys(tabEntSlots).length;
    const filled = Object.values(tabEntSlots).filter(v => v !== null).length;
    if (filled < total) {
        _showTabFeedback('warning', `⚠️ Quedan ${total - filled} campo(s) sin asignar.`);
        return;
    }
    let hits = 0;
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            if (tabEntSlots[`${ti}_${fi}`] === fld.name) hits++;
        });
    });
    tabEntAttempts++;
    const pct = Math.round(hits / total * 100);

    // Colorear slots
    _colorEntSlots(data);

    if (hits === total) {
        _showTabFeedback('success', `🎉 ¡Perfecto! Todas las tablas de entidades están correctas.
          <button onclick="proceedToRelations()"
            class="ml-3 px-3 py-1 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xs transition">
            Continuar → Relaciones
          </button>`);
    } else {
        let html = `<span class="font-bold">${hits} de ${total} campos correctos (${pct}%).</span>`;
        if (tabEntAttempts >= 2) {
            html += ` <button onclick="revealEntAnswers()"
              class="ml-2 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg text-xs transition">💡 Ver respuestas</button>`;
        }
        html += ` <button onclick="proceedToRelations()" class="ml-2 px-2 py-0.5 bg-indigo-700 hover:bg-indigo-600 text-indigo-100 font-semibold rounded-lg text-xs transition">Continuar igual →</button>`;
        _showTabFeedback('error', html);
    }
}

function _colorEntSlots(data) {
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            const el = document.getElementById(`eslot-${ti}-${fi}`);
            if (!el) return;
            const word = tabEntSlots[`${ti}_${fi}`];
            const ok   = word === fld.name;
            el.className = `font-mono text-xs flex-1 font-bold ${ok ? 'text-green-300' : 'text-red-300'}`;
        });
    });
}

function revealEntAnswers() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    tabEntRevealed = true;
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            tabEntSlots[`${ti}_${fi}`] = fld.name;
        });
    });
    tabEntWB.forEach(w => w.used = true);
    _refreshEntWB();
    _colorEntSlots(data);
    _showTabFeedback('info', '✓ Respuestas reveladas.');
}

function proceedToRelations() {
    const data = tablesData[tabExIdx];
    if (!data) return;
    // Completar con respuestas correctas si no están todas
    data.entityTables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            if (!tabEntSlots[`${ti}_${fi}`]) tabEntSlots[`${ti}_${fi}`] = fld.name;
        });
    });
    tabPhase   = 'relations';
    tabRelIdx  = 0;
    tabDecision     = null;
    tabDecAttempts  = 0;
    tabFKAdditions  = {};
    document.getElementById('tab-feedback')?.classList.add('hidden');
    _renderRelationPhase(data);
}

// ══════════════════════════════════════════════════════════════════════════════
// FASE 2: RELACIONES
// ══════════════════════════════════════════════════════════════════════════════

function _renderRelationPhase(data) {
    const rel   = data.relations[tabRelIdx];
    const total = data.relations.length;
    document.getElementById('tab-phase-label').textContent =
        `Fase 2 de 2: Relaciones (${tabRelIdx + 1} / ${total})`;
    document.getElementById('tab-feedback')?.classList.add('hidden');

    // Reset estado de relación actual
    tabDecision    = null;
    tabDecAttempts = 0;
    tabRelWB       = [];
    tabRelSlots    = {};
    tabRelSelWB    = null;
    tabRelAttempts = 0;
    tabRelRevealed = false;
    tabFKAttempts  = 0;
    tabFKRevealed  = false;
    tabFKChosen    = null;

    document.getElementById('tab-phase-content').innerHTML = `
<div class="flex flex-col gap-3">
  <!-- Tarjeta de relación -->
  <div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
    <div class="flex items-center gap-3 flex-wrap">
      <span class="text-2xl font-mono font-black text-white">${rel.name}</span>
      <span class="text-xs text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-mono">${rel.cardHint}</span>
    </div>
    <div class="bg-indigo-950/40 border border-indigo-800/30 rounded-lg px-3 py-2">
      <p class="text-xs text-indigo-300"><span class="font-bold">Regla aplicable:</span> ${rel.ruleHint}</p>
    </div>

    <!-- Decisión -->
    <div>
      <p class="text-xs text-slate-400 font-semibold mb-2">¿Esta relación genera una tabla?</p>
      <div class="flex gap-2">
        <button id="btn-rel-yes" onclick="setRelDecision('yes')"
          class="px-5 py-2 rounded-xl text-sm font-bold border transition bg-slate-700 border-slate-600 text-slate-200 hover:bg-emerald-900/50 hover:border-emerald-600 hover:text-emerald-200">
          ✅ SÍ, genera tabla
        </button>
        <button id="btn-rel-no" onclick="setRelDecision('no')"
          class="px-5 py-2 rounded-xl text-sm font-bold border transition bg-slate-700 border-slate-600 text-slate-200 hover:bg-rose-900/50 hover:border-rose-600 hover:text-rose-200">
          ❌ NO, agrega FK
        </button>
      </div>
    </div>

    <!-- Sub-UI dinámica (se inyecta al decidir) -->
    <div id="tab-rel-sub"></div>
  </div>

  <!-- Progreso de relaciones ya procesadas -->
  <div id="tab-rel-progress" class="text-[10px] text-slate-600"></div>
</div>`;

    _updateRelProgress(data);
}

function _updateRelProgress(data) {
    const el = document.getElementById('tab-rel-progress');
    if (!el || tabRelIdx === 0) return;
    const lines = data.relations.slice(0, tabRelIdx).map((r, i) => {
        const decided = (typeof tabFKAdditions[r.fkPlacement?.targetTable] !== 'undefined' || r.generatesTable)
            ? '✓' : '✓';
        return `<span class="mr-3">✓ ${r.name}</span>`;
    });
    el.innerHTML = `<span class="text-slate-700">Procesadas: </span>${lines.join('')}`;
}

function setRelDecision(d) {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];
    const correct = rel.generatesTable ? 'yes' : 'no';

    // Marcar botón activo
    ['yes','no'].forEach(v => {
        const btn = document.getElementById(`btn-rel-${v}`);
        if (!btn) return;
        btn.className = btn.className
            .replace(/bg-emerald-\S+|bg-rose-\S+|bg-indigo-\S+|border-emerald-\S+|border-rose-\S+|border-indigo-\S+|text-emerald-\S+|text-rose-\S+|text-indigo-\S+/g, '')
            .trim();
        if (v === d) {
            btn.className += d === 'yes'
                ? ' bg-emerald-900/60 border-emerald-600 text-emerald-200'
                : ' bg-rose-900/60 border-rose-600 text-rose-200';
        }
        btn.disabled = true;
    });

    tabDecision = d;

    if (d === correct) {
        // Decisión correcta → mostrar sub-UI
        if (d === 'yes') {
            _renderRelTableFill(data, rel);
        } else {
            _renderFKPlacement(data, rel);
        }
    } else {
        // Decisión incorrecta
        tabDecAttempts++;
        const hint = tabDecAttempts >= 2
            ? ` La respuesta correcta es: <strong>${correct === 'yes' ? 'SÍ genera tabla' : 'NO genera tabla'}</strong>. Motivo: ${rel.ruleHint}.`
            : ' Revisar la regla indicada arriba y volver a intentar.';
        _showTabFeedback('error', `✗ Incorrecto.${hint}`);
        // Re-habilitar botones para reintento
        setTimeout(() => {
            ['yes','no'].forEach(v => {
                const btn = document.getElementById(`btn-rel-${v}`);
                if (btn) { btn.disabled = false; }
            });
            // Resetear estilos
            ['yes','no'].forEach(v => {
                const btn = document.getElementById(`btn-rel-${v}`);
                if (btn) {
                    btn.className = 'px-5 py-2 rounded-xl text-sm font-bold border transition bg-slate-700 border-slate-600 text-slate-200 '
                        + (v === 'yes' ? 'hover:bg-emerald-900/50 hover:border-emerald-600 hover:text-emerald-200'
                                       : 'hover:bg-rose-900/50 hover:border-rose-600 hover:text-rose-200');
                }
            });
            tabDecision = null;
        }, 1500);
    }
}

// ── Sub-UI: llenar tabla de relación ─────────────────────────────────────────

function _renderRelTableFill(data, rel) {
    document.getElementById('tab-feedback')?.classList.add('hidden');

    // Banco para esta tabla
    tabRelWB   = [];
    tabRelSlots = {};
    rel.tableFields.forEach((fld, fi) => {
        tabRelWB.push({ word: fld.name, used: false });
        tabRelSlots[fi] = null;
    });
    _tabShuffle(tabRelWB);

    const rows = rel.tableFields.map((fld, fi) => {
        const icon = fld.isPK && fld.isFK ? '🔑' : fld.isPK ? '🔑' : fld.isFK ? '🔗' : '·';
        const hint = fld.isPK && fld.isFK ? 'PK · FK' : fld.isPK ? 'PK' : fld.isFK ? 'FK' : '';
        return `<div class="tab-rslot flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800/60 cursor-pointer transition hover:bg-slate-800/40"
                     onclick="clickRelSlot(${fi})">
          <span class="text-xs w-4 text-center select-none">${icon}</span>
          <span id="rslot-${fi}" class="font-mono text-xs flex-1 text-slate-600 italic">▢</span>
          <span class="text-[9px] text-slate-600 font-mono">${hint}</span>
        </div>`;
    }).join('');

    document.getElementById('tab-rel-sub').innerHTML = `
<div class="flex flex-col gap-2 pt-1">
  <p class="text-xs text-emerald-400 font-bold">✅ Correcto — esta relación genera tabla. Completar los campos:</p>
  <p class="text-[10px] text-slate-500">${rel.tableNote}</p>
  <!-- Banco -->
  <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-2">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Banco de campos</p>
    <div id="tab-rel-wb" class="flex flex-wrap gap-1.5 min-h-[24px]"></div>
  </div>
  <!-- Tabla -->
  <div class="bg-slate-950/60 border border-slate-700 rounded-xl overflow-hidden">
    <div class="px-3 py-2 bg-slate-800/80 border-b border-slate-700 flex items-center gap-2">
      <span class="font-mono font-bold text-white text-sm">${rel.tableName}</span>
      <span class="text-[9px] text-emerald-300 bg-emerald-900/30 border border-emerald-700/40 px-1.5 py-0.5 rounded-full font-bold">Tabla nueva</span>
    </div>
    <div class="border-t border-slate-800">
      <div class="grid grid-cols-[20px_1fr_auto] text-[9px] font-bold text-slate-700 uppercase tracking-wide px-3 py-1 bg-slate-800/40">
        <span></span><span>Campo</span><span>Tipo</span>
      </div>
      ${rows}
    </div>
  </div>
  <div class="flex gap-2">
    <button onclick="validateRelTable()" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition">✔ Verificar tabla</button>
  </div>
</div>`;

    _refreshRelWB();
}

function _refreshRelWB() {
    const el = document.getElementById('tab-rel-wb');
    if (!el) return;
    if (tabRelWB.every(w => w.used)) {
        el.innerHTML = '<span class="text-slate-500 text-xs italic">Todos los campos asignados.</span>';
        return;
    }
    el.innerHTML = tabRelWB.map((item, idx) => {
        if (item.used) return `<span class="px-2 py-0.5 rounded-md text-xs text-slate-700 line-through select-none">${item.word}</span>`;
        const sel = tabRelSelWB === idx;
        return `<button onclick="selectRelWord(${idx})"
          class="px-2.5 py-0.5 rounded-md text-xs font-semibold border transition
            ${sel ? 'bg-yellow-400 text-slate-900 border-yellow-300 ring-2 ring-yellow-300'
                  : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'}"
        >${item.word}</button>`;
    }).join('');
}

function selectRelWord(idx) {
    if (tabRelRevealed) return;
    if (tabRelWB[idx]?.used) return;
    tabRelSelWB = (tabRelSelWB === idx) ? null : idx;
    _refreshRelWB();
    _refreshRelSlots();
}

function clickRelSlot(fi) {
    if (tabRelRevealed) return;
    const placed = tabRelSlots[fi];
    if (placed) {
        const wbi = tabRelWB.findIndex(w => w.word === placed && w.used);
        if (wbi !== -1) tabRelWB[wbi].used = false;
        tabRelSlots[fi] = null;
        tabRelSelWB = null;
        _refreshRelWB();
        _refreshRelSlots();
        return;
    }
    if (tabRelSelWB === null) return;
    tabRelWB[tabRelSelWB].used = true;
    tabRelSlots[fi] = tabRelWB[tabRelSelWB].word;
    tabRelSelWB = null;
    _refreshRelWB();
    _refreshRelSlots();
}

function _refreshRelSlots() {
    const rel = tablesData[tabExIdx].relations[tabRelIdx];
    rel.tableFields.forEach((fld, fi) => {
        const el = document.getElementById(`rslot-${fi}`);
        if (!el) return;
        const word    = tabRelSlots[fi];
        const canDrop = tabRelSelWB !== null && !word;
        if (word) {
            el.textContent = word;
            el.className   = 'font-mono text-xs flex-1 text-yellow-300 font-bold';
        } else {
            el.textContent = canDrop ? '← aquí' : '▢';
            el.className   = `font-mono text-xs flex-1 ${canDrop ? 'text-indigo-400 italic' : 'text-slate-600 italic'}`;
        }
    });
}

function validateRelTable() {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];
    const total  = rel.tableFields.length;
    const filled = Object.values(tabRelSlots).filter(v => v !== null).length;
    if (filled < total) {
        _showTabFeedback('warning', `⚠️ Quedan ${total - filled} campo(s) sin asignar.`);
        return;
    }
    let hits = 0;
    rel.tableFields.forEach((fld, fi) => {
        if (tabRelSlots[fi] === fld.name) hits++;
    });
    tabRelAttempts++;
    const pct = Math.round(hits / total * 100);

    // Colorear
    rel.tableFields.forEach((fld, fi) => {
        const el = document.getElementById(`rslot-${fi}`);
        if (!el) return;
        el.className = `font-mono text-xs flex-1 font-bold ${tabRelSlots[fi] === fld.name ? 'text-green-300' : 'text-red-300'}`;
    });

    if (hits === total) {
        _showTabFeedback('success', `🎉 ¡Correcto! Tabla "${rel.tableName}" completada.
          <button onclick="advanceRelation()" class="ml-2 px-3 py-0.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xs transition">Siguiente relación →</button>`);
    } else {
        let html = `<span class="font-bold">${hits}/${total} correctos (${pct}%).</span>`;
        if (tabRelAttempts >= 2) {
            html += ` <button onclick="revealRelTable()" class="ml-2 px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg text-xs transition">💡 Ver respuestas</button>`;
        }
        html += ` <button onclick="advanceRelation()" class="ml-2 px-2 py-0.5 bg-indigo-700 text-indigo-100 font-semibold rounded-lg text-xs transition">Continuar igual →</button>`;
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
      <button onclick="advanceRelation()" class="ml-2 px-3 py-0.5 bg-indigo-700 text-indigo-100 font-bold rounded-lg text-xs transition">Siguiente →</button>`);
}

// ── Sub-UI: elegir dónde va la FK ─────────────────────────────────────────────

function _renderFKPlacement(data, rel) {
    document.getElementById('tab-feedback')?.classList.add('hidden');
    const fp = rel.fkPlacement;
    const tableNames = data.entityTables.map(t => t.name);

    document.getElementById('tab-rel-sub').innerHTML = `
<div class="flex flex-col gap-2 pt-1">
  <p class="text-xs text-rose-400 font-bold">❌ Correcto — esta relación no genera tabla. ¿En qué tabla se agrega la clave foránea?</p>
  <div class="flex flex-wrap gap-2" id="tab-fk-btns">
    ${tableNames.map(name => `
      <button onclick="chooseFKTarget('${name}')"
        class="px-4 py-2 rounded-xl text-sm font-bold border transition bg-slate-700 border-slate-600 text-slate-200 hover:bg-rose-900/40 hover:border-rose-500 hover:text-rose-200">
        ${name}
      </button>`).join('')}
  </div>
</div>`;
}

function chooseFKTarget(tableName) {
    const data = tablesData[tabExIdx];
    const rel  = data.relations[tabRelIdx];
    const fp   = rel.fkPlacement;
    const ok   = tableName === fp.targetTable;

    document.querySelectorAll('#tab-fk-btns button').forEach(b => { b.disabled = true; });
    const clickedBtn = [...document.querySelectorAll('#tab-fk-btns button')]
        .find(b => b.textContent.trim() === tableName);

    if (ok) {
        if (clickedBtn) clickedBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold border transition bg-green-900/60 border-green-600 text-green-200';
        // Acumular FK
        if (!tabFKAdditions[fp.targetTable]) tabFKAdditions[fp.targetTable] = [];
        fp.fkFields.forEach(f => tabFKAdditions[fp.targetTable].push(f));

        const fkList = fp.fkFields.map(f => `<code class="text-yellow-300 font-bold">${f.name}</code> FK → ${f.fkTo}`).join(', ');
        _showTabFeedback('success', `✓ Correcto. Se agrega ${fkList} a la tabla <strong>${fp.targetTable}</strong>.
          <button onclick="advanceRelation()" class="ml-2 px-3 py-0.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg text-xs transition">Siguiente →</button>`);

        // Agregar campo FK en la UI de la tabla destino (visual inmediato)
        document.getElementById('tab-rel-sub').innerHTML += `
          <div class="mt-2 p-2 bg-green-950/40 border border-green-800/30 rounded-lg text-xs text-green-300">
            <strong>${fp.targetTable}</strong> ← ${fp.reason}
          </div>`;
    } else {
        tabFKAttempts++;
        if (clickedBtn) clickedBtn.className = 'px-4 py-2 rounded-xl text-sm font-bold border transition bg-red-900/60 border-red-600 text-red-300 opacity-60';
        let hint = 'Revisar: ¿cuál es la tabla del lado N de la relación?';
        if (tabFKAttempts >= 2) {
            hint = `La respuesta correcta es <strong>${fp.targetTable}</strong>. ${fp.reason}`;
            // Acumular de todas formas
            if (!tabFKAdditions[fp.targetTable]) tabFKAdditions[fp.targetTable] = [];
            fp.fkFields.forEach(f => tabFKAdditions[fp.targetTable].push(f));
        }
        _showTabFeedback('error', `✗ Incorrecto. ${hint}
          ${tabFKAttempts >= 2
            ? `<button onclick="advanceRelation()" class="ml-2 px-2 py-0.5 bg-indigo-700 text-indigo-100 font-semibold rounded-lg text-xs transition">Continuar →</button>`
            : ''}`);
        if (tabFKAttempts < 2) {
            // Re-habilitar los botones restantes
            document.querySelectorAll('#tab-fk-btns button').forEach(b => {
                if (!b.className.includes('red-900')) b.disabled = false;
            });
        }
    }
}

function advanceRelation() {
    const data = tablesData[tabExIdx];
    // Si la relación actual NO generó tabla y no se acumuló el FK (si se saltó), igual acumularlo
    const rel = data.relations[tabRelIdx];
    if (!rel.generatesTable && rel.fkPlacement) {
        const fp = rel.fkPlacement;
        if (!tabFKAdditions[fp.targetTable]) {
            tabFKAdditions[fp.targetTable] = [...fp.fkFields];
        }
    }

    tabRelIdx++;
    if (tabRelIdx >= data.relations.length) {
        tabPhase = 'complete';
        _renderCompletePhase(data);
    } else {
        _renderRelationPhase(data);
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// FASE 3: ESQUEMA COMPLETO
// ══════════════════════════════════════════════════════════════════════════════

function _renderCompletePhase(data) {
    document.getElementById('tab-phase-label').textContent = '✓ Modelo relacional completo';
    document.getElementById('tab-feedback')?.classList.add('hidden');

    // Construir todas las tablas finales (entidades + FKs acumuladas + tablas de relaciones)
    const allTables = _buildFinalTables(data);
    const fkList    = _buildAllFKConstraints(allTables);

    const tableBlocks = allTables.map(tbl => {
        const fieldStr = tbl.fields.map(f => {
            let name = f.name;
            if (f.isPK) name = `<u>${name}</u>`;
            if (f.isFK && !f.isPK) name = `<span class="text-indigo-300">${name}</span>`;
            if (f.isPK && f.isFK) name = `<u><span class="text-indigo-300">${name}</span></u>`;
            return name;
        }).join(', ');
        const color = tbl.isRelation
            ? 'text-emerald-300 border-emerald-800/40'
            : tbl.sourceType === 'weak'      ? 'text-amber-300 border-amber-800/40'
            : tbl.sourceType === 'isa'        ? 'text-sky-300 border-sky-800/40'
            : tbl.sourceType === 'multivalued'? 'text-purple-300 border-purple-800/40'
            :                                   'text-white border-slate-700';
        return `<div class="font-mono text-sm px-3 py-1.5 rounded-lg border bg-slate-900/60 ${color}">
          <span class="font-extrabold">${tbl.name}</span>(<span class="text-slate-300">${fieldStr}</span>)
        </div>`;
    }).join('');

    const fkBlock = fkList.length > 0
        ? fkList.map(c => `<div class="font-mono text-xs text-slate-400 px-2">${c}</div>`).join('')
        : '<div class="text-xs text-slate-600 italic px-2">Sin restricciones de integridad referencial.</div>';

    document.getElementById('tab-phase-content').innerHTML = `
<div class="flex flex-col gap-4">
  <div class="flex items-center gap-3">
    <span class="text-2xl">🎉</span>
    <div>
      <h3 class="text-base font-extrabold text-white">Modelo Relacional Completo</h3>
      <p class="text-xs text-slate-500">La PK se muestra subrayada. La FK en color azul.</p>
    </div>
  </div>

  <!-- Esquema en notación relacional -->
  <div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col gap-1.5">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Esquema</p>
    ${tableBlocks}
  </div>

  <!-- Restricciones de integridad referencial -->
  <div class="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Restricciones de integridad referencial</p>
    <div class="flex flex-col gap-1">
      ${fkBlock}
    </div>
  </div>
</div>`;
}

function _buildFinalTables(data) {
    const result = [];

    // Entidades (con FKs acumuladas de relaciones)
    data.entityTables.forEach(tbl => {
        const extraFKs = tabFKAdditions[tbl.name] || [];
        result.push({
            name:       tbl.name,
            sourceType: tbl.sourceType,
            isRelation: false,
            fields:     [...tbl.fields, ...extraFKs]
        });
    });

    // Tablas de relaciones (solo las que generaron tabla)
    data.relations.forEach(rel => {
        if (!rel.generatesTable) return;
        result.push({
            name:       rel.tableName,
            sourceType: 'relation',
            isRelation: true,
            fields:     rel.tableFields || []
        });
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

function _findPKField(parentTableName, allTables, fallback) {
    const parent = allTables.find(t => t.name === parentTableName);
    if (!parent) return fallback;
    // Buscar PK con mismo nombre que el campo FK
    const exact = parent.fields.find(f => f.isPK && f.name === fallback);
    if (exact) return exact.name;
    // Primer campo PK
    const first = parent.fields.find(f => f.isPK);
    return first ? first.name : fallback;
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
        if (wrap && img) {
            img.src = tabMerImageUrl;
            wrap.classList.remove('hidden');
        }
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
        version:    2,
        ejercicio:  tabExIdx + 1,
        phase:      tabPhase,
        entitySlots: tabEntSlots,
        fkAdditions: tabFKAdditions,
        relIdx:      tabRelIdx,
        relSlots:    tabRelSlots
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const exTitle = (typeof exercises !== 'undefined' && exercises[tabExIdx]?.title)
        ? exercises[tabExIdx].title.replace(/\s+/g, '_') : `ejercicio_${tabExIdx + 1}`;
    a.href     = url;
    a.download = `pasaje_tablas_${exTitle}.json`;
    a.click();
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
                if (!confirm(`El progreso guardado es del ejercicio ${p.ejercicio} y el actual es el ${tabExIdx + 1}. ¿Cargar de todas formas?`)) return;
            }
            tabEntSlots    = p.entitySlots  || {};
            tabFKAdditions = p.fkAdditions  || {};
            tabRelIdx      = p.relIdx       || 0;
            tabRelSlots    = p.relSlots     || {};
            tabPhase       = p.phase        || 'entities';

            const data = tablesData[tabExIdx];
            if (!data) return;
            if (tabPhase === 'complete') {
                document.getElementById('tab-phase-content')?.classList.remove('hidden');
                _renderCompletePhase(data);
            } else if (tabPhase === 'relations') {
                _renderRelationPhase(data);
            } else {
                _renderEntityPhase(data);
                // Repoblar slots visuales
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
            _showTabFeedback('success', `✓ Progreso del ejercicio ${p.ejercicio} cargado correctamente.`);
        } catch (err) {
            alert('Error al leer el archivo JSON.');
        }
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

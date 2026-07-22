// tables.js — Pestaña "Pasaje a Tablas" — DB-Lab
// Diseñada por Prof. Elizabeth Izquierdo con asistencia de Claude — CC BY-SA 4.0

// ── Estado ────────────────────────────────────────────────────────────────
let tabWordBank   = [];   // [{ word, used }]
let tabSlots      = {};   // { "ti_fi": word | null }
let tabSelWB      = null; // índice en tabWordBank seleccionado
let tabAttempts   = 0;
let tabRevealed   = false;

// ── Punto de entrada ──────────────────────────────────────────────────────
function renderTablesPanel(exIdx) {
    const data = (typeof tablesData !== 'undefined') ? tablesData[exIdx] : null;
    const stage = document.getElementById('stage-tables');
    if (!stage) return;

    if (!data) {
        stage.innerHTML = `
          <div class="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <span style="font-size:3rem">📊</span>
            <h2 class="text-xl font-extrabold text-white">Pasaje a Tablas</h2>
            <p class="text-slate-400 text-sm max-w-xs">Este ejercicio aún no tiene datos de pasaje a tablas disponibles.</p>
          </div>`;
        return;
    }

    // Inicializar estado
    tabWordBank = [];
    tabSlots    = {};
    tabSelWB    = null;
    tabAttempts = 0;
    tabRevealed = false;

    data.tables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            tabWordBank.push({ word: fld.name, used: false });
            tabSlots[`${ti}_${fi}`] = null;
        });
    });

    // Mezclar banco
    _tabShuffle(tabWordBank);

    // Renderizar HTML
    stage.innerHTML = _buildTablesHTML(data, exIdx);

    // Actualizar visual inicial
    _refreshWordBank();
    _refreshAllSlots(data);
}

// ── Construcción del HTML principal ───────────────────────────────────────
function _buildTablesHTML(data, exIdx) {
    const title = (typeof exercises !== 'undefined' && exercises[exIdx])
        ? exercises[exIdx].title : 'Pasaje a Tablas';

    return `
<div class="flex flex-col gap-4 w-full max-w-[1600px] mx-auto px-4 py-4 pb-10">

  <!-- Encabezado -->
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div>
      <h2 class="text-lg font-extrabold text-white">${title} — Pasaje a Tablas</h2>
      <p class="text-slate-400 text-xs mt-0.5">Asignar cada campo a la tabla correcta. Usar el banco de palabras.</p>
    </div>
    <div class="flex gap-2">
      <button onclick="resetTables()" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition">🔄 Reiniciar</button>
      <button id="btn-corregir-tables" onclick="validateTables()"
              class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition">
        ✔ Corregir
      </button>
    </div>
  </div>

  <!-- Banco de palabras -->
  <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Banco de campos</p>
    <div id="tab-wordbank" class="flex flex-wrap gap-1.5 min-h-[32px]"></div>
  </div>

  <!-- Grid: derivación + tablas -->
  <div class="flex gap-4 items-start flex-wrap lg:flex-nowrap">

    <!-- Panel izquierdo: derivación -->
    <div class="w-full lg:w-56 flex-shrink-0 bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex flex-col gap-2">
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Derivación</p>
      ${data.derivation.map(step => `
        <div class="bg-slate-900/60 rounded-lg p-2 flex flex-col gap-0.5">
          <span class="text-[10px] text-slate-300 font-semibold">${step.icon} ${step.element}</span>
          <span class="text-[10px] text-indigo-400 font-bold">${step.rule}</span>
          <span class="text-[9px] text-slate-500 leading-tight">${step.note}</span>
        </div>`).join('')}
    </div>

    <!-- Panel derecho: tarjetas de tablas -->
    <div id="tab-tables-grid" class="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
    </div>
  </div>

  <!-- Feedback -->
  <div id="tab-feedback" class="hidden"></div>

</div>`;
}

// ── Banco de palabras ─────────────────────────────────────────────────────
function _refreshWordBank() {
    const el = document.getElementById('tab-wordbank');
    if (!el) return;
    if (tabWordBank.every(w => w.used)) {
        el.innerHTML = '<span class="text-slate-500 text-xs italic">Todos los campos fueron asignados.</span>';
        return;
    }
    el.innerHTML = tabWordBank.map((item, idx) => {
        if (item.used) return `<span class="inline-block px-2 py-0.5 rounded-md text-xs text-slate-600 bg-slate-800/30 border border-slate-700/30 line-through select-none">${item.word}</span>`;
        const isSel = tabSelWB === idx;
        return `<button
          onclick="selectTabWord(${idx})"
          class="tab-word-btn px-2.5 py-0.5 rounded-md text-xs font-semibold border transition
            ${isSel
              ? 'bg-yellow-400 text-slate-900 border-yellow-300 ring-2 ring-yellow-300'
              : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600 hover:border-slate-500'}"
        >${item.word}</button>`;
    }).join('');
}

// ── Tarjetas de tablas ────────────────────────────────────────────────────
function _refreshAllSlots(data) {
    const grid = document.getElementById('tab-tables-grid');
    if (!grid || !data) return;

    grid.innerHTML = data.tables.map((tbl, ti) => {
        const fieldRows = tbl.fields.map((fld, fi) => _slotHTML(ti, fi, fld)).join('');
        return `
<div class="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden">
  <div class="px-3 py-2 bg-slate-800/80 flex items-center justify-between gap-2 border-b border-slate-700">
    <span class="font-mono font-bold text-white text-sm">${tbl.name}</span>
    <span class="text-[9px] font-bold text-indigo-300 bg-indigo-900/40 border border-indigo-700/40 px-1.5 py-0.5 rounded-full">${tbl.ruleLabel}</span>
  </div>
  <div class="px-3 pt-1.5 pb-0.5">
    <p class="text-[9px] text-slate-500 leading-tight">${tbl.ruleNote}</p>
  </div>
  <div class="border-t border-slate-800 mt-1.5">
    <div class="grid grid-cols-[20px_1fr_auto] text-[9px] font-bold text-slate-600 uppercase tracking-wide px-3 py-1 bg-slate-800/40">
      <span></span><span>Campo</span><span>Tipo</span>
    </div>
    ${fieldRows}
  </div>
</div>`;
    }).join('');
}

function _slotHTML(ti, fi, fld) {
    const key = `${ti}_${fi}`;
    const placed = tabSlots[key];
    const icon = _slotIcon(fld);
    const hint = _slotHint(fld);

    const canDrop = tabSelWB !== null && !placed && !tabRevealed;
    const isCorrect = tabRevealed ? (placed === fld.name) : null;

    let slotClass = 'tab-slot flex items-center gap-1.5 px-3 py-1.5 border-b border-slate-800/60 cursor-pointer transition';
    if (canDrop)       slotClass += ' bg-indigo-900/20 hover:bg-indigo-900/40';
    else if (placed)   slotClass += ' hover:bg-slate-800/40';
    if (isCorrect === true)  slotClass += ' !bg-green-900/30';
    if (isCorrect === false) slotClass += ' !bg-red-900/30';

    let innerContent;
    if (placed) {
        const wordColor = isCorrect === false ? 'text-red-300' : isCorrect === true ? 'text-green-300' : 'text-yellow-300';
        innerContent = `<span class="font-mono text-xs font-bold ${wordColor} flex-1">${placed}</span>`;
    } else {
        innerContent = `<span class="text-slate-600 text-xs flex-1 italic">${canDrop ? '← soltar aquí' : '▢'}</span>`;
    }

    return `
<div class="${slotClass}" onclick="clickTabSlot(${ti},${fi})">
  <span class="text-xs select-none w-4 text-center" title="${hint}">${icon}</span>
  ${innerContent}
  <span class="text-[9px] text-slate-500 font-mono text-right leading-tight whitespace-nowrap">${hint}</span>
</div>`;
}

function _slotIcon(fld) {
    if (fld.isPK && fld.isFK) return '🔑';
    if (fld.isPK) return '🔑';
    if (fld.isFK) return '🔗';
    return '·';
}

function _slotHint(fld) {
    if (fld.isPK && fld.isFK) return `PK · FK→${fld.fkTo}`;
    if (fld.isPK)             return 'PK';
    if (fld.isFK)             return `FK→${fld.fkTo}`;
    return '';
}

// ── Interacción ───────────────────────────────────────────────────────────
function selectTabWord(idx) {
    if (tabRevealed) return;
    if (tabWordBank[idx] && tabWordBank[idx].used) return;
    tabSelWB = (tabSelWB === idx) ? null : idx;
    _refreshWordBank();
    // Redibujar slots para actualizar el estilo "soltar aquí"
    const data = tablesData[activeExercise];
    if (data) _refreshAllSlots(data);
}

function clickTabSlot(ti, fi) {
    if (tabRevealed) return;
    const key = `${ti}_${fi}`;
    const placed = tabSlots[key];

    if (placed) {
        // Devolver al banco
        const wbIdx = tabWordBank.findIndex(w => w.word === placed && w.used);
        if (wbIdx !== -1) tabWordBank[wbIdx].used = false;
        tabSlots[key] = null;
        tabSelWB = null;
        _refreshWordBank();
        const data = tablesData[activeExercise];
        if (data) _refreshAllSlots(data);
        return;
    }

    if (tabSelWB === null) return;

    // Colocar palabra
    const word = tabWordBank[tabSelWB].word;
    tabWordBank[tabSelWB].used = true;
    tabSlots[key] = word;
    tabSelWB = null;
    _refreshWordBank();
    const data = tablesData[activeExercise];
    if (data) _refreshAllSlots(data);
}

// ── Validación ────────────────────────────────────────────────────────────
function validateTables() {
    const data = tablesData[activeExercise];
    if (!data) return;

    // Contar slots vacíos
    const totalSlots = Object.keys(tabSlots).length;
    const filledSlots = Object.values(tabSlots).filter(v => v !== null).length;
    if (filledSlots < totalSlots) {
        _showTabFeedback('warning', `⚠️ Quedan ${totalSlots - filledSlots} campo(s) sin asignar. Completar todos los campos antes de corregir.`);
        return;
    }

    let hits = 0;
    data.tables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            if (tabSlots[`${ti}_${fi}`] === fld.name) hits++;
        });
    });

    tabAttempts++;
    const pct = Math.round((hits / totalSlots) * 100);

    // Mostrar resultados
    tabRevealed = false; // redibujar con colores parciales
    _refreshAllSlots(data); // los slots muestran ✓/✗

    if (hits === totalSlots) {
        _showTabFeedback('success', `🎉 ¡Perfecto! Todos los campos están en la tabla correcta.`);
        document.getElementById('btn-corregir-tables').disabled = true;
    } else {
        let fbHTML = `<span class="font-bold">${hits} de ${totalSlots} campos correctos (${pct}%).</span>`;
        if (tabAttempts >= 2) {
            fbHTML += `<button onclick="revealTablesAnswers()"
              class="ml-3 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg text-xs transition">
              💡 Ver respuestas
            </button>`;
        }
        _showTabFeedback('error', fbHTML);
    }
}

// ── Revelar respuestas ────────────────────────────────────────────────────
function revealTablesAnswers() {
    const data = tablesData[activeExercise];
    if (!data) return;

    // Colocar respuestas correctas en todos los slots
    data.tables.forEach((tbl, ti) => {
        tbl.fields.forEach((fld, fi) => {
            tabSlots[`${ti}_${fi}`] = fld.name;
        });
    });
    tabRevealed = true;
    tabWordBank.forEach(w => w.used = true);

    _refreshWordBank();
    _refreshAllSlots(data);
    _showTabFeedback('info', '✓ Respuestas reveladas. Estudiar la derivación del panel izquierdo para comprender cada caso.');
    document.getElementById('btn-corregir-tables').disabled = true;
}

// ── Reiniciar ─────────────────────────────────────────────────────────────
function resetTables() {
    const data = tablesData[activeExercise];
    if (!data) return;
    renderTablesPanel(activeExercise);
    const fb = document.getElementById('tab-feedback');
    if (fb) fb.classList.add('hidden');
}

// ── Feedback ──────────────────────────────────────────────────────────────
function _showTabFeedback(type, html) {
    const fb = document.getElementById('tab-feedback');
    if (!fb) return;
    const styles = {
        success: 'bg-green-950/60 border-green-700/50 text-green-200',
        error:   'bg-red-950/60   border-red-700/50   text-red-200',
        warning: 'bg-yellow-950/60 border-yellow-700/50 text-yellow-200',
        info:    'bg-slate-800/80 border-slate-600/50 text-slate-200'
    };
    fb.className = `rounded-xl border p-3 text-sm ${styles[type] || styles.info}`;
    fb.innerHTML = html;
    fb.classList.remove('hidden');
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Utilidades ────────────────────────────────────────────────────────────
function _tabShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

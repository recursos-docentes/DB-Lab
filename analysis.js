// ── Modo ejercitación / evaluación ───────────────────
// Activado via ?ex=1 en la URL (no visible para estudiantes).
// Se persiste en sessionStorage para sobrevivir un F5 sin el param.
function _initMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ex') === '1') {
        sessionStorage.setItem('ermode', 'eval');
    }
    evalMode = sessionStorage.getItem('ermode') === 'eval';
}
// ── Stage navigation ─────────────────────────────────
function setStage(stage) {
    ['analyze', 'diagram', 'tables'].forEach(s => {
        const panel = document.getElementById(`stage-${s}`);
        if (panel) panel.classList.toggle('hidden', s !== stage);
        const tab = document.getElementById(`tab-${s}`);
        if (tab && !tab.disabled) tab.classList.toggle('active', s === stage);
    });
    hidePopup();
    if (stage === 'diagram') {
        requestAnimationFrame(drawCrispConnectors);
        // Mostrar avisos si el ejercicio los tiene
        const wrapper = document.getElementById('notices-wrapper');
        const panel   = document.getElementById('notices-panel');
        const content = document.getElementById('notices-content');
        if (wrapper && content && content.children.length > 0) {
            wrapper.classList.remove('hidden');
            // Abrir el panel y programar auto-cierre
            if (panel) {
                panel.classList.remove('hidden');
                if (_noticesTimeout) clearTimeout(_noticesTimeout);
                _noticesTimeout = setTimeout(() => panel.classList.add('hidden'), 7000);
            }
        }
        // Restaurar toggle y panel RNE al volver al tab de diseño
        if (typeof renderRNEPanel === 'function' && exercises && exercises[activeExercise]) {
            renderRNEPanel(exercises[activeExercise]);
        }
    } else {
        // En otras etapas, ocultar el wrapper, el panel de avisos y el toggle RNE
        const wrapper = document.getElementById('notices-wrapper');
        const panel   = document.getElementById('notices-panel');
        if (wrapper) wrapper.classList.add('hidden');
        if (panel)   panel.classList.add('hidden');
        if (_noticesTimeout) { clearTimeout(_noticesTimeout); _noticesTimeout = null; }
        const rneToggleRow = document.getElementById('rne-toggle-row');
        const rnePanel     = document.getElementById('rne-panel');
        if (rneToggleRow) rneToggleRow.classList.add('hidden');
        if (rnePanel)     rnePanel.classList.add('hidden');
    }
}
// ── Render analysis panel ─────────────────────────────
function renderAnalysisPanel(exerciseIndex) {
    wordClassifications = {};
    wordAttrTypes = {};
    analysisAttempts = 0;
    wordEntityTypes = {};
    wordCompounds = {};
    selectedComponents = new Set();
    activeWordIdx = null;
    const btn = document.getElementById('btn-go-diagram');
    if (btn) {
        btn.disabled = false;
        btn.className = 'py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition border border-indigo-600';
        btn.textContent = '🔗 Ir al Diseño E-R';
    }
    const tab = document.getElementById('tab-diagram');
    // if (tab) tab.disabled = true;  // Comentado para permitir acceso sin completar análisis
    const vbtn = document.getElementById('btn-validate-analysis');
    if (vbtn) {
        vbtn.disabled = false;
        vbtn.className = 'py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg';
        vbtn.textContent = '📝 Validar clasificación';
    }
    document.getElementById('analyze-feedback').classList.add('hidden');
    const segments = analyzeData[exerciseIndex];
    // Texto completamente limpio (sin resaltados)
    const textContainer = document.getElementById('analyze-text');
    textContainer.innerHTML = '';
    if (!segments) {
        textContainer.innerHTML = '<p class="text-slate-500 italic">Análisis no disponible para este ejercicio.</p>';
        document.getElementById('terms-pool').innerHTML = '';
        updateClassificationPanels();
        return;
    }
    textContainer.innerHTML = (exercises[exerciseIndex]?.description || '').replace(/\n\s*/g, '');
    // Fichas en el panel lateral
    const pool = document.getElementById('terms-pool');
    pool.innerHTML = '';
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        const chip = document.createElement('button');
        chip.className = 'word-tag px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300';
        chip.dataset.wordIdx = idx;
        chip.dataset.word = seg.word;
        chip.textContent = seg.word;
        chip.onclick = (e) => { e.stopPropagation(); showPopup(chip, idx); };
        pool.appendChild(chip);
    });
    updateClassificationPanels();
}
// ── Word popup ────────────────────────────────────────
function showPopup(chipEl, wordIdx) {
    activeWordIdx = wordIdx;
    const popup = document.getElementById('word-popup');
    const rect  = chipEl.getBoundingClientRect();
    popup.style.top  = (rect.bottom + 6 + window.scrollY) + 'px';
    popup.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 260) + 'px';
    popup.classList.remove('hidden');
}
function hidePopup() {
    const p = document.getElementById('word-popup');
    if (p) {
        p.classList.add('hidden');
        document.getElementById('popup-step1').style.display = '';
        document.getElementById('popup-step2').style.display = '';
        document.getElementById('popup-step3').style.display = '';
    }
    activeWordIdx = null;
    selectedComponents = new Set();
}
function classifyWord(type) {
    if (activeWordIdx === null) return;
    wordClassifications[activeWordIdx] = type;
    if (type === 'atributo') { _showSubtypePopup('atributo'); return; }
    if (type === 'entidad')  { _showSubtypePopup('entidad');  return; }
    // relacion: clasificación directa
    delete wordAttrTypes[activeWordIdx];
    delete wordEntityTypes[activeWordIdx];
    updateChipStyle(activeWordIdx);
    hidePopup();
    updateClassificationPanels();
}
function _showSubtypePopup(mainType) {
    wordClassifications[activeWordIdx] = mainType;
    // Si el ejercicio no requiere subtipos de atributo, clasificar directo
    if (mainType === 'atributo' && !analyzeConfig[activeExercise]?.requireSubtypes) {
        updateChipStyle(activeWordIdx);
        hidePopup();
        updateClassificationPanels();
        return;
    }
    // Calcular qué subtipos existen en este ejercicio
    const segments = analyzeData[activeExercise] || [];
    const existing = new Set();
    segments.forEach(seg => {
        if (typeof seg === 'string') return;
        if (seg.type === mainType) {
            const sub = mainType === 'atributo' ? seg.attrType : seg.entityType;
            if (sub) existing.add(sub);
        }
    });
    // Entidad: si solo existe "fuerte", clasificar directo sin preguntar
    if (mainType === 'entidad') {
        const entOpts = [['fuerte','Fuerte'],['débil','Débil']].filter(([v]) => existing.has(v));
        if (entOpts.length <= 1) {
            wordEntityTypes[activeWordIdx] = 'fuerte';
            updateChipStyle(activeWordIdx);
            hidePopup();
            updateClassificationPanels();
            return;
        }
        // Múltiples tipos → mostrar paso 2
        _renderStep2(mainType, entOpts);
        return;
    }
    // Atributo → siempre mostrar paso 2 con las opciones del ejercicio
    const attrOpts = [
        ['simple','Simple'], ['clave','Clave'], ['relacion','De relación'],
        ['compuesto','Compuesto'], ['multivaluado','Multivaluado'], ['derivado','Derivado']
    ].filter(([v]) => existing.has(v));
    _renderStep2(mainType, attrOpts);
}
function _renderStep2(mainType, opts) {
    document.getElementById('popup-step1').style.display = 'none';
    const step2 = document.getElementById('popup-step2');
    step2.style.display = 'flex';
    step2.style.flexDirection = 'column';
    document.getElementById('popup-step2-title').textContent =
        mainType === 'atributo' ? '¿Qué tipo de atributo?' : '¿Qué tipo de entidad?';
    const btnClass = 'px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition border';
    const color = mainType === 'atributo'
        ? 'text-emerald-300 hover:bg-emerald-900/60 border-emerald-700/40'
        : 'text-blue-300 hover:bg-blue-900/60 border-blue-700/40';
    document.getElementById('popup-step2-options').innerHTML = opts.map(([val, label]) =>
        `<button onclick="classifySubtype('${val}')" class="${btnClass} ${color}">${label}</button>`
    ).join('');
}
function classifySubtype(subtype) {
    if (activeWordIdx === null) return;
    const mainType = wordClassifications[activeWordIdx];
    if (mainType === 'atributo') wordAttrTypes[activeWordIdx]   = subtype;
    if (mainType === 'entidad')  wordEntityTypes[activeWordIdx] = subtype;
    if (mainType === 'atributo' && subtype === 'compuesto') {
        _showCompoundStep(); return;
    }
    updateChipStyle(activeWordIdx);
    hidePopup();
    updateClassificationPanels();
}
function _showCompoundStep() {
    document.getElementById('popup-step2').style.display = 'none';
    const step3 = document.getElementById('popup-step3');
    step3.style.display = 'flex';
    step3.style.flexDirection = 'column';
    selectedComponents = new Set();
    const segments = analyzeData[activeExercise] || [];
    const opts = segments
        .filter((seg, idx) => typeof seg !== 'string' && idx !== activeWordIdx && seg.type === 'atributo')
        .map(seg => seg.word);
    const btnCls = 'comp-btn px-2 py-1 text-[10px] font-bold rounded-lg transition border border-slate-600 bg-slate-700/40 text-slate-300 hover:border-emerald-500 hover:text-emerald-300';
    document.getElementById('popup-step3-options').innerHTML = opts.map(w =>
        `<button onclick="toggleComponent(this,'${w}')" class="${btnCls}" data-word="${w}">${w}</button>`
    ).join('');
}
function toggleComponent(btn, word) {
    if (selectedComponents.has(word)) {
        selectedComponents.delete(word);
        btn.className = 'comp-btn px-2 py-1 text-[10px] font-bold rounded-lg transition border border-slate-600 bg-slate-700/40 text-slate-300 hover:border-emerald-500 hover:text-emerald-300';
    } else {
        selectedComponents.add(word);
        btn.className = 'comp-btn px-2 py-1 text-[10px] font-bold rounded-lg transition border border-emerald-500 bg-emerald-500/20 text-emerald-300';
    }
}
function confirmCompoundComponents() {
    if (activeWordIdx === null) return;
    wordCompounds[activeWordIdx] = [...selectedComponents];
    updateChipStyle(activeWordIdx);
    // Gregor visualmente los chips que son componentes
    _refreshComponentChips();
    hidePopup();
    updateClassificationPanels();
}
// Pone en gris los chips que ya fueron identificados como parte de un compuesto
function _refreshComponentChips() {
    const componentWords = _getComponentWords();
    document.querySelectorAll('#terms-pool [data-word-idx]').forEach(chip => {
        if (componentWords.has(chip.dataset.word)) {
            chip.className = 'term-chip px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/40 bg-slate-800/40 text-slate-600 cursor-default select-none';
            chip.onclick = null;
            chip.dataset.isComponent = 'true';
        } else if (chip.dataset.isComponent === 'true') {
            // Re-habilitar si ya no es componente de nada
            chip.dataset.isComponent = '';
            chip.className = 'word-tag px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300';
            const idx = chip.dataset.wordIdx;
            chip.onclick = (e) => { e.stopPropagation(); showPopup(chip, parseInt(idx)); };
        }
    });
}
function _getComponentWords() {
    const s = new Set();
    Object.values(wordCompounds).forEach(comps => comps.forEach(w => s.add(w)));
    return s;
}
function updateChipStyle(idx) {
    const chip = document.querySelector(`#terms-pool [data-word-idx="${idx}"]`);
    if (!chip) return;
    const type      = wordClassifications[idx];
    const attrSub   = wordAttrTypes[idx];
    const entSub    = wordEntityTypes[idx];
    const word      = chip.dataset.word;
    const base = 'term-chip rounded-lg text-xs font-bold transition-all active:scale-95 border flex flex-col items-center leading-tight';
    if (type === 'entidad') {
        chip.className = `${base} px-2.5 py-1 border-blue-500 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25`;
        chip.innerHTML = entSub
            ? `${word}<span class="text-[9px] font-extrabold text-blue-400/80 uppercase tracking-wide">${entSub}</span>`
            : word;
    } else if (type === 'relacion') {
        chip.className = `${base} px-2.5 py-1.5 border-pink-500 bg-pink-500/15 text-pink-300 hover:bg-pink-500/25`;
        chip.innerHTML = word;
    } else if (type === 'atributo') {
        // Si el ejercicio no requiere subtipos, no mostrar el badge
        if (!analyzeConfig[activeExercise]?.requireSubtypes) {
            chip.className = `${base} px-2.5 py-1.5 border-emerald-500 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25`;
            chip.innerHTML = word;
            return;
        }
        chip.className = `${base} px-2.5 py-1 border-emerald-500 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25`;
        const comps = wordCompounds[idx];
        if (attrSub === 'compuesto' && comps && comps.length > 0) {
            chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-emerald-400/80 uppercase tracking-wide">compuesto: ${comps.join(', ')}</span>`;
        } else if (attrSub) {
            chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-emerald-400/80 uppercase tracking-wide">${attrSub}</span>`;
        } else {
            chip.innerHTML = word;
        }
    }
}
function updateClassificationPanels() {
    const segments = analyzeData[activeExercise] || [];
    const componentWords = _getComponentWords();
    const cols = { entidad: [], atributo: [], relacion: [] };
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        if (componentWords.has(seg.word)) return; // no mostrar componentes por separado
        const t = wordClassifications[idx];
        if (!t) return;
        if (t === 'atributo') {
            const sub = wordAttrTypes[idx];
            cols.atributo.push(sub ? `${seg.word} <span class="text-[9px] text-emerald-400/70 font-extrabold uppercase">${sub}</span>` : seg.word);
        } else if (t === 'entidad') {
            const sub = wordEntityTypes[idx];
            cols.entidad.push(sub ? `${seg.word} <span class="text-[9px] text-blue-400/70 font-extrabold uppercase">${sub}</span>` : seg.word);
        } else {
            cols[t].push(seg.word);
        }
    });
    const color = { entidad: 'text-blue-300 bg-blue-900/30', atributo: 'text-emerald-300 bg-emerald-900/30', relacion: 'text-pink-300 bg-pink-900/30' };
    const ids   = { entidad: 'classified-entities', atributo: 'classified-attrs', relacion: 'classified-relations' };
    Object.keys(cols).forEach(type => {
        const el = document.getElementById(ids[type]);
        if (el) el.innerHTML = cols[type].map(w =>
            `<span class="px-2 py-1 rounded-lg font-semibold text-[11px] ${color[type]}">${w}</span>`
        ).join('');
    });
}
function _resetCorregirBtn() {
    const btn = document.querySelector('button[onclick="checkAnswers()"]');
    if (btn) {
        btn.disabled = false;
        btn.className = 'w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm';
        btn.textContent = '📝 Corregir Diagrama';
    }
}
function validateAnalysis() {
    const segments = analyzeData[activeExercise] || [];
    const componentWords = _getComponentWords();
    let total = 0, hits = 0;
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        if (componentWords.has(seg.word)) return; // excluir componentes del compuesto
        total++;
        const chip = document.querySelector(`#terms-pool [data-word-idx="${idx}"]`);
        if (!chip) return;
        const userType    = wordClassifications[idx];
        const userAttrSub = wordAttrTypes[idx];
        let correct = false;
        if (userType === seg.type) {
            if (seg.type === 'atributo' && seg.attrType && analyzeConfig[activeExercise]?.requireSubtypes) {
                if (userAttrSub !== seg.attrType) {
                    correct = false;
                } else if (seg.attrType === 'compuesto' && seg.components) {
                    const userComps = wordCompounds[idx] || [];
                    correct = seg.components.length === userComps.length &&
                              seg.components.every(c => userComps.includes(c));
                } else {
                    correct = true;
                }
            } else if (seg.type === 'entidad' && seg.entityType) {
                correct = wordEntityTypes[idx] === seg.entityType;
            } else {
                correct = true;
            }
        }
        const word = chip.dataset.word || chip.textContent;
        if (!userType) {
            chip.className = 'term-chip px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-600 bg-slate-700/30 text-slate-500';
            chip.textContent = word;
        } else if (correct) {
            chip.className = 'term-chip px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-emerald-500 bg-emerald-500/20 text-emerald-300 flex flex-col items-center leading-tight';
            const showAttrLabel = seg.attrType && analyzeConfig[activeExercise]?.requireSubtypes;
            const label = showAttrLabel ? `<span class="text-[9px] font-extrabold text-emerald-400/80 uppercase">${seg.attrType}</span>` : '';
            chip.innerHTML = `${word}${label}`;
            hits++;
        } else {
            // Mostrar qué era correcto
            const correctLabel = seg.type === 'atributo' && seg.attrType ? `atributo (${seg.attrType})`
                               : seg.type === 'entidad'  && seg.entityType ? `entidad (${seg.entityType})`
                               : seg.type;
            chip.className = 'term-chip px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-rose-500 bg-rose-500/20 text-rose-300 flex flex-col items-center leading-tight';
            chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-rose-400/80 uppercase">${correctLabel}</span>`;
        }
    });
    const fb  = document.getElementById('analyze-feedback');
    const pct = total > 0 ? Math.round((hits / total) * 100) : 0;
    fb.classList.remove('hidden','bg-emerald-950','text-emerald-300','border-emerald-700','bg-amber-950','text-amber-300','border-amber-700');
    const msg = hits === total
        ? `🎉 ¡Perfecto! Identificaste todos los términos (${hits}/${total})`
        : `👀 <strong>${hits} de ${total}</strong> correctos (${pct}%). Verde = correcto · Rojo = incorrecto · Gris = sin clasificar.`;
    fb.classList.add(...(hits === total
        ? ['bg-emerald-950','text-emerald-300','border-emerald-700']
        : ['bg-amber-950','text-amber-300','border-amber-700']));
    // Rastrear intentos
    analysisAttempts++;
    if (!evalMode) {
        analysisAttemptScores.push({ hits, total, pct });
        const histHtml = analysisAttemptScores
            .map((s, i) => `<span class="font-bold">Intento ${i+1}:</span> ${s.hits}/${s.total} (${s.pct}%)`)
            .join(' &nbsp;|&nbsp; ');
        fb.innerHTML = `<span class="text-sm">${msg}</span><div class="mt-1.5 text-xs text-slate-300">${histHtml}</div>`;
        if (analysisAttemptScores.length >= 3) {
            const vbtn = document.getElementById('btn-validate-analysis');
            if (vbtn) {
                vbtn.disabled = true;
                vbtn.className = 'py-3.5 bg-slate-700/50 text-slate-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700';
                vbtn.textContent = '✓ Máximo 3 intentos';
            }
            // Congelar chips del analizador
            document.querySelectorAll('#terms-pool .term-chip').forEach(chip => {
                chip.style.pointerEvents = 'none';
                chip.classList.add('opacity-60');
            });
        }
        // Mostrar botón "Ver respuestas" + "Siguiente" después de 2 intentos fallidos
        if (!evalMode && analysisAttempts >= 2 && hits < total) {
            fb.innerHTML += `<button onclick="_revealCorrectAnswers()" class="mt-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl text-xs transition">💡 Ver respuestas correctas</button>`;
            const goBtn = document.getElementById('btn-go-diagram');
            if (goBtn) { goBtn.textContent = '✓ Siguiente: Diseño E-R'; goBtn.classList.remove('hidden'); }
        }
    } else {
        // modo evaluación
        fb.innerHTML = `<span class="text-sm">${msg}</span>`;
        const vbtn = document.getElementById('btn-validate-analysis');
        const goBtn = document.getElementById('btn-go-diagram');
        if (vbtn) {
            vbtn.disabled = true;
            vbtn.className = 'py-3.5 bg-slate-700/50 text-slate-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700';
            vbtn.textContent = '✓ Clasificación registrada';
        }
        if (goBtn) {
            goBtn.disabled = true;
            goBtn.className = 'py-3 bg-sky-600/50 text-sky-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition border border-sky-600 cursor-not-allowed';
        }
    }
}

// ── Revelar respuestas correctas ──────────────────────────────────────────────
function _revealCorrectAnswers() {
    const segments   = analyzeData[activeExercise] || [];
    const componentWords = _getComponentWords();
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        if (componentWords.has(seg.word)) return;
        const chip = document.querySelector(`#terms-pool [data-word-idx="${idx}"]`);
        if (!chip) return;
        const word  = chip.dataset.word || seg.word;
        const label = seg.type === 'entidad'
            ? (seg.entityType || 'entidad')
            : seg.type === 'atributo'
                ? (analyzeConfig[activeExercise]?.requireSubtypes ? (seg.attrType || 'atributo') : 'atributo')
                : 'relación';
        chip.className = 'term-chip px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-indigo-400 bg-indigo-500/20 text-indigo-200 flex flex-col items-center leading-tight';
        chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-indigo-300/80 uppercase tracking-wide">${label}</span>`;
    });
    // Deshabilitar el botón tras usarlo
    document.querySelectorAll('#analyze-feedback button').forEach(btn => {
        if (btn.textContent.includes('Ver respuestas')) {
            btn.disabled = true;
            btn.textContent = '✓ Respuestas reveladas';
            btn.className = btn.className.replace('hover:bg-slate-600', '') + ' opacity-60 cursor-not-allowed';
        }
    });
}

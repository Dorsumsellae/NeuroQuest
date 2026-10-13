// minigames.js : salles (bug, ordre, assoc) rendues en overlay DOM. Retourne une Promise<{ok, chosen}>.
window.MiniGames = (function () {
  'use strict';
  const h = NQ.h;
  let root = null, current = null;
  const LINK_COLORS = ['#33ccff', '#ff44cc', '#ffd23f', '#44ff99'];
  const TITLES = { bug: '🐞 Chasse au bug', ordre: '🔢 Remets dans l\'ordre', assoc: '🔗 Associations' };

  function ensureRoot() {
    if (!root) root = document.getElementById('room');
    return root;
  }

  // Termine la salle : révèle la correction un instant puis résout la promesse
  function finish(ctx, result, reveal) {
    if (ctx.done) return;
    ctx.done = true;
    clearInterval(ctx.timer);
    if (reveal) reveal();
    ctx.footer.innerHTML = '';
    setTimeout(() => { close(); ctx.resolve(result); }, 1100);
  }
  function close() {
    if (root) { root.classList.remove('open'); root.innerHTML = ''; }
    current = null;
  }

  // ---------- bug : cliquer la ligne fautive ----------
  function buildBug(ctx) {
    const it = ctx.item, rows = [];
    const body = h('div', { class: 'code-lines' });
    it.code.forEach((line, i) => {
      const r = h('button', { class: 'code-line', onclick: () => pick(i) },
        h('span', { class: 'ln' }, String(i + 1)), h('code', null, line));
      rows.push(r); body.appendChild(r);
    });
    function reveal(chosen) {
      rows[it.line].classList.add('good');
      if (chosen != null && chosen !== it.line) rows[chosen].classList.add('bad');
    }
    function pick(i) {
      if (ctx.done) return;
      finish(ctx, { ok: i === it.line, chosen: i }, () => reveal(i));
    }
    ctx.onTimeout = () => finish(ctx, { ok: false, chosen: null, timeout: true }, () => reveal(null));
    ctx.hint.textContent = 'Touche la ligne qui contient l\'erreur.';
    return body;
  }

  // ---------- ordre : ▲▼ ----------
  function buildOrdre(ctx) {
    const it = ctx.item;
    let order = NQ.shuffle(it.items.map((_, i) => i));
    for (let t = 0; t < 5 && order.every((v, i) => it.items[v] === it.items[i]); t++) order = NQ.shuffle(order);
    const list = h('div', { class: 'ord-list' });
    function render() {
      list.innerHTML = '';
      order.forEach((idx, pos) => {
        const grip = h('span', { class: 'grip', title: 'Glisser pour déplacer' }, '⠿');
        const row = h('div', { class: 'ord-row', 'data-idx': String(idx) },
          grip,
          h('span', { class: 'ln' }, String(pos + 1)),
          h('span', { class: 'ord-txt' }, it.items[idx]),
          h('button', { class: 'sq', 'aria-label': 'Monter', disabled: pos === 0, onclick: () => move(pos, -1) }, '▲'),
          h('button', { class: 'sq', 'aria-label': 'Descendre', disabled: pos === order.length - 1, onclick: () => move(pos, 1) }, '▼'));
        attachDrag(row, grip);
        list.appendChild(row);
      });
    }
    function move(pos, d) {
      if (ctx.done) return;
      const j = pos + d; [order[pos], order[j]] = [order[j], order[pos]]; render();
    }
    // Glisser-déposer (souris et tactile) via la poignée ⠿ : la ligne suit le pointeur,
    // les autres lignes s'écartent ; l'ordre est relu depuis le DOM au relâchement.
    function attachDrag(row, grip) {
      grip.addEventListener('pointerdown', (e) => {
        if (ctx.done) return;
        e.preventDefault();
        try { grip.setPointerCapture(e.pointerId); } catch (err) { /* capture non supportée : le drag suit quand même le pointeur sur la poignée */ }
        row.classList.add('drag');
        const onMove = (ev) => {
          const others = Array.prototype.filter.call(list.children, (r) => r !== row);
          const before = others.find((r) => { const b = r.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; });
          if (before) list.insertBefore(row, before); else list.appendChild(row);
          Array.prototype.forEach.call(list.children, (r, i) => { r.querySelector('.ln').textContent = String(i + 1); });
        };
        const onUp = (ev) => {
          grip.removeEventListener('pointermove', onMove); grip.removeEventListener('pointerup', onUp); grip.removeEventListener('pointercancel', onUp);
          try { grip.releasePointerCapture(ev.pointerId); } catch (err) { /* déjà relâché */ }
          row.classList.remove('drag');
          order = Array.prototype.map.call(list.children, (r) => +r.getAttribute('data-idx'));
          render();
        };
        grip.addEventListener('pointermove', onMove);
        grip.addEventListener('pointerup', onUp);
        grip.addEventListener('pointercancel', onUp);
      });
    }
    function validate(timeout) {
      const chosen = order.map((i) => it.items[i]);
      const ok = !timeout && chosen.every((t, i) => t === it.items[i]);
      finish(ctx, { ok, chosen, timeout: !!timeout }, () => {
        Array.prototype.forEach.call(list.children, (row, pos) => {
          row.classList.add(chosen[pos] === it.items[pos] ? 'good' : 'bad');
          row.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        });
      });
    }
    ctx.onTimeout = () => validate(true);
    ctx.footer.appendChild(h('button', { class: 'btn primary', onclick: () => validate(false) }, 'Valider'));
    ctx.hint.textContent = 'Glisse les lignes par la poignée ⠿ (ou utilise ▲ ▼) pour les remettre dans le bon ordre.';
    render();
    return list;
  }

  // ---------- assoc : relier terme -> définition ----------
  function buildAssoc(ctx) {
    const it = ctx.item, n = it.pairs.length;
    const defOrder = NQ.shuffle(it.pairs.map((_, i) => i)); // position affichée -> index de paire
    const link = {}; // terme (index) -> position de définition
    let selTerm = null;
    const left = h('div', { class: 'as-col' }), right = h('div', { class: 'as-col' });
    const terms = [], defs = [];
    for (let i = 0; i < n; i++) {
      terms.push(h('button', { class: 'as-item', onclick: () => clickTerm(i) }, it.pairs[i][0]));
      defs.push(h('button', { class: 'as-item def', onclick: () => clickDef(i) }, it.pairs[defOrder[i]][1]));
      left.appendChild(terms[i]); right.appendChild(defs[i]);
    }
    function paint() {
      const used = {};
      Object.keys(link).forEach((t) => { used[link[t]] = +t; });
      for (let i = 0; i < n; i++) {
        const lt = link[i] != null, ld = used[i] != null;
        terms[i].style.borderColor = lt ? LINK_COLORS[i] : '';
        terms[i].style.background = lt ? LINK_COLORS[i] + '33' : '';
        terms[i].classList.toggle('sel', selTerm === i);
        defs[i].style.borderColor = ld ? LINK_COLORS[used[i]] : '';
        defs[i].style.background = ld ? LINK_COLORS[used[i]] + '33' : '';
      }
    }
    function clickTerm(i) {
      if (ctx.done) return;
      if (link[i] != null) { delete link[i]; selTerm = i; } else selTerm = selTerm === i ? null : i;
      paint();
    }
    function clickDef(d) {
      if (ctx.done || selTerm == null) return;
      Object.keys(link).forEach((t) => { if (link[t] === d) delete link[t]; }); // une définition = un seul terme
      link[selTerm] = d; selTerm = null; paint();
    }
    function validate(timeout) {
      const chosen = [];
      let ok = !timeout;
      for (let t = 0; t < n; t++) {
        const d = link[t];
        chosen.push([it.pairs[t][0], d != null ? it.pairs[defOrder[d]][1] : null]);
        if (d == null || defOrder[d] !== t) ok = false;
      }
      finish(ctx, { ok, chosen, timeout: !!timeout }, () => {
        for (let t = 0; t < n; t++) { // correction : bonne définition recolorée
          const good = link[t] != null && defOrder[link[t]] === t;
          terms[t].classList.add(good ? 'good' : 'bad');
          if (!good) defs[defOrder.indexOf(t)].classList.add('good');
        }
      });
    }
    ctx.onTimeout = () => validate(true);
    ctx.footer.appendChild(h('button', { class: 'btn primary', onclick: () => validate(false) }, 'Valider'));
    ctx.hint.textContent = 'Touche un terme, puis sa définition. Retouche un terme pour défaire le lien.';
    return h('div', { class: 'as-grid' }, left, right);
  }

  // ---------- API ----------
  function run(item, opts) {
    const timerSeconds = (opts && opts.timerSeconds) || 0;
    ensureRoot();
    return new Promise((resolve) => {
      const ctx = { item, resolve, done: false, timer: null, footer: h('div', { class: 'room-foot' }), hint: h('p', { class: 'hint' }) };
      const timerBar = h('i'), timerTxt = h('span', { class: 'rt' });
      const head = h('div', { class: 'room-head' }, h('b', null, TITLES[item.type] || 'Salle'),
        timerSeconds ? h('div', { class: 'room-timer' }, h('div', { class: 'bar' }, timerBar), timerTxt) : null);
      const builder = { bug: buildBug, ordre: buildOrdre, assoc: buildAssoc }[item.type];
      const body = builder(ctx);
      const card = h('div', { class: 'room-card' }, head, item.ctx ? h('p', { class: 'ctx' }, item.ctx) : null, h('p', { class: 'room-q' }, item.q), ctx.hint, body, ctx.footer);
      root.innerHTML = ''; root.appendChild(card); root.classList.add('open'); root.scrollTop = 0;
      current = ctx;
      if (timerSeconds) {
        const end = Date.now() + timerSeconds * 1000;
        const tick = () => {
          const left = Math.max(0, (end - Date.now()) / 1000);
          timerBar.style.width = (100 * left / timerSeconds) + '%';
          timerTxt.textContent = Math.ceil(left) + ' s';
          timerBar.parentNode.classList.toggle('low', left < 8);
          if (left <= 0 && !ctx.done) ctx.onTimeout();
        };
        tick(); ctx.timer = setInterval(tick, 100);
      }
    });
  }
  function abort() {
    if (!current) return;
    const c = current; c.done = true; clearInterval(c.timer); close(); c.resolve({ ok: false, chosen: null, aborted: true });
  }

  // Bloc DOM décrivant la solution (pour le feedback)
  function solutionNode(item) {
    if (item.type === 'bug') {
      return h('div', { class: 'sol' }, h('b', null, 'Ligne fautive (' + (item.line + 1) + ') :'), h('pre', null, item.code[item.line]));
    }
    if (item.type === 'ordre') {
      return h('div', { class: 'sol' }, h('b', null, 'Bon ordre :'), h('ol', null, item.items.map((t) => h('li', null, t))));
    }
    if (item.type === 'assoc') {
      return h('div', { class: 'sol' }, h('b', null, 'Bonnes associations :'),
        h('ul', null, item.pairs.map((p) => h('li', null, h('b', null, p[0]), ' → ' + p[1]))));
    }
    return h('div');
  }

  return { run, abort, solutionNode, isOpen: () => !!current };
})();

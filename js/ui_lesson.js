// ui_lesson.js : micro-leçons (carte affichée à la première rencontre d'une notion) et glossaire
// au toucher (termes techniques cliquables dans les questions, salles et explications).
window.UILesson = (function () {
  'use strict';
  const h = NQ.h;
  const $ = (id) => document.getElementById(id);

  // Schémas : définis dans js/schemas.js (NQ.schemas)
  const SVG = NQ.schemas || {};

  // ---------- Glossaire ----------
  let index = null;
  function buildIndex() {
    index = [];
    const terms = {}, words = {}; // dédoublonnage : plusieurs fichiers de contenu alimentent le glossaire
    (NQ.glossary || []).forEach((g) => {
      const key = g.t.toLowerCase(); if (terms[key]) return; terms[key] = 1;
      [g.t].concat(g.alt || []).forEach((w) => { const k = w && w.toLowerCase(); if (w && !words[k]) { words[k] = 1; index.push({ w, d: g.d, t: g.t }); } });
    });
    index.sort((a, b) => b.w.length - a.w.length); // les termes longs d'abord
  }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Renvoie un fragment où chaque terme connu (une fois par texte) est un <span class="term">
  // `shared` (optionnel) : objet partagé entre plusieurs appels pour ne souligner un terme qu'une fois par carte
  function glossify(text, shared) {
    if (!index) buildIndex();
    const frag = document.createDocumentFragment();
    if (!text || !index.length) { frag.appendChild(document.createTextNode(text || '')); return frag; }
    const seen = shared || {}, hits = [];
    index.forEach((e) => {
      if (seen[e.t]) return;
      const re = new RegExp('(^|[^\\p{L}\\p{N}])(' + esc(e.w) + ')(?![\\p{L}\\p{N}])', 'iu');
      const m = re.exec(text);
      if (m) {
        const start = m.index + m[1].length, end = start + m[2].length;
        if (!hits.some((x) => start < x.end && end > x.start)) { hits.push({ start, end, d: e.d, t: e.t }); seen[e.t] = true; }
      }
    });
    hits.sort((a, b) => a.start - b.start);
    let pos = 0;
    hits.forEach((x) => {
      if (x.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, x.start)));
      frag.appendChild(h('span', { class: 'term', 'data-def': x.d, 'data-term': x.t, role: 'button', tabindex: '0' }, text.slice(x.start, x.end)));
      pos = x.end;
    });
    if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
    return frag;
  }
  // Bulle de définition (une seule à la fois), fermée au clic ailleurs ou Échap
  let tip = null;
  function showTip(el) {
    hideTip();
    tip = h('div', { class: 'tip' }, h('b', null, el.getAttribute('data-term')), h('p', null, el.getAttribute('data-def')));
    document.body.appendChild(tip);
    const r = el.getBoundingClientRect(), tw = Math.min(320, window.innerWidth - 24);
    tip.style.width = tw + 'px';
    let left = Math.max(12, Math.min(window.innerWidth - tw - 12, r.left + r.width / 2 - tw / 2));
    tip.style.left = left + 'px';
    const below = r.bottom + 8 + tip.offsetHeight < window.innerHeight;
    tip.style.top = (below ? r.bottom + 8 : Math.max(8, r.top - tip.offsetHeight - 8)) + 'px';
    el.classList.add('open');
  }
  function hideTip() { if (tip) { tip.remove(); tip = null; } document.querySelectorAll('.term.open').forEach((e) => e.classList.remove('open')); }
  function bindGlossary() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest && e.target.closest('.term');
      if (t) { e.stopPropagation(); if (t.classList.contains('open')) hideTip(); else showTip(t); }
      else if (tip && !e.target.closest('.tip')) hideTip();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tip) hideTip(); });
    window.addEventListener('resize', hideTip);
  }

  // ---------- Micro-leçons ----------
  // Notions d'un item jamais rencontrées (ni répondues ni leçon vue) et qui ont une leçon
  function pendingFor(item) {
    const p = NQ.store.profile; p.lessonsSeen = p.lessonsSeen || {};
    return (item.notions || []).filter((id) => NQ.lessons && NQ.lessons[id] && !p.lessonsSeen[id] && NQ.masteryOf(id).ok + NQ.masteryOf(id).ko === 0);
  }
  let resolveLesson = null;
  function show(notionId, opts) {
    opts = opts || {};
    const L = NQ.lessons[notionId], n = NQ.notionsById[notionId];
    if (!L) return Promise.resolve();
    return new Promise((resolve) => {
      resolveLesson = resolve;
      const root = $('lesson'); root.innerHTML = '';
      // En partie : sous les écrans modaux (le Codex ouvert depuis la leçon passe devant).
      // En relecture (depuis la carte de maîtrise ou le Codex) : au-dessus d'eux.
      root.style.zIndex = opts.replay ? '50' : '';
      const once = {}, gl = (t) => glossify(t, once);
      const card = h('div', { class: 'lesson-card' },
        h('div', { class: 'lesson-head' }, h('small', null, opts.replay ? '📘 Leçon' : '🧭 Nouvelle notion'), h('h2', null, L.title), n ? h('em', null, n.label) : null),
        L.svg && SVG[L.svg] ? h('div', { class: 'lesson-svg', html: SVG[L.svg] }) : null,
        h('div', { class: 'lesson-body' }, L.p.map((t) => h('p', null, gl(t)))),
        L.ex ? h('div', { class: 'lesson-ex' }, h('b', null, 'Exemple : '), gl(L.ex)) : null,
        L.tip ? h('div', { class: 'lesson-tip' }, '💡 ', gl(L.tip)) : null,
        h('div', { class: 'row' },
          n && !opts.replay ? h('button', { class: 'btn', onclick: () => UICodex.open({ notionId, resume: true }) }, '📖 Lire la fiche') : null,
          h('button', { class: 'btn primary', id: 'lesson-go', onclick: close }, opts.replay ? 'Fermer' : 'C\'est parti ▶ (↑)')));
      root.appendChild(card); root.classList.add('open'); card.scrollTop = 0;
      if (!opts.replay) { NQ.store.profile.lessonsSeen[notionId] = Date.now(); NQ.store.save(); }
    });
  }
  function close() {
    const root = $('lesson'); root.classList.remove('open'); root.innerHTML = '';
    hideTip();
    const r = resolveLesson; resolveLesson = null; if (r) r();
  }
  const isOpen = () => !!resolveLesson;
  // Enchaîne les leçons en attente pour un item, puis résout
  function showPending(item) {
    const ids = pendingFor(item);
    return ids.reduce((p, id) => p.then(() => show(id)), Promise.resolve());
  }

  return { glossify, bindGlossary, hideTip, show, showPending, pendingFor, close, isOpen, hasLesson: (id) => !!(NQ.lessons && NQ.lessons[id]) };
})();

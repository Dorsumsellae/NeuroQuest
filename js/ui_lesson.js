// ui_lesson.js : micro-leçons (carte affichée à la première rencontre d'une notion) et glossaire
// au toucher (termes techniques cliquables dans les questions, salles et explications).
window.UILesson = (function () {
  'use strict';
  const h = NQ.h;
  const $ = (id) => document.getElementById(id);

  // ---------- Schémas (SVG inline, légers) ----------
  const SVG = {
    droite: '<svg viewBox="0 0 240 120" class="lsvg"><line x1="20" y1="100" x2="230" y2="100" stroke="#8cf" stroke-width="1.5"/><line x1="20" y1="100" x2="20" y2="10" stroke="#8cf" stroke-width="1.5"/>' +
      '<circle cx="50" cy="80" r="3" fill="#fff"/><circle cx="80" cy="70" r="3" fill="#fff"/><circle cx="110" cy="58" r="3" fill="#fff"/><circle cx="140" cy="50" r="3" fill="#fff"/><circle cx="170" cy="35" r="3" fill="#fff"/><circle cx="200" cy="30" r="3" fill="#fff"/>' +
      '<line x1="25" y1="92" x2="225" y2="22" stroke="#f6f" stroke-width="2.5"/><text x="180" y="18" fill="#f6f" font-size="11">ŷ = θ₀ + θ₁x</text><text x="24" y="92" fill="#ffd23f" font-size="10">θ₀</text></svg>',
    neurone: '<svg viewBox="0 0 260 120" class="lsvg"><g fill="#8cf" font-size="11"><text x="8" y="30">x₁</text><text x="8" y="64">x₂</text><text x="8" y="98">x₃</text></g>' +
      '<g stroke="#8cf" stroke-width="1.5"><line x1="28" y1="26" x2="110" y2="60"/><line x1="28" y1="60" x2="110" y2="60"/><line x1="28" y1="94" x2="110" y2="60"/></g>' +
      '<g fill="#ffd23f" font-size="10"><text x="60" y="36">w₁</text><text x="60" y="56">w₂</text><text x="60" y="88">w₃</text></g>' +
      '<ellipse cx="140" cy="60" rx="34" ry="24" fill="#1a2a6c" stroke="#f6f" stroke-width="2"/><text x="122" y="56" fill="#fff" font-size="11">Σ − θ</text><text x="128" y="72" fill="#fff" font-size="11">f(a)</text>' +
      '<line x1="174" y1="60" x2="235" y2="60" stroke="#3f8" stroke-width="2.5"/><text x="238" y="64" fill="#3f8" font-size="12">y</text></svg>',
    sablier: '<svg viewBox="0 0 260 120" class="lsvg"><g fill="#33aaff" opacity=".85"><rect x="20" y="10" width="14" height="100"/><rect x="55" y="25" width="14" height="70"/><rect x="90" y="40" width="14" height="40"/></g>' +
      '<rect x="123" y="50" width="14" height="20" fill="#ff44cc"/>' +
      '<g fill="#33aaff" opacity=".85"><rect x="156" y="40" width="14" height="40"/><rect x="191" y="25" width="14" height="70"/><rect x="226" y="10" width="14" height="100"/></g>' +
      '<g fill="#8cf" font-size="10"><text x="30" y="118">encodeur</text><text x="118" y="46">code</text><text x="178" y="118">décodeur</text></g></svg>'
  };

  // ---------- Glossaire ----------
  let index = null;
  function buildIndex() {
    index = [];
    (NQ.glossary || []).forEach((g) => {
      [g.t].concat(g.alt || []).forEach((w) => { if (w) index.push({ w, d: g.d, t: g.t }); });
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
      const once = {}, gl = (t) => glossify(t, once);
      const card = h('div', { class: 'lesson-card' },
        h('div', { class: 'lesson-head' }, h('small', null, opts.replay ? '📘 Leçon' : '🧭 Nouvelle notion'), h('h2', null, L.title), n ? h('em', null, n.label) : null),
        L.svg && SVG[L.svg] ? h('div', { class: 'lesson-svg', html: SVG[L.svg] }) : null,
        h('div', { class: 'lesson-body' }, L.p.map((t) => h('p', null, gl(t)))),
        L.ex ? h('div', { class: 'lesson-ex' }, h('b', null, 'Exemple : '), gl(L.ex)) : null,
        L.tip ? h('div', { class: 'lesson-tip' }, '💡 ', gl(L.tip)) : null,
        h('div', { class: 'row' },
          n ? h('button', { class: 'btn', onclick: () => UICodex.open({ notionId, resume: true }) }, '📖 Lire la fiche') : null,
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

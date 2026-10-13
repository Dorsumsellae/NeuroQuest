// ui_codex.js : le Codex (fiches de révision en Markdown) avec recherche et lien vers les notions.
window.UICodex = (function () {
  'use strict';
  const h = NQ.h;
  const READ_CHAPTERS = { '01': [1], '02': [2], '03': [3, 4] }; // fiche -> chapitres couverts (bouclier du boss)

  // Section correspondant à une notion (fragment de titre, insensible à la casse)
  function locate(notionId) {
    const n = NQ.notionsById[notionId];
    if (!n || !NQ.codex[n.fiche]) return null;
    const secs = NQ.codex[n.fiche].sections;
    const frag = n.section.toLowerCase();
    const s = secs.find((x) => x.h.toLowerCase().indexOf(frag) >= 0) || secs[0];
    return { fiche: n.fiche, sectionId: s.id, notion: n };
  }

  function markRead(fiche) {
    const chs = READ_CHAPTERS[fiche];
    if (!chs) return;
    chs.forEach((c) => { NQ.store.profile.codexRead[c] = Date.now(); });
    NQ.store.save();
  }

  // opts: {fiche, sectionId, notionId, resume}
  function open(opts) {
    opts = opts || {};
    let cur = { fiche: opts.fiche || '00', sectionId: null };
    let notion = null;
    if (opts.notionId) {
      const loc = locate(opts.notionId);
      if (loc) { cur = loc; notion = loc.notion; }
    } else if (opts.fiche && opts.sectionId) cur.sectionId = opts.sectionId;
    if (!cur.sectionId) cur.sectionId = NQ.codex[cur.fiche].sections[0].id;

    const search = h('input', { type: 'search', placeholder: 'Rechercher une section…', class: 'cx-search', oninput: renderNav });
    const nav = h('nav', { class: 'cx-nav' });
    const content = h('article', { class: 'cx-content md' });
    const navToggle = h('button', { class: 'btn small cx-toggle', onclick: () => root.classList.toggle('nav-open') }, '☰ Sommaire');
    const root = h('div', { class: 'codex' }, navToggle, h('div', { class: 'cx-left' }, search, nav), content);

    function renderNav() {
      const q = search.value.trim().toLowerCase();
      nav.innerHTML = '';
      Object.keys(NQ.codex).sort().forEach((f) => {
        const fiche = NQ.codex[f];
        const secs = fiche.sections.filter((s) => !q || s.h.toLowerCase().indexOf(q) >= 0 || fiche.title.toLowerCase().indexOf(q) >= 0);
        if (!secs.length) return;
        nav.appendChild(h('div', { class: 'cx-fiche' }, f + ' · ' + fiche.title));
        secs.forEach((s) => nav.appendChild(h('button', {
          class: 'cx-sec l' + s.level + (f === cur.fiche && s.id === cur.sectionId ? ' on' : ''),
          onclick: () => { notion = null; show(f, s.id); root.classList.remove('nav-open'); }
        }, s.h)));
      });
    }
    function show(f, sid) {
      cur = { fiche: f, sectionId: sid };
      const sec = NQ.codex[f].sections.find((s) => s.id === sid) || NQ.codex[f].sections[0];
      markRead(f);
      content.innerHTML = '';
      if (notion) {
        const e = NQ.masteryOf(notion.id);
        const trainBtn = h('button', { class: 'btn small primary', onclick: () => train(notion.id) }, '🎯 M\'entraîner (5 portes)');
        content.appendChild(h('div', { class: 'badge' },
          h('div', { class: 'badge-info' }, h('b', null, notion.label),
            h('div', { class: 'mbar' }, h('i', { style: 'width:' + Math.round(e.m) + '%' })),
            h('small', null, NQ.masteryState(notion.id) + ' · ' + Math.round(e.m) + '/100')),
          trainBtn));
      }
      content.appendChild(h('div', { html: marked.parse(sec.md || '') }));
      content.scrollTop = 0;
      renderNav();
    }
    function train(id) {
      while (UI.hasModal()) UI.closeTop();
      UI.handlers().startFlash(id);
    }
    show(cur.fiche, cur.sectionId);
    UI.showFrame('📖 Codex', root, { closeLabel: opts.resume ? '▶ Reprendre' : '✕ Fermer' });
    // Centrer l'entrée active dans la colonne de navigation seulement (scrollIntoView ferait
    // aussi défiler la fenêtre entière et cacherait le haut de la page sous l'en-tête).
    const active = nav.querySelector('.on');
    if (active) nav.scrollTop = Math.max(0, active.offsetTop - nav.clientHeight / 2 + active.offsetHeight / 2);
  }

  return { open, locate };
})();

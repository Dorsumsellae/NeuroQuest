// core.js : profil (localStorage), tirage pondéré des épreuves, utilitaires DOM et sons.
(function () {
  'use strict';
  const NQ = window.NQ = window.NQ || {};
  const KEY = 'nq_profile_v1';

  // ---------- Utilitaires ----------
  // h('div', {class:'x', onclick:fn, html:'<b>..</b>'}, enfants...) : création DOM concise
  NQ.h = function (tag, attrs) {
    const el = document.createElement(tag);
    for (const k in (attrs || {})) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    const add = (c) => {
      if (c == null || c === false) return;
      if (Array.isArray(c)) c.forEach(add);
      else el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    };
    for (let i = 2; i < arguments.length; i++) add(arguments[i]);
    return el;
  };
  NQ.shuffle = function (a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- Profil ----------
  const defaults = () => ({
    name: 'Joueur', xp: 0, difficulty: 'normal',
    equipped: { skin: 'cobalt', trail: 'bleu', title: '' },
    elite: false, bosses: { 1: false, 2: false, 3: false, 4: false },
    mastery: {}, codexRead: {},
    stats: { games: 0, best: 0, answers: 0, correct: 0 },
    muted: false,     // effets sonores coupés
    music: true,      // musique d'ambiance
    vibrate: true,    // vibration sur mobile en cas d'erreur
    autoContinue: 5 // secondes avant reprise automatique après un feedback (0 = désactivé)
  });
  // Fusionne une source (localStorage / import) dans les valeurs par défaut
  function sanitize(src) {
    const out = defaults();
    if (!src || typeof src !== 'object') return out;
    Object.keys(out).forEach((k) => {
      const d = out[k], v = src[k];
      if (v === undefined || v === null) return;
      if (typeof d === 'object') { if (typeof v === 'object') out[k] = Object.assign(d, v); }
      else if (typeof v === typeof d) out[k] = v;
    });
    return out;
  }
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } };

  const store = NQ.store = {
    profile: defaults(),
    load() {
      let raw = null;
      try { raw = JSON.parse(lsGet(KEY)); } catch (e) { raw = null; }
      store.profile = sanitize(raw);
      return store.profile;
    },
    save() { lsSet(KEY, JSON.stringify(store.profile)); },
    exportJSON() { return JSON.stringify(store.profile, null, 2); },
    importJSON(str) {
      const o = JSON.parse(str); // peut lever une exception : gérée par l'appelant
      if (!o || typeof o !== 'object' || typeof o.xp !== 'number') throw new Error('Format invalide');
      store.profile = sanitize(o);
      store.save();
    },
    reset() { store.profile = defaults(); store.save(); }
  };
  store.load();

  // ---------- Notions et épreuves ----------
  NQ.notionsById = {};
  (NQ.notions || []).forEach((n) => { NQ.notionsById[n.id] = n; });

  NQ.allItems = function () {
    const c = NQ.content || {};
    return [1, 2, 3, 4].reduce((acc, k) => acc.concat(c['ch' + k] || []), []);
  };
  NQ.GATE_TYPES = ['choix', 'calcul'];
  NQ.ROOM_TYPES = ['bug', 'ordre', 'assoc'];
  NQ.isRoom = (it) => NQ.ROOM_TYPES.indexOf(it.type) >= 0;

  // filter: {ch: 0|1..4, notion: id, types: [..]}
  NQ.pool = function (f) {
    f = f || {};
    return NQ.allItems().filter((it) =>
      (!f.ch || it.ch === f.ch) &&
      (!f.notion || it.notions.indexOf(f.notion) >= 0) &&
      (!f.types || f.types.indexOf(it.type) >= 0));
  };

  NQ.masteryOf = function (id) {
    return NQ.store.profile.mastery[id] || { m: 0, last: 0, ok: 0, ko: 0 };
  };
  NQ.masteryState = function (id) {
    const e = NQ.masteryOf(id);
    if (e.m >= 70) return 'Maîtrisée';
    if (e.m >= 30) return 'En cours';
    return 'Découverte';
  };

  const DIFF_PREF = {
    decouverte: { 1: 1.0, 2: 0.5, 3: 0 },
    facile: { 1: 1.0, 2: 0.6, 3: 0.2 },
    normal: { 1: 0.8, 2: 1.0, 3: 0.6 },
    expert: { 1: 0.4, 2: 1.0, 3: 1.2 }
  };
  const DAY = 86400000;
  function weight(item, difficulty) {
    const now = Date.now();
    let m = 0, days = 0;
    const ids = item.notions.length ? item.notions : [''];
    ids.forEach((id) => {
      const e = NQ.masteryOf(id);
      m += e.m;
      days += e.last ? Math.min(10, (now - e.last) / DAY) : 10;
    });
    m /= ids.length; days /= ids.length;
    const base = (100 - m) + 15 * Math.min(days, 10) + 10;
    return base * ((DIFF_PREF[difficulty] || DIFF_PREF.normal)[item.diff] || 1);
  }
  // Tirage pondéré ; opts.avoid = ids à éviter (répétitions immédiates)
  NQ.pick = function (pool, opts) {
    opts = opts || {};
    if (!pool.length) return null;
    const avoid = opts.avoid || [];
    let cand = pool.filter((it) => avoid.indexOf(it.id) < 0);
    if (!cand.length) cand = pool;
    const ws = cand.map((it) => weight(it, opts.difficulty));
    let r = Math.random() * ws.reduce((a, b) => a + b, 0);
    for (let i = 0; i < cand.length; i++) { r -= ws[i]; if (r <= 0) return cand[i]; }
    return cand[cand.length - 1];
  };

  NQ.applyResult = function (item, ok) {
    const p = store.profile;
    const delta = (ok ? 15 : -20) * (0.8 + 0.2 * item.diff);
    item.notions.forEach((id) => {
      const e = p.mastery[id] || (p.mastery[id] = { m: 0, last: 0, ok: 0, ko: 0 });
      e.m = Math.max(0, Math.min(100, e.m + delta));
      e.last = Date.now();
      if (ok) e.ok++; else e.ko++;
    });
    p.stats.answers++;
    if (ok) p.stats.correct++;
    store.save();
  };

  // ---------- Sons : délégués à js/audio.js (NQ.audio), chargé après ce fichier ----------
  NQ.beep = function (f, d, type) { if (NQ.audio) NQ.audio.note(f, d || 0.12, type); };
  NQ.sfx = {
    good(mult) { if (NQ.audio) NQ.audio.sfx.good(mult); },
    bad() { if (NQ.audio) NQ.audio.sfx.bad(); }
  };
})();

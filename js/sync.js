// sync.js : sauvegarde de la progression en ligne (Firestore), protégée par pseudo + code à 4 chiffres.
//
// Principe : l'identifiant du document est une empreinte SHA-256 de « pseudo normalisé + code ».
// Sans le bon code, on ne connaît pas l'identifiant : impossible de lire ou d'écraser la progression
// de quelqu'un (les règles Firestore interdisent de lister la collection). Le code n'est jamais stocké :
// seul l'identifiant dérivé est gardé dans le navigateur. Deux joueurs au même pseudo mais avec des
// codes différents ont donc deux sauvegardes distinctes.
//
// Règle de fusion : la version la plus récente (updatedAt) gagne, à l'ouverture comme à la connexion.
window.NQ = window.NQ || {};
NQ.sync = (function () {
  'use strict';
  const COL = 'profiles', DELAY = 4000;
  let timer = null, pending = false, status = 'off', lastSync = 0;
  const listeners = [];
  const prof = () => NQ.store.profile;
  const setStatus = (s) => { status = s; listeners.forEach((f) => { try { f(s); } catch (e) { /* ignore */ } }); };

  const available = () => !!(NQ.leaderboard && NQ.leaderboard.isShared());
  const normalize = (name) => String(name || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ');

  // Empreinte SHA-256 en hexadécimal (crypto.subtle : https et file:// dans Chrome)
  async function makeId(name, pin) {
    const txt = 'neuroquest|v1|' + normalize(name) + '|' + pin;
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    // Repli (navigateurs anciens) : empreinte simple, moins robuste mais déterministe
    let h1 = 0x811c9dc5, h2 = 0x01000193;
    for (let i = 0; i < txt.length; i++) { h1 = Math.imul(h1 ^ txt.charCodeAt(i), 16777619); h2 = Math.imul(h2 + txt.charCodeAt(i), 2246822519); }
    return 'f' + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16);
  }

  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('pas de réponse du serveur')), ms || 8000))]);
  // Ce qu'on envoie : tout le profil sauf la clé elle-même
  const payload = () => { const p = Object.assign({}, prof()); delete p.syncId; return JSON.stringify(p); };

  async function fetchRemote(id) {
    const db = await withTimeout(NQ.leaderboard.db());
    const snap = await withTimeout(db.collection(COL).doc(id).get());
    if (!snap.exists) return null;
    const d = snap.data();
    try { return { name: d.name, updatedAt: d.updatedAt || 0, profile: JSON.parse(d.data) }; } catch (e) { return null; }
  }
  async function push(id) {
    const db = await withTimeout(NQ.leaderboard.db());
    const p = prof();
    await withTimeout(db.collection(COL).doc(id).set({ name: String(p.name).slice(0, 20), data: payload(), updatedAt: p.updatedAt || Date.now() }));
    lastSync = Date.now();
  }

  // Connexion avec pseudo + code. Résout {found, remoteNewer, remote} ; ne modifie rien tant que l'appelant n'a pas choisi.
  async function lookup(name, pin) {
    if (!available()) throw new Error('Synchronisation indisponible (Firebase non configuré)');
    const id = await makeId(name, pin);
    const remote = await fetchRemote(id);
    return { id, remote };
  }
  // Après lookup : adopte la sauvegarde en ligne (useRemote) ou y envoie la progression locale.
  async function link(name, id, remote, useRemote) {
    if (useRemote && remote) {
      NQ.store.replace(Object.assign({}, remote.profile, { name: remote.name || name, syncId: id })); // orthographe d'origine du pseudo
    } else {
      const p = prof(); p.name = name; p.syncId = id; NQ.store.save();
      await push(id);
    }
    prof().syncId = id; NQ.store.save(true);
    setStatus('ok');
  }
  function unlink() { const p = prof(); p.syncId = ''; NQ.store.save(true); setStatus('off'); }

  // Sauvegarde différée après chaque modification locale
  function schedule() {
    if (!prof().syncId || !available()) return;
    pending = true; clearTimeout(timer);
    timer = setTimeout(flush, DELAY);
  }
  async function flush() {
    const id = prof().syncId; if (!id || !pending) return;
    pending = false; setStatus('saving');
    try { await push(id); setStatus('ok'); } catch (e) { pending = true; setStatus('error'); console.warn('Sauvegarde en ligne impossible :', e.message); }
  }
  // Au démarrage : récupère la version en ligne si elle est plus récente que la locale
  async function startup() {
    const id = prof().syncId; if (!id || !available()) return 'off';
    setStatus('saving');
    try {
      const remote = await fetchRemote(id);
      if (remote && (remote.updatedAt || 0) > (prof().updatedAt || 0)) {
        NQ.store.replace(Object.assign({}, remote.profile, { syncId: id }));
        setStatus('ok'); return 'pulled';
      }
      if (!remote || (prof().updatedAt || 0) > (remote.updatedAt || 0)) { pending = true; await flush(); return 'pushed'; }
      setStatus('ok'); return 'same';
    } catch (e) { setStatus('error'); console.warn('Synchronisation impossible :', e.message); return 'error'; }
  }
  // Envoi immédiat (fin de partie, fermeture de l'onglet)
  window.addEventListener('pagehide', () => { if (pending) flush(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pending) flush(); });

  return {
    available, makeId, lookup, link, unlink, schedule, flush, startup,
    status: () => status, lastSync: () => lastSync,
    isLinked: () => !!prof().syncId,
    onStatus: (f) => listeners.push(f)
  };
})();

// leaderboard.js : classement. Interface unique pour le reste du jeu :
//   NQ.leaderboard.submit({name, score, difficulty, chapter, date})  -> Promise
//   NQ.leaderboard.top(n, difficulty)                                 -> Promise<[{name, score, difficulty, chapter, date}]>
//   NQ.leaderboard.isShared()                                         -> true si le classement partagé (Firebase) est actif
// Deux implémentations : locale (localStorage, toujours disponible) et partagée (Firestore) activée
// quand js/firebase-config.js fournit une configuration. Les scores sont toujours écrits en local ;
// la lecture montre le classement partagé quand il est joignable, sinon le local.
window.NQ = window.NQ || {};
NQ.leaderboard = (function () {
  'use strict';
  const KEY = 'nq_scores', MAX = 50;

  // ---------- Local ----------
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function write(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* stockage indisponible */ } }
  const clean = (e) => ({
    name: String(e.name || 'Joueur').slice(0, 20), score: Math.max(0, Math.round(+e.score || 0)),
    difficulty: e.difficulty || 'normal', chapter: +e.chapter || 0, date: e.date || new Date().toISOString().slice(0, 10)
  });
  const local = {
    submit(entry) {
      const list = read(); list.push(clean(entry));
      list.sort((a, b) => b.score - a.score); write(list.slice(0, MAX));
      return Promise.resolve();
    },
    top(n, difficulty) {
      return Promise.resolve(read().filter((e) => !difficulty || e.difficulty === difficulty)
        .sort((a, b) => b.score - a.score).slice(0, n || 20));
    }
  };

  // ---------- Partagé (Firebase Firestore, SDK compat chargé à la demande) ----------
  const cfg = window.NQ_FIREBASE_CONFIG || null;
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  let dbPromise = null;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = resolve; s.onerror = () => reject(new Error('chargement impossible : ' + src));
      document.head.appendChild(s);
    });
  }
  function db() {
    if (!cfg) return Promise.reject(new Error('pas de configuration Firebase'));
    if (!dbPromise) {
      dbPromise = loadScript(SDK + 'firebase-app-compat.js')
        .then(() => loadScript(SDK + 'firebase-firestore-compat.js'))
        .then(() => {
          if (!window.firebase.apps.length) window.firebase.initializeApp(cfg);
          return window.firebase.firestore();
        })
        .catch((e) => { dbPromise = null; throw e; });
    }
    return dbPromise;
  }
  const shared = {
    submit(entry) {
      const e = clean(entry);
      return db().then((d) => d.collection('scores').add(Object.assign(e, { ts: Date.now() })));
    },
    top(n, difficulty) {
      return db().then((d) => {
        let q = d.collection('scores');
        if (difficulty) q = q.where('difficulty', '==', difficulty);
        return q.orderBy('score', 'desc').limit(n || 20).get();
      }).then((snap) => snap.docs.map((doc) => clean(doc.data())));
    }
  };

  // ---------- Façade ----------
  // Le SDK Firestore réessaie indéfiniment quand la base est injoignable (hors ligne, base non créée) :
  // on borne chaque appel pour retomber sur le classement local au lieu de rester sur « chargement… ».
  const TIMEOUT = 8000;
  const withTimeout = (p, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(what + ' : pas de réponse de Firestore en ' + TIMEOUT / 1000 + ' s')), TIMEOUT))]);
  return {
    isShared: () => !!cfg,
    submit(entry) {
      const p = local.submit(entry);
      if (!cfg) return p;
      return withTimeout(shared.submit(entry), 'envoi du score').catch((e) => { console.warn('Classement partagé indisponible :', e.message); });
    },
    top(n, difficulty) {
      if (!cfg) return local.top(n, difficulty);
      return withTimeout(shared.top(n, difficulty), 'lecture du classement').catch((e) => {
        console.warn('Classement partagé indisponible, affichage local :', e.message);
        return local.top(n, difficulty).then((rows) => { rows.localFallback = true; return rows; });
      });
    },
    localTop: local.top
  };
})();

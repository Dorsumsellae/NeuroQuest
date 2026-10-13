// leaderboard.js : classement. Implémentation locale (localStorage).
// Pour un classement partagé, remplacer le corps de submit() et top() par des appels Firebase
// en gardant la même interface : submit({name, score, difficulty, chapter, date}), top(n, difficulty).
(function () {
  'use strict';
  const KEY = 'nq_scores';
  function read() {
    try { const a = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function write(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* ignoré */ } }

  window.NQ = window.NQ || {};
  window.NQ.leaderboard = {
    submit(entry) {
      const e = {
        name: String(entry.name || 'Joueur').slice(0, 20), score: Math.round(entry.score) || 0,
        difficulty: entry.difficulty || 'normal', chapter: entry.chapter || 0,
        date: entry.date || new Date().toISOString().slice(0, 10)
      };
      const all = read(); all.push(e);
      all.sort((a, b) => b.score - a.score);
      write(all.slice(0, 50));
      return e;
    },
    top(n, difficulty) {
      return read().filter((e) => !difficulty || e.difficulty === difficulty)
        .sort((a, b) => b.score - a.score).slice(0, n || 10);
    }
  };
})();

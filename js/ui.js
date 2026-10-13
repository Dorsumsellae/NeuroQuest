// ui.js : écrans de base (menu, HUD, feedback, fin de partie, dialogue de confirmation, pile d'écrans modaux).
// Les vues lourdes sont dans ui_codex.js (Codex) et ui_views.js (maîtrise, pass, classement, options, boss).
window.UI = (function () {
  'use strict';
  const h = NQ.h;
  const $ = (id) => document.getElementById(id);
  const CH_LABEL = { 0: 'Les 4 chapitres mélangés', 1: 'Régressions', 2: 'Neurones, MLP & CNN', 3: 'Autoencodeurs & U-Net', 4: 'Détection d\'anomalies' };
  const DIFF_LABEL = { decouverte: 'Découverte', facile: 'Facile', normal: 'Normal', expert: 'Expert' };
  const DIFF_ORDER = ['decouverte', 'facile', 'normal', 'expert'];
  const DIFF_DESC = {
    decouverte: 'Découverte (niveau 0) : 15 questions de compréhension des notions, sans code ni calcul, sans vies ni salle, vitesse lente.',
    facile: 'Facile : 5 vies, vitesse douce, pas de chrono en salle.',
    normal: 'Normal : 3 vies, vitesse progressive, salles chronométrées (45 s).',
    expert: 'Expert : 2 vies, très rapide, salles en 25 s, XP ×1,5 et score ×1,5.'
  };
  let H = {};            // gestionnaires fournis par main.js
  const stack = [];      // écrans modaux ouverts (le dernier est au-dessus)
  let fbResolve = null, flashTimer = null;

  // ---------- Pile d'écrans modaux ----------
  function openScreen(node, opts) {
    opts = opts || {};
    node.classList.add('screen', 'modal');
    $('ui').appendChild(node);
    stack.push({ node, onClose: opts.onClose, closable: opts.closable !== false });
    return node;
  }
  function closeTop() {
    const top = stack[stack.length - 1];
    if (!top || !top.closable) return false;
    stack.pop(); top.node.remove();
    if (top.onClose) top.onClose();
    return true;
  }
  function closeAll() { while (stack.length) { const t = stack.pop(); t.node.remove(); } }
  // Cadre standard : titre + bouton fermer + contenu
  function frame(title, content, opts) {
    opts = opts || {};
    const closeBtn = h('button', { class: 'btn close', onclick: closeTop }, opts.closeLabel || '✕ Fermer');
    return h('div', { class: 'frame' },
      h('div', { class: 'frame-head' }, h('h2', null, title), closeBtn), h('div', { class: 'frame-body' }, content));
  }
  function showFrame(title, content, opts) { return openScreen(frame(title, content, opts), opts); }

  // ---------- Dialogue de confirmation (jamais window.confirm) ----------
  // ---------- Pseudo ----------
  const DEFAULT_NAME = 'Joueur';
  const hasName = () => { const n = (NQ.store.profile.name || '').trim(); return n && n !== DEFAULT_NAME; };
  // Dialogue de saisie du pseudo (+ code à 4 chiffres si la sauvegarde en ligne est disponible).
  // Résout avec le nom enregistré (ou null si « Plus tard »).
  function askName(opts) {
    opts = opts || {};
    const syncOn = !!(NQ.sync && NQ.sync.available());
    return new Promise((resolve) => {
      const dlg = $('dlg'), p = NQ.store.profile;
      const input = h('input', { type: 'text', class: 'txt', maxlength: '20', placeholder: 'Ton pseudo (ex. Maxence)', value: hasName() ? p.name : '' });
      const pin = h('input', { type: 'password', class: 'txt pin', inputmode: 'numeric', maxlength: '4', autocomplete: 'off', placeholder: '••••' });
      pin.addEventListener('input', () => { pin.value = pin.value.replace(/\D/g, '').slice(0, 4); });
      const err = h('p', { class: 'hint' });
      const body = h('div');
      let busy = false;
      const done = (v) => { dlg.classList.remove('open'); dlg.innerHTML = ''; resolve(v); };
      // Choix quand une sauvegarde en ligne existe déjà et que cet appareil a aussi une progression
      const chooser = (name, id, remote) => {
        const rp = remote.profile || {}, lvl = NQ.prog.levelFor(rp.xp || 0), when = remote.updatedAt ? new Date(remote.updatedAt).toLocaleString('fr-FR') : '?';
        const here = NQ.prog.levelFor(p.xp || 0);
        body.innerHTML = '';
        body.appendChild(h('div', null,
          h('p', null, '☁ Une sauvegarde existe pour « ' + name + ' » : palier ' + lvl + ', ' + (rp.xp || 0) + ' XP, ' + Object.keys(rp.campaign || {}).length + ' étapes de campagne (mise à jour le ' + when + ').'),
          h('p', { class: 'hint' }, 'Cet appareil : palier ' + here + ', ' + (p.xp || 0) + ' XP.'),
          h('div', { class: 'col' },
            h('button', { class: 'btn primary', onclick: () => finish(name, id, remote, true) }, '☁ Charger la sauvegarde en ligne'),
            h('button', { class: 'btn', onclick: () => finish(name, id, remote, false) }, '📱 Garder la progression de cet appareil (remplace la sauvegarde en ligne)'))));
      };
      const finish = (name, id, remote, useRemote) => {
        body.innerHTML = ''; body.appendChild(h('p', null, '⏳ Synchronisation…'));
        NQ.sync.link(name, id, remote, useRemote).then(() => { applyEquipped(); done(name); })
          .catch((e) => { body.innerHTML = ''; body.appendChild(h('p', { class: 'hint' }, 'Synchronisation impossible (' + e.message + '). Le pseudo est gardé sur cet appareil.')); p.name = name; NQ.store.save(); setTimeout(() => done(name), 1800); });
      };
      const save = () => {
        if (busy) return;
        const v = input.value.trim().slice(0, 20);
        if (!v || v.toLowerCase() === DEFAULT_NAME.toLowerCase()) { err.textContent = 'Choisis un pseudo pour apparaître dans le classement.'; input.focus(); return; }
        if (!syncOn) { p.name = v; NQ.store.save(); done(v); return; }
        if (!/^\d{4}$/.test(pin.value)) { err.textContent = 'Choisis un code à 4 chiffres : il protège ta progression.'; pin.focus(); return; }
        busy = true; err.textContent = '⏳ Recherche de ta sauvegarde…';
        NQ.sync.lookup(v, pin.value).then(({ id, remote }) => {
          busy = false;
          const localEmpty = !(p.xp > 0) && !Object.keys(p.campaign || {}).length;
          if (!remote) { err.textContent = ''; finish(v, id, null, false); }          // nouvelle sauvegarde
          else if (localEmpty || p.syncId === id) finish(v, id, remote, (remote.updatedAt || 0) >= (p.updatedAt || 0));
          else { err.textContent = ''; chooser(v, id, remote); }
        }).catch((e) => {
          busy = false;
          err.textContent = 'Sauvegarde en ligne injoignable (' + e.message + '). ';
          err.appendChild(h('button', { class: 'btn small', onclick: () => { p.name = v; NQ.store.save(); done(v); } }, 'Garder le pseudo sur cet appareil'));
        });
      };
      [input, pin].forEach((el) => el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); save(); } }));
      body.appendChild(h('div', null,
        input,
        syncOn ? h('label', { class: 'pin-label' }, 'Code à 4 chiffres', pin) : null,
        syncOn ? h('p', { class: 'hint small' }, 'Pseudo + code = ta sauvegarde en ligne. Retape les mêmes sur un autre appareil pour retrouver ta progression. Ne l\'oublie pas : il n\'est stocké nulle part.') : null,
        err,
        h('div', { class: 'row' },
          h('button', { class: 'btn', onclick: () => done(null) }, opts.later || 'Plus tard'),
          h('button', { class: 'btn primary', onclick: save }, 'Valider'))));
      dlg.innerHTML = '';
      dlg.appendChild(h('div', { class: 'dlg-card name-card' },
        h('h2', null, opts.title || '👋 Bienvenue dans NeuroQuest'),
        h('p', null, opts.msg || (syncOn ? 'Choisis ton pseudo et un code : ta progression sera sauvegardée en ligne et tu apparaîtras dans le classement de la promo.' : 'Choisis ton pseudo : il apparaîtra dans le classement partagé avec toute la promo.')),
        body));
      dlg.classList.add('open');
      dlg._cancel = () => done(null);
      setTimeout(() => input.focus(), 50);
    });
  }

  function confirmDialog(msg, yes) {
    return new Promise((resolve) => {
      const dlg = $('dlg');
      const done = (v) => { dlg.classList.remove('open'); dlg.innerHTML = ''; resolve(v); };
      dlg.innerHTML = '';
      dlg.appendChild(h('div', { class: 'dlg-card' }, h('p', null, msg),
        h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => done(false) }, 'Annuler'),
          h('button', { class: 'btn danger', onclick: () => done(true) }, yes || 'Confirmer'))));
      dlg.classList.add('open');
      dlg._cancel = () => done(false);
    });
  }

  // ---------- Ship / équipement ----------
  function applyEquipped() {
    const e = NQ.store.profile.equipped, P = NQ.prog;
    Runner.setShip(P.byId(e.skin) || P.byId('cobalt'), P.byId(e.trail) || P.byId('bleu'));
  }
  function titleOf(p) {
    p = p || NQ.store.profile;
    const t = p.equipped.title && NQ.prog.byId(p.equipped.title);
    return t ? t.value : '';
  }

  // ---------- Menu principal ----------
  function showMenu() {
    const p = NQ.store.profile, pr = NQ.prog.progressInLevel(p.xp);
    const seen = (NQ.notions || []).filter((n) => { const e = p.mastery[n.id]; return e && e.ok + e.ko > 0; }).length;
    const menu = $('menu');
    menu.innerHTML = '';
    const chapBtns = [1, 2, 3, 4, 0].map((c) => h('button', {
      class: 'btn chap' + (c === 0 ? ' mix' : ''), onclick: () => H.startGame({ chapter: c, difficulty: p.difficulty, mode: 'normal' })
    }, h('b', null, c ? 'Chapitre ' + c : 'Mix'), h('small', null, CH_LABEL[c])));
    const desc = h('p', { class: 'diff-desc' }, DIFF_DESC[p.difficulty]);
    const diffBtns = DIFF_ORDER.map((d) => h('button', {
      class: 'btn seg' + (p.difficulty === d ? ' on' : ''), onclick: () => { p.difficulty = d; NQ.store.save(); showMenu(); }
    }, DIFF_LABEL[d]));
    menu.appendChild(h('div', { class: 'menu-inner' },
      h('h1', { class: 'logo' }, 'NEURO', h('span', null, 'QUEST')),
      h('p', { class: 'tag' }, 'Révise le Deep Learning en courant dans le tunnel'),
      h('div', { class: 'profile-card' },
        h('div', { class: 'name-row' },
          h('b', null, hasName() ? p.name : 'Joueur anonyme'), titleOf(p) ? h('em', null, ' · ' + titleOf(p)) : null,
          h('button', { class: 'btn small name-edit' + (hasName() && (!NQ.sync.available() || NQ.sync.isLinked()) ? '' : ' pulse'), onclick: () => askName({ title: NQ.sync.isLinked() ? '✏️ Changer de pseudo' : '☁ Sauvegarder ma progression', msg: NQ.sync.available() ? 'Pseudo + code à 4 chiffres : ta progression est sauvegardée en ligne et tu la retrouves sur n\'importe quel appareil.' : 'Ton pseudo apparaît dans le classement partagé.', later: 'Annuler' }).then(() => showMenu()) },
            !hasName() ? '✏️ Choisir mon pseudo' : NQ.sync.available() && !NQ.sync.isLinked() ? '☁ Sauvegarder en ligne' : '✏️ Modifier')),
        NQ.sync.available() ? h('small', { class: 'sync-line' }, NQ.sync.isLinked()
          ? (NQ.sync.status() === 'error' ? '⚠ Sauvegarde en ligne injoignable : progression gardée sur cet appareil' : '☁ Progression sauvegardée en ligne')
          : '📱 Progression enregistrée sur cet appareil seulement') : null,
        h('div', { class: 'xpbar' }, h('i', { style: 'width:' + pr.pct + '%' })),
        h('small', null, 'Palier ' + pr.level + '/' + NQ.prog.TIERS + (pr.max ? ' (max)' : ' · ' + pr.into + '/' + pr.need + ' XP') +
          ' · Collection : ' + seen + '/' + NQ.notions.length + ' notions · Record ' + p.stats.best)),
      h('button', { class: 'btn campaign-btn', onclick: () => UIViews.campaign() },
        h('b', null, '🗺 Campagne guidée'), h('small', null, 'Débutant : une notion à la fois, dans l\'ordre du cours, leçon puis questions')),
      h('h3', null, 'Jouer'), h('div', { class: 'chap-grid' }, chapBtns),
      h('h3', null, 'Difficulté'), h('div', { class: 'seg-row' }, diffBtns), desc,
      h('div', { class: 'menu-grid' },
        h('button', { class: 'btn boss', onclick: () => UIViews.bossSelect() }, '👹 Boss'),
        h('button', { class: 'btn', onclick: () => UIViews.mastery() }, '🧠 Carte de maîtrise'),
        h('button', { class: 'btn', onclick: () => UICodex.open({}) }, '📖 Codex'),
        h('button', { class: 'btn', onclick: () => UIViews.pass() }, '🎖 Pass de combat'),
        h('button', { class: 'btn', onclick: () => UIViews.leaderboard() }, '🏆 Classement'),
        h('button', { class: 'btn', onclick: () => UIViews.options() }, '⚙ Options')),
      h('p', { class: 'keys' }, '← → ou A/D (Q) : changer de couloir · H : indice · Espace : solution · ↑ ou W/Z : passer (maintenu : accélérer) · Échap : fermer')));
    menu.classList.add('open'); $('hud').hidden = true; $('pads').hidden = true;
  }
  function hideMenu() { $('menu').classList.remove('open'); }

  // ---------- HUD ----------
  function showHud(on) { $('hud').hidden = !on; $('pads').hidden = !on; if (!on) { setQuestion(null); hideFeedback(); } }
  function updateHud(s) {
    $('sc').textContent = 'Score ' + s.score;
    $('st').textContent = '🔥 ×' + s.mult;
    $('lv').textContent = (s.lives == null ? '∞' : '❤'.repeat(Math.max(0, s.lives)) + '🖤'.repeat(Math.max(0, s.maxLives - s.lives))) + (s.shield ? ' 🛡' : '');
    $('who').textContent = [s.tag, s.progress, s.rooms ? 'Salles : ' + s.rooms : '', s.title].filter(Boolean).join(' · ');
  }
  // data: {q, code, chips:[{text,color}]} ou null pour vider
  function setQuestion(d) {
    const cx = $('ctx'); cx.textContent = d && d.ctx ? d.ctx : ''; cx.style.display = d && d.ctx ? '' : 'none';
    $('q').textContent = '';
    if (d) $('q').appendChild(window.UILesson ? UILesson.glossify(d.q) : document.createTextNode(d.q));
    $('q').style.display = d ? '' : 'none';
    const code = $('qcode');
    code.textContent = d && d.code ? d.code : '';
    code.style.display = d && d.code ? '' : 'none';
    $('help').hidden = !d || !!(d && d.noHelp);
    $('hintb').disabled = false;
    const qh = $('qhint'); qh.innerHTML = ''; qh.hidden = true;
    const opts = $('opts'); opts.innerHTML = '';
    if (d && d.chips) d.chips.forEach((c, i) => opts.appendChild(h('button', {
      class: 'chip', style: 'border-color:' + c.color, onclick: () => Runner.setLane(i)
    }, c.text)));
  }
  // Indice sur une porte : texte sous la question, et pastille de réponse éliminée grisée
  function showHint(text, level) {
    const qh = $('qhint'); qh.hidden = false;
    qh.appendChild(h('span', null, (level === 1 ? '🔎 ' : '🔎🔎 '), window.UILesson ? UILesson.glossify(text) : text));
    if (level >= 2) $('hintb').disabled = true;
  }
  function dimChip(i) { const c = $('opts').children[i]; if (c) c.classList.add('out'); }
  function flash(ok) {
    const f = $('flash'); f.textContent = ok ? '✅' : '❌'; f.className = 'show ' + (ok ? 'ok' : 'ko');
    clearTimeout(flashTimer); flashTimer = setTimeout(() => { f.className = ''; }, 600);
  }

  // ---------- Feedback ----------
  // d: {ok, headline, lines:[{k,t}], solution:Node, why, whyNot, xp, extra:[str], item}
  function showFeedback(d) {
    return new Promise((resolve) => {
      fbResolve = resolve;
      const fb = $('fb'); fb.innerHTML = '';
      const parts = [h('div', { class: 'fb-title' }, d.headline)];
      (d.lines || []).forEach((l) => parts.push(h('p', { class: l.k || '' }, l.t)));
      if (d.solution) parts.push(d.solution);
      const gl = (t) => (window.UILesson ? UILesson.glossify(t) : t);
      if (d.plain) parts.push(h('p', { class: 'plain' }, h('b', null, '💬 En clair : '), gl(d.plain)));
      if (d.why) parts.push(h('p', { class: 'why' }, h('b', null, d.plain ? 'Plus précisément : ' : 'Explication : '), gl(d.why)));
      if (d.whyNot) parts.push(h('p', { class: 'whynot' }, h('b', null, 'Pourquoi les autres sont faux : '), gl(d.whyNot)));
      (d.extra || []).forEach((t) => parts.push(h('p', { class: 'extra' }, t)));
      const go = h('button', { class: 'btn primary', id: 'go', onclick: continueFeedback }, 'Continuer ▶ (↑)');
      const box = h('div', { class: 'fb-box ' + (d.ok ? 'ok' : 'ko') }, parts,
        h('div', { class: 'row' },
          d.item ? h('button', { class: 'btn', onclick: () => UICodex.open({ notionId: d.item.notions[0], resume: true }) }, '📖 Réviser dans le Codex') : null,
          go));
      fb.appendChild(box); fb.classList.add('open'); box.scrollTop = 0;
      fbGo = go;
      // Toucher ou faire défiler l'explication la fige aussi (équivalent d'Espace sur mobile)
      box.addEventListener('pointerdown', (e) => { if (!e.target.closest('button') && !e.target.closest('.term')) pauseFeedback(); });
      box.addEventListener('scroll', pauseFeedback, { passive: true });
      // Solution demandée (Espace) : pas de reprise automatique, l'élève lit à son rythme
      if (d.noAuto) pauseFeedback(); else startAutoContinue(go);
    });
  }
  // Reprise automatique : compte à rebours affiché sur le bouton, en pause tant qu'un écran
  // (Codex, dialogue) est ouvert ; le compte repart de zéro à la fermeture de cet écran.
  let autoTimer = null;
  function startAutoContinue(btn) {
    stopAutoContinue();
    const total = +NQ.store.profile.autoContinue || 0;
    if (!total) return;
    let left = total;
    const label = () => { btn.textContent = 'Continuer ▶ (↑ · ' + Math.ceil(left) + ' s)'; };
    label();
    autoTimer = setInterval(() => {
      if (!fbResolve) { stopAutoContinue(); return; }
      if (stack.length) { left = total; btn.textContent = 'Continuer ▶ (↑)'; return; } // en pause
      left -= 0.25; label();
      if (left <= 0) { stopAutoContinue(); continueFeedback(); }
    }, 250);
  }
  function stopAutoContinue() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  // Met le feedback en pause : plus de compte à rebours, seule ↑ (ou le bouton) fait passer à la suite
  let fbGo = null;
  function pauseFeedback() {
    stopAutoContinue();
    if (fbGo) fbGo.textContent = '⏸ En pause · Continuer ▶ (↑)';
    const box = document.querySelector('#fb .fb-box'); if (box) box.classList.add('paused');
  }
  function hideFeedback() { stopAutoContinue(); const fb = $('fb'); fb.classList.remove('open'); fb.innerHTML = ''; }
  function feedbackOpen() { return !!fbResolve && $('fb').classList.contains('open'); }
  function continueFeedback() {
    if (!fbResolve || stack.length) return false; // pas de reprise tant que le Codex est ouvert
    const r = fbResolve; fbResolve = null; hideFeedback(); r(); return true;
  }

  // ---------- Fin de partie ----------
  // r: {headline, win, score, xp, levelUp, unlocks:[reward], recap:[{item, ok}], full (explications pour tous), sub}
  function showGameOver(r) {
    hideFeedback(); showHud(false);
    const recap = r.recap.map((e) => h('details', { class: 'rec ' + (e.ok ? 'ok' : 'ko'), open: !e.ok && !r.full ? true : null },
      h('summary', null, (e.ok ? '✅ ' : '❌ ') + e.item.q),
      // Toujours une explication dépliable (ouverte d'office pour les erreurs, hors boss)
      h('div', { class: 'rec-body' },
        e.item.ok ? h('p', { class: 'ok' }, h('b', null, '✅ Bonne réponse : '), e.item.ok) : MiniGames.solutionNode(e.item),
        e.item.plain ? h('p', { class: 'plain' }, h('b', null, '💬 En clair : '), e.item.plain) : null,
        h('p', null, h('b', null, e.item.plain ? 'Plus précisément : ' : 'Explication : '), e.item.why),
        e.item.whyNot ? h('p', null, h('b', null, 'Pourquoi les autres sont faux : '), e.item.whyNot) : null,
        h('button', { class: 'btn small', onclick: () => UICodex.open({ notionId: e.item.notions[0], resume: true }) }, '📖 Codex'))));
    const unlocks = r.unlocks.length ? h('div', { class: 'unlocks' }, h('b', null, '🎁 Débloqué : '),
      r.unlocks.map((u) => h('span', { class: 'pill' }, u.name))) : null;
    const node = h('div', { class: 'frame over' },
      h('div', { class: 'frame-head' }, h('h2', null, r.headline)),
      h('div', { class: 'frame-body' },
        r.sub ? h('p', null, r.sub) : null,
        h('div', { class: 'big-stats' },
          r.noScore ? null : h('div', null, h('b', null, r.score), h('small', null, 'Score')),
          h('div', null, h('b', null, '+' + r.xp), h('small', null, 'XP')),
          h('div', null, h('b', null, r.recap.filter((e) => e.ok).length + '/' + r.recap.length), h('small', null, 'Bonnes réponses'))),
        r.levelUp ? h('p', { class: 'lvl' }, '⬆ Palier ' + r.levelUp + ' atteint !') : null,
        unlocks, h('h3', null, 'Récapitulatif'), h('div', { class: 'recap' }, recap),
        h('div', { class: 'row' },
          r.nextLabel && r.onNext ? h('button', { class: 'btn primary', id: 'over-next', onclick: () => { closeAll(); r.onNext(); } }, r.nextLabel) : null,
          r.campaignMap ? h('button', { class: 'btn', onclick: () => { closeAll(); H.menu(); UIViews.campaign(); } }, '🗺 Carte de campagne')
            : h('button', { class: 'btn primary', onclick: () => { closeAll(); H.replay(); } }, '↻ Rejouer'),
          h('button', { class: 'btn', onclick: () => { closeAll(); H.menu(); } }, 'Menu'))));
    openScreen(node, { closable: false });
  }

  function init(handlers) { H = handlers; }

  return {
    init, showMenu, hideMenu, showHud, updateHud, setQuestion, flash,
    showFeedback, hideFeedback, feedbackOpen, continueFeedback, pauseFeedback, showGameOver,
    openScreen, closeTop, closeAll, frame, showFrame, confirm: confirmDialog,
    applyEquipped, titleOf, CH_LABEL, DIFF_LABEL, DIFF_ORDER, showHint, dimChip,
    hasModal: () => stack.length > 0,
    cancelDialog() { const d = $('dlg'); if (d.classList.contains('open') && d._cancel) { d._cancel(); return true; } return false; },
    start(cfg) { return H.startGame(cfg); },
    askName, hasName,
    handlers: () => H
  };
})();

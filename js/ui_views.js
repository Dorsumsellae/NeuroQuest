// ui_views.js : vues secondaires (carte de maîtrise, pass de combat, classement, options, choix du boss).
window.UIViews = (function () {
  'use strict';
  const h = NQ.h;
  const CH_FICHE = { 1: '01', 2: '02', 3: '03', 4: '03' };
  const hex = (n) => '#' + ('000000' + n.toString(16)).slice(-6);
  const closeModals = () => { while (UI.hasModal()) UI.closeTop(); };

  // ---------- Carte de maîtrise ----------
  function mastery() {
    const body = h('div', { class: 'mastery' });
    [1, 2, 3, 4].forEach((ch) => {
      const list = NQ.notions.filter((n) => n.ch === ch);
      const avg = list.length ? Math.round(list.reduce((a, n) => a + NQ.masteryOf(n.id).m, 0) / list.length) : 0;
      body.appendChild(h('h3', null, 'Chapitre ' + ch + ' · ' + UI.CH_LABEL[ch] + ' (' + avg + '%)'));
      list.forEach((n) => {
        const e = NQ.masteryOf(n.id), st = NQ.masteryState(n.id);
        body.appendChild(h('div', { class: 'm-row' },
          h('div', { class: 'm-label' }, n.label),
          h('div', { class: 'mbar' }, h('i', { class: st === 'Maîtrisée' ? 'gold' : '', style: 'width:' + Math.round(e.m) + '%' })),
          h('small', { class: 'm-state s-' + st }, st + ' · ' + Math.round(e.m)),
          h('div', { class: 'm-btns' },
            UILesson.hasLesson(n.id) ? h('button', { class: 'btn small', title: 'Revoir la leçon', onclick: () => UILesson.show(n.id, { replay: true }) }, '📘') : null,
            h('button', { class: 'btn small', title: 'Lire la fiche', onclick: () => UICodex.open({ notionId: n.id }) }, '📖'),
            h('button', { class: 'btn small primary', onclick: () => { closeModals(); UI.handlers().startFlash(n.id); } }, 'M\'entraîner'))));
      });
    });
    UI.showFrame('🧠 Carte de maîtrise', body);
  }

  // ---------- Pass de combat ----------
  function equip(r) {
    const p = NQ.store.profile;
    if (!NQ.prog.canEquip(r, p)) return;
    if (r.type === 'skin') p.equipped.skin = r.id;
    else if (r.type === 'trail') p.equipped.trail = r.id;
    else p.equipped.title = r.id === 'titre-aucun' ? '' : r.id;
    NQ.store.save(); UI.applyEquipped();
  }
  function isEquipped(r, p) {
    const e = p.equipped;
    return (r.type === 'skin' && e.skin === r.id) || (r.type === 'trail' && e.trail === r.id) ||
      (r.type === 'title' && (e.title || 'titre-aucun') === r.id);
  }
  // Un clic sur une récompense l'affiche dans l'aperçu 3D (même verrouillée) et l'équipe si elle est débloquée.
  function rewardCell(r, p, unlockedIds, lockedLabel, rerender, preview) {
    const un = unlockedIds[r.id], eq = isEquipped(r, p);
    const icon = r.type === 'skin' ? '🚀' : r.type === 'trail' ? '✨' : '🏷';
    const sw = r.type === 'title' ? null : h('span', {
      class: 'swatch ' + (r.rainbow ? 'rainbow' : ''), style: r.rainbow ? '' : 'background:' + hex(r.color)
    });
    return h('button', {
      class: 'reward' + (un ? ' un' : ' lock') + (eq ? ' eq' : ''), 'aria-disabled': un ? null : 'true',
      onclick: () => { if (preview) preview(r); if (un) { equip(r); rerender(); } }
    }, h('small', null, r.tier ? 'Palier ' + r.tier : r.track === 'boss' ? 'Boss' : 'Base'), h('span', { class: 'ic' }, icon), sw,
      h('b', null, r.name), h('em', null, eq ? 'ÉQUIPÉ' : un ? 'Équiper' : lockedLabel(r)));
  }

  // ---------- Aperçu 3D du vaisseau (pass) ----------
  // Petit rendu three.js indépendant du runner : le skin sélectionné tourne au-dessus d'un anneau
  // de la couleur du sillage. Détruit à la fermeture du pass (contexte WebGL libéré).
  function shipPreview() {
    const canvas = h('canvas', { class: 'pv-canvas', width: '260', height: '260' });
    const label = h('div', { class: 'pv-label' });
    const box = h('div', { class: 'pv-box' }, canvas, label);
    let r = null, scene, cam, mesh = null, ring = null, skin = null, raf = 0, t0 = performance.now();
    try {
      r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); r.setSize(260, 260, false);
      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50); cam.position.set(0, 1.6, 4.6); cam.lookAt(0, 0.2, 0);
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const dl = new THREE.DirectionalLight(0xffffff, 1); dl.position.set(3, 5, 4); scene.add(dl);
      ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.05, 8, 48), new THREE.MeshBasicMaterial({ color: 0x33aaff }));
      ring.rotation.x = Math.PI / 2; ring.position.y = -0.9; scene.add(ring);
    } catch (e) { r = null; box.textContent = 'Aperçu 3D indisponible'; }
    let trail = null;
    function show(sk, trl) {
      if (!r) return;
      if (sk && sk !== skin) {
        skin = sk;
        if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
        mesh = Runner.buildShip(sk); mesh.scale.setScalar(1.25); scene.add(mesh);
      }
      if (trl) { trail = trl; ring.material.color.set(trl.rainbow ? 0xffffff : trl.color); }
      const t = UI.titleOf();
      label.textContent = (skin ? skin.name : '') + (trail ? ' · ' + trail.name : '') + (t ? ' · ' + t : '');
    }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!r || !mesh) return;
      const t = (now - t0) / 1000;
      mesh.rotation.y = t * 1.2; mesh.position.y = Math.sin(t * 2) * 0.08;
      if (mesh.geometry.type === 'ConeGeometry') mesh.rotation.x = -Math.PI / 2 + Math.sin(t) * 0.15;
      if (skin && skin.rainbow) mesh.material.color.setHSL((t * 0.3) % 1, 1, 0.6);
      ring.rotation.z = t * 0.5;
      r.render(scene, cam);
    }
    raf = requestAnimationFrame(loop);
    function dispose() { cancelAnimationFrame(raf); if (r) { r.dispose(); r.forceContextLoss && r.forceContextLoss(); } }
    return { box, show, dispose };
  }

  function pass() {
    const body = h('div', { class: 'pass' });
    const P0 = NQ.prog, e0 = NQ.store.profile.equipped;
    const pv = shipPreview();
    let curSkin = P0.byId(e0.skin) || P0.byId('cobalt'), curTrail = P0.byId(e0.trail) || P0.byId('bleu');
    pv.show(curSkin, curTrail);
    const preview = (r) => {
      if (r.type === 'skin') curSkin = r; else if (r.type === 'trail') curTrail = r;
      pv.show(curSkin, curTrail);
    };
    const tracks = h('div');
    body.appendChild(pv.box); body.appendChild(tracks);
    function render() {
      const p = NQ.store.profile, pr = NQ.prog.progressInLevel(p.xp), P = NQ.prog;
      const ids = {}; P.unlockedRewards(p).forEach((r) => { ids[r.id] = true; });
      tracks.innerHTML = '';
      const body = tracks; // les sections ci-dessous s'ajoutent sous l'aperçu
      body.appendChild(h('div', { class: 'pass-head' },
        h('div', null, h('b', null, 'Saison 1 : Fondamentaux'), h('small', null, ' · palier ' + pr.level + '/' + P.TIERS + ' · ' + p.xp + ' XP')),
        h('div', { class: 'xpbar' }, h('i', { style: 'width:' + pr.pct + '%' })),
        h('small', null, pr.max ? 'Tous les paliers sont atteints.' : pr.into + '/' + pr.need + ' XP avant le palier ' + (pr.level + 1))));
      const bossList = [1, 2, 3, 4].map((c) => P.BOSS_SKINS[c]);
      const lockTier = (r) => 'Palier ' + r.tier;
      body.appendChild(h('h3', null, 'Base et skins de boss'));
      body.appendChild(h('div', { class: 'track' }, P.BASE.concat(bossList).map((r) =>
        rewardCell(r, p, ids, (x) => x.boss ? 'Bats le boss ' + x.boss : '', render, preview))));
      body.appendChild(h('h3', null, 'Piste gratuite'));
      body.appendChild(h('div', { class: 'track' }, P.FREE.filter(Boolean).map((r) => rewardCell(r, p, ids, lockTier, render, preview))));
      body.appendChild(h('h3', null, 'Piste Élite ' + (p.elite ? '(débloquée)' : '🔒 (bats un boss pour la débloquer)')));
      body.appendChild(h('div', { class: 'track' + (p.elite ? '' : ' dim') }, P.ELITE.filter(Boolean).map((r) =>
        rewardCell(r, p, ids, (x) => p.elite ? lockTier(x) : 'Élite', render, preview))));
      body.appendChild(h('p', { class: 'hint' }, 'Touche une récompense pour la voir dans l\'aperçu ; si elle est débloquée, elle est équipée.'));
    }
    render();
    UI.showFrame('🎖 Pass de combat', body, { onClose: pv.dispose });
  }

  // ---------- Classement ----------
  function leaderboard() {
    let diff = NQ.store.profile.difficulty;
    const body = h('div', { class: 'lb' });
    let seq = 0;
    function render() {
      const my = ++seq;
      body.innerHTML = '';
      body.appendChild(h('div', { class: 'seg-row' }, UI.DIFF_ORDER.map((d) =>
        h('button', { class: 'btn seg' + (d === diff ? ' on' : ''), onclick: () => { diff = d; render(); } }, UI.DIFF_LABEL[d]))));
      const status = h('p', { class: 'hint' }, NQ.leaderboard.isShared() ? 'Classement partagé : chargement…' : 'Classement local (ce navigateur). Voir docs/FIREBASE.md pour un classement de promo.');
      body.appendChild(status);
      NQ.leaderboard.top(20, diff).then((rows) => {
        if (my !== seq) return; // une autre difficulté a été choisie entre-temps
        if (NQ.leaderboard.isShared()) status.textContent = rows.localFallback ? 'Classement partagé injoignable : affichage local.' : 'Classement partagé (tous les joueurs).';
        if (!rows.length) { body.appendChild(h('p', { class: 'hint' }, 'Aucun score pour l\'instant : lance une partie !')); return; }
        body.appendChild(h('table', { class: 'lb-table' },
          h('tr', null, ['#', 'Joueur', 'Score', 'Chap.', 'Date'].map((t) => h('th', null, t))),
          rows.map((e, i) => h('tr', null, h('td', null, String(i + 1)), h('td', null, e.name), h('td', null, String(e.score)),
            h('td', null, e.chapter ? String(e.chapter) : 'Mix'), h('td', null, e.date)))));
      });
    }
    render();
    UI.showFrame('🏆 Classement', body);
  }

  // ---------- Options ----------
  function options() {
    const p = NQ.store.profile;
    const name = h('input', { type: 'text', maxlength: 20, value: p.name, class: 'txt' });
    name.addEventListener('change', () => { p.name = name.value.trim() || 'Joueur'; NQ.store.save(); });
    const exp = h('textarea', { class: 'io', readonly: true, rows: 5 });
    const imp = h('textarea', { class: 'io', rows: 5, placeholder: 'Colle ici une sauvegarde JSON…' });
    const msg = h('p', { class: 'hint' });
    exp.value = NQ.store.exportJSON();
    const copy = () => {
      exp.select();
      const done = () => { msg.textContent = 'Sauvegarde copiée.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(exp.value).then(done, () => { document.execCommand('copy'); done(); });
      else { try { document.execCommand('copy'); } catch (e) { /* sélection manuelle */ } done(); }
    };
    const doImport = () => {
      try { NQ.store.importJSON(imp.value); msg.textContent = 'Import réussi.'; UI.applyEquipped(); closeModals(); UI.showMenu(); }
      catch (e) { msg.textContent = 'Import impossible : JSON invalide.'; }
    };
    const doReset = () => UI.confirm('Effacer toute la progression (XP, maîtrise, boss) ? Cette action est définitive.', 'Tout effacer').then((yes) => {
      if (!yes) return;
      NQ.store.reset(); UI.applyEquipped(); closeModals(); UI.showMenu();
    });
    const mute = h('button', { class: 'btn seg' + (p.muted ? '' : ' on'), onclick: () => {
      p.muted = !p.muted; NQ.store.save(); mute.textContent = p.muted ? '🔇 Effets coupés' : '🔊 Effets activés'; mute.classList.toggle('on', !p.muted);
    } }, p.muted ? '🔇 Effets coupés' : '🔊 Effets activés');
    const musicBtn = h('button', { class: 'btn seg' + (p.music ? ' on' : ''), onclick: () => {
      p.music = !p.music; NQ.store.save(); NQ.audio.music.toggle(p.music);
      musicBtn.textContent = p.music ? '🎵 Musique activée' : '🎵 Musique coupée'; musicBtn.classList.toggle('on', p.music);
    } }, p.music ? '🎵 Musique activée' : '🎵 Musique coupée');
    const vibBtn = h('button', { class: 'btn seg' + (p.vibrate !== false ? ' on' : ''), onclick: () => {
      p.vibrate = p.vibrate === false; NQ.store.save(); if (p.vibrate) NQ.audio.vibrate([80]);
      vibBtn.textContent = p.vibrate ? '📳 Vibration activée' : '📳 Vibration coupée'; vibBtn.classList.toggle('on', p.vibrate);
    } }, p.vibrate !== false ? '📳 Vibration activée' : '📳 Vibration coupée');
    const soundRow = h('div', { class: 'seg-row' }, mute, musicBtn, vibBtn);
    const AUTO = [[0, 'Désactivée'], [5, '5 s'], [10, '10 s']];
    const autoRow = h('div', { class: 'seg-row' });
    const renderAuto = () => {
      autoRow.innerHTML = '';
      AUTO.forEach(([v, lbl]) => autoRow.appendChild(h('button', {
        class: 'btn seg' + ((+p.autoContinue || 0) === v ? ' on' : ''),
        onclick: () => { p.autoContinue = v; NQ.store.save(); renderAuto(); }
      }, lbl)));
    };
    renderAuto();
    UI.showFrame('⚙ Options', h('div', { class: 'opts' },
      h('label', null, 'Nom du joueur'), name,
      h('h3', null, 'Son et sensations'),
      h('p', { class: 'hint' }, 'Musique d\'ambiance synthétisée (aucun fichier), effets sonores, et vibration du téléphone en cas d\'erreur.'), soundRow,
      h('h3', null, 'Reprise automatique après une réponse'),
      h('p', { class: 'hint' }, 'Le jeu continue tout seul après ce délai (ou dès que tu appuies sur Espace). En pause tant que le Codex est ouvert.'), autoRow,
      h('h3', null, 'Exporter la progression'), exp, h('button', { class: 'btn', onclick: copy }, 'Copier'),
      h('h3', null, 'Importer une progression'), imp, h('button', { class: 'btn', onclick: doImport }, 'Importer'), msg,
      h('h3', null, 'Zone dangereuse'), h('button', { class: 'btn danger', onclick: doReset }, 'Réinitialiser la progression')));
  }

  // ---------- Campagne guidée ----------
  // Une étape par notion, dans l'ordre du cours. Chaque chapitre progresse indépendamment ;
  // une étape s'ouvre quand la précédente est validée. Les étapes validées restent rejouables.
  function campaign() {
    const body = h('div', { class: 'camp' }, h('p', { class: 'hint' },
      'Chaque étape = la leçon d\'une notion, puis jusqu'à 3 questions faciles dessus (au plus 1 erreur sur 3 pour valider, aucune s'il y en a moins). Pas de vies, indices et solution autorisés. Quand un chapitre est terminé, son boss vous attend.'));
    const start = (id) => { closeModals(); UI.handlers().startGame({ mode: 'campaign', notionFilter: id }); };
    [1, 2, 3, 4].forEach((c) => {
      const steps = NQ.campaign.steps(c), cur = NQ.campaign.current(c), pr = NQ.campaign.progress(c);
      const pct = Math.round(100 * pr.done / pr.total);
      const list = h('ol', { class: 'camp-steps' });
      steps.forEach((id) => {
        const n = NQ.notionsById[id], done = NQ.campaign.done(id), isCur = id === cur;
        const open = done || isCur;
        list.appendChild(h('li', { class: 'camp-step' + (done ? ' done' : '') + (isCur ? ' cur' : '') + (open ? '' : ' lock') },
          h('button', { class: 'btn small' + (isCur ? ' primary' : ''), disabled: !open, onclick: () => start(id) },
            done ? '✓' : isCur ? '▶' : '🔒'),
          h('span', null, n.label)));
      });
      const head = h('div', { class: 'camp-head' },
        h('div', null, h('b', null, 'Chapitre ' + c + ' · ' + UI.CH_LABEL[c]), h('small', null, ' ' + pr.done + '/' + pr.total + ' étapes')),
        h('div', { class: 'xpbar' }, h('i', { style: 'width:' + pct + '%' })),
        cur ? h('button', { class: 'btn primary', onclick: () => start(cur) }, pr.done ? 'Continuer ▶' : 'Commencer ▶')
          : h('button', { class: 'btn boss', onclick: () => { closeModals(); UI.handlers().startGame({ mode: 'boss', chapter: c, difficulty: 'expert' }); } }, '👹 Boss du chapitre'));
      const det = h('details', { class: 'camp-ch', open: (cur && pr.done > 0) || (c === 1 && !pr.done) ? true : null }, h('summary', null, head), list);
      body.appendChild(det);
    });
    UI.showFrame('🗺 Campagne guidée', body);
  }

  // ---------- Choix du boss ----------
  function bossSelect() {
    const p = NQ.store.profile, now = Date.now();
    const body = h('div', { class: 'boss-sel' }, h('p', { class: 'hint' },
      '10 épreuves mixtes, vitesse Expert, 1 seule vie, pas d\'explication avant le bilan. Lis la fiche du chapitre dans les 30 minutes avant le combat pour obtenir un 🛡 bouclier (une erreur pardonnée). Victoire : skin unique, +200 XP, piste Élite.'));
    [1, 2, 3, 4].forEach((c) => {
      const shield = p.codexRead[c] && now - p.codexRead[c] < 30 * 60000;
      body.appendChild(h('div', { class: 'boss-row' },
        h('div', null, h('b', null, 'Boss du chapitre ' + c + ' · ' + UI.CH_LABEL[c]),
          h('small', null, (p.bosses[c] ? '✅ Vaincu · ' : '') + 'Skin : ' + NQ.prog.BOSS_SKINS[c].name + (shield ? ' · 🛡 bouclier actif' : ''))),
        h('div', { class: 'row' },
          h('button', { class: 'btn small', onclick: () => UICodex.open({ fiche: CH_FICHE[c] }) }, '📖 Lire la fiche'),
          h('button', { class: 'btn boss', onclick: () => { closeModals(); UI.start({ chapter: c, difficulty: 'expert', mode: 'boss' }); } }, 'Combattre'))));
    });
    UI.showFrame('👹 Boss de chapitre', body);
  }

  return { mastery, pass, leaderboard, options, bossSelect, campaign };
})();

// main.js : contrôleur de partie (flux des épreuves, jugement, score, XP, boss, flash) et entrées clavier / tactile.
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const h = NQ.h;
  const DIFF = {
    // Niveau 0 : uniquement des questions de compréhension (type choix, diff ≤ 2), pas de salle,
    // pas de vies, session de 15 questions à vitesse lente.
    // Une porte part à 120 unités : temps d'arrivée = 120 / vitesse.
    // Découverte 10 → 8 s, Facile 8,6 → 6 s, Normal 7 → 4 s, Expert 5,5 → 3 s.
    decouverte: { lives: null, speed: 12, inc: 0.3, max: 15, roomTimer: 0, conceptOnly: true, len: 15 },
    facile: { lives: 5, speed: 14, inc: 0.4, max: 20, roomTimer: 0 },
    normal: { lives: 3, speed: 17, inc: 0.7, max: 30, roomTimer: 45 },
    expert: { lives: 2, speed: 22, inc: 1.0, max: 40, roomTimer: 25 }
  };
  const DIFF_BONUS = { decouverte: 0.5, facile: 1, normal: 1.25, expert: 1.5 };
  const isConcept = (it) => it.type === 'choix' && it.diff <= 2 && !it.code;
  const COLS = ['#33ccff', '#ff44cc', '#ffd23f'];
  const BOSS_LEN = 10, FLASH_LEN = 5, SHIELD_WINDOW = 30 * 60000, IDLE_SPEED = 7;

  let S = null;        // état de la partie en cours (null = menu)
  let lastCfg = null;  // pour "Rejouer"
  let gameSeq = 0;     // invalide les callbacks asynchrones d'une partie abandonnée
  let paused = false;
  let boost = false;      // accélération effective (uniquement pendant l'approche d'une porte)
  let boostHeld = false;  // touche ↑ / W / Z ou bouton ⏩ maintenu
  const BOOST = 2.5;      // multiplicateur de vitesse pendant l'accélération
  function setBoost(on) {
    on = !!on && !!S && S.state === 'gate';
    if (on === boost) return;
    boost = on;
    document.body.classList.toggle('boost', boost);
    const b = $('bb'); if (b) b.classList.toggle('on', boost);
    Runner.setBoostFx(boost);
    NQ.audio.sfx.boost(boost);
  }

  const prof = () => NQ.store.profile;

  // ---------- Démarrage ----------
  function abortCurrent() {
    MiniGames.abort(); Runner.clearGate(); UI.hideFeedback(); UI.closeAll(); S = null; boostHeld = false; setBoost(false);
  }
  function effDifficulty(cfg) { return cfg.mode === 'boss' ? 'expert' : cfg.difficulty; }

  function buildBossQueue(cfg) {
    const all = NQ.pool({ ch: cfg.chapter });
    const rooms = all.filter(NQ.isRoom), gates = all.filter((i) => !NQ.isRoom(i));
    const picked = [];
    const take = (pool, n) => {
      for (let i = 0; i < n && pool.length; i++) {
        const it = NQ.pick(pool.filter((x) => picked.indexOf(x) < 0), { difficulty: 'expert' });
        if (it) picked.push(it);
      }
    };
    take(rooms, Math.min(3, rooms.length));
    take(gates, BOSS_LEN - picked.length);
    if (picked.length < BOSS_LEN) take(all, BOSS_LEN - picked.length);
    return NQ.shuffle(picked);
  }

  function startGame(c) {
    abortCurrent();
    const p = prof();
    const cfg = Object.assign({ chapter: 0, difficulty: p.difficulty, mode: 'normal', notionFilter: null }, c);
    if (cfg.mode === 'boss' && !cfg.chapter) cfg.chapter = 1;
    lastCfg = cfg;
    const ed = effDifficulty(cfg), D = DIFF[ed];
    const recent = p.codexRead[cfg.chapter] && Date.now() - p.codexRead[cfg.chapter] < SHIELD_WINDOW;
    const lives = cfg.mode === 'flash' ? null : cfg.mode === 'boss' ? 1 : D.lives;
    let all = cfg.mode === 'flash' ? [] : NQ.pool({ ch: cfg.chapter });
    if (D.conceptOnly) all = all.filter(isConcept);
    S = {
      id: ++gameSeq, cfg, D, ed, state: 'idle', score: 0, streak: 0, lives, maxLives: lives,
      shield: cfg.mode === 'boss' && recent ? 1 : 0, speed: D.speed, n: 0, rooms: 0, sinceRoom: 0, owedRoom: false,
      recent: [], recap: [], xp: 0, answered: 0, end: null, cur: null, okLane: 0, answers: [],
      pool: all, roomPool: all.filter(NQ.isRoom), gatePool: all.filter((i) => !NQ.isRoom(i)),
      queue: cfg.mode === 'boss' ? buildBossQueue(cfg) : null,
      unlockedBefore: NQ.prog.unlockedRewards(p).map((r) => r.id), lvl: NQ.prog.levelFor(p.xp)
    };
    if (cfg.mode === 'flash') {
      S.gatePool = NQ.pool({ notion: cfg.notionFilter, types: NQ.GATE_TYPES });
      if (!S.gatePool.length) S.gatePool = NQ.pool({ notion: cfg.notionFilter });
    }
    if (!S.pool.length && !S.gatePool.length && !(S.queue && S.queue.length)) { S = null; return; }
    UI.hideMenu(); UI.showHud(true);
    Runner.setLane(1); Runner.setSpeed(S.speed);
    refreshHud(); next();
  }
  function startFlash(notionId) { startGame({ chapter: 0, mode: 'flash', notionFilter: notionId, difficulty: prof().difficulty }); }

  // ---------- HUD ----------
  function refreshHud() {
    const c = S.cfg;
    const tag = c.mode === 'boss' ? '👹 Boss ' + c.chapter
      : c.mode === 'flash' ? '🎯 ' + ((NQ.notionsById[c.notionFilter] || {}).label || 'Entraînement').slice(0, 28)
        : UI.CH_LABEL[c.chapter] + ' · ' + (UI.DIFF_LABEL[c.difficulty] || c.difficulty);
    const total = c.mode === 'boss' ? BOSS_LEN : c.mode === 'flash' ? FLASH_LEN : (S.D.len || 0);
    UI.updateHud({
      score: S.score, mult: NQ.prog.streakMult(S.streak), lives: S.lives, maxLives: S.maxLives, shield: S.shield,
      title: UI.titleOf(), tag, rooms: c.mode === 'normal' ? S.rooms : 0, progress: total ? Math.min(S.answered + 1, total) + '/' + total : ''
    });
  }

  // ---------- Choix de l'épreuve suivante ----------
  function nextItem() {
    const c = S.cfg, opt = { difficulty: S.ed, avoid: S.recent };
    S.n++;
    if (S.queue) return S.queue[S.n - 1];
    if (c.mode === 'flash') return NQ.pick(S.gatePool, opt);
    if (S.n % 4 === 0) S.owedRoom = true;
    if (S.owedRoom && S.sinceRoom >= 2 && S.roomPool.length) { S.owedRoom = false; return NQ.pick(S.roomPool, opt); }
    let it = NQ.pick(S.pool, opt);
    if (NQ.isRoom(it) && (S.sinceRoom < 2) && S.gatePool.length) it = NQ.pick(S.gatePool, opt);
    return it;
  }

  function next() {
    if (!S) return;
    const item = nextItem();
    S.cur = item; S.recent.push(item.id);
    // Pas de répétition dans une session tant que le pool le permet
    const cap = Math.max(4, (S.cfg.mode === 'flash' ? S.gatePool.length : S.pool.length) - 1);
    if (S.recent.length > cap) S.recent.shift();
    refreshHud();
    if (NQ.isRoom(item)) { S.sinceRoom = 0; startRoom(item); } else { S.sinceRoom++; startGate(item); }
  }

  function startGate(item) {
    const answers = NQ.shuffle([{ t: item.ok, ok: true }, { t: item.ko[0] }, { t: item.ko[1] }]);
    S.answers = answers; S.okLane = answers.findIndex((a) => a.ok); S.state = 'gate';
    Runner.spawnGate(answers.map((a) => a.t), COLS); Runner.setSpeed(S.speed);
    UI.setQuestion({ q: item.q, ctx: item.ctx, code: item.code, chips: answers.map((a, i) => ({ text: a.t, color: COLS[i] })) });
  }

  function startRoom(item) {
    const id = S.id;
    S.state = 'room'; S.rooms++;
    UI.setQuestion(null); Runner.setSpeed(S.speed * 0.5); refreshHud();
    const timer = S.cfg.mode === 'flash' ? 0 : S.D.roomTimer;
    MiniGames.run(item, { timerSeconds: timer }).then((res) => {
      if (!S || S.id !== id || res.aborted) return;
      resolveItem(item, res.ok, { kind: 'room', timeout: res.timeout });
    });
  }

  // ---------- Jugement ----------
  function judgeGate(lane) {
    const ok = lane === S.okLane;
    resolveItem(S.cur, ok, { kind: 'gate', chosen: S.answers[lane].t });
  }

  function checkEnd() {
    const c = S.cfg;
    if (S.lives != null && S.lives <= 0) return { win: false };
    if (c.mode === 'boss' && S.answered >= BOSS_LEN) return { win: true };
    if (c.mode === 'flash' && S.answered >= FLASH_LEN) return { win: true };
    if (c.mode === 'normal' && S.D.len && S.answered >= S.D.len) return { win: true };
    return null;
  }

  function resolveItem(item, ok, info) {
    const p = prof(), room = info.kind === 'room', id = S.id;
    S.state = 'fb';
    let gainXp = 0, shieldUsed = false;
    if (ok) {
      S.streak++;
      const mult = NQ.prog.streakMult(S.streak);
      S.score += Math.round(100 * mult * DIFF_BONUS[S.ed] * (room ? 2 : 1));
      gainXp = NQ.prog.xpFor({ kind: room ? 'room' : 'gate', diff: item.diff, difficulty: S.ed, streak: S.streak });
      p.xp += gainXp; S.xp += gainXp;
      if (!room) S.speed = Math.min(S.speed + S.D.inc, S.D.max);
      NQ.sfx.good(mult);
    } else {
      S.streak = 0;
      if (S.cfg.mode !== 'flash') {
        if (S.shield > 0) { S.shield--; shieldUsed = true; } else if (S.lives != null) S.lives--;
      }
      Runner.shake(0.6); NQ.sfx.bad();
    }
    NQ.applyResult(item, ok); // sauvegarde incluse
    S.answered++; S.recap.push({ item, ok });
    S.end = checkEnd();
    refreshHud();

    if (S.cfg.mode === 'boss') { // pas de feedback : seulement un éclair
      UI.flash(ok);
      setTimeout(() => { if (S && S.id === id) afterItem(); }, 750);
      return;
    }
    UI.showFeedback(buildFeedback(item, ok, info, gainXp, shieldUsed)).then(() => { if (S && S.id === id) afterItem(); });
  }

  function buildFeedback(item, ok, info, gainXp, shieldUsed) {
    const lines = [], extra = [];
    if (info.kind === 'gate') {
      if (ok) lines.push({ k: 'ok', t: '✅ Bonne réponse : « ' + item.ok + ' »' });
      else {
        lines.push({ k: 'ko', t: '❌ Tu as pris : « ' + info.chosen + ' »' });
        lines.push({ k: 'ok', t: '✅ Bonne réponse : « ' + item.ok + ' »' });
      }
    } else if (info.timeout) lines.push({ k: 'ko', t: '⏱ Temps écoulé !' });
    if (gainXp) extra.push('+' + gainXp + ' XP');
    if (shieldUsed) extra.push('🛡 Le bouclier a encaissé l\'erreur.');
    const lvl = NQ.prog.levelFor(prof().xp);
    if (lvl > S.lvl) { extra.push('⬆ Palier ' + lvl + ' atteint ! Récompense dans le Pass de combat.'); S.lvl = lvl; }
    return {
      ok, headline: ok ? '✅ Juste !' : '❌ Raté', lines, item, extra, why: item.why, whyNot: item.whyNot,
      solution: info.kind === 'room' ? MiniGames.solutionNode(item) : null
    };
  }

  function afterItem() {
    if (S.end) finish(S.end.win); else next();
  }

  // ---------- Fin de partie ----------
  function finish(win) {
    const p = prof(), c = S.cfg;
    S.state = 'end';
    if (c.mode === 'boss' && win) {
      p.bosses[c.chapter] = true; p.elite = true; p.xp += 200; S.xp += 200;
    }
    p.stats.games++;
    if (c.mode !== 'flash') {
      p.stats.best = Math.max(p.stats.best, S.score);
      NQ.leaderboard.submit({ name: p.name, score: S.score, difficulty: S.ed, chapter: c.chapter, date: new Date().toISOString().slice(0, 10) });
    }
    NQ.store.save();
    const before = {}; S.unlockedBefore.forEach((i) => { before[i] = true; });
    const unlocks = NQ.prog.unlockedRewards(p).filter((r) => !before[r.id]);
    const lvlNow = NQ.prog.levelFor(p.xp), startLvl = NQ.prog.levelFor(p.xp - S.xp);
    Runner.clearGate(); Runner.setSpeed(IDLE_SPEED); UI.setQuestion(null);
    const res = {
      headline: c.mode === 'boss' ? (win ? '👹 Boss vaincu !' : '💀 Le boss résiste') : c.mode === 'flash' ? '🎯 Entraînement terminé'
        : S.D.conceptOnly ? '🌱 Session Découverte terminée' : 'Partie terminée',
      sub: c.mode === 'boss' ? (win ? 'Skin « ' + NQ.prog.BOSS_SKINS[c.chapter].name + ' » et piste Élite débloqués (+200 XP).' : 'Relis les explications ci-dessous et retente.') : '',
      score: S.score, xp: S.xp, noScore: c.mode === 'flash', levelUp: lvlNow > startLvl ? lvlNow : 0,
      unlocks, recap: S.recap, full: c.mode === 'boss'
    };
    UI.showGameOver(res);
  }

  function quitToMenu() {
    abortCurrent(); Runner.setSpeed(IDLE_SPEED); UI.showMenu();
  }

  // ---------- Entrées ----------
  function onKey(e) {
    const t = e.target && e.target.tagName;
    if (e.key === 'Escape') { if (!UI.cancelDialog()) UI.closeTop(); return; }
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    if (UI.hasModal() || MiniGames.isOpen()) return;
    if (e.key === ' ' || e.key === 'Enter') {
      if (UI.feedbackOpen()) { e.preventDefault(); UI.continueFeedback(); }
      return;
    }
    if (!S) return;
    if (['ArrowLeft', 'a', 'A', 'q', 'Q'].indexOf(e.key) >= 0) Runner.moveLane(-1);
    else if (['ArrowRight', 'd', 'D'].indexOf(e.key) >= 0) Runner.moveLane(1);
    else if (isBoostKey(e.key)) { e.preventDefault(); boostHeld = true; }
  }
  const isBoostKey = (k) => ['ArrowUp', 'w', 'W', 'z', 'Z'].indexOf(k) >= 0;
  function bindInputs() {
    // Déblocage de l'audio (contexte créé / repris) au premier geste utilisateur
    const unlock = () => { NQ.audio.unlock(); };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', (e) => { if (isBoostKey(e.key)) boostHeld = false; });
    window.addEventListener('blur', () => { boostHeld = false; });
    const move = (d) => { if (S) Runner.moveLane(d); };
    $('bl').addEventListener('pointerdown', (e) => { e.preventDefault(); move(-1); });
    $('br').addEventListener('pointerdown', (e) => { e.preventDefault(); move(1); });
    // Bouton ⏩ : accélère tant qu'il est maintenu
    const bb = $('bb');
    bb.addEventListener('pointerdown', (e) => { e.preventDefault(); boostHeld = true; });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => bb.addEventListener(t, () => { boostHeld = false; }));
    bb.addEventListener('contextmenu', (e) => e.preventDefault());
    let tx = null;
    const stage = $('stage');
    stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (tx === null) return;
      const d = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(d) > 30) move(d > 0 ? 1 : -1);
    });
    $('quit').addEventListener('click', () => {
      paused = true;
      UI.confirm('Quitter la partie en cours ?', 'Quitter').then((yes) => { paused = false; if (yes) quitToMenu(); });
    });
  }

  // ---------- Boucle ----------
  let lastT = performance.now();
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
    // L'accélération ne s'applique que pendant l'approche d'une porte (pas en salle ni en feedback)
    setBoost(boostHeld); // s'engage dès qu'une porte approche si la touche est maintenue, se coupe sinon
    if (S && S.state === 'gate') Runner.setSpeed(S.speed * (boost ? BOOST : 1));
    else if (S && S.state === 'fb') Runner.setSpeed(S.speed);
    const events = Runner.update(paused ? 0 : dt);
    if (S && S.state === 'gate') events.forEach((ev) => { if (ev.type === 'gate' && S.state === 'gate') judgeGate(ev.lane); });
  }

  // ---------- Initialisation ----------
  function init() {
    Runner.init($('stage'));
    UI.init({ startGame, startFlash, replay: () => startGame(lastCfg), menu: quitToMenu });
    UI.applyEquipped();
    Runner.setSpeed(IDLE_SPEED);
    bindInputs();
    UI.showMenu();
    requestAnimationFrame(loop);
  }
  init();

  // Accès de test depuis la console
  window.NQGame = { state: () => S, startGame, startFlash, judgeGate, quitToMenu };
})();

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
    if (UILesson.isOpen()) UILesson.close();
  }
  function effDifficulty(cfg) { return cfg.mode === 'boss' ? 'expert' : cfg.mode === 'campaign' ? 'decouverte' : cfg.difficulty; }
  const CAMPAIGN_LEN = 3, CAMPAIGN_XP = 30;

  // Campagne : jusqu'à 3 épreuves sur la notion de l'étape, les plus faciles d'abord (portes avant salles)
  function buildCampaignQueue(cfg) {
    // Priorité aux questions écrites pour la campagne (rappel, compréhension, piège), dans leur ordre
    const camp = NQ.pool({ notion: cfg.notionFilter }).filter((it) => it.camp);
    if (camp.length >= CAMPAIGN_LEN) return camp.slice(0, CAMPAIGN_LEN);
    const all = NQ.pool({ notion: cfg.notionFilter }).filter((it) => !it.camp);
    const rank = (it) => (NQ.isRoom(it) ? 10 : 0) + it.diff;
    return NQ.shuffle(all).sort((a, b) => rank(a) - rank(b)).slice(0, CAMPAIGN_LEN);
  }
  // Étape validée : au plus une erreur sur 3 épreuves (aucune s'il y en a moins de 3)
  const campaignAllowed = (n) => (n >= 3 ? 1 : 0);

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
    if (cfg.mode === 'campaign') cfg.chapter = (NQ.notionsById[cfg.notionFilter] || {}).ch || 1;
    lastCfg = cfg;
    const ed = effDifficulty(cfg);
    // Campagne : deux fois plus de temps que le niveau Découverte pour répondre (≈ 20 s puis 16 s par porte)
    // Boss : 1 minute par question (porte : 120 unités à vitesse 2 ; salle : chrono de 60 s), sans accélération
    // progressive ; ↑ maintenue accélère fortement pour ne pas attendre quand on a déjà choisi.
    const D = cfg.mode === 'campaign' ? Object.assign({}, DIFF[ed], { speed: DIFF[ed].speed / 2, inc: DIFF[ed].inc / 2, max: DIFF[ed].max / 2 })
      : cfg.mode === 'boss' ? Object.assign({}, DIFF[ed], { speed: 2, inc: 0, max: 2, roomTimer: 60, boost: 12 })
        : DIFF[ed];
    const recent = p.codexRead[cfg.chapter] && Date.now() - p.codexRead[cfg.chapter] < SHIELD_WINDOW;
    const lives = cfg.mode === 'flash' || cfg.mode === 'campaign' ? null : cfg.mode === 'boss' ? 1 : D.lives;
    let all = cfg.mode === 'flash' ? [] : NQ.pool({ ch: cfg.chapter });
    if (D.conceptOnly) all = all.filter(isConcept);
    S = {
      id: ++gameSeq, cfg, D, ed, state: 'idle', score: 0, streak: 0, lives, maxLives: lives,
      shield: cfg.mode === 'boss' && recent ? 1 : 0, speed: D.speed, n: 0, rooms: 0, sinceRoom: 0, owedRoom: false,
      recent: [], recap: [], xp: 0, answered: 0, end: null, cur: null, okLane: 0, answers: [],
      pool: all, roomPool: all.filter(NQ.isRoom), gatePool: all.filter((i) => !NQ.isRoom(i)),
      queue: cfg.mode === 'boss' ? buildBossQueue(cfg) : cfg.mode === 'campaign' ? buildCampaignQueue(cfg) : null,
      unlockedBefore: NQ.prog.unlockedRewards(p).map((r) => r.id), lvl: NQ.prog.levelFor(p.xp)
    };
    if (cfg.mode === 'flash') {
      S.gatePool = NQ.pool({ notion: cfg.notionFilter, types: NQ.GATE_TYPES });
      if (!S.gatePool.length) S.gatePool = NQ.pool({ notion: cfg.notionFilter });
    }
    if (!S.pool.length && !S.gatePool.length && !(S.queue && S.queue.length)) { S = null; return; }
    UI.hideMenu(); UI.showHud(true);
    Runner.setLane(1); Runner.setSpeed(S.speed);
    refreshHud();
    if (cfg.mode === 'campaign' && UILesson.hasLesson(cfg.notionFilter)) {
      // Une étape de campagne commence toujours par la leçon de sa notion
      const id = S.id; S.state = 'lesson'; Runner.setSpeed(0);
      UILesson.show(cfg.notionFilter).then(() => { if (S && S.id === id) { Runner.setSpeed(S.speed); next(); } });
      return;
    }
    next();
  }
  function startFlash(notionId) { startGame({ chapter: 0, mode: 'flash', notionFilter: notionId, difficulty: prof().difficulty }); }

  // ---------- HUD ----------
  function refreshHud() {
    const c = S.cfg;
    const tag = c.mode === 'campaign' ? '🗺 ' + ((NQ.notionsById[c.notionFilter] || {}).label || 'Campagne').slice(0, 30)
      : c.mode === 'boss' ? '👹 Boss ' + c.chapter
      : c.mode === 'flash' ? '🎯 ' + ((NQ.notionsById[c.notionFilter] || {}).label || 'Entraînement').slice(0, 28)
        : UI.CH_LABEL[c.chapter] + ' · ' + (UI.DIFF_LABEL[c.difficulty] || c.difficulty);
    const total = c.mode === 'boss' ? BOSS_LEN : c.mode === 'flash' ? FLASH_LEN : c.mode === 'campaign' ? S.queue.length : (S.D.len || 0);
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
    // Première rencontre d'une notion (hors boss) : micro-leçon avant l'épreuve, runner en pause
    if (S.cfg.mode !== 'boss' && UILesson.pendingFor(item).length) {
      const id = S.id;
      S.state = 'lesson'; UI.setQuestion(null); Runner.setSpeed(0);
      UILesson.showPending(item).then(() => { if (S && S.id === id) { Runner.setSpeed(S.speed); present(item); } });
      return;
    }
    present(item);
  }
  function present(item) {
    S.cur = item; S.recent.push(item.id); S.itemHints = 0; S.hintSlow = 1;
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
    UI.setQuestion({ q: item.q, ctx: item.ctx, code: item.code, noHelp: S.cfg.mode === 'boss', chips: answers.map((a, i) => ({ text: a.t, color: COLS[i] })) });
  }

  function startRoom(item) {
    const id = S.id;
    S.state = 'room'; S.rooms++;
    UI.setQuestion(null); Runner.setSpeed(S.speed * 0.5); refreshHud();
    const timer = S.cfg.mode === 'flash' ? 0 : S.D.roomTimer;
    MiniGames.run(item, { timerSeconds: timer, hintText: hintTextFor(item), noHelp: S.cfg.mode === 'boss' }).then((res) => {
      if (!S || S.id !== id || res.aborted) return;
      resolveItem(item, res.ok, { kind: 'room', timeout: res.timeout, revealed: !!res.revealed, hints: res.hints || 0 });
    });
  }

  // ---------- Jugement ----------
  function judgeGate(lane) {
    const ok = lane === S.okLane;
    resolveItem(S.cur, ok, { kind: 'gate', chosen: S.answers[lane].t, hints: S.itemHints || 0 });
  }

  // ---------- Indices ----------
  // Texte du 1er indice : la phrase à retenir de la leçon de la notion, sinon son intitulé
  function hintTextFor(item) {
    const id = (item.notions || []).find((n) => NQ.lessons && NQ.lessons[n]) || item.notions[0];
    const L = NQ.lessons && NQ.lessons[id];
    if (L && L.tip) return L.tip;
    const n = NQ.notionsById[id];
    return n ? 'Pense à la notion : ' + n.label + '.' : 'Relis attentivement chaque proposition.';
  }
  // 1er indice : rappel de la notion + porte ralentie ; 2e indice : une mauvaise réponse est éliminée
  function hint() {
    if (!S || S.cfg.mode === 'boss') return;
    if (MiniGames.isOpen()) { MiniGames.hint(); return; }
    if (S.state !== 'gate' || S.itemHints >= 2) return;
    S.itemHints++;
    if (S.itemHints === 1) { S.hintSlow = 0.5; UI.showHint(hintTextFor(S.cur), 1); return; }
    const wrong = [0, 1, 2].filter((i) => i !== S.okLane);
    const cur = Runner.getLane();
    const out = wrong.indexOf(cur) >= 0 ? cur : wrong[Math.floor(Math.random() * wrong.length)];
    S.eliminated = out; Runner.dimPanel(out); UI.dimChip(out);
    UI.showHint('Une mauvaise réponse est éliminée : « ' + S.answers[out].t + ' ».', 2);
  }
  const HINT_FACTOR = [1, 0.6, 0.3]; // part d'XP et de score gardée selon le nombre d'indices

  function checkEnd() {
    const c = S.cfg;
    if (S.lives != null && S.lives <= 0) return { win: false };
    if (c.mode === 'boss' && S.answered >= BOSS_LEN) return { win: true };
    if (c.mode === 'flash' && S.answered >= FLASH_LEN) return { win: true };
    if (c.mode === 'campaign' && S.answered >= S.queue.length) {
      const errors = S.recap.filter((r) => !r.ok).length;
      return { win: errors <= campaignAllowed(S.queue.length) };
    }
    if (c.mode === 'normal' && S.D.len && S.answered >= S.D.len) return { win: true };
    return null;
  }

  function resolveItem(item, ok, info) {
    const p = prof(), room = info.kind === 'room', id = S.id;
    S.state = 'fb'; $('help').hidden = true;
    let gainXp = 0, shieldUsed = false;
    const hf = HINT_FACTOR[Math.min(2, info.hints || 0)];
    if (ok) {
      S.streak++;
      const mult = NQ.prog.streakMult(S.streak);
      S.score += Math.round(100 * mult * DIFF_BONUS[S.ed] * (room ? 2 : 1) * hf);
      gainXp = Math.round(hf * NQ.prog.xpFor({ kind: room ? 'room' : 'gate', diff: item.diff, difficulty: S.ed, streak: S.streak }));
      p.xp += gainXp; S.xp += gainXp;
      if (!room) S.speed = Math.min(S.speed + S.D.inc, S.D.max);
      NQ.sfx.good(mult);
    } else if (info.revealed && S.cfg.mode !== 'boss') {
      // Solution demandée : pas de vie perdue, mais la série est rompue et la maîtrise baisse
      S.streak = 0; NQ.audio.sfx.unlock();
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
    if (info.revealed) {
      if (info.kind === 'gate') lines.push({ k: 'ok', t: '✅ Bonne réponse : « ' + item.ok + ' »' });
      if (S.cfg.mode === 'boss') lines.push({ k: 'ko', t: 'Pendant un boss, demander la solution compte comme une erreur.' });
      else lines.push({ k: '', t: 'Pas de vie perdue, mais la série repart de zéro et la maîtrise de la notion baisse.' });
    } else if (info.kind === 'gate') {
      if (ok) lines.push({ k: 'ok', t: '✅ Bonne réponse : « ' + item.ok + ' »' });
      else {
        lines.push({ k: 'ko', t: '❌ Tu as pris : « ' + info.chosen + ' »' });
        lines.push({ k: 'ok', t: '✅ Bonne réponse : « ' + item.ok + ' »' });
      }
    } else if (info.timeout) lines.push({ k: 'ko', t: '⏱ Temps écoulé !' });
    if (gainXp) extra.push('+' + gainXp + ' XP');
    if (info.hints) extra.push('🔎 ' + info.hints + (info.hints > 1 ? ' indices utilisés' : ' indice utilisé') + ' : XP et score réduits.');
    if (shieldUsed) extra.push('🛡 Le bouclier a encaissé l\'erreur.');
    const lvl = NQ.prog.levelFor(prof().xp);
    if (lvl > S.lvl) { extra.push('⬆ Palier ' + lvl + ' atteint ! Récompense dans le Pass de combat.'); S.lvl = lvl; }
    return {
      ok, headline: info.revealed ? '💡 Solution' : ok ? '✅ Juste !' : '❌ Raté', lines, item, extra, plain: item.plain, why: item.why, whyNot: item.whyNot,
      solution: info.kind === 'room' ? MiniGames.solutionNode(item) : null,
      noAuto: !!info.revealed
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
    let campaign = null;
    if (c.mode === 'campaign') {
      const firstTime = !NQ.campaign.done(c.notionFilter);
      if (win) { p.campaign = p.campaign || {}; p.campaign[c.notionFilter] = Date.now(); if (firstTime) { p.xp += CAMPAIGN_XP; S.xp += CAMPAIGN_XP; } }
      const nextId = win ? NQ.campaign.nextAfter(c.notionFilter) : null;
      const good = S.recap.filter((r) => r.ok).length, prog = NQ.campaign.progress(c.chapter);
      campaign = {
        sub: good + '/' + S.recap.length + ' bonnes réponses. ' + (win
          ? 'Étape validée' + (firstTime ? ' (+' + CAMPAIGN_XP + ' XP)' : '') + '. Chapitre ' + c.chapter + ' : ' + prog.done + '/' + prog.total + ' étapes.'
          : 'Il faut au plus ' + campaignAllowed(S.recap.length) + ' erreur' + (campaignAllowed(S.recap.length) > 1 ? 's' : '') + ' pour valider : relis la leçon et réessaie.'),
        nextLabel: win ? (nextId ? 'Étape suivante ▶' : (prog.done === prog.total ? '👹 Affronter le boss ▶' : null)) : '🔁 Réessayer l\'étape',
        onNext: win ? (nextId ? () => startGame({ mode: 'campaign', notionFilter: nextId }) : (prog.done === prog.total ? () => startGame({ mode: 'boss', chapter: c.chapter, difficulty: 'expert' }) : null)) : () => startGame(lastCfg)
      };
    }
    p.stats.games++;
    if (c.mode !== 'flash' && c.mode !== 'campaign') {
      p.stats.best = Math.max(p.stats.best, S.score);
      const entry = { score: S.score, difficulty: S.ed, chapter: c.chapter, date: new Date().toISOString().slice(0, 10) };
      const submit = () => NQ.leaderboard.submit(Object.assign({ name: p.name }, entry));
      // Sans pseudo, on le demande avant d'envoyer le score au classement (après l'affichage du bilan)
      if (!UI.hasName() && S.score > 0) {
        setTimeout(() => UI.askName({ title: '🏆 Ton score : ' + S.score, msg: 'Choisis un pseudo pour qu\'il apparaisse à ton nom dans le classement de la promo.', later: 'Rester « Joueur »' }).then(submit), 400);
      } else submit();
    }
    NQ.store.save();
    NQ.sync.flush(); // fin de partie : sauvegarde en ligne immédiate
    const before = {}; S.unlockedBefore.forEach((i) => { before[i] = true; });
    const unlocks = NQ.prog.unlockedRewards(p).filter((r) => !before[r.id]);
    const lvlNow = NQ.prog.levelFor(p.xp), startLvl = NQ.prog.levelFor(p.xp - S.xp);
    Runner.clearGate(); Runner.setSpeed(IDLE_SPEED); UI.setQuestion(null);
    const res = {
      headline: c.mode === 'campaign' ? (win ? '✅ Étape validée' : '🔁 Étape à refaire')
        : c.mode === 'boss' ? (win ? '👹 Boss vaincu !' : '💀 Le boss résiste') : c.mode === 'flash' ? '🎯 Entraînement terminé'
        : S.D.conceptOnly ? '🌱 Session Découverte terminée' : 'Partie terminée',
      sub: campaign ? campaign.sub : c.mode === 'boss' ? (win ? 'Skin « ' + NQ.prog.BOSS_SKINS[c.chapter].name + ' » et piste Élite débloqués (+200 XP).' : 'Relis les explications ci-dessous et retente.') : '',
      score: S.score, xp: S.xp, noScore: c.mode === 'flash' || c.mode === 'campaign', levelUp: lvlNow > startLvl ? lvlNow : 0,
      unlocks, recap: S.recap, full: c.mode === 'boss',
      nextLabel: campaign && campaign.nextLabel, onNext: campaign && campaign.onNext,
      campaignMap: c.mode === 'campaign'
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
    if (UI.hasModal()) return;
    if (UILesson.isOpen() && e.key !== ' ' && !isBoostKey(e.key) && e.key !== 'Enter') return;
    if (e.key === ' ') { // Espace : met l'explication en pause (↑ pour continuer)
      e.preventDefault();
      if (UILesson.isOpen() || e.repeat || !S) return;
      if (UI.feedbackOpen()) UI.pauseFeedback();
      return;
    }
    if (e.key === 's' || e.key === 'S') { // S : afficher la solution (porte ou salle)
      if (UILesson.isOpen() || e.repeat || !S || UI.feedbackOpen()) return;
      if (MiniGames.isOpen()) MiniGames.giveUp();
      else if (S.state === 'gate') revealGate();
      return;
    }
    if (isBoostKey(e.key) || e.key === 'Enter') { // ↑ : passer (feedback, leçon) ; maintenu pendant une porte : accélérer
      if (e.key !== 'Enter') e.preventDefault();
      if (e.repeat) return; // une touche gardée enfoncée ne doit pas sauter le feedback suivant
      if (UILesson.isOpen()) { UILesson.close(); return; }
      if (UI.feedbackOpen()) { UI.continueFeedback(); return; }
      if (e.key !== 'Enter' && S && !MiniGames.isOpen()) boostHeld = true;
      return;
    }
    if (e.key === 'h' || e.key === 'H') { if (!e.repeat) hint(); return; }
    if (!S || MiniGames.isOpen()) return;
    if (['ArrowLeft', 'a', 'A', 'q', 'Q'].indexOf(e.key) >= 0) Runner.moveLane(-1);
    else if (['ArrowRight', 'd', 'D'].indexOf(e.key) >= 0) Runner.moveLane(1);
  }
  // Espace pendant une porte : la porte disparaît, la solution s'affiche (voir resolveItem)
  function revealGate() {
    if (!S || S.state !== 'gate') return;
    Runner.clearGate();
    resolveItem(S.cur, false, { kind: 'gate', revealed: true });
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
    bb.addEventListener('pointerdown', (e) => { e.preventDefault(); if (UI.feedbackOpen()) UI.continueFeedback(); else boostHeld = true; });
    $('sol').addEventListener('click', () => { if (MiniGames.isOpen()) MiniGames.giveUp(); else revealGate(); });
    $('hintb').addEventListener('click', hint);
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
    if (S && S.state === 'gate') {
      Runner.setSpeed(S.speed * (boost ? (S.D.boost || BOOST) : 1) * (S.hintSlow || 1));
      // Boss : temps restant affiché avant l'arrivée de la porte
      if (S.cfg.mode === 'boss' && now - (S.lastTick || 0) > 250) {
        S.lastTick = now;
        const left = Math.max(0, Math.ceil(Runner.gateDistance() / (S.speed || 1)));
        UI.setTimer('⏱ ' + left + ' s');
      }
    } else if (S && S.cfg.mode === 'boss') UI.setTimer('');
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
    UILesson.bindGlossary();
    UI.showMenu();
    // Sauvegarde en ligne : récupère une version plus récente faite sur un autre appareil
    NQ.sync.startup().then((r) => { if (r === 'pulled') { UI.applyEquipped(); if (!S) UI.showMenu(); } else if (!S && document.getElementById('menu').classList.contains('open')) UI.showMenu(); });
    // Premier lancement : invitation à choisir un pseudo (et un code pour la sauvegarde en ligne)
    if (!UI.hasName()) setTimeout(() => UI.askName().then(() => UI.showMenu()), 500);
    requestAnimationFrame(loop);
  }
  init();

  // Accès de test depuis la console
  window.NQGame = { state: () => S, startGame, startFlash, judgeGate, quitToMenu };
})();

// progression.js : XP, paliers du pass de combat, récompenses (skins, traînées, titres).
(function () {
  'use strict';
  const NQ = window.NQ = window.NQ || {};
  const TIERS = 20;

  // ---------- Récompenses ----------
  // skin : {color, emissive, geo, rainbow?} ; trail : {color, rainbow?} ; title : {name}
  const skin = (id, name, color, emissive, geo, extra) => Object.assign({ id, type: 'skin', name, color, emissive, geo }, extra);
  const trail = (id, name, color, extra) => Object.assign({ id, type: 'trail', name, color }, extra);
  const title = (id, name) => ({ id, type: 'title', name, value: name });

  const BASE = [
    skin('cobalt', 'Cobalt', 0x33ccff, 0x114477, 'cone4'),
    trail('bleu', 'Sillage bleu', 0x33aaff),
    { id: 'titre-aucun', type: 'title', name: 'Aucun titre', value: '' }
  ];
  const BOSS_SKINS = {
    1: skin('boss1', 'Régresseur', 0xff8a1f, 0x7a3300, 'knot'),
    2: skin('boss2', 'Convolueur', 0x44ff88, 0x006633, 'box'),
    3: skin('boss3', 'Encodeur', 0xb36bff, 0x3b0a77, 'torus'),
    4: skin('boss4', 'Sentinelle', 0xeaf6ff, 0x336699, 'dodeca')
  };

  // Piste gratuite : skins aux paliers 2,5,8,11,14,17,20 ; traînées 1,4,…,19 ; titres 3,6,…,18
  const FREE_SKINS = [skin('rubis', 'Rubis', 0xff3355, 0x661122, 'cone3'), skin('emeraude', 'Émeraude', 0x33ff99, 0x116644, 'octa'),
    skin('or', 'Or', 0xffd23f, 0x775500, 'cone6'), skin('neon', 'Néon rose', 0xff44cc, 0x771166, 'box'),
    skin('cristal', 'Cristal', 0xaaf0ff, 0x2266aa, 'ico'), skin('plasma', 'Plasma', 0xaa55ff, 0x440088, 'knot'),
    skin('lave', 'Lave', 0xff7722, 0x882200, 'dodeca')];
  const FREE_TRAILS = [trail('rouge', 'Sillage rouge', 0xff3355), trail('vert', 'Sillage vert', 0x33ff99),
    trail('or', 'Sillage doré', 0xffd23f), trail('rose', 'Sillage rose', 0xff44cc), trail('cyan', 'Sillage cyan', 0x66f0ff),
    trail('violet', 'Sillage violet', 0xaa55ff), trail('blanc', 'Sillage blanc', 0xffffff)];
  const FREE_TITLES = ['Novice des neurones', 'Apprenti du gradient', 'Descendeur de pente', 'Tisseur de couches',
    'Dompteur de dropout', 'Maître de la MSE'].map((n, i) => title('titre-f' + i, n));

  // Piste Élite : skins aux paliers 3,6,…,18 ; traînées 2,5,…,20 ; titres 1,4,…,19
  const ELITE_SKINS = [skin('spectre', 'Spectre', 0xffffff, 0x445566, 'tetra'),
    skin('arcenciel', 'Arc-en-ciel', 0xffffff, 0x222222, 'ico', { rainbow: true }),
    skin('couronne', 'Couronne', 0xffc400, 0x996600, 'torus'), skin('nebuleuse', 'Nébuleuse', 0x7a3cff, 0x220066, 'octa'),
    skin('aurore', 'Aurore', 0x55ffd0, 0x006655, 'cone6'), skin('singularite', 'Singularité', 0x111122, 0x6600ff, 'knot')];
  const ELITE_TRAILS = [trail('feu', 'Sillage de feu', 0xff6a00), trail('glace', 'Sillage de glace', 0x9fe8ff),
    trail('arcenciel-t', 'Sillage arc-en-ciel', 0xffffff, { rainbow: true }), trail('plasma-t', 'Sillage plasma', 0xd04bff),
    trail('dore', 'Sillage solaire', 0xffe27a), trail('elec', 'Sillage électrique', 0x4d7bff),
    trail('spectre-t', 'Sillage spectral', 0xd8f4ff)];
  const ELITE_TITLES = ['Élite : Rétropropagateur', 'Élite : Convexe', 'Élite : Résiduel', 'Élite : Latent',
    'Élite : Skip-connecté', 'Élite : Bayésien', 'Légende du Deep Learning'].map((n, i) => title('titre-e' + i, n));

  // Construit un tableau de 20 cases à partir de 3 listes et des paliers (1-indexés) de chacune
  function layout(lists, tierSets, track) {
    const row = new Array(TIERS + 1).fill(null);
    lists.forEach((list, li) => tierSets[li].forEach((t, i) => {
      row[t] = Object.assign({}, list[i], { track, tier: t });
    }));
    return row;
  }
  const FREE = layout([FREE_SKINS, FREE_TRAILS, FREE_TITLES],
    [[2, 5, 8, 11, 14, 17, 20], [1, 4, 7, 10, 13, 16, 19], [3, 6, 9, 12, 15, 18]], 'free');
  const ELITE = layout([ELITE_SKINS, ELITE_TRAILS, ELITE_TITLES],
    [[3, 6, 9, 12, 15, 18], [2, 5, 8, 11, 14, 17, 20], [1, 4, 7, 10, 13, 16, 19]], 'elite');

  const BY_ID = {};
  BASE.forEach((r) => { BY_ID[r.id] = Object.assign(r, { track: 'base', tier: 0 }); });
  Object.keys(BOSS_SKINS).forEach((c) => { BY_ID[BOSS_SKINS[c].id] = Object.assign(BOSS_SKINS[c], { track: 'boss', boss: +c, tier: 0 }); });
  FREE.concat(ELITE).forEach((r) => { if (r) BY_ID[r.id] = r; });

  // ---------- XP et niveaux ----------
  const tierCost = (k) => 100 + 20 * (k - 1);
  const threshold = (k) => 100 * k + 10 * k * (k - 1); // somme cumulée des coûts 1..k
  function levelFor(xp) {
    let k = 0;
    while (k < TIERS && xp >= threshold(k + 1)) k++;
    return k;
  }
  function progressInLevel(xp) {
    const level = levelFor(xp);
    if (level >= TIERS) return { level, into: 0, need: 0, pct: 100, max: true };
    const into = xp - (level ? threshold(level) : 0), need = tierCost(level + 1);
    return { level, into, need, pct: Math.round(100 * into / need), max: false };
  }
  // Multiplicateur de série (XP et score)
  const streakMult = (s) => (s >= 10 ? 4 : s >= 6 ? 3 : s >= 3 ? 2 : 1);
  // {kind:'gate'|'room', diff, difficulty, streak}
  function xpFor(o) {
    const base = (o.kind === 'room' ? 25 : 10) * o.diff;
    return Math.round(base * (o.difficulty === 'expert' ? 1.5 : 1) * Math.min(streakMult(o.streak), 3));
  }

  function unlockedRewards(profile) {
    const lvl = levelFor(profile.xp);
    const out = BASE.slice();
    for (let t = 1; t <= lvl; t++) {
      out.push(FREE[t]);
      if (profile.elite) out.push(ELITE[t]);
    }
    Object.keys(BOSS_SKINS).forEach((c) => { if (profile.bosses[c]) out.push(BOSS_SKINS[c]); });
    return out;
  }
  const canEquip = (reward, profile) => unlockedRewards(profile).some((r) => r.id === reward.id);

  NQ.prog = {
    TIERS, FREE, ELITE, BASE, BOSS_SKINS, byId: (id) => BY_ID[id],
    tierCost, threshold, levelFor, progressInLevel, streakMult, xpFor, unlockedRewards, canEquip
  };
})();

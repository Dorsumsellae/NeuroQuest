// schemas.js : petits schémas SVG utilisés par les micro-leçons (clé "svg" d'une leçon).
// Palette : bleu #33aaff, rose #ff44cc, or #ffd23f, vert #33ff99, texte #88ccff.
window.NQ = window.NQ || {};
(function () {
  'use strict';
  const T = (x, y, s, c, size, anchor) => '<text x="' + x + '" y="' + y + '" fill="' + (c || '#8cf') + '" font-size="' + (size || 10) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + s + '</text>';
  const svg = (body, vb) => '<svg viewBox="' + (vb || '0 0 260 130') + '" class="lsvg" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  const axes = '<line x1="20" y1="110" x2="245" y2="110" stroke="#8cf" stroke-width="1.5"/><line x1="20" y1="110" x2="20" y2="10" stroke="#8cf" stroke-width="1.5"/>';
  const box = (x, y, w, h, label, c, tc) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="#1a2a6c" stroke="' + (c || '#33aaff') + '" stroke-width="1.8"/>' + T(x + w / 2, y + h / 2 + 4, label, tc || '#fff', 10, 'middle');
  const arrow = (x1, y1, x2, y2, c) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || '#8cf') + '" stroke-width="1.6" marker-end="url(#ah)"/>';
  const defs = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8cf"/></marker></defs>';

  // Grille de cases avec valeurs (pour conv / maxpool)
  function grid(x0, y0, vals, cell, colors) {
    let s = '';
    vals.forEach((row, i) => row.forEach((v, j) => {
      const c = colors ? colors(i, j) : '#1a2a6c';
      s += '<rect x="' + (x0 + j * cell) + '" y="' + (y0 + i * cell) + '" width="' + cell + '" height="' + cell + '" fill="' + c + '" stroke="#0b1030" stroke-width="1.5"/>';
      s += T(x0 + j * cell + cell / 2, y0 + i * cell + cell / 2 + 4, v, '#fff', 10, 'middle');
    }));
    return s;
  }
  const quad = (i, j) => ['#2a5f9e', '#9e2a6c', '#7a6a1a', '#1f7a4f'][(i < 2 ? 0 : 2) + (j < 2 ? 0 : 1)];

  NQ.schemas = {
    droite: svg(axes +
      [[50, 80], [80, 70], [110, 58], [140, 50], [170, 35], [200, 30]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#fff"/>').join('') +
      '<line x1="25" y1="92" x2="225" y2="22" stroke="#f6f" stroke-width="2.5"/>' + T(180, 18, 'ŷ = θ₀ + θ₁x', '#f6f', 11) + T(24, 92, 'θ₀', '#ffd23f')),

    mse: svg(axes + '<line x1="25" y1="95" x2="235" y2="25" stroke="#f6f" stroke-width="2.5"/>' +
      [[50, 70, 87], [90, 88, 73], [130, 45, 60], [170, 62, 47], [210, 20, 33]].map((p) =>
        '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + p[0] + '" y2="' + p[2] + '" stroke="#ffd23f" stroke-width="2" stroke-dasharray="3,2"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="#fff"/>').join('') +
      T(135, 124, 'écarts (y − ŷ) au carré, puis moyenne = MSE', '#ffd23f', 10, 'middle')),

    gradient: svg('<path d="M20,20 Q130,190 240,20" fill="none" stroke="#33aaff" stroke-width="2.5"/>' + defs +
      '<circle cx="40" cy="44" r="5" fill="#ff44cc"/><circle cx="70" cy="74" r="5" fill="#ff44cc" opacity=".85"/><circle cx="98" cy="94" r="5" fill="#ff44cc" opacity=".7"/><circle cx="122" cy="103" r="5" fill="#ff44cc" opacity=".55"/>' +
      arrow(44, 48, 64, 68) + arrow(74, 78, 92, 90) + arrow(102, 97, 116, 101) +
      '<circle cx="130" cy="104" r="4" fill="#33ff99"/>' + T(140, 98, 'minimum', '#33ff99') + T(150, 40, 'pas = η × gradient', '#ffd23f') + T(14, 126, 'erreur selon la valeur du paramètre θ', '#8cf', 9)),

    sgd: svg('<ellipse cx="130" cy="65" rx="110" ry="52" fill="none" stroke="#1a2a6c" stroke-width="1.5"/><ellipse cx="130" cy="65" rx="70" ry="33" fill="none" stroke="#1a2a6c" stroke-width="1.5"/><ellipse cx="130" cy="65" rx="30" ry="14" fill="none" stroke="#1a2a6c" stroke-width="1.5"/>' +
      '<polyline points="30,30 70,45 100,55 120,62 130,65" fill="none" stroke="#33aaff" stroke-width="2.5"/>' +
      '<polyline points="30,105 55,80 48,95 80,70 72,88 100,66 118,78 112,60 130,65" fill="none" stroke="#ff44cc" stroke-width="2"/>' +
      '<circle cx="130" cy="65" r="4" fill="#33ff99"/>' + T(200, 30, 'batch : lisse', '#33aaff', 11) + T(178, 118, 'SGD : bruité', '#ff44cc', 11)),

    poly: svg(axes + [[40, 40], [65, 75], [90, 92], [115, 98], [140, 92], [165, 78], [190, 55], [215, 30]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#fff"/>').join('') +
      '<line x1="30" y1="80" x2="230" y2="60" stroke="#ffd23f" stroke-width="2" stroke-dasharray="5,3"/>' +
      '<path d="M30,25 Q125,160 225,18" fill="none" stroke="#33ff99" stroke-width="2.5"/>' +
      '<path d="M30,30 C45,55 50,95 65,72 S85,100 95,90 S112,105 118,96 S140,85 145,95 S165,70 170,80 S190,40 195,58 S215,20 228,28" fill="none" stroke="#ff44cc" stroke-width="1.6"/>' +
      T(150, 124, 'degré 1 : trop simple', '#ffd23f', 9) + T(30, 124, 'degré 2 : juste', '#33ff99', 9) + T(250, 12, 'degré élevé : colle au bruit', '#ff44cc', 9, 'end')),

    neurone: svg(T(8, 30, 'x₁', '#8cf', 11) + T(8, 64, 'x₂', '#8cf', 11) + T(8, 98, 'x₃', '#8cf', 11) +
      '<g stroke="#8cf" stroke-width="1.5"><line x1="28" y1="26" x2="110" y2="60"/><line x1="28" y1="60" x2="110" y2="60"/><line x1="28" y1="94" x2="110" y2="60"/></g>' +
      T(60, 36, 'w₁', '#ffd23f') + T(60, 56, 'w₂', '#ffd23f') + T(60, 88, 'w₃', '#ffd23f') +
      '<ellipse cx="140" cy="60" rx="34" ry="24" fill="#1a2a6c" stroke="#f6f" stroke-width="2"/>' + T(140, 56, 'Σ − θ', '#fff', 11, 'middle') + T(140, 72, 'f(a)', '#fff', 11, 'middle') +
      '<line x1="174" y1="60" x2="235" y2="60" stroke="#3f8" stroke-width="2.5"/>' + T(238, 64, 'y', '#3f8', 12)),

    mlp: svg((function () {
      const L = [[30, [25, 50, 75, 100]], [100, [20, 45, 70, 95, 115]], [170, [30, 60, 90]], [235, [45, 75]]];
      let s = '';
      for (let k = 0; k < L.length - 1; k++) L[k][1].forEach((a) => L[k + 1][1].forEach((b) => { s += '<line x1="' + L[k][0] + '" y1="' + a + '" x2="' + L[k + 1][0] + '" y2="' + b + '" stroke="#33aaff" stroke-opacity=".35"/>'; }));
      L.forEach((l, k) => l[1].forEach((y) => { s += '<circle cx="' + l[0] + '" cy="' + y + '" r="6" fill="' + (k === 0 ? '#8cf' : k === L.length - 1 ? '#3f8' : '#f6f') + '"/>'; }));
      return s + T(30, 129, 'entrées', '#8cf', 9, 'middle') + T(135, 129, 'couches cachées', '#f6f', 9, 'middle') + T(235, 129, 'sorties', '#3f8', 9, 'middle');
    })()),

    backprop: svg(defs + box(10, 45, 50, 30, 'entrée') + box(85, 45, 50, 30, 'couche') + box(160, 45, 50, 30, 'sortie') +
      arrow(60, 55, 84, 55, '#33aaff') + arrow(135, 55, 159, 55, '#33aaff') + T(110, 30, '1. passe avant →', '#33aaff', 10, 'middle') +
      '<line x1="210" y1="60" x2="240" y2="60" stroke="#ffd23f" stroke-width="2"/>' + T(225, 40, 'erreur', '#ffd23f', 10, 'middle') +
      '<path d="M235,78 Q160,120 60,78" fill="none" stroke="#ff44cc" stroke-width="2" stroke-dasharray="5,3"/>' + T(140, 118, '2. ← gradient rétropropagé, poids corrigés', '#ff44cc', 9, 'middle')),

    onehot: svg(T(30, 22, 'classe', '#8cf', 11, 'middle') + T(170, 22, 'vecteur one-hot', '#8cf', 11, 'middle') +
      [['Rouge', [1, 0, 0, 0]], ['Vert', [0, 1, 0, 0]], ['Violet', [0, 0, 1, 0]]].map((r, i) => {
        const y = 42 + i * 30;
        return T(30, y + 4, r[0], '#fff', 11, 'middle') + r[1].map((v, j) => '<rect x="' + (110 + j * 30) + '" y="' + (y - 12) + '" width="26" height="22" rx="3" fill="' + (v ? '#ff44cc' : '#1a2a6c') + '" stroke="#33aaff"/>' + T(123 + j * 30, y + 4, v, '#fff', 11, 'middle')).join('');
      }).join('')),

    conv: svg(grid(15, 15, [[1, 0, 2, 1, 0], [0, 1, 3, 1, 1], [2, 1, 0, 2, 0], [1, 3, 1, 0, 1], [0, 1, 2, 1, 2]], 20, (i, j) => (i < 3 && j < 3 ? '#9e2a6c' : '#1a2a6c')) +
      '<rect x="15" y="15" width="60" height="60" fill="none" stroke="#ffd23f" stroke-width="2.5"/>' + T(65, 125, 'image', '#8cf', 10, 'middle') +
      grid(135, 35, [[1, 0, 1], [0, 1, 0], [1, 0, 1]], 16, () => '#7a6a1a') + T(159, 100, 'filtre 3×3', '#ffd23f', 10, 'middle') +
      T(195, 65, '→', '#8cf', 16) + grid(215, 45, [['6', ''], ['', '']], 18, (i, j) => (i === 0 && j === 0 ? '#9e2a6c' : '#1a2a6c')) + T(233, 100, 'carte', '#8cf', 10, 'middle')),

    maxpool: svg(grid(15, 15, [[12, 20, 30, 0], [2, 12, 8, 20], [34, 70, 37, 5], [127, 100, 25, 15]], 24, quad) +
      T(115, 70, 'max 2×2 →', '#ffd23f', 11) + grid(185, 39, [[20, 30], [127, 37]], 26, quad)),

    cnn: svg(defs + box(5, 45, 40, 36, 'image') + box(58, 40, 42, 46, 'Conv') + box(112, 48, 38, 30, 'Pool') + box(162, 50, 38, 26, 'Flat') + box(212, 50, 44, 26, 'Dense') +
      arrow(45, 63, 57, 63) + arrow(100, 63, 111, 63) + arrow(150, 63, 161, 63) + arrow(200, 63, 211, 63) +
      T(78, 30, 'contours → objets', '#ffd23f', 9, 'middle') + T(130, 100, '[N, W, H, C]', '#8cf', 10, 'middle') + T(234, 100, 'softmax', '#3f8', 10, 'middle')),

    dropout: svg((function () {
      const L = [[40, [25, 55, 85, 115]], [130, [20, 45, 70, 95, 120]], [220, [40, 70, 100]]], off = { '130,45': 1, '130,95': 1, '40,85': 1 };
      let s = '';
      for (let k = 0; k < 2; k++) L[k][1].forEach((a) => L[k + 1][1].forEach((b) => {
        if (off[L[k][0] + ',' + a] || off[L[k + 1][0] + ',' + b]) return;
        s += '<line x1="' + L[k][0] + '" y1="' + a + '" x2="' + L[k + 1][0] + '" y2="' + b + '" stroke="#33aaff" stroke-opacity=".4"/>';
      }));
      L.forEach((l) => l[1].forEach((y) => { const d = off[l[0] + ',' + y]; s += '<circle cx="' + l[0] + '" cy="' + y + '" r="7" fill="' + (d ? '#0b1030' : '#f6f') + '" stroke="' + (d ? '#555' : '#f6f') + '" stroke-dasharray="' + (d ? '2,2' : '') + '"/>'; if (d) s += T(l[0], y + 4, '×', '#888', 11, 'middle'); }));
      return s;
    })()),

    resnet: svg(defs + T(40, 22, 'x', '#fff', 12, 'middle') + arrow(40, 26, 40, 38) + box(10, 40, 60, 22, 'couche', '#ff44cc') + arrow(40, 62, 40, 72) + box(10, 74, 60, 22, 'couche', '#ff44cc') +
      arrow(40, 96, 40, 108) + '<circle cx="40" cy="114" r="7" fill="none" stroke="#3f8" stroke-width="2"/>' + T(40, 118, '+', '#3f8', 12, 'middle') +
      '<path d="M44,28 Q110,28 110,70 Q110,114 49,114" fill="none" stroke="#ffd23f" stroke-width="2"/>' + T(118, 70, 'identité x', '#ffd23f', 10) +
      T(185, 50, 'sortie =', '#8cf', 11, 'middle') + T(185, 70, 'F(x) + x', '#3f8', 13, 'middle') + T(185, 92, 'le gradient passe', '#8cf', 9, 'middle') + T(185, 104, 'par le raccourci', '#8cf', 9, 'middle')),

    inception: svg(defs + box(100, 5, 60, 20, 'entrée') +
      [[10, '1×1'], [72, '3×3'], [134, '5×5'], [196, 'pool']].map((b) => arrow(130, 25, b[0] + 27, 50) + box(b[0], 52, 54, 24, b[1], '#ff44cc') + arrow(b[0] + 27, 76, 130, 100)).join('') +
      box(90, 102, 80, 22, 'concaténation', '#3f8')),

    sablier: svg('<g fill="#33aaff" opacity=".85"><rect x="20" y="10" width="14" height="100"/><rect x="55" y="25" width="14" height="70"/><rect x="90" y="40" width="14" height="40"/></g>' +
      '<rect x="123" y="50" width="14" height="20" fill="#ff44cc"/>' +
      '<g fill="#33aaff" opacity=".85"><rect x="156" y="40" width="14" height="40"/><rect x="191" y="25" width="14" height="70"/><rect x="226" y="10" width="14" height="100"/></g>' +
      T(30, 124, 'encodeur', '#8cf') + T(118, 46, 'code', '#8cf') + T(178, 124, 'décodeur', '#8cf')),

    unet: svg('<g fill="#33aaff">' + [[15, 10, 50], [45, 40, 36], [75, 70, 24], [105, 95, 16]].map((b) => '<rect x="' + b[0] + '" y="' + b[1] + '" width="16" height="' + b[2] + '"/>').join('') + '</g>' +
      '<rect x="122" y="105" width="16" height="14" fill="#ff44cc"/>' +
      '<g fill="#3f8">' + [[139, 95, 16], [169, 70, 24], [199, 40, 36], [229, 10, 50]].map((b) => '<rect x="' + b[0] + '" y="' + b[1] + '" width="16" height="' + b[2] + '"/>').join('') + '</g>' +
      [[31, 35, 229], [61, 58, 199], [91, 82, 169], [121, 103, 139]].map((s) => '<line x1="' + s[0] + '" y1="' + s[1] + '" x2="' + s[2] + '" y2="' + s[1] + '" stroke="#ffd23f" stroke-width="1.5" stroke-dasharray="4,3"/>').join('') +
      T(40, 126, 'contraction', '#33aaff', 9, 'middle') + T(215, 126, 'expansion', '#3f8', 9, 'middle') + T(130, 30, 'skip connections', '#ffd23f', 9, 'middle')),

    anomalie: svg('<line x1="15" y1="110" x2="250" y2="110" stroke="#8cf" stroke-width="1.5"/>' +
      [6, 14, 28, 40, 34, 22, 12, 6, 3].map((v, i) => '<rect x="' + (20 + i * 14) + '" y="' + (110 - v * 2) + '" width="12" height="' + v * 2 + '" fill="#33aaff"/>').join('') +
      [[200, 6], [214, 10], [228, 4]].map((b) => '<rect x="' + b[0] + '" y="' + (110 - b[1] * 2) + '" width="12" height="' + b[1] * 2 + '" fill="#ff44cc"/>').join('') +
      '<line x1="185" y1="15" x2="185" y2="112" stroke="#ffd23f" stroke-width="2" stroke-dasharray="5,3"/>' + T(185, 12, 'seuil', '#ffd23f', 10, 'middle') +
      T(80, 124, 'normal : petite erreur', '#33aaff', 9, 'middle') + T(220, 124, 'anomalie', '#ff44cc', 9, 'middle') + T(20, 12, 'erreur de reconstruction →', '#8cf', 9)),

    lstm: svg('<rect x="40" y="20" width="180" height="90" rx="10" fill="#1a2a6c" stroke="#33aaff" stroke-width="1.8"/>' +
      '<line x1="10" y1="35" x2="250" y2="35" stroke="#ffd23f" stroke-width="2"/>' + T(12, 30, 'c(t−1)', '#ffd23f', 9) + T(222, 30, 'c(t)', '#ffd23f', 9) +
      [[70, 'oubli', '#ff44cc'], [130, 'entrée', '#3f8'], [190, 'sortie', '#8cf']].map((g) => '<circle cx="' + g[0] + '" cy="70" r="16" fill="#0b1030" stroke="' + g[2] + '" stroke-width="2"/>' + T(g[0], 74, g[1], g[2], 9, 'middle') + '<line x1="' + g[0] + '" y1="54" x2="' + g[0] + '" y2="37" stroke="' + g[2] + '" stroke-width="1.5"/>').join('') +
      T(130, 124, 'x(t) et h(t−1) entrent, h(t) sort', '#8cf', 9, 'middle')),

    seq2seq: svg(defs + box(5, 50, 44, 26, 'entrée') + box(60, 50, 40, 26, 'LSTM', '#ff44cc') + box(111, 50, 50, 26, 'Repeat', '#ffd23f') + box(172, 50, 36, 26, 'LSTM', '#3f8') + box(218, 50, 36, 26, 'LSTM', '#3f8') +
      arrow(49, 63, 59, 63) + arrow(100, 63, 110, 63) + arrow(161, 63, 171, 63) + arrow(208, 63, 217, 63) +
      T(80, 40, 'code', '#ff44cc', 10, 'middle') + T(80, 96, 'seq=False', '#8cf', 8, 'middle') + T(213, 96, 'seq=True', '#8cf', 8, 'middle') + T(136, 40, '×16 jours', '#ffd23f', 9, 'middle')),

    conv1d: svg(Array.from({ length: 8 }, (_, i) => '<rect x="' + (15 + i * 28) + '" y="35" width="24" height="40" rx="3" fill="' + (i < 5 ? '#9e2a6c' : '#1a2a6c') + '" stroke="#33aaff"/>' + T(27 + i * 28, 90, 'J' + (i + 1), '#8cf', 9, 'middle')).join('') +
      '<rect x="12" y="31" width="141" height="48" fill="none" stroke="#ffd23f" stroke-width="2.5" rx="4"/>' + T(82, 24, 'noyau de taille 5', '#ffd23f', 10, 'middle') +
      T(130, 116, '8 jours − 5 + 1 = 4 positions', '#8cf', 10, 'middle')),

    roc: svg(axes + '<line x1="20" y1="110" x2="240" y2="12" stroke="#555" stroke-dasharray="4,3"/>' +
      '<path d="M20,110 C30,40 70,22 240,12" fill="none" stroke="#33ff99" stroke-width="2.5"/>' +
      '<circle cx="20" cy="12" r="5" fill="#ffd23f"/>' + T(30, 16, 'idéal', '#ffd23f', 10) +
      T(150, 124, 'taux de faux positifs', '#8cf', 9, 'middle') + T(150, 80, 'hasard (AUC 0,5)', '#888', 9) + T(80, 50, 'modèle', '#3f8', 10)),

    bayes: svg(axes + '<path d="M20,70 C50,30 80,95 110,60 S170,20 200,55 S235,80 245,70" fill="none" stroke="#33aaff" stroke-width="2"/>' +
      '<path d="M20,85 C50,40 80,110 110,72 S170,30 200,70 S235,95 245,85 L245,55 C235,65 210,40 200,40 S160,10 110,48 S50,20 20,55 Z" fill="#33aaff" opacity=".15"/>' +
      [[45, 50], [110, 60], [190, 52]].map((p) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#fff"/>').join('') +
      '<line x1="160" y1="15" x2="160" y2="110" stroke="#ff44cc" stroke-width="2" stroke-dasharray="4,3"/>' + T(160, 12, 'prochain essai', '#ff44cc', 9, 'middle') +
      T(130, 124, 'hyperparamètre (ex. learning rate)', '#8cf', 9, 'middle'))
  };
})();

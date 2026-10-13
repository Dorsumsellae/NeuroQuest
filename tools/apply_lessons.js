// Applique les correctifs de micro-leçons des rapports d'audit (action "lesson").
// Usage : node tools/apply_lessons.js --prefix=prereq_ [--apply]
// Correctif : {"action":"lesson","lesson":"reg.mse","field":"p"|"ex"|"tip"|"title","op":"append"|"set","value":...}
//   p + append : ajoute une phrase (value = chaîne) ; set : remplace le champ (p = liste de phrases).
// Seul le bloc des leçons de chaque fichier est réécrit ; le reste (glossaire…) est conservé.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), AUDIT = path.join(ROOT, 'docs', 'audit'), CONTENT = path.join(ROOT, 'content');
const apply = process.argv.includes('--apply');
const prefix = (process.argv.find((a) => a.startsWith('--prefix=')) || '--prefix=prereq_').slice(9);

const patches = [];
for (const f of fs.readdirSync(AUDIT).filter((x) => x.startsWith(prefix) && x.endsWith('.md')).sort()) {
  const blocks = [...fs.readFileSync(path.join(AUDIT, f), 'utf8').matchAll(/```json\s*([\s\S]*?)```/g)];
  if (!blocks.length) continue;
  try { JSON.parse(blocks[blocks.length - 1][1]).filter((p) => p.action === 'lesson').forEach((p) => patches.push(Object.assign({ from: f }, p))); }
  catch (e) { console.log(f + ' : JSON invalide (' + e.message + ')'); }
}

// Charge chaque fichier de leçons en notant quelles clés il définit
global.window = {};
const files = fs.readdirSync(CONTENT).filter((f) => /^lessons.*\.js$/.test(f))
  .sort((a, b) => (a === 'lessons.js' ? -1 : b === 'lessons.js' ? 1 : a.localeCompare(b)));
const owner = {};
for (const f of files) {
  const before = new Set(Object.keys(window.NQ && window.NQ.lessons ? window.NQ.lessons : {}));
  require(path.join(CONTENT, f));
  for (const k of Object.keys(window.NQ.lessons)) if (!before.has(k)) owner[k] = f;
}
const L = window.NQ.lessons;
let ok = 0, bad = 0;
const touched = new Set();
for (const p of patches) {
  const les = L[p.lesson];
  if (!les || !['p', 'ex', 'tip', 'title'].includes(p.field)) { console.log('INVALIDE ' + JSON.stringify(p).slice(0, 160)); bad++; continue; }
  if (p.op === 'append' && p.field === 'p') les.p.push(p.value);
  else if (p.op === 'set') les[p.field] = p.value;
  else { console.log('OP INVALIDE ' + p.lesson); bad++; continue; }
  console.log('LEÇON ' + p.lesson + '.' + p.field + ' ' + p.op + ' : ' + String(JSON.stringify(p.value)).slice(0, 220));
  touched.add(owner[p.lesson]); ok++;
}
if (apply) {
  for (const f of touched) {
    const keys = Object.keys(owner).filter((k) => owner[k] === f);
    const body = keys.map((k) => JSON.stringify(k) + ': ' + JSON.stringify(L[k])).join(',\n');
    const lines = fs.readFileSync(path.join(CONTENT, f), 'utf8').replace(/\r\n/g, '\n').split('\n');
    const s0 = lines.findIndex((l) => /^(Object\.assign\(window\.NQ\.lessons, \{|window\.NQ\.lessons = \{)\s*$/.test(l));
    const e0 = lines.findIndex((l, i) => i > s0 && /^\}\)?;\s*$/.test(l));
    if (s0 < 0 || e0 < 0) { console.log('BLOC INTROUVABLE ' + f); bad++; continue; }
    fs.writeFileSync(path.join(CONTENT, f), lines.slice(0, s0 + 1).concat([body], lines.slice(e0)).join('\n'), 'utf8');
    console.log('ÉCRIT ' + f + ' (' + keys.length + ' leçons)');
  }
}
console.log((apply ? 'APPLIQUÉ' : 'À BLANC') + ' : ' + ok + ' correctif(s) de leçon, ' + bad + ' problème(s)');

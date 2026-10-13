// Ajoute de nouvelles notions proposées par les rapports d'audit (action "notion").
// Usage : node tools/apply_notions.js --prefix=cover_ [--apply]
// Correctif : {"action":"notion","after":"<id de notion existante>",
//              "notion":{"id","ch","label","fiche","section"},
//              "lesson":{"title","p":[...],"ex","tip","svg"?},
//              "items":[3 épreuves de campagne complètes (camp:true, src, notions:[id])]}
// La notion est insérée juste après "after" (donc à cette place dans la campagne), sa leçon dans le
// même fichier de leçons que "after", ses épreuves dans le même fichier camp_* que "after".
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), AUDIT = path.join(ROOT, 'docs', 'audit'), C = path.join(ROOT, 'content');
const apply = process.argv.includes('--apply');
const prefix = (process.argv.find((a) => a.startsWith('--prefix=')) || '--prefix=cover_').slice(9);
const rd = (f) => fs.readFileSync(path.join(C, f), 'utf8').replace(/\r\n/g, '\n').split('\n');
const isItem = (l) => /^\{"id":\s*"/.test(l || '');

const patches = [];
for (const f of fs.readdirSync(AUDIT).filter((x) => x.startsWith(prefix) && x.endsWith('.md')).sort()) {
  const blocks = [...fs.readFileSync(path.join(AUDIT, f), 'utf8').matchAll(/```json\s*([\s\S]*?)```/g)];
  if (!blocks.length) continue;
  try { JSON.parse(blocks[blocks.length - 1][1]).filter((p) => p.action === 'notion').forEach((p) => patches.push(Object.assign({ from: f }, p))); }
  catch (e) { console.log(f + ' : JSON invalide (' + e.message + ')'); }
}

global.window = {};
require(path.join(C, 'notions.js'));
const lessonFiles = fs.readdirSync(C).filter((f) => /^lessons.*\.js$/.test(f)).sort((a, b) => (a === 'lessons.js' ? -1 : b === 'lessons.js' ? 1 : a.localeCompare(b)));
const lessonOwner = {};
for (const f of lessonFiles) { const before = new Set(Object.keys((window.NQ.lessons) || {})); require(path.join(C, f)); for (const k of Object.keys(window.NQ.lessons)) if (!before.has(k)) lessonOwner[k] = f; }
const campFiles = fs.readdirSync(C).filter((f) => /^camp_.*\.js$/.test(f));
const campOwner = {}, allIds = new Set();
window.NQ.content = {};
for (const f of fs.readdirSync(C).filter((f) => /^(ch\d|camp_).*\.js$/.test(f))) require(path.join(C, f));
for (const [k, arr] of Object.entries(window.NQ.content)) for (const it of arr) { allIds.add(it.id); if (k.startsWith('camp_')) for (const n of it.notions) campOwner[n] = campOwner[n] || k + '.js'; }
const notionIds = new Set(window.NQ.notions.map((n) => n.id));

const files = {};
const get = (f) => (files[f] = files[f] || rd(f));
let ok = 0, bad = 0;
for (const p of patches) {
  const id = p.notion && p.notion.id;
  const err = [];
  if (!id || notionIds.has(id)) err.push('id absent ou déjà pris');
  if (!notionIds.has(p.after)) err.push('after inconnu');
  if (!p.lesson || !Array.isArray(p.lesson.p) || !p.lesson.title) err.push('leçon incomplète');
  if (!Array.isArray(p.items) || p.items.length < 3) err.push('moins de 3 épreuves');
  (p.items || []).forEach((it) => { if (allIds.has(it.id)) err.push('id épreuve déjà pris ' + it.id); if (!(it.notions || []).includes(id)) err.push('épreuve ' + it.id + ' sans la notion'); allIds.add(it.id); });
  if (err.length) { console.log('INVALIDE ' + (id || '?') + ' (' + p.from + ') : ' + err.join(', ')); bad++; continue; }
  notionIds.add(id);
  // registre
  const N = get('notions.js'), ai = N.findIndex((l) => l.startsWith('{"id":"' + p.after + '"'));
  if (!N[ai].endsWith(',')) N[ai] += ',';
  const nextIsItem = N.slice(ai + 1).some((l) => l.startsWith('{"id"'));
  N.splice(ai + 1, 0, JSON.stringify(p.notion) + (nextIsItem ? ',' : ''));
  // leçon
  const lf = lessonOwner[p.after], LL = get(lf);
  const s0 = LL.findIndex((l) => /^(Object\.assign\(window\.NQ\.lessons, \{|window\.NQ\.lessons = \{)\s*$/.test(l));
  LL.splice(s0 + 1, 0, JSON.stringify(id) + ': ' + JSON.stringify(p.lesson) + ',');
  lessonOwner[id] = lf;
  // épreuves de campagne
  const cf = campOwner[p.after], CL = get(cf);
  const last = CL.map((l, i) => (isItem(l) ? i : -1)).filter((i) => i >= 0).pop();
  if (!CL[last].endsWith(',')) CL[last] += ',';
  CL.splice(last + 1, 0, ...p.items.map((it, j) => JSON.stringify(it) + (j < p.items.length - 1 ? ',' : '')));
  campOwner[id] = cf;
  console.log('NOTION ' + id + ' après ' + p.after + ' -> ' + lf + ', ' + cf + ' (' + p.items.length + ' épreuves) : ' + p.lesson.title);
  ok++;
}
if (apply) for (const [f, lines] of Object.entries(files)) fs.writeFileSync(path.join(C, f), lines.join('\n'), 'utf8');
console.log((apply ? 'APPLIQUÉ' : 'À BLANC') + ' : ' + ok + ' notion(s), ' + bad + ' problème(s)');

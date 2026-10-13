// Applique les correctifs proposés par les rapports d'audit (docs/audit/audit_*.md, dernier bloc ```json).
// Usage : node tools/apply_audit.js            -> affiche les correctifs (à blanc)
//         node tools/apply_audit.js --apply    -> les applique aux fichiers content/chN.js
// Actions : edit (field, value), retag (value = liste de notions), remove (reason).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), AUDIT = path.join(ROOT, 'docs', 'audit'), CONTENT = path.join(ROOT, 'content');
const apply = process.argv.includes('--apply');
const prefix = (process.argv.find((a) => a.startsWith('--prefix=')) || '--prefix=audit_').slice(9);
const skip = new Set((process.argv.find((a) => a.startsWith('--skip=')) || '--skip=').slice(7).split(',').filter(Boolean));

// Correctifs de tous les rapports
const patches = [];
for (const f of fs.readdirSync(AUDIT).filter((x) => x.startsWith(prefix) && x.endsWith('.md')).sort()) {
  const md = fs.readFileSync(path.join(AUDIT, f), 'utf8');
  const blocks = [...md.matchAll(/```json\s*([\s\S]*?)```/g)];
  if (!blocks.length) { console.log(f + ' : aucun bloc json'); continue; }
  try { JSON.parse(blocks[blocks.length - 1][1]).forEach((p) => patches.push(Object.assign({ from: f }, p))); }
  catch (e) { console.log(f + ' : JSON invalide (' + e.message + ')'); }
}

// Fichiers de contenu : une épreuve par ligne
// Questions générales (ch1..ch4) et questions de campagne (camp_*), une épreuve par ligne
const files = {};
for (const name of ['ch1', 'ch2', 'ch3', 'ch4', 'camp_ch1', 'camp_ch2a', 'camp_ch2b', 'camp_ch3', 'camp_ch4']) {
  const p = path.join(CONTENT, name + '.js');
  if (fs.existsSync(p)) files[name] = { p, lines: fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').split('\n') };
}
const isItem = (l) => l && /^\{"id":\s*"/.test(l);
function find(id) {
  const re = new RegExp('^\\{"id":\\s*"' + id.replace(/[-]/g, '\\-') + '"');
  for (const F of Object.values(files)) {
    const i = F.lines.findIndex((l) => l && re.test(l));
    if (i >= 0) return { F, i };
  }
  return null;
}
const parse = (line) => { const comma = line.endsWith(','); return { obj: JSON.parse(comma ? line.slice(0, -1) : line), comma }; };

let ok = 0, bad = 0;
for (const p of patches) {
  if (p.action === 'lesson') continue; // traité par tools/apply_lessons.js
  if (skip.has(p.id)) { console.log('IGNORÉ  ' + p.id); continue; }
  const loc = find(p.id);
  if (!loc) { console.log('INTROUVABLE ' + p.id + ' (' + p.from + ')'); bad++; continue; }
  const { obj, comma } = parse(loc.F.lines[loc.i]);
  if (p.action === 'edit') {
    // champ simple ("why") ou chemin dans une liste ("items[4]", "pairs[2][1]")
    const keys = p.field.match(/[^.[\]]+/g).map((k) => (/^\d+$/.test(k) ? +k : k));
    let parent = obj;
    for (let k = 0; k < keys.length - 1; k++) parent = parent[keys[k]];
    const last = keys[keys.length - 1];
    if (parent == null || (keys.length > 1 && !(last in parent))) { console.log('CHEMIN INVALIDE ' + p.id + '.' + p.field); bad++; continue; }
    console.log('EDIT    ' + p.id + '.' + p.field + '\n   avant : ' + String(JSON.stringify(parent[last])).slice(0, 200) + '\n   après : ' + String(JSON.stringify(p.value)).slice(0, 200));
    parent[last] = p.value;
  } else if (p.action === 'retag') {
    console.log('RETAG   ' + p.id + ' : ' + JSON.stringify(obj.notions) + ' -> ' + JSON.stringify(p.value));
    obj.notions = p.value;
  } else if (p.action === 'replace') {
    // remplacement complet de l'épreuve (même id), ex. réécriture conceptuelle
    if (!p.value || p.value.id !== p.id) { console.log('REPLACE INVALIDE ' + p.id); bad++; continue; }
    console.log('REPLACE ' + p.id + '\n   avant : ' + String(obj.q).slice(0, 150) + '\n   après : ' + String(p.value.q).slice(0, 150));
    loc.F.lines[loc.i] = JSON.stringify(p.value) + (comma ? ',' : ''); ok++; continue;
  } else if (p.action === 'remove') {
    console.log('REMOVE  ' + p.id + ' : ' + (p.reason || ''));
    loc.F.lines[loc.i] = null; ok++; continue;
  } else if (p.action === 'lesson') { continue; // traité par tools/apply_lessons.js
  } else { console.log('ACTION INCONNUE ' + JSON.stringify(p)); bad++; continue; }
  loc.F.lines[loc.i] = JSON.stringify(obj) + (comma ? ',' : '');
  ok++;
}
if (apply) {
  for (const c of Object.keys(files)) {
    const F = files[c];
    let lines = F.lines.filter((l) => l !== null);
    // la dernière épreuve ne doit pas finir par une virgule
    const last = lines.map((l, i) => (isItem(l) ? i : -1)).filter((i) => i >= 0).pop();
    lines = lines.map((l, i) => (isItem(l) ? (i === last ? l.replace(/,$/, '') : (l.endsWith(',') ? l : l + ',')) : l));
    fs.writeFileSync(F.p, lines.join('\n'), 'utf8');
  }
}
console.log((apply ? 'APPLIQUÉ' : 'À BLANC') + ' : ' + ok + ' correctif(s), ' + bad + ' problème(s)');

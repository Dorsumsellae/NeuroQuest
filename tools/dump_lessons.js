// Charge les fichiers de leçons et de glossaire comme le navigateur et imprime {lessons, glossary} en JSON.
// Utilisé par tools/check_content.py (lecture fiable, même avec des accolades dans le texte).
const path = require('path'), fs = require('fs');
global.window = {};
const dir = path.join(__dirname, '..', 'content');
['glossary.js'].concat(fs.readdirSync(dir).filter((f) => /^lessons.*\.js$/.test(f)).sort())
  .forEach((f) => require(path.join(dir, f)));
process.stdout.write(JSON.stringify({ lessons: window.NQ.lessons || {}, glossary: window.NQ.glossary || [] }));

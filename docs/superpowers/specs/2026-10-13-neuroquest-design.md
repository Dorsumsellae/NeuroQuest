# NeuroQuest – design (13 octobre 2026)

Jeu de révision du module Deep Learning (Mastère 2 IA, Hexagone). Inspiré du prototype « Neuro Runner », étendu pour couvrir toutes les notions des 4 chapitres et pour donner envie de rejouer après l'examen.

## Intention validée avec l'utilisateur

- Réviser **toutes** les notions des fiches `Revisions/01` à `04` ; pas de dates ni d'historique.
- Joueur solo pour l'instant ; classement partagé via Firebase dans un second temps (module isolé).
- Cœur : runner 3 couloirs + mini-jeux (bug, calcul, ordre, association).
- Progression : pass de combat saisonnier à paliers, maîtrise par notion, difficultés et boss.
- Contraintes : s'ouvre en double-clic (file://), hors ligne, PC et téléphone, questions rédigées à la main à partir des fiches vérifiées.

## Architecture (approche retenue : fichiers séparés, sans build)

```
NeuroQuest/
  index.html              page unique, charge les scripts classiques (pas de modules ES, compatible file://)
  css/style.css
  lib/three.min.js        three.js r128 vendorisé (hors ligne)
  content/notions.js      registre des notions : window.NQ.notions = [{id, ch, label}]
  content/ch1.js…ch4.js   épreuves par chapitre : window.NQ.content.chN = [ ...JSON strict... ]
  js/core.js              état, sauvegarde localStorage, tirage pondéré des épreuves
  js/progression.js       XP, niveaux, pass de combat, maîtrise, récompenses
  js/leaderboard.js       interface {submit, top} ; implémentation locale ; Firebase plus tard
  js/runner.js            scène three.js, portes, boucle d'animation
  js/minigames.js         salles : bug, calcul, ordre, assoc (DOM, tactile)
  js/ui.js                menus, HUD, carte de maîtrise, pass, boss, export/import
  js/main.js              câblage
  tools/check_content.py  validateur du contenu (couverture des notions, doublons, schéma)
```

## Contenu

Épreuve = `{id, type, ch, notions:[ids], diff:1-3, q, ...champs selon type, why, whyNot}`.

| type | champs | rendu |
|---|---|---|
| choix | `ok`, `ko:[2]` | porte du runner (3 panneaux) |
| calcul | `ok`, `ko:[2]`, optionnel `code` | porte du runner, avec bloc de code / matrice affiché dans le HUD |
| bug | `code:[lignes]`, `line` (index fautif) | salle : cliquer la ligne |
| ordre | `items:[ordre correct]` | salle : réordonner avec ▲▼ ou glisser |
| assoc | `pairs:[[terme, définition]×4]` | salle : relier par clics successifs |

Objectif v1 : ≈160 épreuves, chaque notion couverte au moins une fois (contrôlé par `check_content.py`).

## Boucle de jeu

- Menu : chapitre (1-4 ou mix), difficulté, boss, carte de maîtrise, pass, options.
- Runner : porte toutes les ~150 unités ; au passage, jugement, feedback (juste / faux + explications), reprise sur Espace ou tap.
- Toutes les 4 portes : salle de mini-jeu (overlay), chrono selon difficulté, le runner est en pause.
- Difficultés (ajout du 13/10 au soir) : **Découverte (niveau 0)** = 15 questions de compréhension seulement (type `choix`, diff ≤ 2, sans code), pas de vies, pas de salle, vitesse 12 ; Facile 5 vies, vitesse 14 ; Normal 3 vies, vitesse 17 ; Expert 2 vies, vitesse 22. Une porte part à 120 unités : temps d'arrivée ≈ 10 / 8,6 / 7 / 5,5 s au début de partie.
- Salle « ordre » : glisser-déposer par poignée ⠿ (Pointer Events, souris et tactile) en plus des boutons ▲▼. Pass : aperçu 3D du skin sélectionné (second renderer three.js, détruit à la fermeture), cliquable même verrouillé.
- Les épreuves ont un champ optionnel `ctx` (contexte affiché au-dessus de la question) pour être répondables sans se souvenir du slide.
- Fin de partie : vies à 0 (Facile 5, Normal 3, Expert 2) ou 15 questions en Découverte. Score = 100 × multiplicateur de série (1 à 4) × bonus difficulté (1 / 1.25 / 1.5).
- Boss de chapitre : 10 épreuves mixtes à vitesse Expert, 1 vie, sans explications pendant l'enchaînement (bilan à la fin). Victoire : skin unique + accès pass Élite.

## Progression

- XP : +10 par porte juste, +25 par salle réussie, ×1.5 en Expert ; série de 3 → ×2, 6 → ×3.
- Niveau = palier du pass : 20 paliers, coût croissant (100, 120, 140 … XP).
- Pass « Saison 1 : Fondamentaux » : piste gratuite (skins, traînées, titres) et piste Élite (débloquée par n'importe quel boss). Pas de paiement, même fictif.
- Maîtrise par notion : 0-100, +15 juste, −20 faux (borné). Poids de tirage = (100 − maîtrise) + 15 × jours depuis la dernière vue + 10. Carte de maîtrise : jauges groupées par chapitre, avec le libellé de la notion.

## Données (localStorage, clé `nq_profile_v1`)

`{xp, difficulty, equipped:{skin, trail, title}, unlocked:[], elite:false, bosses:{1:false…}, mastery:{notionId:{m, last, ok, ko}}, stats:{games, best, answers}}` + export / import JSON. Classement local : clé `nq_scores` (20 meilleurs, par difficulté).

## Tests

- `tools/check_content.py` : chaque fichier de contenu est du JSON strict après le préfixe `window.NQ.content.chN =` ; vérifie le schéma, l'unicité des ids, la présence des notions référencées, la couverture de toutes les notions, pas de bonne réponse présente dans les mauvaises.
- Test manuel dans Chrome (file://) : aucune erreur console, une partie complète par difficulté, chaque type de salle, un boss, export / import.

## Codex (fiches de révision dans le jeu)

- Source unique : les fichiers Markdown de `Revisions/00` à `04`. `tools/build_codex.py` les découpe par titres (H2/H3) et écrit `content/codex.js` (`window.NQ.codex`). Rendu dans le jeu avec `lib/marked.min.js` (vendorisé).
- Chaque notion du registre référence sa fiche et un fragment de titre (`fiche`, `section`). Le feedback d'une erreur propose « Réviser dans le Codex », qui ouvre la section, puis « Reprendre ».
- Chaque page affiche la jauge de maîtrise et l'état Découverte / En cours / Maîtrisée ; le menu affiche la collection (notions rencontrées / total).
- Tout est lisible sans déblocage. Lire une fiche de chapitre dans les 30 minutes précédant son boss donne un bouclier (une erreur pardonnée).
- Depuis une page du Codex : « M'entraîner » lance 5 portes ciblées sur la notion, sans vies ni salle.
- Les fiches 05 (exercices) et 06 (QCM) ne sont pas dans le Codex : elles alimentent les épreuves.

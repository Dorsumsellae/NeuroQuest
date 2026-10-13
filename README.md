# NeuroQuest – réviser le Deep Learning en jouant

Jeu de révision du module Deep Learning (Mastère 2 IA, Hexagone). On pilote un vaisseau dans un tunnel à trois couloirs : chaque porte pose une question, les salles proposent des mini-jeux (chasse au bug, remise en ordre, association), et toute erreur renvoie à la fiche de cours correspondante dans le Codex. La progression reprend les codes des jeux en ligne : pass de combat, skins, boss de chapitre, carte de maîtrise.

Le contenu couvre les quatre chapitres du cours : régressions et descente de gradient, neurones / MLP / CNN, autoencodeurs et U-Net, détection d'anomalies. Pas de dates ni d'historique.

**Idée originale : Maxence.** Le concept du jeu (réviser le cours en courant dans un tunnel, avec skins et pass de combat) vient de son prototype Neuro Runner, dont NeuroQuest est le prolongement.

---

## 1. Lancer le jeu

- **PC** : double-cliquer sur `index.html` (Chrome ou Edge). Aucune installation, aucun serveur, fonctionne hors ligne.
- **Téléphone** : copier le dossier complet sur le téléphone et ouvrir `index.html`, ou déposer le dossier sur n'importe quel hébergement statique (GitHub Pages, Netlify…) et ouvrir le lien.
- **Commandes** : ← → (ou A / D, Q / D) pour changer de couloir ; **Espace** met en pause et affiche la solution (porte ou salle) ; **↑** (ou W / Z, ou Entrée) passe à la suite après un feedback, et maintenue pendant l'approche d'une porte elle accélère ; Échap ferme une fenêtre. Sur mobile : balayer vers la gauche ou la droite ou utiliser ◀ ▶, le bouton 💡 Solution sous la question, et ⏩ pour passer (appui) ou accélérer (maintien).
- **Indices** (touche H ou bouton 🔎) : le premier rappelle la phrase clé de la notion et ralentit la porte ; le second élimine une mauvaise réponse (porte), ne laisse que deux lignes possibles (chasse au bug), place le premier élément (ordre) ou relie une paire (association). L'XP et le score de la réponse sont réduits (60 % puis 30 %). Pas d'indice pendant un boss.
- **Demander la solution** rompt la série et fait baisser la maîtrise de la notion, mais ne coûte pas de vie, sauf pendant un boss où cela compte comme une erreur.

La sauvegarde est dans le navigateur (localStorage). Pour changer d'appareil : Options → Exporter, puis Options → Importer sur l'autre appareil.

## 2. Comment jouer

### Les modes

| Mode | Déroulement |
|---|---|
| **Campagne guidée** (recommandé pour débuter) | Une étape par notion, dans l'ordre du cours : la leçon de la notion, puis jusqu'à 3 questions faciles dessus. Au plus une erreur sur 3 pour valider ; pas de vies, indices et solution autorisés. Chaque étape validée ouvre la suivante (+30 XP la première fois). Quand un chapitre est terminé, la campagne propose son boss. Les étapes validées restent rejouables. |
| **Partie** (chapitre 1 à 4 ou Mix) | Enchaînement de portes (questions à 3 choix, calculs) et, toutes les 4 épreuves environ, une salle de mini-jeu. On perd une vie par erreur ; la partie s'arrête à 0 vie. |
| **Découverte** (niveau 0) | 15 questions de compréhension des notions, sans code ni calcul, sans vies ni salle, à vitesse lente. Idéal pour un premier passage ou pour vérifier qu'on a compris avant de passer aux niveaux suivants. |
| **Boss** (un par chapitre) | 10 épreuves mixtes à vitesse Expert, une seule vie, pas d'explication entre les épreuves (bilan complet à la fin). Victoire : skin unique du chapitre, piste Élite du pass, +200 XP. Lire la fiche du chapitre dans le Codex moins de 30 minutes avant donne un **bouclier** : une erreur pardonnée. |
| **Entraînement ciblé** | Depuis la carte de maîtrise ou le Codex, « M'entraîner » lance 5 portes sur une seule notion, sans vies ni score. |

### Les difficultés

| Niveau | Épreuves tirées | Vies | Salles | Temps d'arrivée d'une porte |
|---|---|---|---|---|
| Découverte | questions de compréhension seulement (niveau 1-2, sans code) | ∞ | aucune | 10 s → 8 s |
| Facile | toutes, surtout niveaux 1-2 | 5 | sans chrono | 8,6 s → 6 s |
| Normal | toutes | 3 | 45 s | 7 s → 4 s |
| Expert | toutes, surtout niveaux 2-3 ; XP et score ×1,5 | 2 | 25 s | 5,5 s → 3 s |

La vitesse augmente à chaque bonne réponse jusqu'au plafond du niveau.

### Les salles (mini-jeux)

- **Chasse au bug** : un code de 4 à 7 lignes, toucher la ligne fautive.
- **Remise en ordre** : glisser les lignes par la poignée ⠿ (souris ou doigt) ou utiliser ▲ ▼, puis Valider.
- **Association** : toucher un terme puis sa définition pour les relier, puis Valider.

### Apprendre avant d'être interrogé

- **Micro-leçon** : la première fois qu'une notion apparaît (hors boss), le jeu s'arrête sur une carte : un titre parlant, un schéma, 3 à 5 phrases simples, un exemple chiffré et une phrase à retenir. ↑ ou « C'est parti » lance la question. Les 68 notions ont leur leçon ; on peut les relire depuis la carte de maîtrise (📘) ou le Codex (📘 Leçon).
- **Glossaire au toucher** : les termes techniques (83 termes) sont soulignés en pointillés dorés dans les questions, les salles, les explications et les leçons ; un toucher affiche leur définition en une phrase.

### Après chaque réponse

Le feedback commence par **💬 En clair** : une ou deux phrases en mots de tous les jours, souvent avec une image (une pente qu'on descend, un détecteur de fumée…). Viennent ensuite la version précise avec le vocabulaire du cours, pourquoi elle est juste, pourquoi les autres sont fausses, et un bouton **Réviser dans le Codex** qui ouvre la section de la fiche correspondant à la notion. Le jeu reprend dès qu'on appuie sur ↑ (ou Entrée, ou le bouton), et automatiquement après 5 secondes ; ce délai se règle dans les Options (désactivé, 5 s, 10 s) et se met en pause tant que le Codex est ouvert. C'est le cœur de l'apprentissage : l'erreur mène à la fiche, la fiche mène à la prochaine réussite.

### Son et sensations

- **Musique d'ambiance** synthétisée en direct (nappe et arpège sur quatre accords, aucun fichier audio), démarrée au premier clic ou à la première touche. Coupable dans Options.
- **Effets sonores** : carillon de bonne réponse, grave d'erreur, souffle qui monte pendant l'accélération. Programmés sur l'horloge audio, donc sans décalage même quand le rendu est chargé.
- **Effet de vitesse** pendant l'accélération : champ de vision élargi, étoiles étirées, anneaux dilatés, lignes de vitesse et vignette.
- **Vibration** du téléphone en cas d'erreur (si le navigateur le permet). Désactivable dans Options.

## 3. Progression

- **XP** : 10 × difficulté de l'épreuve (1 à 3) par porte réussie, 25 × difficulté par salle réussie, ×1,5 en Expert, multiplicateur de série (×2 à partir de 3 bonnes réponses d'affilée, ×3 à partir de 6).
- **Pass de combat « Saison 1 : Fondamentaux »** : 20 paliers de coût croissant. Deux pistes : Gratuite et Élite (débloquée en battant n'importe quel boss). Récompenses : skins (forme et couleur du vaisseau), sillages (couleur de la traînée), titres affichés dans le HUD et le classement. L'aperçu 3D du pass montre la récompense sélectionnée, même verrouillée. Aucun achat, même fictif.
- **Carte de maîtrise** : chaque notion a une jauge de 0 à 100 (+15 par bonne réponse, −20 par erreur, pondérés par la difficulté). Le jeu tire plus souvent les notions faibles ou pas vues depuis longtemps (répétition espacée). États : Découverte, En cours, Maîtrisée. Le menu affiche la collection (notions rencontrées / 68).
- **Classement** : local pour l'instant, par difficulté, 50 meilleurs scores. Score = 100 × multiplicateur de série × bonus de difficulté (0,5 / 1 / 1,25 / 1,5), doublé pour une salle.

## 4. Le Codex

Les cinq fiches de révision (sommaire, régressions, neurones et CNN, autoencodeurs et anomalies, lecture de code) sont lisibles dans le jeu, section par section, avec une recherche. Chaque notion du registre connaît sa fiche et sa section : le feedback d'une erreur et la carte de maîtrise ouvrent directement le bon paragraphe. Lire une fiche marque le chapitre comme révisé pour le bouclier du boss.

## 5. Organisation du dossier

```
index.html                 page du jeu (scripts classiques, compatible file://)
css/style.css
lib/three.min.js           three.js r128, copie locale (hors ligne)
lib/marked.min.js          marked 4.3, rendu Markdown du Codex
content/notions.js         registre des 68 notions : id, chapitre, libellé, fiche + section du Codex
content/ch1.js … ch4.js    192 épreuves (134 choix, 24 calculs, 16 bugs, 9 ordres, 9 associations), JSON strict
content/codex.js           fiches de révision, GÉNÉRÉ par tools/build_codex.py (ne pas éditer à la main)
content/glossary.js        glossaire de base (les fichiers de leçons y ajoutent leurs termes)
content/lessons*.js        68 micro-leçons (une par notion) + termes de glossaire par chapitre
js/schemas.js              23 schémas SVG des leçons
js/ui_lesson.js            affichage des leçons et bulles du glossaire
js/core.js                 état, sauvegarde, tirage pondéré des épreuves, maîtrise
js/audio.js                sons, musique procédurale, souffle d'accélération, vibrations (Web Audio)
js/progression.js          XP, paliers, récompenses du pass, skins de boss
js/firebase-config.js      configuration Firebase (null = classement local)
js/leaderboard.js          classement : local (localStorage) ou partagé (Firestore) derrière la même interface
js/runner.js               scène three.js : tunnel, vaisseau, sillage, portes
js/minigames.js            salles : bug, ordre (glisser-déposer), assoc
js/ui.js                   menu, HUD, feedback, fin de partie, dialogues
js/ui_codex.js             Codex
js/ui_views.js             carte de maîtrise, pass (avec aperçu 3D), classement, options, choix du boss
js/main.js                 contrôleur de partie : flux, jugement, score, boss, flash, entrées
tools/check_content.py     validateur du contenu
tools/build_codex.py       reconstruit content/codex.js à partir de ../Revisions/*.md
docs/superpowers/specs/    document de design
```

## 6. Modifier le contenu

### Mettre à jour les fiches du Codex

Les fiches sources sont les fichiers Markdown du dossier `../Revisions` (00 à 04). Après une modification :

```
python tools/build_codex.py
```

### Ajouter ou corriger des épreuves

Éditer `content/chN.js` en respectant le schéma (JSON strict, guillemets doubles, pas de virgule finale).

Champs communs : `id` (unique, ex. `c2-72`), `type`, `ch` (1 à 4), `notions` (liste d'ids du registre), `diff` (1 à 3 : multiplie l'XP et le gain de maîtrise ; Découverte ne tire que les niveaux 1-2), `q` (question), `plain` (explication en clair pour débutant, 45 mots maximum, affichée en premier), `why` (pourquoi la bonne réponse est juste, version précise), `whyNot` (pourquoi les autres sont fausses), `ctx` optionnel (une ou deux phrases de contexte affichées au-dessus de la question : modèle, dataset, hypothèses).

| type | champs spécifiques | rendu |
|---|---|---|
| `choix` | `ok`, `ko` (2 mauvaises réponses) | porte du runner |
| `calcul` | `ok`, `ko`, `code` optionnel (affiché dans un bloc monospace) | porte du runner |
| `bug` | `code` (liste de lignes), `line` (index 0-based de la ligne fautive) | salle |
| `ordre` | `items` (dans l'ordre correct, 4 à 8) | salle |
| `assoc` | `pairs` (4 paires `[terme, définition]`) | salle |

Exemple :

```json
{"id":"c1-45","type":"choix","ch":1,"notions":["reg.eta"],"diff":1,
 "ctx":"Descente de gradient sur une régression linéaire.",
 "q":"La MSE augmente à chaque itération. Cause la plus probable ?",
 "ok":"Learning rate trop grand","ko":["Learning rate trop petit","Trop d'échantillons"],
 "why":"Un pas trop grand dépasse le minimum et fait diverger.",
 "whyNot":"Un η trop petit ralentit sans faire diverger ; le nombre d'échantillons ne change pas le sens de la descente."}
```

Règles de rédaction :
- **Tester un concept, pas un exemple** : la question doit être répondable par quelqu'un qui a compris la notion, sans avoir mémorisé un dataset, une figure ou un chiffre du cours. Toutes les données utiles vont dans `q`, `ctx` ou `code`.
- **Calculs faisables de tête** (pas de calculatrice au contrôle) : petits nombres, ou bien faire reconnaître l'expression (« 784 × 128 + 128 ») plutôt que son résultat.
- Questions de campagne (`content/camp_*.js`, `"camp": true`) : 3 par notion, dans l'ordre idée, compréhension, piège.

Puis valider :

```
python tools/check_content.py
```

Les audits de contenu (contre les PDF du cours) sont dans `docs/audit/`. `node tools/apply_audit.js --prefix=<rapport>` affiche les correctifs proposés par un rapport, `--apply` les applique.

Le validateur vérifie le schéma, l'unicité des ids, l'existence des notions référencées, la couverture de toutes les notions par au moins une épreuve, l'absence de la bonne réponse parmi les mauvaises, et la validité de l'index de ligne des bugs.

### Ajouter une notion

Ajouter une entrée dans `content/notions.js` : `{"id":"ch.nom","ch":N,"label":"…","fiche":"0N","section":"fragment du titre de section"}`. Le `section` est recherché (sans casse) dans les titres de la fiche pour ouvrir le Codex au bon endroit. Le validateur exigera ensuite au moins une épreuve sur cette notion.

## 7. Classement partagé (Firebase, gratuit)

Le classement est local par défaut. Pour un classement commun à toute la promo, suivre `docs/FIREBASE.md` : créer un projet Firebase (offre gratuite, sans carte bancaire), coller sa configuration dans `js/firebase-config.js`, publier les règles Firestore fournies. Le jeu charge alors le SDK Firebase à la demande, envoie chaque score dans la collection `scores` et affiche le classement partagé ; hors ligne, il retombe sur le classement local.

## 8. Jouer en ligne

Le jeu est publié sur GitHub Pages : https://dorsumsellae.github.io/NeuroQuest/ (mis à jour à chaque `git push` sur `main`). La sauvegarde reste dans le navigateur de chaque joueur.

## 9. Vérifications effectuées

- Contenu relu par quatre relectures indépendantes contre le texte des slides ; nombres de paramètres et shapes des réseaux recalculés avec Keras.
- Chargement depuis `file://` sans erreur console ; parties complètes testées en Découverte, Normal et Expert (fin par vies), boss avec bouclier, salles bug / ordre / assoc, glisser-déposer, Codex, export / import, mise en page vérifiée en 390 × 844.
- Non testé sur un téléphone physique : le balayage tactile et les boutons ◀ ▶ sont implémentés mais n'ont été exercés qu'en émulation.

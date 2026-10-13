# Audit des épreuves du chapitre 4 (`content/ch4.js`)

Source de vérité : `Cours/IA-Hexagone-4.Pratique-Autoencodeurs.pdf` (20 slides), schémas vérifiés sur les pages rendues en image (slides 5, 6, 9-18).
Le lab (notebook) fait partie du cours pratique : une épreuve HORS-PDF qui porte sur le lab reste utile pour l'examen ; le verdict signale seulement que le PDF ne permet pas de la vérifier.

Bilan : **44 épreuves** — OK 15 · HORS-PDF 25 · ERREUR 1 · AMBIGU 2 · MAL-TAGUÉ 1.

## Tableau

| id | verdict | justification |
|---|---|---|
| c4-01 | OK | Slides 3-4 : Backblaze, features de disques durs, stockage journalier. |
| c4-02 | OK | Slide 4 : définition de Failure, citée mot pour mot. |
| c4-03 | OK | Slide 4 : « 90 colonnes … issues de 45 données brutes et normalisées ». La mention « le lab ne garde que les brutes » est cohérente avec les 21 histogrammes `*_raw` du slide 5. |
| c4-04 | OK | Slide 18 : séquences de S jours × 21 features d'un disque. |
| c4-05 | HORS-PDF | Lab : train sans séquence finissant par une panne (citation du notebook). Le PDF ne le dit pas (seulement implicite slides 9-10). Utile. |
| c4-06 | OK | Slide 6 : « modèle adapté aux séries / time series ». |
| c4-07 | OK | Slide 6 : forget / input / output gate sur le schéma. |
| c4-08 | OK | Slide 6, légende : logistic pour f, i, o ; tanh pour g et avant l'output gate. La remarque sur `activation='relu'` vient du lab. |
| c4-09 | OK | Slide 11 : Input → LSTM → Repeat Vector → LSTM → LSTM → Output. |
| c4-10 | HORS-PDF | Repeat Vector est sur le slide 11, mais « recopier S fois » vient du lab (`RepeatVector(sequence_length)`). |
| c4-11 | HORS-PDF | `return_sequences` n'apparaît pas dans le PDF (code Keras du lab). |
| c4-12 | HORS-PDF | Calcul de shapes sur le code Keras du lab (le lab utilise 128, la question 64 : sans conséquence). |
| c4-13 | HORS-PDF | Position du code : déductible du slide 11, dimension `lstm_width` = lab. |
| c4-14 | OK | Slide 12 : convolution le long des jours. **Mais** le `why` dit « en couvrant toutes les features », alors que les slides 12-13 dessinent un noyau par colonne de feature (correctif proposé). |
| c4-15 | AMBIGU | Résultat (4, 5) conforme au slide 13, mais « 5 filtres » n'est pas dans le PDF : sur le slide 13, la colonne j de la sortie provient de la feature j (cadre rose feature 1 jours 1-5 → case (1,1) ; cadre brun feature 5 jours 4-8 → case (4,5)). L'étudiant peut croire que les 5 colonnes de sortie sont les 5 features. Reformuler sans « filtres ». |
| c4-16 | HORS-PDF | Le slide 14 montre 2 Maxpooling et 2 Upsampling, mais le facteur 2 (16 → 8 → 4) vient du lab. |
| c4-17 | OK | Slide 14, citation exacte. |
| c4-18 | OK | Slide 14, architecture complète (5 Conv 1D, 2 Maxpooling, 2 Upsampling). |
| c4-19 | HORS-PDF | StandardScaler : lab uniquement. |
| c4-20 | HORS-PDF | Format (n_seq, S, n_features) : lab ; le slide 18 montre seulement S × 21. |
| c4-21 | HORS-PDF | Règle de seuil : lab ; idée illustrée par les erreurs 0.0215 / 4.5252 des slides 9-10. |
| c4-22 | HORS-PDF | `sort_mse[num_normal_disks]` : lab. |
| c4-23 | HORS-PDF | Compromis rappel / faux positifs : lab. |
| c4-24 | HORS-PDF | Citation du notebook sur le rappel. |
| c4-25 | HORS-PDF | Hors PDF **et** hors lab / leçon (quantile sur données normales) : connaissance générale. Réponse correcte et utile en diff 3 ; pourrait préciser que la ROC demande des labels de validation. |
| c4-26 | HORS-PDF | ROC : lab. |
| c4-27 | HORS-PDF | ROC / AUC : lab. |
| c4-28 | OK | Slides 15-17 : optimisation des paramètres, carte (lstm_width, learning_rate). Dropout / filtres de l'exercice Conv1D = lab. |
| c4-29 | OK | Slide 15 : moyenne et variance du processus gaussien, fonction d'acquisition. |
| c4-30 | HORS-PDF | `init_points` / `n_iter` : API bayes_opt du lab. |
| c4-31 | ERREUR | Slide 17 : les bons points (gros, jaunes) sont à lr ≈ 1,5·10⁻³ – 3,5·10⁻³ pour **toutes** les largeurs : 3, 14, 15 à lstm_width ≈ 44-56, 10 et 13 à ≈ 116 ; le point 1 (width ≈ 32) est aussi correct. « Et largeur LSTM élevée » n'est pas soutenu, et le distracteur « Largeur LSTM minimale » n'est pas clairement faux. Le discriminant est le learning rate (points 0, 4, 5, 6, 7, 11 à lr ≥ 10⁻² : quasi nuls). |
| c4-32 | HORS-PDF | « 15 à 20 minutes pour 16 essais » et la comparaison avec la grille : lab. Principe compatible avec les slides 15-17. |
| c4-33 | OK | Slide 20, citation exacte. |
| c4-34 | HORS-PDF | `metrics=['accuracy']` sur l'AE Conv1D : lab. Très bon piège. |
| c4-35 | HORS-PDF | `loss='mae'` : lab. |
| c4-36 | MAL-TAGUÉ | ModelCheckpoint / val_loss n'a rien à voir avec le prétraitement (`ano.pretraitement`) : relève de `nn.validation` seul. HORS-PDF (lab). |
| c4-37 | HORS-PDF | Pipeline du notebook. L'étape ROC est évaluée sans tag `ano.roc`. |
| c4-38 | AMBIGU | L'ordre est juste, mais la question dit « les couches de l'AE Conv1D du cours » alors que la liste (1 pooling, 1 up-sampling, 3 Conv1D) est une version réduite du slide 14 (2 pooling, 2 up-sampling, 5 Conv 1D). Risque de mémoriser une architecture fausse. |
| c4-39 | OK | Forget gate (slide 6), RepeatVector (slide 11), MaxPooling (slide 14) ; « pool_size 2 » et seuil = lab. |
| c4-40 | HORS-PDF | Rappel, faux positif, AUC : lab ; fonction d'acquisition : slide 15. |
| c4-41 | HORS-PDF | Code Keras du lab (`return_sequences`). Utile. |
| c4-42 | HORS-PDF | Fuite de données du StandardScaler : lab. Utile. |
| c4-43 | HORS-PDF | Seuil inversé : lab. Utile. |
| c4-44 | HORS-PDF | Train sans panne : lab. Utile. |

## Contradictions entre micro-leçons (`lessons_ch34.js`) et PDF

1. **`ano.conv1d`** : la leçon dit « Le noyau couvre plusieurs jours consécutifs et toutes les features à la fois » et « Le nombre de colonnes de sortie est égal au nombre de filtres ». Les slides 12-13 dessinent un noyau de taille 5 **par colonne de feature** (5 cadres verts), et la sortie (4, 5) a une colonne par feature (cadre rose feature 1 → case (1,1), cadre brun feature 5 → case (4,5)). Le PDF ne parle jamais de filtres. La formule de la leçon correspond à Keras et donne la même shape ici, mais elle contredit le schéma : il faut nuancer (« sur le schéma du cours, une colonne de sortie par feature ; en Keras, une colonne par filtre »).
2. **`ano.bayes`** (exemple) : « Les bons modèles sont à learning rate faible (≈ 10⁻³) et grande largeur ». Le slide 17 montre de bons modèles à faible largeur (points 3, 14, 15 vers 44-56) : seul le learning rate est discriminant. Les points 8 et 9 (lr ≈ 5·10⁻⁴) sont un peu moins bons que ceux à 1,5-3,5·10⁻³ : « ≈ 10⁻³ » est acceptable, « grande largeur » ne l'est pas.
3. **`ano.bayes`** : le slide 16 affiche un « objective » (0.0043 pour l'essai qui diverge, 0.5567 pour le bon) ; ce score est **maximisé** (plus haut = meilleur). La leçon n'en parle pas, alors qu'un étudiant peut lire 0.0043 comme « meilleure loss ». À ajouter dans la leçon.
4. Pas de contradiction, mais du **hors PDF présenté comme cours** dans les leçons : `ano.seq2seq` (`return_sequences`, tanh, loss MAE, lstm_width = 128), `ano.conv1d_vs_lstm` (21 filtres de noyau 1, goulot (4, 4)), `ano.dataset` (« 256 pannes pour environ 3 millions d'échantillons »), `ano.sequences` (fenêtre glissante de 8 jours), `ano.transformers` (« regardent tous les pas de temps à la fois », « beaucoup plus de données » : le PDF dit seulement « surcharge significative »). Tout cela vient du lab ou de connaissances générales.
5. `ano.pretraitement`, `ano.seuil`, `ano.roc` : entièrement hors PDF (lab). Les questions de campagne correspondantes sont marquées `"src":"hors PDF (lab) : …"`.

## Notions du PDF non couvertes par une notion `ano.*`

- **Slides 7-10 : auto-encodeur pour la détection d'anomalies** (goulot, erreur de reconstruction X − X̃, exemple chiffré 0.0215 pour un échantillon normal contre 4.5252 pour un anormal). Couvert seulement par `ae.anomalie` (chapitre 3) : la campagne du chapitre 4 n'a pas d'étape pour ce cœur du cours (les questions k4-18 et k4-22 s'y appuient indirectement). Une notion `ano.reconstruction` serait utile.
- **Slide 8 : AE adapté aux séries temporelles** (courbe d'entrée, reconstruction, superposition « Reconstruction vs Input »). Aucune notion.
- **Slide 5 : distribution des features** (21 histogrammes `smart_*_raw`, disques normaux contre disques en panne, échelle log). Aucune notion ; `ano.dataset` ne cite que le nombre de features.
- **Slide 16 : score « objective » maximisé** par l'optimisation bayésienne (voir contradiction 3).
- Slide 19 (consignes de l'exercice : Colab, dossier data) : logistique, pas besoin de notion.

## Correctifs proposés

```json
[
  {"id":"c4-31","action":"edit","field":"ok","value":"Learning rate faible (≈ 10⁻³ à quelques 10⁻³), quelle que soit la largeur"},
  {"id":"c4-31","action":"edit","field":"ko","value":["Learning rate élevé (≥ 10⁻²), quelle que soit la largeur","Largeur maximale (≈ 120) uniquement, quel que soit le learning rate"]},
  {"id":"c4-31","action":"edit","field":"why","value":"Slide 17 : les bons points (gros, jaunes) sont à lr ≈ 1,5·10⁻³ – 3,5·10⁻³, aussi bien à lstm_width ≈ 44-56 (points 3, 14, 15) qu'à ≈ 116 (10, 13). Slide 16 : avec lr 0.0227 la loss remonte vers 0.5 et stagne ; avec lr 0.0035 elle décroît régulièrement."},
  {"id":"c4-31","action":"edit","field":"whyNot","value":"Les points à lr ≥ 10⁻² (0, 4, 5, 6, 7, 11) ont les plus mauvais scores ; les bons points couvrent de petites et de grandes largeurs : la largeur n'est pas le facteur décisif."},
  {"id":"c4-15","action":"edit","field":"q","value":"Entrée (8 jours, 5 features), noyau de taille 5 glissant sur les jours, sans padding (slide 13). Shape de sortie ?"},
  {"id":"c4-15","action":"edit","field":"why","value":"8 − 5 + 1 = 4 pas de temps ; slide 13 : Input (8, 5) → Output (4, 5). Sur le schéma, chaque colonne de sortie correspond à une feature ; en Keras, le nombre de colonnes de sortie est le nombre de filtres."},
  {"id":"c4-14","action":"edit","field":"why","value":"Slide 12 : le noyau (Kernel, Size = 5) couvre 5 jours consécutifs et glisse de Day 1 à Day 8, le long de l'axe du temps."},
  {"id":"c4-38","action":"edit","field":"q","value":"Remettez dans l'ordre ces couches (une de chaque type) de l'AE Conv1D du cours, qui en répète certaines (slide 14 : 5 Conv 1D, 2 Maxpooling, 2 Upsampling)."},
  {"id":"c4-36","action":"retag","value":["nn.validation"]},
  {"id":"c4-37","action":"retag","value":["ano.sequences","ano.pretraitement","ano.seuil","ano.roc"]}
]
```

Aucune suppression proposée : toutes les épreuves HORS-PDF portent sur le lab, qui fait partie du cours pratique.

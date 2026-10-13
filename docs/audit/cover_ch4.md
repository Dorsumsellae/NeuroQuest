# Audit de couverture — ch4 (IA-Hexagone-4.Pratique-Autoencodeurs.pdf, 20 diapos)

Périmètre lu : diapos 1 à 20. Ignorées : 1 (garde), 2 (plan), 19 (consignes de TP : notebook, Colab, dossier `data`, rien d'enseignable pour l'écrit).
Leçons vérifiées : toutes les `ano.*` ; les leçons `ae.*` (ch3) sont seulement citées quand elles couvrent déjà un élément (elles ne sont pas modifiées ici).

## Tableau élément → diapo → statut → correctif

| # | Élément enseignable | Diapo | Statut | Correctif |
|---|---|---|---|---|
| 1 | Problématique : détecter des activités défaillantes dans des séquences | 3 | partiel (implicite) | `ano.dataset` p : phrase d'ouverture sur le problème |
| 2 | Données du dataset Backblaze, features de disques durs | 3 | couvert (`ano.dataset`) | — |
| 3 | Colonnes Date (yyyy-mm-dd), Serial Number, Model, Capacity (en octets) | 4 | partiel (format de date, unité de Capacity absents) | `ano.dataset` p : précisions ajoutées |
| 4 | Failure : 0 si OK, 1 le dernier jour opérationnel avant anomalie | 4 | couvert (`ano.dataset`) | — |
| 5 | SMART Stats : 90 colonnes = 45 brutes + 45 normalisées | 4 | couvert (`ano.dataset`) | — |
| 6 | Données journalières = séries temporelles | 4 | couvert (`ano.dataset`) | — |
| 7 | Distribution des features : histogrammes disques normaux vs en panne (échelle log) | 5 | absent | `ano.dataset` p : phrase ajoutée |
| 8 | LSTM adapté aux séries temporelles | 6 | couvert (`ano.lstm`) | — |
| 9 | Cellule LSTM : c(t−1)→c(t), h(t−1)→h(t), portes forget / input / output | 6 | couvert (`ano.lstm`) | — |
| 10 | Quatre couches FC sur x(t) et h(t−1) donnant f, g, i, o ; g = contenu candidat (tanh) | 6 | absent | `ano.lstm` p : phrase ajoutée |
| 11 | Calcul : c(t) = f⊗c(t−1) + i⊗g ; h(t) = o⊗tanh(c(t)) ; y(t) = h(t) ; ⊗ = produit élément par élément | 6 | absent | `ano.lstm` p : phrase ajoutée |
| 12 | Sigmoïde (logistique) pour les portes, tanh pour le contenu | 6 | couvert (`ano.lstm`) | — |
| 13 | AE pour la détection d'anomalies : entrée X, goulot (bottleneck), sortie X̃, erreur X − X̃ | 7 | couvert (`ae.principe`, `ae.anomalie`) | — |
| 14 | Structure d'AE adaptée aux time series : série en entrée, série reconstruite en sortie, comparaison reconstruction vs input | 8 | couvert (`ano.sequences`, `ano.seq2seq`, `ae.anomalie`) | — |
| 15 | Encoder-Net / code z₁…zₙ / Decoder-Net ; erreur d'un échantillon normal faible (0.0215) | 9 | couvert (`ae.principe`, ex de `ae.anomalie`) | — |
| 16 | Échantillon anormal : reconstruction très différente, erreur forte (4.5252) | 10 | couvert (`ae.anomalie`) | — |
| 17 | Architecture Seq2Seq : Input → LSTM → RepeatVector → LSTM → LSTM → Output | 11 | couvert (`ano.seq2seq`) | — |
| 18 | Conv1D sur séries temporelles : noyau (size=5) glissant sur les jours, par feature | 12 | couvert (`ano.conv1d`) | — |
| 19 | Input (8, 5) → Output (4, 5) | 13 | couvert (`ano.conv1d`, ex) | — |
| 20 | Architecture AE Conv1D : Conv1D / MaxPooling ×2, Conv1D, UpSampling / Conv1D ×2, Output | 14 | couvert (`ano.conv1d_vs_lstm`) | — |
| 21 | Conv1D moins consommatrice que LSTM, plus robuste au bruit et aux données manquantes | 14 | couvert (`ano.conv1d_vs_lstm`) | — |
| 22 | Optimisation bayésienne = optimisation des (hyper)paramètres | 15 | couvert (`ano.bayes`) | — |
| 23 | Les 4 cartes : fonction cible, moyenne prédite du processus gaussien, variance du PG, fonction d'acquisition | 15 | partiel (moyenne + incertitude + acquisition cités ; fonction cible et lecture de la variance absentes) | `ano.bayes` p : deux phrases ajoutées |
| 24 | Variance faible près des points déjà testés, forte ailleurs ; l'acquisition est haute là où l'incertitude est grande | 15 | absent | `ano.bayes` p (même ajout) |
| 25 | Courbes de loss : lstm_width 68 / lr 0.0227 diverge ; 116 / lr 0.0035 décroît ; « objective » | 16 | couvert (`ano.bayes`, ex) | — |
| 26 | Carte de loss en fonction de lstm_width et learning_rate | 17 | couvert (`ano.bayes`, ex) | — |
| 27 | Entraînement : séquences de S jours de SMART d'un même disque (N+0 … N+S−1) → AE | 18 | couvert (`ano.sequences`) | — |
| 28 | Inférence : S derniers jours (N−S+1 … N) → AE → séquence reconstruite S jours × 21 features | 18 | couvert (`ano.sequences`) | — |
| 29 | Bilan : AE modèles de référence pour de nombreuses applications, dont la détection d'anomalies non supervisée | 20 | partiel (`ae.latent_bilan` parle d'applications, pas de « modèle de référence » ni de « non supervisée » dans le bilan ch4) | `ano.transformers` p : phrase d'ouverture |
| 30 | Encodeurs/décodeurs conçus de différentes manières (convolutions, LSTM…) | 20 | couvert (`ano.transformers`) | — |
| 31 | Transformers pour aller plus loin, avec une surcharge significative | 20 | couvert (`ano.transformers`) | — |

Remarque (hors correctif) : `ano.transformers` p[2] précise « besoin de beaucoup plus de données », formulation absente de la diapo 20 (qui dit seulement « surcharge significative ») ; le correctif ci-dessous recentre cette phrase sur la diapo.

## Détail des correctifs

- `ano.dataset` (diapos 3, 4, 5) : phrase d'ouverture sur la problématique ; format de Date et unité de Capacity ; lecture de la diapo 5 (histogrammes par feature brute, normaux vs en panne, échelle logarithmique, disques en panne bien moins nombreux). 7 phrases.
- `ano.lstm` (diapo 6) : les quatre couches FC et g(t) ; les équations de c(t), h(t), y(t) lues sur le schéma. 6 phrases.
- `ano.bayes` (diapo 15) : les quatre cartes du slide ; la variance faible près des points testés et l'acquisition élevée là où l'incertitude est forte. 6 phrases.
- `ano.transformers` (diapo 20) : phrase de bilan sur les AE comme modèles de référence, dont la détection d'anomalies non supervisée ; « surcharge significative » sans ajout non sourcé. 5 phrases.

Aucune nouvelle notion : tous les concepts du PDF ont déjà une notion `ano.*` ou `ae.*`.

```json
[
{"action":"lesson","lesson":"ano.dataset","field":"p","op":"set","value":[
"Le problème posé par le cours : détecter des activités défaillantes dans des séquences, ici des disques durs qui vont tomber en panne.",
"Un disque dur s'autosurveille un peu comme un bilan de santé quotidien : il enregistre des compteurs internes appelés statistiques SMART (erreurs de lecture, températures, secteurs réalloués…).",
"Le dataset Backblaze contient une ligne par disque et par jour : Date (format yyyy-mm-dd), Serial Number (numéro de série), Model, Capacity (en octets), Failure, puis les SMART stats.",
"Les SMART occupent 90 colonnes : 45 valeurs brutes et leurs 45 versions normalisées. Le lab ne garde que les brutes, soit 21 features utiles.",
"La colonne Failure vaut 0 si le disque va bien, et 1 le dernier jour où il fonctionne encore avant la panne.",
"Les relevés sont stockés jour après jour : ce sont des séries temporelles, et c'est l'évolution d'un même disque dans le temps qui compte.",
"Le cours trace, pour chaque feature brute (smart_5_raw, smart_187_raw…), l'histogramme des disques normaux et celui des disques en panne, en échelle logarithmique : les disques en panne sont beaucoup moins nombreux."
]},
{"action":"lesson","lesson":"ano.lstm","field":"p","op":"set","value":[
"Pour lire une phrase, on se souvient des mots précédents. Un LSTM (Long Short-Term Memory) fait pareil avec une série temporelle : il lit les jours un par un en gardant une mémoire.",
"Cette mémoire s'appelle l'état de cellule c(t) ; à chaque pas, la cellule produit aussi une sortie h(t).",
"Trois portes règlent la mémoire : la forget gate décide ce qu'on oublie de c(t−1), l'input gate ce qu'on ajoute, l'output gate ce qu'on montre en sortie.",
"Les portes utilisent une sigmoïde (logistique, valeur entre 0 = fermé et 1 = ouvert) ; le contenu utilise tanh (valeur entre −1 et 1). Cela permet de retenir des dépendances longues.",
"Dans la cellule, quatre petites couches denses (FC) reçoivent l'entrée du jour x(t) et la sortie précédente h(t−1) : trois donnent les portes f(t), i(t), o(t) (sigmoïde), la quatrième donne g(t), le nouveau contenu proposé (tanh).",
"Calcul de la cellule : c(t) = f(t) ⊗ c(t−1) + i(t) ⊗ g(t), puis h(t) = o(t) ⊗ tanh(c(t)), et la sortie y(t) vaut h(t). Le symbole ⊗ est une multiplication élément par élément."
]},
{"action":"lesson","lesson":"ano.bayes","field":"p","op":"set","value":[
"Les hyperparamètres sont les réglages qu'on choisit avant l'entraînement : lstm_width (taille du LSTM), learning_rate, dropout… Chaque essai coûte un entraînement complet de plusieurs minutes.",
"Tout tester (une grille) coûterait trop cher. L'optimisation bayésienne fait comme un chercheur d'or : elle construit une carte de ce qu'elle croit savoir et choisit où creuser ensuite.",
"Cette carte est un processus gaussien : pour chaque réglage, il prédit un score moyen et une incertitude. Une fonction d'acquisition choisit le prochain essai en équilibrant exploitation (zones prometteuses) et exploration (zones inconnues).",
"Le cours montre quatre cartes côte à côte : la fonction cible (le vrai score, inconnu, qu'on cherche à optimiser), la moyenne prédite par le processus gaussien, sa variance (l'incertitude) et la fonction d'acquisition.",
"La variance est faible près des réglages déjà testés et forte loin d'eux ; la fonction d'acquisition est élevée là où l'incertitude reste grande, ce qui pousse à explorer ces zones.",
"Avec bayes_opt : BayesianOptimization(f, pbounds) puis maximize(init_points, n_iter), où init_points = essais aléatoires de départ et n_iter = essais guidés."
]},
{"action":"lesson","lesson":"ano.transformers","field":"p","op":"set","value":[
"Bilan du cours : les auto-encodeurs sont des modèles de référence pour de nombreuses applications, notamment la détection d'anomalies non supervisée.",
"Le bilan du cours rappelle qu'encodeur et décodeur peuvent être construits de plusieurs façons : convolutions, LSTM…",
"Pour mieux comprendre les séquences, une piste plus puissante existe : les transformers, des réseaux qui regardent tous les pas de temps à la fois au lieu de les lire un par un.",
"Le prix à payer est une surcharge significative : le modèle est nettement plus lourd à entraîner et à faire tourner.",
"Quelle que soit la brique choisie (convolutions, LSTM ou transformers), on reste un autoencodeur : l'anomalie se repère toujours par une grande erreur de reconstruction."
]}
]
```

## Résumé

- Éléments recensés : 31 (diapos 3 à 18 et 20).
- Couverts : 23 ; partiels : 4 (n° 1, 3, 23, 29) ; absents : 4 (n° 7, 10, 11, 24) — n° 23 et 24 corrigés par le même ajout.
- Leçons complétées : 4 (`ano.dataset`, `ano.lstm`, `ano.bayes`, `ano.transformers`), chacune par un `set` de p (≤ 7 phrases).
- Notions créées : 0.

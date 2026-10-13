# Audit « concept vs exemple » : chapitre 3 (notions ae.*)

Demande de l'étudiant : des questions qui testent la compréhension des concepts, pas le souvenir des exemples du cours (schéma NVIDIA, chiffres débruités, canaux 64→1024 du U-Net, foie, chiffres du lab…).

Source de vérité : `Cours/IA-Hexagone-3.Autoencodeurs.pdf`, micro-leçons `content/lessons.js` (ae.principe) et `content/lessons_ch34.js`.

Verdicts : **CONCEPT** (répondable par quelqu'un qui a compris), **EXEMPLE** (exige de se souvenir d'un exemple / schéma précis), **MIXTE** (concept, mais ancré dans un détail d'exemple : énoncé, réponse ou éléments).

## 1. Campagne : `content/camp_ch3.js` (réécrite directement)

| id | notion | verdict | ce qui était mémorisé | action |
|---|---|---|---|---|
| k3-01 | ae.cnn_limite | CONCEPT | – | inchangée |
| k3-02 | ae.cnn_limite | EXEMPLE | schéma NVIDIA slide 5 : (28,28,1), vecteur de 1568, 24 sorties | réécrite : pourquoi Flatten + Dense font perdre la position |
| k3-03 | ae.cnn_limite | CONCEPT | – | inchangée |
| k3-04 | ae.principe | CONCEPT | – | inchangée |
| k3-05 | ae.principe | MIXTE | lecture du schéma en sablier slide 9 (où est la couche la plus étroite) | réécrite : pourquoi le code doit être plus petit que l'entrée |
| k3-06 | ae.principe | CONCEPT | – | inchangée |
| k3-07 | ae.non_supervise | CONCEPT | – | inchangée |
| k3-08 | ae.non_supervise | CONCEPT | – (calcul MSE générique) | inchangée |
| k3-09 | ae.non_supervise | CONCEPT | – | inchangée |
| k3-10 | ae.applications | CONCEPT | – (liste des applications = contenu du cours) | inchangée |
| k3-11 | ae.applications | EXEMPLE | image de la slide 12 (chiffres manuscrits bruités) | réécrite : entrée / cible d'un autoencodeur débruiteur |
| k3-12 | ae.applications | CONCEPT | – | inchangée |
| k3-13 | ae.unet | CONCEPT | – | inchangée |
| k3-14 | ae.unet | EXEMPLE | légende et canaux 64 → 1024 du schéma slide 16 | réécrite : pourquoi résolution ↓ et canaux ↑ dans l'encodeur |
| k3-15 | ae.unet | CONCEPT | – | inchangée |
| k3-16 | ae.unet_skip | CONCEPT | – | inchangée |
| k3-17 | ae.unet_skip | EXEMPLE | flèches grises « copy and crop » du schéma slide 16 | réécrite : pourquoi le pont relie deux niveaux de même résolution |
| k3-18 | ae.unet_skip | CONCEPT | – | inchangée |
| k3-19 | ae.unet_ext | MIXTE | liste nominative des extensions (et noms inventés en distracteurs) | réécrite : idée commune des extensions (même plan en U, briques adaptées) |
| k3-20 | ae.unet_ext | MIXTE | blocs Conv3D / MaxPooling3D du schéma slide 18 | réécrite : avantage du U-Net 3D sur un 2D coupe par coupe (IRM) |
| k3-21 | ae.unet_ext | CONCEPT | – | inchangée |
| k3-22 | ae.denoise | CONCEPT | – | inchangée |
| k3-23 | ae.denoise | MIXTE | schéma DnCNN slide 25 (« Residual Image » granuleuse) | réécrite : image propre = y − r, sans le schéma |
| k3-24 | ae.denoise | CONCEPT | – (méthode ↔ idée, notions du cours) | inchangée |
| k3-25 | ae.anomalie | CONCEPT | – | inchangée |
| k3-26 | ae.anomalie | EXEMPLE | schéma NVIDIA slide 26 : champs flag SF (1)/(0), ✓/✗ | réécrite : machine à capteurs, quelques champs mal reconstruits → erreur ↑ |
| k3-27 | ae.anomalie | CONCEPT | – | inchangée |
| k3-28 | ae.latent_bilan | CONCEPT | – | inchangée |
| k3-29 | ae.latent_bilan | MIXTE | segmentation du foie (slides 7 et 21) | réécrite : segmentation d'une photo satellite |
| k3-30 | ae.latent_bilan | CONCEPT | – | inchangée |

Bilan campagne : 10 réécrites (k3-02, 05, 11, 14, 17, 19, 20, 23, 26, 29), 20 inchangées. Mêmes id, notions, diff et positions Q1/Q2/Q3 ; `src` mis à jour ; `ctx` de schéma supprimés.

## 2. Épreuves générales : `content/ch3.js` (non modifié, correctifs ci-dessous)

| id | type | verdict | ce qui était mémorisé | action |
|---|---|---|---|---|
| c3-01 | choix | CONCEPT | – | – |
| c3-02 | choix | CONCEPT | – | – |
| c3-03 | choix | CONCEPT | – | – |
| c3-04 | choix | CONCEPT | – (vocabulaire) | – |
| c3-05 | choix | CONCEPT | – | – |
| c3-06 | choix | CONCEPT | – | – |
| c3-07 | choix | CONCEPT | – | – |
| c3-08 | choix | CONCEPT | – (liste des applications) | – |
| c3-09 | choix | CONCEPT | – | – |
| c3-10 | choix | CONCEPT | – (auteurs seulement dans le why) | – |
| c3-11 | choix | CONCEPT | – (vocabulaire contractive / expansive path) | – |
| c3-12 | choix | CONCEPT | – | – |
| c3-13 | choix | CONCEPT | – | – |
| c3-14 | choix | CONCEPT | – | – |
| c3-15 | choix | CONCEPT | – | – |
| c3-16 | choix | MIXTE | liste nominative des extensions, aucune idée testée | replace : quelle extension pour des volumes, et pourquoi |
| c3-17 | choix | CONCEPT | – | – |
| c3-18 | choix | CONCEPT | – | – |
| c3-19 | choix | CONCEPT | – | – |
| c3-20 | choix | CONCEPT | – (FFDNet = notion du cours) | – |
| c3-21 | choix | CONCEPT | – | – |
| c3-22 | choix | CONCEPT | – | – |
| c3-23 | calcul | CONCEPT | – (valeurs comparées au seuil, répondable sans le lab) | – |
| c3-24 | choix | MIXTE | ctx et plain : chiffres du lab (256 disques / 3 millions) | replace : scénario bancaire générique ; notion ano.dataset (Backblaze) retirée car inadaptée |
| c3-25 | choix | CONCEPT | – | – |
| c3-26 | choix | MIXTE | bonne réponse citant « les données réseau tabulaires de la slide 26 » | replace : réponse générale (tout vecteur de données, MLP) |
| c3-27 | ordre | CONCEPT | – | – |
| c3-28 | ordre | MIXTE | détails du schéma slide 16 (1024 canaux, conv 3×3, max-pool 2×2, up-conv 2×2, conv 1×1) | replace : étapes génériques, même ordre |
| c3-29 | assoc | CONCEPT | – | – |
| c3-30 | assoc | CONCEPT | – | – |
| c3-31 | bug | CONCEPT | – (line 5 = fit(x_train, y_train), vérifié) | – |
| c3-32 | bug | CONCEPT | – (line 1 = Dense(1024), vérifié) | – |
| c3-33 | choix | CONCEPT | – | – |

Bilan : 4 MIXTE à remplacer (c3-16, c3-24, c3-26, c3-28), 29 CONCEPT. Application : `node tools/apply_audit.js --prefix=concept_ch3 --apply`.

## Correctifs

```json
[
 {
  "id": "c3-16",
  "action": "replace",
  "value": {
   "id": "c3-16",
   "type": "choix",
   "ch": 3,
   "notions": [
    "ae.unet_ext"
   ],
   "diff": 1,
   "q": "On doit segmenter des scanners, c'est-à-dire des volumes formés de coupes empilées. Quelle extension de U-Net est conçue pour ce type de données, et pourquoi ?",
   "ok": "U-Net 3D : ses convolutions 3D parcourent tout le volume d'un coup",
   "ko": [
    "Dense U-Net : ses blocs denses empilent les coupes une à une",
    "nnU-Net : il aplatit chaque volume en une seule image 2D"
   ],
   "plain": "Une image normale est plate ; un scanner est une pile de coupes, un volume. Le U-Net 3D utilise des filtres en cube qui parcourent ce volume d'un coup, au lieu de traiter chaque coupe séparément.",
   "why": "Slide 18 : U-Net 3D, construit avec des convolutions et poolings 3D (noyaux 3×3×3), donc adapté aux volumes. Les autres extensions changent les blocs : Dense U-Net (blocs denses), Multi-res U-Net (plusieurs résolutions) ; nnU-Net apprend la meilleure configuration (slide 22).",
   "whyNot": "Les blocs denses relient chaque couche à toutes les précédentes, ils n'empilent pas de coupes ; nnU-Net n'aplatit pas le volume, il choisit automatiquement la meilleure configuration de U-Net."
  }
 },
 {
  "id": "c3-24",
  "action": "replace",
  "value": {
   "id": "c3-24",
   "type": "choix",
   "ch": 3,
   "notions": [
    "ae.anomalie",
    "nn.types_ml"
   ],
   "diff": 2,
   "ctx": "Une banque observe environ 1 transaction frauduleuse pour 10 000, et les fraudes changent de forme d'un mois à l'autre.",
   "q": "Pourquoi une détection d'anomalies par autoencodeur est-elle ici préférable à un classifieur supervisé fraude / normal ?",
   "ok": "Trop peu d'exemples anormaux pour apprendre une classe, et l'AE repère aussi des fraudes jamais vues",
   "ko": [
    "Parce qu'un classifieur supervisé est toujours plus lent à entraîner qu'un autoencodeur",
    "Parce que l'autoencodeur n'a besoin d'aucune donnée, normale ou anormale, pour apprendre"
   ],
   "plain": "Avec une fraude pour 10 000 opérations, il n'y a pas de quoi apprendre à quoi ressemble une fraude, surtout si elle change de forme. On apprend plutôt la normalité : tout ce qui s'en écarte devient suspect.",
   "why": "Slide 26 : la détection se fait « de manière non supervisée » ; l'autoencodeur reconstruit bien les données vues fréquemment (normales) et mal les autres. Pas besoin d'exemples étiquetés « anormal », et une anomalie inédite reste mal reconstruite, donc détectée.",
   "whyNot": "La vitesse d'entraînement n'est pas le critère ; l'autoencodeur a besoin de beaucoup de données normales pour apprendre la normalité."
  }
 },
 {
  "id": "c3-26",
  "action": "replace",
  "value": {
   "id": "c3-26",
   "type": "choix",
   "ch": 3,
   "notions": [
    "ae.latent_bilan"
   ],
   "diff": 1,
   "q": "Un autoencodeur peut-il servir sur des données qui ne sont pas des images ?",
   "ok": "Oui : il résume et reconstruit tout vecteur de données, comme des mesures de capteurs",
   "ko": [
    "Non : son code latent ne peut se calculer qu'à partir de pixels d'image",
    "Non : il lui faut des convolutions 2D pour produire son code latent"
   ],
   "plain": "Un autoencodeur résume puis reconstruit des nombres ; peu importe qu'ils viennent d'une photo, d'un tableau de mesures ou d'une série temporelle. Sa forme de base est un simple MLP, sans convolution obligatoire.",
   "why": "Slide 28 : « Et d'autres applications non-image !! ». Slide 8 : la structure d'un autoencodeur ressemble à un MLP ; rien n'impose des pixels ni des convolutions.",
   "whyNot": "Le bilan affirme explicitement l'existence d'applications non-image, et un MLP traite n'importe quel vecteur de valeurs."
  }
 },
 {
  "id": "c3-28",
  "action": "replace",
  "value": {
   "id": "c3-28",
   "type": "ordre",
   "ch": 3,
   "notions": [
    "ae.unet",
    "ae.unet_skip"
   ],
   "diff": 2,
   "q": "Remettez dans l'ordre les étapes du chemin d'un U-Net.",
   "items": [
    "Image d'entrée",
    "Encodeur (contractive path) : convolutions + max-pooling (résolution ↓, canaux ↑)",
    "Fond du U : résolution minimale, nombre de canaux maximal",
    "Convolution inverse apprise, Conv2DTranspose (résolution ↑)",
    "Concaténation avec la carte de l'encodeur de même taille (skip connection)",
    "Convolutions qui fusionnent détails et contexte",
    "Convolution finale → carte de segmentation (une classe par pixel)"
   ],
   "plain": "On descend le U en rétrécissant l'image, on touche le fond, puis on remonte : à chaque étage on ré-agrandit, on recolle les détails gardés pendant la descente, on affine, et une dernière couche donne la carte de segmentation.",
   "why": "Slides 15 à 17 : l'encodeur (contractive path) réduit la résolution ; le décodeur (expansive path) la ré-agrandit par une convolution inverse apprise (Conv2DTranspose) ; à chaque niveau, la skip connection réinjecte les détails de l'encodeur ; une dernière convolution produit la carte de segmentation.",
   "whyNot": "La concaténation ne peut venir qu'après la convolution inverse : il faut d'abord ré-agrandir la carte pour qu'elle ait la taille de celle de l'encodeur."
  }
 }
]
```

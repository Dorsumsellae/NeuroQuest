# Audit de couverture, chapitre 3 (Autoencodeurs)

Périmètre : `Cours/IA-Hexagone-3.Autoencodeurs.pdf`, 27 pages (diapos 1 à 26 et 28, la diapo 27 « Exercice » est absente du PDF). Les 27 pages ont été lues.
Leçons auditées : `ae.cnn_limite`, `ae.principe`, `ae.non_supervise`, `ae.applications`, `ae.unet`, `ae.unet_skip`, `ae.unet_ext`, `ae.denoise`, `ae.anomalie`, `ae.latent_bilan`.
Ignoré : page de garde (1), plan (2), diapo-question vide (3), liens web (14, 22), historique (auteurs et date du U-Net, diapo 15).

## Tableau de couverture

| # | Élément enseignable | Diapo | Statut | Correctif |
|---|---|---|---|---|
| 1 | Architecture CNN de classification : Conv → MaxPool → Conv → Dropout → MaxPool → Conv → MaxPool → Dense → Dense → Output | 4 | partiel | `ae.cnn_limite` p (+1 phrase) |
| 2 | Dimensions de l'exemple : entrée (28,28,1), noyaux (3,3,1,2) puis (3,3,2,2), cartes (28,28,2), aplatissement en 1568, Dense 512, Dense 512, 24 sorties | 5 | absent | `ae.cnn_limite` ex |
| 3 | Les premières couches du CNN représentent les motifs à différentes échelles | 6 | couvert | — |
| 4 | Pas d'image en sortie, réponses des filtres plus spatialisées dans les couches finales | 6 | couvert | — |
| 5 | CNN = classification, pas analyse | 6 | couvert | — |
| 6 | Exemple : segmentation du foie au scanner (sortie = carte par pixel) | 7 | couvert | — |
| 7 | AE = encodeur + décodeur ; code = plongement = espace latent | 8 | partiel (« plongement » absent) | `ae.principe` p |
| 8 | Structure proche d'un MLP ; nombre et taille des couches = éléments clés | 8 | couvert | — |
| 9 | Approche non supervisée : erreur entre images d'entrée et de sortie | 8 | couvert | — |
| 10 | Schéma en sablier Input → Encoder → Code → Decoder → Output | 9, 14 | couvert (svg sablier) | — |
| 11 | Compression : JPEG, JPEG2000 et CAE comparés à débit égal (~0,3 bpp contre 24 bpp en brut) | 10 | partiel | `ae.applications` p |
| 12 | Réduction de dimensions : ACP vs autoencodeur linéaire | 11 | couvert | — |
| 13 | Débruitage (entrée bruitée, sortie propre, TensorFlow/Keras) | 12 | couvert | — |
| 14 | AE comme partie d'un réseau (réseau de compression) | 13 | couvert | — |
| 15 | U-Net supervisé, en forme de U, AE de référence en segmentation ; contractive path / expansive path | 15 | couvert | — |
| 16 | Schéma standard : conv 3×3 + ReLU, max pool 2×2, up-conv 2×2, copy and crop, conv 1×1 ; canaux 64 → 1024 | 16 | couvert | — |
| 17 | Tailles du schéma : 572 → 570 → 568 (chaque conv 3×3 retire 2 pixels), pooling divise par 2, sortie 388×388 à 2 canaux | 16 | absent | `ae.unet` p (+2 phrases) |
| 18 | Pourquoi « crop » : la carte de l'encodeur est plus grande que celle du décodeur (568 contre 392) | 16 | absent | `ae.unet_skip` p |
| 19 | La contraction fait perdre les détails ; les skip connections compensent | 17 | couvert | — |
| 20 | Up-sampling remplacé par une convolution inverse apprise (Conv2DTranspose) | 17 | couvert | — |
| 21 | Approche supervisée, métrique importante (Dice) | 17 | couvert | — |
| 22 | U-Net 3D : step block (Conv3D 3×3×3 + ReLU, Dropout 20 %, Conv3D 3×3×3 + ReLU), MaxPooling3D, UpSampling3D, concaténation, filtres 8 → 128 | 18 | partiel | `ae.unet_ext` p |
| 23 | Sortie du U-Net 3D : Conv3D 1×1×1 à 1 filtre + sigmoïde | 18 | absent | `ae.unet_ext` p |
| 24 | Dense U-Net : BatchNormalization, connexion dense et connexion résiduelle dans le bloc | 19 | partiel | `ae.unet_ext` p |
| 25 | Multi-res U-Net : Resolution Block (3 Conv3D enchaînées concaténées + raccourci 1×1×1 additionné), Resolution Path sur les ponts | 20 | partiel | `ae.unet_ext` p |
| 26 | Comparaison sur la segmentation vasculaire du foie (annotation, MultiRes, Dense, U-Net) | 21 | couvert | — |
| 27 | nnU-Net : apprendre le meilleur modèle | 22, 28 | couvert | — |
| 28 | Pipeline nnU-Net : data fingerprint, règles heuristiques, paramètres inférés (rééchantillonnage, normalisation, architecture, batch, patch), paramètres fixés (loss, optimiseur, planning, augmentation), entraînement 2D / 3D / 3D cascade en validation croisée, post-traitement, ensemble | 22 | absent | `ae.unet_ext` ex |
| 29 | Débruitage : les motifs de haute fréquence (détails) comptent beaucoup | 23 | couvert | — |
| 30 | Noise2Noise (type U-Net), FFDNet (sous-images), DnCNN (apprendre le résidu) | 23–25 | couvert | — |
| 31 | FFDNet : sous-images + carte du niveau de bruit ; couches Conv + BN + ReLU, Conv finale | 24 | partiel | `ae.denoise` p (+1 phrase) |
| 32 | DnCNN : Conv + ReLU, Conv + BN + ReLU répétées, Conv → image résiduelle | 25 | partiel | `ae.denoise` p (même phrase) |
| 33 | Détection d'anomalies non supervisée : faible erreur = donnée fréquente, normale ; grande erreur = anormale | 26 | couvert | — |
| 34 | Erreur de reconstruction MSE : L = (1/N) Σ (xᵢ − x̂ᵢ)² | 26 | couvert | — |
| 35 | Exemple : données réseau tabulaires (duration, src_bytes, service, flag) ; les colonnes mal reconstruites trahissent l'anomalie | 26 | partiel | `ae.anomalie` p (+1 phrase) |
| 36 | Bilan : représentation efficace dans l'espace latent ; segmentation, compression, reconstruction, débruitage ; non-image ; apprendre les modèles (nnU-Net) | 28 | couvert | — |

## Correctifs

Aucune nouvelle notion : tous les manques tiennent dans les leçons existantes (7 phrases max respectées).

```json
[
  {"action":"lesson","lesson":"ae.cnn_limite","field":"p","op":"set","value":[
    "Un CNN de classification répond à une question du type « qu'y a-t-il sur la photo ? » : il sort une étiquette, pas une image.",
    "Ses premières couches sont pourtant utiles : elles repèrent des motifs à différentes échelles (contours, textures, formes).",
    "Le schéma type du cours enchaîne : Convolution, Max Pooling, Convolution, Dropout, Max Pooling, Convolution, Max Pooling, puis deux couches Dense et la sortie.",
    "Mais à la fin, Flatten aplatit les cartes en une longue liste de nombres et les couches Dense les mélangent : on perd l'information de position (on dit que ce n'est plus spatialisé).",
    "Pour une tâche d'analyse (segmentation, reconstruction, débruitage), il faut une sortie qui soit elle-même une image : c'est le rôle d'un décodeur, d'où l'autoencodeur et le U-Net."
  ]},
  {"action":"lesson","lesson":"ae.cnn_limite","field":"ex","op":"set","value":"Exemple du cours : une image (28, 28, 1) passe par 2 filtres 3×3 → cartes (28, 28, 2), puis encore 2 filtres → (28, 28, 2). Flatten donne 28 × 28 × 2 = 1568 nombres, puis Dense 512, Dense 512 et 24 sorties (une par classe). Plus aucune carte : impossible de rendre une image. Sur un scanner, un tel CNN peut dire « il y a un foie » ; pour colorier exactement les pixels du foie (segmentation), il faut une sortie de la taille de l'image."},

  {"action":"lesson","lesson":"ae.principe","field":"p","op":"set","value":[
    "Un autoencodeur est un réseau qui apprend à recopier son entrée… en passant par un goulot très étroit.",
    "L'encodeur réduit l'image (ou la série de mesures) en un petit vecteur : le code, aussi appelé plongement ou espace latent.",
    "Le décodeur fait le chemin inverse et tente de reconstruire l'entrée à partir de ce code. Sa structure ressemble à un MLP : le nombre de couches et leur taille sont les choix clés.",
    "Comme le code est petit, le réseau est obligé de ne garder que l'essentiel : c'est ce qui le rend utile pour compresser, débruiter ou repérer ce qui sort de l'ordinaire."
  ]},

  {"action":"lesson","lesson":"ae.applications","field":"p","op":"set","value":[
    "Comme l'autoencodeur apprend un résumé compact (le code) de ses données, il sert partout où ce résumé est utile.",
    "Compression : on stocke le code, plus petit que l'image. Réduction de dimensions : le code remplace les nombreuses variables d'origine ; le cours (slide 11) compare l'ACP à un autoencodeur linéaire.",
    "Le cours (slide 10) compare la compression JPEG, JPEG2000 et un autoencodeur convolutif (CAE) à taille égale : environ 0,3 bit par pixel, contre 24 bits par pixel pour l'image brute. L'image JPEG montre des blocs, celle du CAE reste proche de l'original.",
    "Débruitage : on lui donne une image bruitée en entrée et l'image propre comme cible, il apprend à nettoyer.",
    "Partie d'un réseau : un bloc encodeur / décodeur peut s'insérer dans une architecture plus grande, par exemple de compression."
  ]},

  {"action":"lesson","lesson":"ae.unet","field":"p","op":"set","value":[
    "La segmentation consiste à attribuer une classe à chaque pixel, comme colorier un organe sur un scanner.",
    "U-Net est un autoencodeur dessiné en forme de U : la branche descendante (encodeur, appelée contractive path) réduit la résolution et augmente le nombre de canaux, la branche montante (décodeur, appelée expansive path) fait l'inverse.",
    "Descente : convolutions 3×3 + ReLU puis max-pooling 2×2, avec 64 → 128 → 256 → 512 → 1024 canaux. Remontée : up-convolutions 2×2 (convolutions qui agrandissent l'image), convolutions 3×3, puis une convolution 1×1 finale qui donne, pour chaque pixel, un score par classe.",
    "Sur le schéma standard, chaque convolution 3×3 retire 2 pixels de côté (572 → 570 → 568) et chaque max-pooling 2×2 divise la taille par 2 (568 → 284).",
    "Résultat : une entrée 572×572 donne une carte de segmentation 388×388 à 2 canaux, un par classe ; la sortie est donc plus petite que l'entrée.",
    "Contrairement à l'autoencodeur classique, U-Net est supervisé : il apprend à partir de masques annotés (la bonne réponse, pixel par pixel)."
  ]},

  {"action":"lesson","lesson":"ae.unet_skip","field":"p","op":"set","value":[
    "En réduisant l'image, l'encodeur perd les détails fins, un peu comme une photo trop compressée qui devient floue.",
    "Les skip connections sont des ponts horizontaux du U : chaque niveau de l'encodeur envoie sa carte haute résolution au niveau correspondant du décodeur, qui la concatène (copy and crop) pour retrouver les détails.",
    "« Crop » veut dire recadrer : sur le schéma, la carte de l'encodeur est plus grande que celle du décodeur (568×568 contre 392×392 au premier étage), on la recadre donc à la même taille avant de concaténer.",
    "Pour agrandir l'image dans le décodeur, U-Net n'utilise pas un simple agrandissement fixe mais une convolution inverse apprise : Conv2DTranspose.",
    "À chaque étage de la remontée, l'ordre est donc : agrandir la carte (up-conv), la concaténer avec la carte de l'encodeur de même taille, puis appliquer des convolutions 3×3 qui fusionnent détails et contexte.",
    "Comme le modèle est supervisé, on le juge avec une métrique : le Dice = 2|A∩B| / (|A|+|B|), où A est le masque prédit, B le masque réel et A∩B leur partie commune."
  ]},

  {"action":"lesson","lesson":"ae.unet_ext","field":"p","op":"set","value":[
    "Le U de base a été décliné pour d'autres besoins, en gardant l'idée encodeur + décodeur + ponts.",
    "U-Net 3D traite des volumes (un scanner complet, empilement de coupes) au lieu d'images plates : convolutions et poolings deviennent 3D, avec des filtres en cube 3×3×3 qui combinent des coupes voisines.",
    "Son bloc de base (step block) : Conv3D 3×3×3 + ReLU, Dropout 20 %, Conv3D 3×3×3 + ReLU. On descend par MaxPooling3D, on remonte par UpSampling3D, les ponts sont des concaténations, et le nombre de filtres double à chaque étage (8 → 16 → 32 → 64 → 128).",
    "Sa sortie est une Conv3D 1×1×1 à 1 filtre suivie d'une sigmoïde : une probabilité entre 0 et 1 pour chaque voxel (pixel 3D) d'appartenir à l'objet.",
    "Dense U-Net ajoute une BatchNormalization après chaque convolution et deux raccourcis dans le bloc : une connexion dense (l'entrée est concaténée à la sortie de la 1re convolution) et une connexion résiduelle (l'entrée est réinjectée en fin de bloc).",
    "Multi-res U-Net utilise un Resolution Block : 3 convolutions 3×3×3 enchaînées dont les sorties sont concaténées (plusieurs échelles), plus un raccourci par convolution 1×1×1 additionné ; ses ponts passent par des Resolution Paths, de petites convolutions posées sur la skip connection.",
    "nnU-Net (« no-new-U-Net ») n'invente pas de nouvelle architecture : il apprend automatiquement la meilleure configuration (prétraitement, architecture, réglages) pour un dataset donné."
  ]},
  {"action":"lesson","lesson":"ae.unet_ext","field":"ex","op":"set","value":"Le cours compare l'annotation, MultiRes U-Net, Dense U-Net et U-Net sur la segmentation des vaisseaux du foie : même tâche, architectures différentes. Pipeline nnU-Net : empreinte du dataset (data fingerprint) → règles qui fixent rééchantillonnage, normalisation, architecture, taille de batch et de patch (loss, optimiseur, planning d'entraînement et augmentation sont fixés d'avance) → entraînement de variantes 2D, 3D et 3D en cascade par validation croisée → choix du post-traitement et de l'ensemble de modèles → prédiction."},

  {"action":"lesson","lesson":"ae.denoise","field":"p","op":"set","value":[
    "Débruiter une image, c'est comme retirer le grésillement d'un enregistrement sans couper les aigus de la voix.",
    "La difficulté : le bruit et les détails sont tous deux des motifs de haute fréquence (variations rapides d'un pixel à l'autre). Lisser trop fort efface aussi les détails.",
    "Noise2Noise : un modèle type U-Net entraîné sur des paires d'images bruitées de la même scène, sans jamais voir d'image propre.",
    "FFDNet : découpe l'image en sous-images plus petites, traitées rapidement. DnCNN : apprend le résidu, c'est-à-dire le bruit lui-même, puis image propre = entrée − bruit prédit (même idée que ResNet).",
    "Côté couches : FFDNet reçoit les sous-images avec une carte du niveau de bruit ; FFDNet et DnCNN enchaînent Conv + ReLU, plusieurs Conv + BN (batch normalization) + ReLU, puis une Conv finale. Chez DnCNN, cette sortie est l'image résiduelle (le bruit)."
  ]},

  {"action":"lesson","lesson":"ae.anomalie","field":"p","op":"set","value":[
    "Un détecteur de fumée ne connaît pas tous les incendies possibles : il connaît l'air normal et sonne quand ça ne lui ressemble plus.",
    "L'autoencodeur apprend à bien reconstruire les données qu'il voit souvent : pour le cours (slide 26), une donnée « vue fréquemment » est normale. En pratique (lab), on l'entraîne sur des données normales uniquement.",
    "Face à une donnée jamais vue (une anomalie), il la reconstruit mal : l'erreur de reconstruction, L = (1/N) Σ (xᵢ − x̂ᵢ)² sur les N valeurs de l'échantillon, devient grande.",
    "Un seuil sur cette erreur tranche : en dessous, normal ; au-dessus, anomalie.",
    "Exemple du cours (slide 26) : des connexions réseau décrites par des colonnes (duration, src_bytes, service, flag…). Les colonnes mal reconstruites, comme flag, trahissent la donnée anormale."
  ]}
]
```

## Vérification à blanc

- `node tools/apply_lessons.js --prefix=cover_ch3` : 10 correctifs de leçon, 0 problème.
- `node tools/apply_notions.js --prefix=cover_ch3` : 0 notion, 0 problème.

## Résumé

- 36 éléments enseignables recensés (diapos 4 à 28).
- 22 couverts, 9 partiels, 5 absents.
- 8 leçons complétées : `ae.cnn_limite` (p + ex), `ae.principe`, `ae.applications`, `ae.unet`, `ae.unet_skip`, `ae.unet_ext` (p + ex), `ae.denoise`, `ae.anomalie`. Cela fait 10 correctifs.
- 0 notion créée : tout tient dans les leçons existantes, avec au plus 7 phrases par leçon.

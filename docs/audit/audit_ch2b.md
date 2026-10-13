# Audit chapitre 2b : CNN et modèles avancés (notions cnn.*)

Source de vérité : `Cours/IA-Hexagone-2.DeepLearning.pdf`, slides 24 à 43 (texte extrait + rendu PNG des slides 26, 28-32, 34, 37-40, 42).
Périmètre : les 26 épreuves de `content/ch2.js` dont la première notion commence par `cnn.`.

Bilan : **16 OK, 8 HORS-PDF, 0 ERREUR, 1 AMBIGU, 1 MAL-TAGUÉ.**

Rappel de ce que le PDF dit (partie CNN) :
- s24-25 LeNet, « le premier CNN » ; s26 schéma NVIDIA : (28,28,1) → Kernels (3,3,1,2) → (28,28,2) → Kernels (3,3,2,2) → (28,28,2) → Flatten (1568) → Dense 512 → Dense 512 → 24 (pas de pooling sur ce schéma) ;
- s27 tenseurs 4D [N, W, H, C], calcul parallèle haute performance ; s28-31 Conv2D « filtres qui extraient contours, textures, objets » (s31 : N×(C,H,W) ⊗ K filtres C×R×S = N×(K,P,Q)) ;
- s32 MaxPool2D « sous-échantillonnage et sélection des valeurs max », matrice 4×4 → [[20,30],[127,37]] ;
- s33 Dropout « suppression des liaisons entre neurones en dessous d'un certain seuil », Dense « complètement connectées », Flatten « vecteur 1D » ;
- s34-35 one-hot, learning rate, normalisation 0-1, epoch ; s36 exercice ; s37 validation ;
- s38 VGG16/VGG19 (schéma 224×224×3 → conv+ReLU / max pooling → FC 4096 → softmax 1000) ; s39 ResNet x → F(x) + x, évanescence des gradients, dégradation/saturation, ResNet50 ; s40 Inception (1×1, 3×3, 5×5 conv + 3×3 max pooling → filter concatenation) ;
- s41 bilan modèle profond vs MLP ; s42 comparaison (ResNet-50, Xception, Inception V3, VGG19, VGG16) ; s43 modèles disponibles dans Keras (keras.io/api/applications).

Aucun élément du PDF ne parle de padding, stride, comptage de paramètres d'une Conv2D, BatchNormalization, augmentation de données ni ImageDataGenerator : tout cela vient du notebook CNN ASL.

## 1. Tableau

| id | verdict | justification |
|---|---|---|
| c2-36 | OK | Format [N, W, H, C], slide 27. Réponse juste nettement plus longue que les leurres (devinable à la longueur) : voir correctif. |
| c2-37 | OK | Applique le format 4D du slide 27 (C = 1) ; le `reshape(-1, 28, 28, 1)` vient du code fourni, mais la notion testée est au slide 27. |
| c2-38 | OK | Slide 28 : « filtres … extraient les contours, textures, objets ». « Appris » n'est pas écrit dans le PDF mais n'est pas contredit. |
| c2-39 | HORS-PDF | Padding 'same' / 'valid' absent du PDF (code ASL). Utile pour l'examen s'il porte sur le notebook ; à garder. |
| c2-40 | OK | Matrice et résultat exacts du slide 32. |
| c2-41 | OK | Variante du slide 32 ; maxima vérifiés (8, 9, 12, 6). |
| c2-42 | HORS-PDF | « Zéro paramètre » n'est pas écrit dans le PDF ; déductible du slide 32 (opération fixe). À garder. |
| c2-43 | AMBIGU | La réponse dit « supprime aléatoirement », le slide 33 dit « suppression des liaisons entre neurones en dessous d'un certain seuil » ; le sur-apprentissage n'est pas mentionné au slide 33. Un étudiant qui a appris le slide peut hésiter. Corriger le `why` pour citer les deux. |
| c2-44 | OK | Slide 33 (Flatten = vecteur 1D, Dense = complètement connectées) et slide 26 (1568). Leurres beaucoup plus courts que la bonne réponse. |
| c2-45 | HORS-PDF | (4, 4, 25) vient du CNN ASL ; l'équivalent PDF est (28, 28, 2) → 1568 (slide 26). Calcul juste. |
| c2-46 | HORS-PDF | Formule (k×k×C_in + 1)×filtres absente du PDF (code ASL). Calcul juste (33 800). |
| c2-47 | HORS-PDF | Repose sur padding 'same' (hors PDF). Calcul juste (3 136). |
| c2-48 | HORS-PDF | Arrondi supérieur du pooling en 'same' : hors PDF (code ASL). Juste. |
| c2-49 | HORS-PDF | L'augmentation de données n'apparaît nulle part dans le PDF. Juste vis-à-vis du notebook. |
| c2-50 | HORS-PDF | Idem (vertical_flip, dataset ASL). |
| c2-51 | OK | Slide 38. |
| c2-52 | OK | Slide 39, formulation exacte « x → F(x) + x au lieu de x → F(x) ». |
| c2-53 | OK | Slide 39 (évanescence des gradients, dégradation / saturation). |
| c2-54 | OK | Slide 39 « ResNet50 : 50 couches ». Question de pur rappel, diff 2 un peu élevée. |
| c2-55 | OK | Slide 40. |
| c2-56 | OK | Slides 38-40 ; « convolutions 3×3 » pour VGG n'est pas écrit au slide 38 (détail hors PDF), U-Net vient du chapitre autoencodeurs. Correctif mineur proposé. |
| c2-57 | OK | Slide 33. Même nuance que c2-43 pour Dropout (« aléatoire » vs « sous un seuil ») ; l'association reste non ambiguë. |
| c2-60 | MAL-TAGUÉ | Teste l'ordre des couches (slides 26, 33, 20), pas les shapes ni les paramètres : première notion `cnn.shapes` inadaptée. Retag vers `cnn.flatten_dense` en tête. |
| c2-63 | OK | Applique le format 4D du slide 27 (N = 1 pour une seule image) au code de prédiction. |
| c2-64 | OK | Idem, canal C = 1 manquant (slide 27). |
| c2-68 | OK | Slide 41, fidèle. |

Remarque transverse : plusieurs épreuves ont une bonne réponse nettement plus longue et plus détaillée que les leurres (c2-36, c2-43, c2-44, c2-49, c2-50, c2-68), ce qui permet de répondre sans connaître le cours. Correctifs proposés pour les deux plus flagrantes (c2-36, c2-44).

## 2. Contradictions ou écarts micro-leçons (`lessons_ch2b.js`) vs PDF

1. **cnn.dropout** : la leçon dit « désactive au hasard une partie des neurones » ; le slide 33 dit « suppression des liaisons entre neurones **en dessous d'un certain seuil** ». La formulation du slide évoque plutôt un élagage par seuil ; la leçon décrit le Dropout réel de Keras. Écart à signaler à l'étudiant : à l'écrit, citer la définition du slide puis préciser le fonctionnement aléatoire. Le taux 0.2 / 0.3 et la désactivation à l'inférence sont hors PDF.
2. **cnn.tenseur** : la leçon ajoute que « Keras range la hauteur avant la largeur » ; le slide 27 écrit [N, W, H, C], et le slide 31 dessine N × (C, H, W). Pas une contradiction (images carrées), mais trois ordres différents circulent ; garder [N, W, H, C] comme réponse « cours ».
3. **cnn.vgg** : « convolutions 3×3 » et « ≈ 138 millions de paramètres » ne sont pas dans le PDF (ajouts, non contradictoires).
4. **cnn.inception** : « à un coût de calcul maîtrisé » n'est pas dans le PDF (le slide 40 dit seulement « plus grande puissance de représentation »).
5. **cnn.bilan** : la leçon cite BatchNormalization, absente du PDF.
6. **cnn.conv2d, cnn.maxpool, cnn.shapes** : padding, stride, formules de paramètres, arrondi « same » 7 → 4 sont hors PDF (notebook ASL). Les leçons restent cohérentes avec les slides 26, 31 et 32.
7. **cnn.augmentation** : notion entièrement hors PDF.
8. **cnn.flatten_dense** : cohérent (NVIDIA (28, 28, 2) → 1568, slide 26). À noter : le schéma NVIDIA a deux Dense 512 avant la sortie 24, alors que le CNN ASL de la leçon n'en a qu'une ; pas d'erreur, juste deux exemples différents.

Aucune contradiction franche (affirmation fausse au regard du PDF) n'a été trouvée dans les leçons.

## 3. Notions du PDF (partie CNN) sans notion dans le registre

- **LeNet** (slides 24-25) : « approche LeNet, le premier CNN ». Aucune notion `cnn.lenet` (seulement un fait historique, faible enjeu).
- **Notation tensorielle de la convolution** (slide 31) : N × (C, H, W) ⊗ K filtres (C, R, S) = N × (K, P, Q), c'est-à-dire que le nombre de canaux de sortie est le nombre de filtres. Couvert seulement implicitement par `cnn.conv2d` (tip de la leçon).
- **Comparaison des modèles** (slide 42 : ResNet-50, Xception, Inception V3, VGG19, VGG16) : Xception n'est couvert nulle part.
- **Modèles pré-entraînés disponibles dans Keras** (slide 43, keras.io/api/applications) : mentionné en une phrase dans la leçon VGG, sans notion propre (transfert / réutilisation de modèles).
- One-hot, learning rate, normalisation, epoch (s34-35) et validation (s37) sont couverts par `nn.onehot`, `nn.epoch_lr`, `nn.normalisation`, `nn.validation` (hors périmètre cnn.*).

## 4. Correctifs proposés

```json
[
  {"id":"c2-36","action":"edit","field":"ko","value":["[W, H, C] : largeur, hauteur, canaux, sans nombre de données","[N, W, H] : nombre de données, largeur, hauteur, sans canal"]},
  {"id":"c2-36","action":"edit","field":"whyNot","value":"Il manque soit la dimension N (nombre d'images du paquet), soit la dimension C (canaux) : le slide 27 impose 4 dimensions."},
  {"id":"c2-43","action":"edit","field":"why","value":"Slide 33 : « Dropout : suppression des liaisons entre neurones en dessous d'un certain seuil ». En pratique (Keras, code ASL), Dropout(p) désactive au hasard une proportion p des neurones à chaque batch d'entraînement, et il est désactivé à l'inférence."},
  {"id":"c2-44","action":"edit","field":"ko","value":["Conv2D attend un vecteur 1D ; Flatten ajoute la dimension canal C","Dense attend une image 2D ; Flatten divise W et H par deux"]},
  {"id":"c2-44","action":"edit","field":"whyNot","value":"Ajouter un canal est le rôle d'un reshape avant Conv2D ; diviser W et H est le rôle de MaxPool2D. Flatten construit un vecteur 1D (slide 33)."},
  {"id":"c2-56","action":"edit","field":"pairs","value":[["VGG","Empilement de convolutions et de max pooling, 16 ou 19 couches"],["ResNet","Blocs résiduels F(x) + x contre l'évanescence des gradients"],["Inception","Convolutions multi-échelles en parallèle"],["U-Net","Encodeur-décodeur en U avec skip connections pour la segmentation"]]},
  {"id":"c2-57","action":"edit","field":"pairs","value":[["Conv2D","Filtres : contours, textures, objets"],["MaxPool2D","Sous-échantillonnage en gardant le max"],["Dropout","Suppression de liaisons entre neurones pendant l'entraînement"],["Flatten","Construction d'un vecteur 1D"]]},
  {"id":"c2-60","action":"retag","value":["cnn.flatten_dense","cnn.conv2d","cnn.maxpool"]}
]
```

Aucune suppression proposée : les 8 épreuves HORS-PDF portent sur le notebook CNN ASL fourni, utile pour l'examen.

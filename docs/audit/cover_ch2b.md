# Audit de couverture ch2b : CNN et modèles avancés (IA-Hexagone-2.DeepLearning.pdf, slides 24 à 43)

Frontière : la partie CNN commence slide 24 (« Approche LeNet »), juste après l'exercice d'évaluation du MLP (slide 23). Périmètre lu : slides 24 à 43 (fin du PDF).
Lecture des leçons : `node tools/dump_lessons.js`. Slides 34 à 37 (one-hot, learning rate, normalisation, epoch, code fourni, validation) sont dans la partie CNN mais couvertes par des notions `nn.*` : elles sont vérifiées ici aussi.

## Tableau élément → diapo → statut → correctif

| # | Élément enseignable | Slide | Statut | Correctif |
|---|---|---|---|---|
| 1 | LeNet : date, auteur | 24 | hors examen (historique) | aucun |
| 2 | LeNet, premier CNN : alternance convolutions / sous-échantillonnage puis couches complètement connectées, tailles 32×32 → 6@28×28 → 6@14×14 → 16@10×10 → 16@5×5 → 120 → 84 → 10 | 24 | absent | `cnn.shapes` p : phrase LeNet |
| 3 | Vidéo d'archive | 25 | hors examen | aucun |
| 4 | Schéma général NVIDIA : (28,28,1) → noyaux (3,3,1,2) → (28,28,2) → noyaux (3,3,2,2) → (28,28,2) → Flatten 1568 → Dense 512 → Dense 512 → 24 | 26 | partiel (seul (28,28,2) → 1568 cité ; notation des noyaux et Dense 512/512/24 absentes) | `cnn.conv2d` ex (notation des noyaux), `cnn.flatten_dense` ex (suite Dense) |
| 5 | Tenseurs 4D, format [NbDonnees, Largeur, Hauteur, NbCanaux] = [N, W, H, C] | 27 | couvert (`cnn.tenseur`) | aucun |
| 6 | Calcul parallèle haute performance | 27 | couvert (`cnn.tenseur`, `cnn.bilan`) | aucun |
| 7 | Conv2D : convolutions avec différents filtres qui extraient contours, textures, objets | 28-30 | couvert (`cnn.conv2d`) | aucun |
| 8 | Fonctionnement d'une convolution : le filtre glisse, somme pondérée des pixels recouverts (animation, noyau 3×3 de 1/9 = moyenne) | 28 | partiel (« calcule un score » sans dire comment) | `cnn.conv2d` p (multiplier puis additionner) + ex (filtre 1/9 = moyenne, flou) |
| 9 | Résultat d'un filtre de contours sur le chat et la rose | 29-30 | partiel | `cnn.conv2d` ex |
| 10 | Schéma tensoriel : N × (C, H, W) ⊗ K filtres (C, R, S) = N × (K, P, Q) ; chaque filtre a C canaux, sortie à K canaux | 31 | partiel (seul « canaux sortie = filtres » dans tip) | `cnn.conv2d` p (phrase slide 31) |
| 11 | MaxPool2D : sous-échantillonnage et sélection des valeurs max, exemple 4×4 → [[20,30],[127,37]] | 32 | partiel (mot « sous-échantillonnage » du cours absent du texte) | `cnn.maxpool` p (terme du cours) |
| 12 | Dropout : suppression des liaisons sous un seuil | 33 | couvert (`cnn.dropout`) | aucun |
| 13 | Dense : couches complètement connectées | 33 | couvert (`cnn.flatten_dense`) | aucun |
| 14 | Flatten : construction d'un vecteur 1D | 33 | couvert (`cnn.flatten_dense`) | aucun |
| 15 | One-hot : labels → vecteurs 0/1, tableau Rouge/Vert/Violet/Marron | 34-35 | couvert (`nn.onehot`) | aucun |
| 16 | Learning rate : optimisation, vitesse d'apprentissage | 35 | couvert (`nn.epoch_lr`) | aucun |
| 17 | Normalisation des données entre 0 et 1 | 35 | couvert (`nn.normalisation`) | aucun |
| 18 | Epoch : nombre de fois qu'on présente le dataset complet | 35 | couvert (`nn.epoch_lr`) | aucun |
| 19 | Code fourni : changer epochs, optimiseur, learning rate et expliquer | 36 | couvert (`nn.epoch_lr` effets du LR, `nn.validation` trop d'epochs, `nn.compile_fit` optimiseur) | aucun |
| 20 | Exercice : évaluer les performances sur tout le jeu de test | 36 | couvert (`nn.compile_fit` : model.evaluate) | aucun |
| 21 | Validation : vérifier que le modèle généralise à chaque epoch | 37 | couvert (`nn.validation`) | aucun |
| 22 | Lecture du graphe accuracy / val_accuracy sur 10 epochs | 37 | partiel (l'exemple de la leçon est inventé, pas celui du cours) | `nn.validation` ex (voir remarque en fin de rapport) |
| 23 | VGG = Visual Geometry Group, modèles convolutionnels, 16 couches VGG16 / VGGNet, 19 couches VGG19 / VGGNet-19 | 38 | partiel (alias VGGNet absents) | `cnn.vgg` p |
| 24 | Schéma VGG : 224×224×3 → 224×224×64 → 112×112×128 → 56×56×256 → 28×28×512 → 14×14×512 → 7×7×512 → 4096 → 4096 → 1000 ; conv+ReLU, max pooling, fully connected+ReLU, softmax | 38 | absent | `cnn.vgg` p + ex |
| 25 | ResNet : blocs résiduels, x → F(x) devient x → F(x) + x, connexion identité | 39 | couvert (`cnn.resnet`) | aucun |
| 26 | Réseaux à dizaines/centaines de couches : évanescence des gradients, dégradation / saturation | 39 | partiel (« saturation » absent) | `cnn.resnet` p |
| 27 | ResNet50 : 50 couches | 39 | couvert | aucun |
| 28 | Inception : modules d'inception, convolutions à différentes échelles en parallèle, plus grande puissance de représentation | 40 | couvert (`cnn.inception`) | aucun |
| 29 | Schéma du module : couche précédente → 1×1, 3×3, 5×5 convolutions + 3×3 max pooling → filter concatenation | 40 | partiel (« un pooling » sans préciser max pooling 3×3 ni l'entrée commune « couche précédente ») | `cnn.inception` p |
| 30 | Bilan : ressemble à un MLP (couches, optimisation + backprop, entrées/sorties selon la tâche) | 41 | couvert (`cnn.bilan`) | aucun |
| 31 | Bilan : MAIS couches très diverses, calcul haute performance avec tenseurs, très nombreux neurones et poids | 41 | couvert (`cnn.bilan`) | aucun |
| 32 | Comparaison visuelle des architectures ResNet-50, Xception, Inception V3, VGG19, VGG16 | 42 | absent | nouvelle notion `cnn.modeles_keras` |
| 33 | Modèles disponibles dans Keras / TF (keras.io/api/applications) | 43 | partiel (une phrase dans `cnn.vgg`) | nouvelle notion `cnn.modeles_keras` |
| 34 | Tableau : taille (Mo), Top-1 / Top-5 accuracy, paramètres, profondeur, temps par inférence CPU / GPU ; ex. VGG16 528 Mo 138,4 M 71,3 % ; ResNet50 25,6 M 74,9 % ; InceptionV3 23,9 M 77,9 % ; Xception 22,9 M 79,0 % ; MobileNet 4,3 M 16 Mo 70,4 % | 43 | absent | nouvelle notion `cnn.modeles_keras` (leçon + 3 épreuves k2b-34 à k2b-36) |

Remarque sur la colonne « Depth » du tableau slide 43 : Keras y affiche 107 pour ResNet50 alors que la slide 39 dit « ResNet50 : 50 couches ». Pour ne pas créer de contradiction, la nouvelle leçon cite la colonne sans donner ces valeurs.

Remarque de coordination : le correctif 22 touche `nn.validation` (notion du bloc ch2a), car la slide 37 est dans la partie CNN. Seul le champ `ex` est modifié ; si l'agent ch2a modifie aussi `nn.validation.ex`, garder sa version et y ajouter la phrase sur le graphe de la slide 37.

## Correctifs

```json
[
{"action":"lesson","lesson":"cnn.conv2d","field":"p","op":"set","value":[
"Imagine une petite loupe 3×3 que l'on fait glisser sur toute l'image, case par case : à chaque position, elle calcule un score qui dit « ce motif est-il présent ici ? ».",
"Ce score se calcule simplement : chaque poids du filtre est multiplié par le pixel qu'il recouvre, puis on additionne tous ces produits.",
"Cette loupe s'appelle un filtre (ou noyau, kernel) : c'est une petite grille de poids que le réseau apprend. Chaque filtre produit une nouvelle image, la carte de caractéristiques (feature map).",
"Les premières couches Conv2D repèrent des contours, les suivantes des textures, les dernières des objets entiers.",
"Chaque filtre a autant de canaux que l'entrée : une entrée N × (C, H, W) traitée par K filtres de taille C × R × S donne une sortie N × (K, P, Q), donc K canaux.",
"Le stride est le pas de déplacement de la loupe. Le padding gère les bords : 'same' ajoute des zéros autour pour garder la même taille, 'valid' n'en ajoute pas et la taille diminue de k − 1 (k = taille du filtre).",
"Nombre de paramètres = (k × k × C_in + 1) × filtres, où C_in est le nombre de canaux en entrée et le +1 est le biais de chaque filtre."]},
{"action":"lesson","lesson":"cnn.conv2d","field":"ex","op":"set","value":"Un filtre 3×3 dont les 9 poids valent 1/9 calcule la moyenne des 9 pixels recouverts : l'image devient floue. Un filtre de contours, lui, fait ressortir les bords du chat ou de la rose et laisse le reste sombre. Dans le schéma NVIDIA, les noyaux notés (3, 3, 1, 2) sont 2 filtres 3×3 sur 1 canal : (28, 28, 1) devient (28, 28, 2) ; puis (3, 3, 2, 2) : 2 filtres 3×3 sur 2 canaux. Sur une image 28×28, un filtre 3×3 avec stride 1 donne 28×28 en 'same' et 28 − 3 + 1 = 26×26 en 'valid'. Conv2D(75, (3,3)) sur 1 canal : (3×3×1 + 1) × 75 = 750 paramètres ; Conv2D(50, (3,3)) sur 75 canaux : (3×3×75 + 1) × 50 = 33 800."},
{"action":"lesson","lesson":"cnn.maxpool","field":"p","op":"set","value":[
"Le pooling sert à faire un résumé plus petit de l'image, comme une miniature qui garde ce qui ressort le plus.",
"Le cours définit MaxPool2D comme un sous-échantillonnage (on garde moins de valeurs) avec sélection des valeurs max.",
"MaxPool2D découpe l'image en petites fenêtres (souvent 2×2) et ne garde que la plus grande valeur de chaque fenêtre.",
"Avec une fenêtre 2×2 et un stride (pas) de 2, la largeur et la hauteur sont divisées par 2 ; le nombre de canaux ne change pas.",
"Cela réduit le calcul et rend le réseau moins sensible aux petits décalages de l'objet. Il n'y a aucun poids à apprendre : prendre un max est une opération fixe."]},
{"action":"lesson","lesson":"cnn.flatten_dense","field":"ex","op":"set","value":"Fin du CNN ASL : (4, 4, 25) → Flatten → 4 × 4 × 25 = 400 valeurs → Dense 512 → Dense 24 (softmax). Dans le schéma NVIDIA : (28, 28, 2) → Flatten 28 × 28 × 2 = 1 568 valeurs → Dense 512 → Dense 512 → 24 sorties, une par lettre."},
{"action":"lesson","lesson":"cnn.shapes","field":"p","op":"set","value":[
"Une question classique consiste à suivre la forme (shape) du tenseur à travers le réseau, comme on suivrait un colis d'étape en étape.",
"Conv2D avec padding 'same' et stride 1 garde largeur et hauteur ; le nombre de canaux devient le nombre de filtres.",
"MaxPool2D 2×2 stride 2 divise largeur et hauteur par 2 (arrondi au supérieur en 'same') et garde les canaux.",
"Flatten multiplie le tout. Pour les paramètres : Conv2D = (k × k × C_in + 1) × filtres, Dense = entrées × neurones + neurones (un biais par neurone).",
"LeNet, le premier CNN, suit déjà ce schéma : image 32×32 → convolutions (6 cartes 28×28) → sous-échantillonnage (6 cartes 14×14) → convolutions (16 cartes 10×10) → sous-échantillonnage (16 cartes 5×5) → couches complètement connectées 120 → 84 → 10 sorties."]},
{"action":"lesson","lesson":"cnn.vgg","field":"p","op":"set","value":[
"VGG (pour Visual Geometry Group, l'équipe qui l'a conçu) est une famille de modèles convolutionnels très réguliers.",
"L'idée : empiler beaucoup de convolutions 3×3 (chacune suivie d'une ReLU) entrecoupées de max-pooling, puis finir par des couches complètement connectées et un softmax.",
"Le nombre dans le nom compte les couches à poids (convolutions + Dense) : VGG16, aussi appelé VGGNet, en a 16 ; VGG19, ou VGGNet-19, en a 19.",
"Le schéma du cours suit la taille : 224×224×3 en entrée, puis 224×224×64 → 112×112×128 → 56×56×256 → 28×28×512 → 14×14×512 → 7×7×512.",
"À chaque max-pooling, largeur et hauteur sont divisées par 2, tandis que le nombre de filtres double jusqu'à 512.",
"Viennent ensuite deux couches complètement connectées de 4 096 neurones, puis 1 000 sorties softmax, une par classe.",
"C'est simple et profond, mais très lourd : environ 138 millions de paramètres pour VGG16. Il existe pré-entraîné dans keras.applications."]},
{"action":"lesson","lesson":"cnn.vgg","field":"ex","op":"set","value":"VGG16 : image 224×224×3 → … → 7×7×512 → 4 096 → 4 096 → 1 000 classes. Il compte 16 couches et ≈ 138 M de paramètres, alors que la plus grosse couche du petit CNN ASL (la Dense 512) n'en a que 205 312."},
{"action":"lesson","lesson":"cnn.resnet","field":"p","op":"set","value":[
"Quand on empile des dizaines ou des centaines de couches, l'apprentissage se dégrade : le signal d'erreur rétropropagé devient si petit qu'il n'atteint plus les premières couches. C'est l'évanescence des gradients.",
"Le cours parle aussi de dégradation / saturation : ajouter des couches finit par faire perdre en qualité d'apprentissage au lieu d'en gagner.",
"ResNet ajoute un raccourci (connexion identité, ou skip) autour de quelques couches : l'entrée x est ajoutée directement à leur sortie.",
"Un bloc résiduel calcule donc F(x) + x au lieu de F(x), où F représente ce que calculent les couches du bloc.",
"Grâce à ce raccourci, le gradient circule facilement et on peut entraîner des réseaux très profonds sans dégradation."]},
{"action":"lesson","lesson":"cnn.inception","field":"p","op":"set","value":[
"Un même objet peut occuper quelques pixels ou toute l'image : quelle taille de filtre choisir ? Inception répond : toutes à la fois.",
"Un module d'inception prend la sortie de la couche précédente et lui applique en parallèle quatre branches : des convolutions 1×1, 3×3 et 5×5, et un max pooling 3×3.",
"Les résultats sont ensuite concaténés (mis côte à côte dans la dimension des canaux) pour former la sortie : c'est la « filter concatenation » du schéma.",
"On obtient une plus grande puissance de représentation, à un coût de calcul maîtrisé."]},
{"action":"lesson","lesson":"nn.validation","field":"ex","op":"set","value":"Epoch après epoch, loss du train : 0.50 → 0.20 → 0.05, mais loss de validation : 0.55 → 0.40 → 0.60. Elle remonte : le modèle mémorise le train. À l'inverse, dans le graphe du CNN du cours (10 epochs), accuracy et val_accuracy montent puis restent proches, entre 0,96 et 0,98 : la validation ne décroche pas, le modèle généralise bien."},
{"action":"notion","after":"cnn.bilan",
 "notion":{"id":"cnn.modeles_keras","ch":2,"label":"Comparer les modèles pré-entraînés de Keras (taille, Top-1/Top-5, paramètres)","fiche":"02","section":"Modèles avancés"},
 "lesson":{"title":"Choisir parmi les modèles tout faits de Keras",
  "p":[
   "Keras / TensorFlow propose des modèles déjà entraînés, prêts à l'emploi : la liste est sur keras.io/api/applications (module keras.applications).",
   "Pour chaque modèle, le tableau du cours donne sa taille en Mo, sa précision Top-1 et Top-5, son nombre de paramètres, sa profondeur et son temps par prédiction sur CPU et sur GPU.",
   "Top-1 accuracy : part des images où la classe jugée la plus probable est la bonne. Top-5 : part des images où la bonne classe est parmi les 5 plus probables ; ce score est donc toujours au moins aussi haut.",
   "Plus de paramètres ne veut pas dire plus précis : VGG16 a 138,4 M de paramètres pour 71,3 % de Top-1, ResNet50 25,6 M pour 74,9 %, InceptionV3 23,9 M pour 77,9 %.",
   "Un modèle léger comme MobileNet (4,3 M de paramètres, 16 Mo) reste correct (70,4 % de Top-1) et va plus vite.",
   "Le GPU accélère fortement la prédiction : pour VGG16, 69,5 ms par prédiction sur CPU contre 4,2 ms sur GPU.",
   "Le schéma comparatif montre les formes : VGG16 et VGG19 sont de simples piles de convolutions, ResNet-50 enchaîne des blocs à raccourci, Inception V3 des modules à branches parallèles concaténées (Filter Concat)."],
  "ex":"VGG16 : 528 Mo, 138,4 M de paramètres, Top-1 71,3 %, Top-5 90,1 %. VGG19 : 143,7 M de paramètres pour le même Top-1 de 71,3 % : 3 couches de plus, aucun gain. Xception : 88 Mo, 22,9 M de paramètres, Top-1 79,0 %.",
  "tip":"Pour comparer des modèles, regarder ensemble précision, nombre de paramètres et temps de calcul : le plus lourd (VGG) n'est pas le plus précis."},
 "items":[
{"id": "k2b-34", "type": "choix", "ch": 2, "notions": ["cnn.modeles_keras"], "diff": 1, "camp": true, "src": "slide 43", "q": "Dans le tableau des modèles Keras, VGG16 a 138,4 M de paramètres et 71,3 % de Top-1 ; ResNet50 a 25,6 M de paramètres et 74,9 %. Que montre cette comparaison ?", "ok": "Plus de paramètres ne garantit pas une meilleure précision", "ko": ["Le nombre de paramètres fixe directement la précision", "Un modèle plus léger est toujours moins précis"], "plain": "VGG16 est plus de cinq fois plus lourd que ResNet50, et pourtant il se trompe plus souvent : la taille seule ne fait pas la qualité.", "why": "Slide 43 : VGG16 = 138,4 M de paramètres pour 71,3 % de Top-1 ; ResNet50 = 25,6 M pour 74,9 %. Le modèle le plus léger est ici le plus précis.", "whyNot": "Si la précision suivait le nombre de paramètres, VGG16 serait devant ResNet50 ; c'est l'inverse dans le tableau."},
{"id": "k2b-35", "type": "choix", "ch": 2, "notions": ["cnn.modeles_keras"], "diff": 1, "camp": true, "src": "slide 43", "q": "Que mesure la colonne « Top-5 Accuracy » du tableau des modèles Keras ?", "ok": "La part d'images dont la bonne classe est parmi les 5 classes les plus probables", "ko": ["La précision moyenne obtenue après 5 epochs d'entraînement", "La précision des 5 dernières couches du réseau"], "plain": "On laisse au modèle 5 essais : on compte l'image comme réussie si la bonne réponse figure dans ses 5 propositions les plus probables.", "why": "Top-1 : la classe la plus probable est la bonne ; Top-5 : la bonne classe est dans les 5 plus probables. C'est pourquoi le Top-5 est plus élevé (VGG16 : 71,3 % en Top-1, 90,1 % en Top-5).", "whyNot": "Le 5 compte des classes proposées en sortie, pas des epochs ni des couches."},
{"id": "k2b-36", "type": "choix", "ch": 2, "notions": ["cnn.modeles_keras"], "diff": 1, "camp": true, "src": "slide 43", "q": "Pour VGG16, le tableau Keras donne 69,5 ms par prédiction sur CPU et 4,2 ms sur GPU. Qu'en conclure ?", "ok": "Le GPU accélère fortement la prédiction d'un modèle profond", "ko": ["Le GPU rend le modèle plus précis", "Le GPU réduit le nombre de paramètres du modèle"], "plain": "Le même modèle, avec les mêmes poids et la même précision, répond environ 16 fois plus vite sur une carte graphique.", "why": "Slide 43 : les colonnes de temps par inférence CPU / GPU montrent un gain de vitesse ; c'est le calcul parallèle haute performance sur les tenseurs (slides 27 et 41).", "whyNot": "Le matériel change la vitesse, pas les poids : précision et nombre de paramètres sont les mêmes sur CPU et sur GPU."}
 ]}
]
```

## Vérification à blanc

- `node tools/apply_lessons.js --prefix=cover_ch2b` : À BLANC : 10 correctif(s) de leçon, 0 problème(s).
- `node tools/apply_notions.js --prefix=cover_ch2b` : À BLANC : 1 notion(s), 0 problème(s) (lessons_ch2b.js, camp_ch2b.js).

## Résumé

- 34 éléments recensés sur les slides 24 à 43 (dont 2 hors examen : date de LeNet, vidéo d'archive).
- 18 couverts, 10 partiels, 4 absents.
- 8 leçons complétées : cnn.conv2d (p + ex), cnn.maxpool, cnn.flatten_dense, cnn.shapes, cnn.vgg (p + ex), cnn.resnet, cnn.inception, nn.validation (ex seul, slide 37).
- 1 notion créée : cnn.modeles_keras (slides 42-43), après cnn.bilan, avec 3 épreuves k2b-34 à k2b-36.

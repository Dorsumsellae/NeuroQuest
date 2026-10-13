# Audit de couverture — bloc ch2a (IA-Hexagone-2.DeepLearning.pdf, slides 3 à 23)

Périmètre : partie 1 « MLP » du PDF 2 (neurone artificiel, régression à un neurone, backpropagation, modèle dense Keras sur Fashion-MNIST : chargement, normalisation, construction, activations, compilation, entraînement, évaluation).
Frontière : la slide 24 (« Approche LeNet », premier CNN) ouvre la partie CNN, traitée par le bloc ch2b. Slides ignorées : 1 (garde), 2 (plan).
Leçons concernées : nn.neurone, nn.poids_signe, nn.lien_regression, nn.backprop, nn.keras_pipeline, nn.params, nn.normalisation, nn.activation, nn.softmax, nn.compile_fit, nn.loss_choice, code.pieges. Les leçons nn.types_ml, nn.train_infer, nn.epoch_lr, nn.onehot, nn.validation et code.fit_transform / code.pytorch s'appuient sur d'autres slides ou PDF (hors de ce bloc) : non modifiées.

## Tableau élément → diapo → statut → correctif

| # | Élément enseignable | Slide | Statut | Correctif |
|---|---|---|---|---|
| 1 | Correspondance biologie ↔ maths : force synaptique = poids | 3, 4 | couvert | — (nn.neurone) |
| 2 | PA (potentiel d'action) avant = entrées ; PA après = impulsion (sortie) | 3 | absent | nn.neurone p (phrase 5) |
| 3 | Schéma Σ → a → f → y | 3, 4 | couvert | — (svg neurone) |
| 4 | Formule a = Σ xᵢ·wᵢ − θ, y = f(a) | 4 | couvert | — |
| 5 | Dendrites = entrées, axone = sortie, seuil d'activation θ | 4 | couvert | — |
| 6 | Poids négatif = inhibition, positif = excitation | 4 | couvert | — (nn.neurone, nn.poids_signe) |
| 7 | f = échelon ou sigmoïde (neurone formel) | 4 | couvert | — |
| 8 | Entrées = valeurs numériques : niveaux de gris, présence/absence d'un trait, variable discrète, tout ce qui se convertit en nombres | 5 | absent | nn.neurone p (phrase 6) |
| 9 | Sortie y le plus souvent binaire (0/1) : 1 = le neurone émet une impulsion | 5 | absent | nn.neurone p (phrase 7) |
| 10 | Exemple chiffré : poids de somme 1, seuil 0.1, a = 2×0.5 + 4×0.2 + 1×0.3 − 0.1 = 2.1 − 0.1 = 2.0 | 6, 7, 8 | partiel (hypothèse « somme des poids = 1 » et étape 2.1 absentes) | nn.neurone ex |
| 11 | Pour a = 2.0 : échelon → 1, sigmoïde → 0.88, tanh → 0.96 | 9, 10 | couvert (nn.activation ex) ; partiel dans nn.neurone | nn.neurone ex (ajout tanh) |
| 12 | Régression à un neurone : x → m·x → + b → y = m·x + b | 11 | partiel (le schéma m·x puis + b n'est pas décrit) | nn.lien_regression p |
| 13 | Exercice : données générées avec m, b, noise ; changer optimiseur et learning rate ; tracer la loss selon les epochs | 11 | partiel (noise absent) | nn.lien_regression p |
| 14 | Backprop : on présente N exemples annotés, sur plusieurs itérations | 12 | couvert | — |
| 15 | Schéma : entrées = caractéristiques (Car. 1, Car. 2), couche cachée Σ f, sorties (0.25 ; 0.79) comparées aux cibles (1 ; 0), aller puis retour | 12 | partiel (entrées = caractéristiques non dit) | nn.backprop p |
| 16 | Graphe de dérivation (PyTorch autograd) : x → g(·) → f(·) → f(g(x)), dérivées locales dg/dx et df/dg | 13 | absent | nn.backprop p |
| 17 | Règle de la chaîne : d f(g(x))/dx = dg/dx × df/dg | 13 | partiel (nommée, sans formule) | nn.backprop p |
| 18 | Imports numpy as np, matplotlib.pyplot as plt, tensorflow as tf, from tensorflow import keras | 14 | absent | nouvelle notion nn.fashion_data |
| 19 | keras.datasets.fashion_mnist ; (train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data() | 14 | absent | nouvelle notion nn.fashion_data |
| 20 | Inspection : train_images.shape, len(train_labels), print des labels, test_images.shape | 15 | absent | nouvelle notion nn.fashion_data |
| 21 | Affichage : plt.figure(), plt.imshow(train_images[0]), plt.colorbar(), plt.grid(False), plt.show() | 15, 17 | absent | nouvelle notion nn.fashion_data |
| 22 | Normalisation train_images / 255.0 et test_images / 255.0 | 16 | couvert | — (nn.normalisation) |
| 23 | class_names : 10 noms de classes pour interpréter données et résultats (label entier = position dans la liste) | 16, 17 | absent | nouvelle notion nn.fashion_data |
| 24 | keras.Sequential = réseau à couches ; Input(shape=(28, 28)) = taille des entrées ; Flatten = conversion 2D → 1D | 18, 19 | couvert | — (nn.keras_pipeline) |
| 25 | 2 couches denses (fully connected), 128 et 10 = nombre de neurones par couche | 19 | couvert | — |
| 26 | ReLU (Rectified Linear Unit) : non linéaire, très répandue, max(0, x) | 20 | couvert (nom développé absent) | nn.activation p (précision) |
| 27 | Sortie : sigmoïde possible pour une valeur entre 0 et 1, mais softmax préférée en classification pour obtenir des probabilités | 20 | couvert | — (nn.softmax) |
| 28 | Sigmoïde σ(x) = 1/(1 + e⁻ˣ), tanh(x) | 20 | couvert | — |
| 29 | Leaky ReLU = max(0.1x, x) ; Maxout = max(w₁ᵀx + b₁, w₂ᵀx + b₂) ; ELU = x si x ≥ 0, α(eˣ − 1) si x < 0 | 20 | absent | nn.activation p (phrase 5) |
| 30 | opt = keras.optimizers.Adam(learning_rate=0.001) | 21 | partiel (Adam cité, sans la syntaxe ni la valeur) | nn.compile_fit p |
| 31 | model.compile(optimizer=opt, loss=tf.keras.losses.SparseCategoricalCrossentropy, metrics=['accuracy']) — compilation = dérivation, paramètres | 21 | partiel | nn.compile_fit p |
| 32 | model.summary() : afficher le modèle et ses paramètres | 21 | absent | nn.params p |
| 33 | model.fit(train_images, train_labels, epochs=10) | 21 | couvert | — |
| 34 | SparseCategoricalCrossentropy avec labels entiers | 21 | couvert | — (nn.loss_choice) |
| 35 | test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2) ; print('Test accuracy:', test_acc) | 22 | partiel (dépaquetage en deux variables absent) | nn.compile_fit p |
| 36 | predictions = model.predict(test_images) ; np.argmax(predictions[0]) comparé à test_labels[0] = vérité terrain | 22 | partiel (« vérité terrain » absent) | nn.compile_fit p |
| 37 | Exercice : bar plot des 10 sorties pour une entrée ; réponse juste (i = 0 : Ankle boot 100 %) ou fausse (i = 12 : Sandal 68 % pour une Sneaker) ; tester différents optimiseurs et paramètres | 23 | absent | nn.compile_fit p + ex |

## Notes de fidélité

- nn.neurone : l'ajout reprend mot pour mot les slides 3 et 5 (« PA avant : inputs ou entrées », « PA après : impulsion », « niveaux de gris dans une image, présence ou l'absence d'un trait, une variable discrète, et tout ce qui peut se convertir en nombres », « sortie y le plus souvent binaire (0/1) selon que le neurone émet ou pas une impulsion (1) »).
- nn.backprop : slide 13 (graphe de dérivation g puis f, dg/dx, df/dg, produit des deux) ; slide 12 (« Car. 1 », « Car. 2 » en entrée).
- nn.activation : formules recopiées de la vignette « Activation Functions » de la slide 20.
- nn.compile_fit : code des slides 21 et 22, valeurs du bar plot de la slide 23 (Ankle boot 100 %, Sandal 68 % pour une Sneaker).
- nn.fashion_data : code des slides 14, 15, 16 ; « la première image affichée est une Ankle boot » vient de la slide 17 (première vignette) ; class_names[9] = 'Ankle boot' (slide 16, dixième nom, indices à partir de 0). Les indices des labels de 0 à 9 sont ceux de l'axe du bar plot de la slide 23.
- Rien n'est ajouté sur l'historique (McCulloch et Pitts reste seulement là où il était déjà).

## Correctifs

```json
[
{"action":"lesson","lesson":"nn.neurone","field":"p","op":"set","value":[
"Un neurone artificiel imite très grossièrement un neurone biologique : des entrées, une somme, une sortie.",
"Chaque entrée xᵢ est multipliée par un poids wᵢ (la force de la connexion), on additionne, et on retranche un seuil θ : a = Σ xᵢwᵢ − θ (attention : ici θ est le seuil, pas le vecteur de paramètres de la régression).",
"Le résultat passe dans une fonction d'activation f : un échelon (0 ou 1) ou une sigmoïde dans la version historique, le plus souvent une ReLU aujourd'hui.",
"Un poids positif pousse le neurone à s'activer (excitation), un poids négatif le freine (inhibition).",
"Dans le neurone formel de McCulloch et Pitts, chaque variable a son modèle biologique : les dendrites sont les entrées xᵢ, les forces synaptiques sont les poids wᵢ, l'axone est la sortie y. Le potentiel d'action (PA) reçu avant le neurone correspond aux entrées, le PA émis après, l'impulsion, correspond à la sortie.",
"Les entrées xᵢ sont des valeurs numériques : niveaux de gris d'une image, présence ou absence d'un trait, variable discrète, bref tout ce qui peut se convertir en nombres.",
"La sortie y est le plus souvent binaire : 1 si le neurone émet une impulsion, 0 sinon."
]},
{"action":"lesson","lesson":"nn.neurone","field":"ex","op":"set","value":"Entrées (2, 4, 1), poids (0.5, 0.2, 0.3) dont la somme vaut 1, seuil 0.1 : a = 2 × 0.5 + 4 × 0.2 + 1 × 0.3 − 0.1 = 2.1 − 0.1 = 2.0. Avec un échelon la sortie vaut 1 ; avec une sigmoïde, environ 0.88 ; avec tanh, environ 0.96."},
{"action":"lesson","lesson":"nn.lien_regression","field":"p","op":"set","value":[
"Enlevez la fonction d'activation d'un neurone : il ne reste que la somme pondérée des entrées plus un biais.",
"Avec une seule entrée x, le neurone multiplie x par son poids m, ajoute le biais b et sort y = m·x + b : c'est exactement la formule d'une régression linéaire (notebook one_neuron_regression).",
"Dans ce notebook, les points d'entraînement sont générés autour de la droite à partir de m, b et d'un bruit (noise) ; changer m, b ou noise change les données à apprendre.",
"On l'entraîne de la même façon qu'une régression : on mesure l'erreur avec la MSE et on corrige les paramètres par descente de gradient.",
"Changer l'optimiseur (SGD, Adam) ou le learning rate change la vitesse et la stabilité de l'apprentissage, ce qu'on voit en traçant la loss au fil des epochs."
]},
{"action":"lesson","lesson":"nn.backprop","field":"p","op":"set","value":[
"Pour apprendre, un réseau doit savoir de combien chaque poids est responsable de son erreur.",
"Passe avant (forward) : on présente N exemples annotés, décrits par leurs caractéristiques (Car. 1, Car. 2…) en entrée ; le réseau calcule ses sorties et on mesure l'écart avec les bonnes réponses (la perte).",
"Passe arrière (backward) : on fait remonter le gradient de cette erreur de la dernière couche vers la première. C'est la backpropagation.",
"Le calcul du réseau se lit comme un graphe de dérivation : x entre dans un bloc g, dont la sortie entre dans un bloc f, ce qui donne f(g(x)) ; chaque bloc connaît sa dérivée locale, dg/dx et df/dg.",
"Règle de dérivation en chaîne : la dérivée de f(g(x)) par rapport à x vaut dg/dx × df/dg ; on multiplie les dérivées locales en remontant le graphe.",
"On met alors à jour tous les poids avec w ← w − η·∇ (η = learning rate, ∇ = gradient de l'erreur par rapport au poids), puis on recommence sur plusieurs itérations (lots et epochs)."
]},
{"action":"lesson","lesson":"nn.params","field":"p","op":"set","value":[
"Les paramètres sont les nombres que le réseau apprend : les poids et les biais.",
"Dans une couche Dense, chaque neurone a un poids par entrée, plus un biais à lui.",
"D'où la règle : paramètres = entrées × neurones + neurones.",
"Flatten, Dropout ou MaxPool n'ont aucun paramètre : ils transforment les données sans rien apprendre.",
"En Keras, model.summary() affiche le modèle couche par couche avec ses paramètres : c'est là qu'on vérifie un calcul de paramètres."
]},
{"action":"lesson","lesson":"nn.activation","field":"p","op":"set","value":[
"Après sa somme pondérée a, un neurone passe le résultat dans une fonction d'activation qui décide de sa sortie.",
"Sans elle, empiler des couches ne servirait à rien : tout reviendrait à une seule transformation linéaire.",
"ReLU (Rectified Linear Unit) = max(0, a) : fonction non linéaire très répandue, qui garde le positif et met le négatif à 0 ; c'est le choix courant dans les couches cachées. Sigmoïde = 1/(1+e⁻ᵃ), entre 0 et 1, utile pour une probabilité.",
"tanh donne une valeur entre −1 et 1. L'échelon (0 ou 1) est, avec la sigmoïde, le choix du neurone formel du cours ; en pratique on lui préfère des fonctions dérivables, car sa dérivée est nulle presque partout et la backpropagation ne peut pas passer.",
"Le cours montre aussi des variantes : Leaky ReLU = max(0.1x, x), qui laisse passer un peu du négatif ; ELU = x si x ≥ 0 et α(eˣ − 1) si x < 0 ; Maxout = max(w₁ᵀx + b₁, w₂ᵀx + b₂), qui garde la plus grande de deux combinaisons linéaires."
]},
{"action":"lesson","lesson":"nn.compile_fit","field":"p","op":"set","value":[
"Une fois le modèle construit, Keras enchaîne quatre étapes : régler la machine, la faire tourner, la noter, puis s'en servir.",
"On crée d'abord l'optimiseur : opt = keras.optimizers.Adam(learning_rate=0.001).",
"model.compile(optimizer=opt, loss=tf.keras.losses.SparseCategoricalCrossentropy, metrics=['accuracy']) prépare l'entraînement (dérivation, paramètres) : l'optimiseur, l'erreur à minimiser et ce qu'on affiche.",
"model.fit(train_images, train_labels, epochs=10) entraîne le modèle ; les epochs et la taille des batchs se règlent ici, pas dans compile.",
"test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2) renvoie la loss et l'accuracy sur le test ; predictions = model.predict(test_images) renvoie les probabilités de chaque classe.",
"np.argmax(predictions[0]) donne l'indice de la classe la plus probable, à comparer à test_labels[0], la vérité terrain (le vrai label).",
"On peut tracer les 10 sorties d'une image en bar plot : si la plus haute barre est la vraie classe, la réponse est juste ; sinon elle est fausse, même si le modèle semble sûr de lui."
]},
{"action":"lesson","lesson":"nn.compile_fit","field":"ex","op":"set","value":"predictions = model.predict(test_images) a la forme (10000, 10) : 10 probabilités par image. Image 0 : np.argmax(predictions[0]) renvoie 9, 'Ankle boot' à 100 %, égal à test_labels[0] : juste. Image 12 : la plus haute barre est 'Sandal' à 68 % alors que la vérité terrain est 'Sneaker' : faux."},
{"action":"notion","after":"nn.backprop","notion":{"id":"nn.fashion_data","ch":2,"label":"Charger et explorer Fashion-MNIST (load_data, shape, imshow, class_names)","fiche":"02","section":"MLP dense avec Keras"},
 "lesson":{"title":"Charger et explorer les données Fashion-MNIST",
  "p":[
   "Un projet Keras commence par quatre imports : import numpy as np (calcul sur tableaux), import matplotlib.pyplot as plt (affichage), import tensorflow as tf et from tensorflow import keras.",
   "keras.datasets.fashion_mnist fournit des images de vêtements en niveaux de gris, déjà annotées.",
   "fashion_mnist.load_data() renvoie deux couples : (train_images, train_labels) pour l'entraînement et (test_images, test_labels) pour le test.",
   "Chaque image est une grille de 28 × 28 pixels ; chaque label est un entier de 0 à 9, un par classe de vêtement.",
   "Avant de construire le modèle, on inspecte les données : train_images.shape donne les dimensions du tableau d'images, len(train_labels) le nombre de labels.",
   "plt.imshow(train_images[0]) affiche la première image d'entraînement, plt.colorbar() ajoute l'échelle des valeurs des pixels, plt.show() ouvre la figure.",
   "class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat', 'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'] stocke le nom des 10 classes : class_names[label] traduit un entier en nom lisible, pour mieux interpréter données et résultats."
  ],
  "ex":"(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data(). La première image affichée est une bottine : son label vaut 9, et class_names[9] = 'Ankle boot' (on compte à partir de 0).",
  "tip":"load_data() sépare déjà train et test ; un label est un entier (la position dans class_names), pas le nom du vêtement, d'où SparseCategoricalCrossentropy à la compilation."},
 "items":[
  {"id":"k2a-58","type":"choix","ch":2,"notions":["nn.fashion_data"],"diff":1,"camp":true,"src":"slide 14","q":"Dans le projet Fashion-MNIST, que renvoie fashion_mnist.load_data() ?","ok":"Deux couples (images, labels) : un pour l'entraînement, un pour le test","ko":["Un seul tableau d'images, sans labels, qu'il faut découper soi-même","Un modèle Keras déjà entraîné à reconnaître les vêtements"],"plain":"load_data, c'est recevoir le paquet de révision déjà trié : d'un côté les images d'entraînement avec leurs réponses, de l'autre les images de test avec les leurs.","why":"Slide 14 : (train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data().","whyNot":"Les labels sont fournis et le découpage train/test est déjà fait ; aucun modèle n'est renvoyé : on le construit ensuite avec keras.Sequential (slide 18)."},
  {"id":"k2a-59","type":"choix","ch":2,"notions":["nn.fashion_data"],"diff":2,"camp":true,"src":"slide 16","q":"class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat', …]. Une image a pour label 3 : quel vêtement est-ce ?","ok":"'Dress'","ko":["'Pullover'","'Coat'"],"plain":"Le label est une position dans la liste, et Python compte à partir de 0 : 0 = T-shirt/top, 1 = Trouser, 2 = Pullover, 3 = Dress.","why":"Slide 16 : class_names stocke les noms des classes pour interpréter les labels entiers ; class_names[3] est le quatrième nom, 'Dress'.","whyNot":"'Pullover' est class_names[2] (erreur de compter à partir de 1) ; 'Coat' est class_names[4]."},
  {"id":"k2a-60","type":"choix","ch":2,"notions":["nn.fashion_data"],"diff":1,"camp":true,"src":"slide 15","q":"Que fait plt.imshow(train_images[0]) suivi de plt.show() ?","ok":"Il affiche la première image d'entraînement","ko":["Il affiche la prédiction du modèle pour la première image","Il affiche le premier label sous forme de texte"],"plain":"imshow veut dire « montre l'image » : on regarde à l'œil la première image du jeu d'entraînement avant de construire le modèle.","why":"Slide 15 : « On peut afficher les informations et la 1ère image » avec plt.imshow(train_images[0]), plt.colorbar(), plt.show().","whyNot":"Aucun modèle n'existe encore à cette étape (les prédictions viennent de model.predict, slide 22) ; train_images contient les pixels, pas les labels."}
 ]}
]
```

## Résumé

- Éléments recensés : 37 (slides 3 à 23 ; la slide 24 LeNet ouvre la partie CNN du bloc ch2b).
- Couverts : 15 ; partiels : 10 ; absents : 12.
- Leçons complétées : 6 (nn.neurone p + ex, nn.lien_regression p, nn.backprop p, nn.params p, nn.activation p, nn.compile_fit p + ex), soit 8 correctifs de leçon.
- Notion créée : 1 (nn.fashion_data, après nn.backprop, fiche 02 « MLP dense avec Keras »), avec 3 épreuves k2a-58 à k2a-60 dans camp_ch2a.
- Vérification à blanc : `node tools/apply_lessons.js --prefix=cover_ch2a` et `node tools/apply_notions.js --prefix=cover_ch2a` → 0 problème.

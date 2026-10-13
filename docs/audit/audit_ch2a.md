# Audit chapitre 2a : neurones, MLP, Keras, code (nn.* et code.*)

Sources de vérité : `Cours/IA-Hexagone-2.DeepLearning.pdf` (slides 1 à 23 pour la partie MLP, 33 à 37 pour les « autres éléments ») et `Cours/IA-Hexagone-0.Introduction.pdf` (noté « intro slide N »). Les équations et schémas ont été vérifiés sur le rendu des pages (slides 3, 4, 6, 10, 11, 12, 13, 19, 34, 37).

Périmètre : les 45 épreuves de `content/ch2.js` dont la première notion commence par `nn.` ou `code.`.

## Synthèse

| Verdict | Nombre |
|---|---|
| OK | 26 |
| HORS-PDF | 15 |
| ERREUR (contredit le PDF) | 0 |
| AMBIGU | 3 |
| MAL-TAGUÉ | 1 |

Aucune épreuve ne contredit frontalement le PDF. Les épreuves HORS-PDF portent presque toutes sur des points utiles à l'examen : PyTorch, fit/transform, choix sparse/categorical, comptage de paramètres, sur-apprentissage. Le cours Régressions et la pratique Keras/PyTorch couvrent sans doute une partie de ces points, mais ils ne figurent pas dans les deux PDF de référence. Aucune suppression n'est proposée.

## Tableau

| id | verdict | justification |
|---|---|---|
| c2-01 | OK | Intro slide 7 : supervisé = données + annotations ; non supervisé = données seules ; renforcement = agent. |
| c2-02 | HORS-PDF | La définition du non supervisé est à l'intro slide 7, mais l'autoencodeur n'apparaît dans aucun des deux PDF (il vient du cours Autoencodeurs). La question reste utile ; ajouter le tag ae.non_supervise. |
| c2-03 | OK | Intro slide 6 : ML vs data science, exemple corrélation âge / cancer. |
| c2-04 | OK | Intro slides 10-11 : apprentissage puis inférence. |
| c2-05 | OK | Intro slide 11 : « format semblable aux données de l'entraînement » ; /255 au slide 16. Les précisions « mêmes dimensions, même normalisation » sont une interprétation fidèle. |
| c2-06 | OK | Slide 4 : a = Σ(xᵢ·wᵢ) − θ, y = f(a). |
| c2-07 | OK | Slides 3-4 : forces synaptiques = poids, dendrites = entrées, axone = sortie. |
| c2-08 | OK | Slide 4 : inhibition = wᵢ négatif. |
| c2-09 | OK | Exemple des slides 6 à 9 (2.1 − 0.1 = 2.0). |
| c2-10 | OK | Slide 10 : pour a = 2.0, échelon 1, sigmoïde 0.88, tanh 0.96. |
| c2-11 | OK | Variante chiffrée de la formule du slide 4 ; calcul vérifié (a = 0.1). |
| c2-12 | OK | Slide 11 : y = m·x + b. Note : « descente de gradient sur la MSE » ne figure pas dans le PDF DeepLearning mais vient du cours Régressions. Tag secondaire reg.one_neuron possible. |
| c2-13 | OK | Slides 12-13 : N exemples annotés, erreur rétropropagée, plusieurs itérations. Le whyNot écrit « supprimer des neurones relève du Dropout », or le slide 33 parle de suppression des *liaisons* : à reformuler. |
| c2-14 | AMBIGU | L'ordre est cohérent avec le slide 12, mais l'item « θ ← θ − η∇ » emploie θ pour les paramètres, alors que dans ce chapitre θ désigne le seuil (slide 4, et la leçon nn.neurone le signale expressément). La règle de mise à jour n'est pas dans le PDF DeepLearning. |
| c2-15 | OK | Slide 19 : Flatten = « Conversion 2D en 1D » ; normalisation au slide 16. |
| c2-16 | OK | Slide 19 : couches denses (fully connected), nombre de neurones par couche. |
| c2-17 | HORS-PDF | Le calcul des paramètres n'est pas détaillé (le slide 21 dit seulement que model.summary() les affiche) ; architecture du slide 19. Utile pour l'examen. |
| c2-18 | HORS-PDF | Même remarque que c2-17. |
| c2-19 | HORS-PDF | 3136 = sortie aplatie d'un CNN (7×7×64), contexte CNN absent de la partie MLP. Ajouter le tag cnn.shapes. |
| c2-20 | OK | Slides 16 et 35 : normalisation entre 0 et 1. Le why présente comme « le cours » l'argument des gradients trop grands, qui est hors PDF : à reformuler. |
| c2-21 | OK | Slide 20 : ReLU, « fonction non linéaire très répandue ». La formule max(0, a) n'est pas dans le PDF mais elle est exacte. |
| c2-22 | HORS-PDF | Le PDF (slide 4) présente l'échelon comme un choix valide pour f ; l'abandon de l'échelon faute de gradient n'est pas dans le cours. Question de compréhension pertinente, à garder. |
| c2-23 | OK | Slide 20 : « en classification, on préfère Softmax pour obtenir des probabilités ». |
| c2-24 | MAL-TAGUÉ | Elle porte sur l'activation de sortie d'une régression : première notion nn.softmax inadaptée, il vaut mieux nn.activation + nn.lien_regression. Le why cite un lab AE Conv1D absent des PDF ; slide 11 (neurone de régression sans f) suffit. |
| c2-25 | OK | Slide 21 : compile(optimizer, loss, metrics), fit(..., epochs=10). |
| c2-26 | OK | Slide 22 : predict puis argmax. La forme (10000, 10) n'est pas affichée dans le PDF mais découle du dataset. |
| c2-27 | OK | Slide 22 : np.argmax(predictions[0]) comparé à test_labels[0]. |
| c2-28 | HORS-PDF | Le PDF ne montre que SparseCategoricalCrossentropy (slide 21) ; CategoricalCrossentropy n'y figure pas. La réponse se déduit des slides 15, 21 et 34 avec la leçon. Essentiel pour l'examen. |
| c2-29 | HORS-PDF | Le slide 21 montre loss et metrics sans expliquer la différence. |
| c2-30 | OK | Slide 35 : « learning rate : vitesse d'apprentissage du modèle ». |
| c2-31 | HORS-PDF | Le batch_size n'est pas dans le PDF DeepLearning ; il est probablement vu dans Régressions (le tag reg.minibatch est présent). |
| c2-32 | OK | Slide 34 : tableau one-hot Rouge/Vert/Violet/Marron. to_categorical est hors PDF. |
| c2-33 | OK | Slide 37, citation exacte. |
| c2-34 | HORS-PDF | Le sur-apprentissage n'est pas nommé dans le PDF DeepLearning (slide 37 : seulement « généralise bien »). Utile ; ajouter le tag reg.overfit si cette notion le traite. |
| c2-35 | AMBIGU | La question affirme « remèdes … vus dans le cours », or le PDF ne présente ni le dropout ni l'augmentation comme remèdes au sur-apprentissage. Le slide 33 définit le Dropout comme « suppression des liaisons entre neurones en dessous d'un certain seuil », sans parler de régularisation. Reformuler la question. |
| c2-58 | AMBIGU | « tanh … utilisée dans les LSTM » ne figure dans aucun PDF du module ; « Sigmoïde : sortie binaire » non plus (le slide 20 dit « une valeur entre 0 et 1 ») ; max(0, a) est hors PDF. Les associations ReLU/softmax sont justes. |
| c2-59 | OK | Ordre des slides 14 à 22. |
| c2-61 | OK | Écart par rapport au slide 21 (SparseCategoricalCrossentropy avec labels entiers) ; il faut la leçon pour savoir que categorical attend du one-hot. Ligne 5 (index 0) vérifiée. |
| c2-62 | OK | Slide 20 : softmax en sortie de classification ; ligne 3 (index 0) vérifiée. |
| c2-65 | HORS-PDF | La boucle PyTorch n'est pas dans les slides (le slide 13 renvoie seulement vers un tutoriel vidéo). Ligne 4 vérifiée. |
| c2-66 | HORS-PDF | Même remarque ; le why cite « le notebook du cours », invérifiable. Ligne 5 vérifiée. |
| c2-67 | HORS-PDF | torch.no_grad absent des PDF. |
| c2-69 | HORS-PDF | reshape(-1, 1) absent des deux PDF (présent dans Régressions, slide 22). |
| c2-70 | HORS-PDF | StandardScaler absent des PDF ; why cite le « lab de détection d'anomalies ». Attention : Régressions slide 22 fait `pol_features.fit_transform(X_test.reshape(-1,1))`. C'est sans conséquence pour PolynomialFeatures, mais cela peut troubler l'étudiant : nuance à ajouter. |
| c2-71 | HORS-PDF | Combinaison de la leçon et du slide 20 ; loss MSE hors PDF DeepLearning. Utile. |

## Contradictions ou tensions entre micro-leçons et PDF

1. **nn.backprop : notation θ.** La leçon écrit la mise à jour « θ ← θ − η∇ », alors que le slide 4 (et la leçon nn.neurone, qui le souligne) définit θ comme le **seuil**. Dans un même chapitre, le même symbole désigne deux choses. À remplacer par « w ← w − η·∇ ». La même erreur se trouve dans c2-14.
2. **nn.activation : échelon et tanh.** La leçon affirme que l'échelon « n'est plus utilisé » et que tanh est « utilisée dans les LSTM ». Ni l'un ni l'autre n'est dans le PDF. Le slide 4 présente au contraire l'échelon comme l'un des deux choix de f, et aucun PDF du module ne relie tanh aux LSTM. Ce n'est pas faux, mais c'est hors cours : à présenter comme un complément.
3. **nn.neurone : choix de f.** « Le plus souvent une ReLU aujourd'hui » : le slide 4 dit « échelon ou sigmoïde » et le slide 20 « ReLU très répandue ». C'est compatible, mais la leçon mêle les deux slides.
4. **nn.validation : sur-apprentissage et remèdes.** La leçon introduit le sur-apprentissage, validation_split et les remèdes (dropout, augmentation, moins d'epochs). Le slide 37 dit seulement que la validation sert à « vérifier que le modèle généralise bien à chaque epoch », et sa courbe montre val_accuracy > accuracy (aucun sur-apprentissage visible). C'est hors PDF.
5. **Dropout (hors périmètre, à transmettre à l'audit cnn.*).** Le slide 33 définit le Dropout comme « suppression des liaisons entre neurones en dessous d'un certain seuil », définition non standard qui ne parle pas d'aléatoire. Les questions qui en font un « remède vu en cours » (c2-35) ou une « suppression de neurones » (c2-13) s'écartent de cette définition.
6. **code.fit_transform.** La leçon pose « jamais fit sur le test », mais le cours Régressions (slide 22) applique fit_transform à X_test avec PolynomialFeatures. Ce n'est pas une contradiction de fond, puisque PolynomialFeatures n'apprend aucune statistique, mais il faudrait le préciser : la règle vaut pour les transformateurs qui apprennent des statistiques (StandardScaler, MinMaxScaler).
7. **Compléments hors PDF présentés sans le signaler** : nn.normalisation (gradients trop grands), nn.softmax (formule eᵃⁱ/Σeᵃʲ), nn.loss_choice (categorical vs sparse, MSE), nn.epoch_lr (batch de 32, nombre de mises à jour), nn.onehot (to_categorical), nn.params (formule), nn.lien_regression (nn.Linear, MSE). Tous sont exacts. nn.lien_regression recoupe en outre la notion reg.one_neuron du registre.

## Notions du PDF non couvertes par le registre

Partie neurone / MLP / Keras (PDF DeepLearning) :
- **Slide 5 : nature des entrées et de la sortie d'un neurone.** Les entrées codent des niveaux de gris, la présence ou l'absence d'un trait, une variable discrète, « tout ce qui peut se convertir en nombres » ; la sortie est « le plus souvent binaire (0/1) ». Aucune notion ni question.
- **Slide 3 : correspondance biomimétique** (PA avant = entrées, PA après = impulsion). Elle n'est couverte qu'en partie, par nn.neurone (c2-07).
- **Slide 13 : graphe de dérivation / dérivation en chaîne** (dg/dx · df/dg). La leçon nn.backprop la cite en une phrase, mais aucune question ne la teste.
- **Slides 14-17 : chargement et inspection de Fashion-MNIST** (load_data renvoyant (train_images, train_labels), (test_images, test_labels) ; .shape ; imshow ; class_names). Seul c2-59 y touche.
- **Slide 21 : choix de l'optimiseur (Adam) et model.summary().** Aucune notion nn.* ne traite de l'optimiseur ; seules les notions reg.* le font peut-être.
- **Slides 23 et 36 : exercices d'évaluation** (bar plot des sorties, cas juste i=0 / faux i=12, évaluer sur tout le jeu de test, comparer optimiseurs et learning rates). Il n'y a pas de notion « analyser les sorties / erreurs du modèle ».

Introduction :
- **Intro slide 12 : IA faible (imiter) vs IA généralisée (apprendre comme un humain)** ; réserves (conscience simulée vs réelle).
- **Intro slide 13 : apports de l'IA** (contrôle, logique d'enchaînement, automatisme) et **tractabilité** (big data, espace des solutions, explosion combinatoire).
- **Intro slide 9 : facteurs de l'essor du deep learning** (approche neuronale sophistiquée, calcul haute performance, big data), sans les dates.
- **Intro slide 8 : IA générative** (LLM, modèles de diffusion, agents). Elle n'est couverte qu'en une phrase dans nn.types_ml.

## Correctifs proposés

```json
[
  {"id":"c2-02","action":"retag","value":["nn.types_ml","ae.non_supervise"]},
  {"id":"c2-12","action":"retag","value":["nn.lien_regression","reg.one_neuron"]},
  {"id":"c2-13","action":"edit","field":"whyNot","value":"L'ordre des exemples n'est pas en jeu ; la backpropagation ne supprime rien : elle corrige les poids."},
  {"id":"c2-14","action":"edit","field":"items[4]","value":"Mettre à jour les poids (w ← w − η·gradient)"},
  {"id":"c2-14","action":"edit","field":"why","value":"Slide 12 : les exemples annotés passent vers l'avant, l'erreur est mesurée puis propagée vers l'arrière, et ce schéma est répété sur plusieurs itérations. (Ici θ désigne le seuil du neurone : on note w les poids mis à jour.)"},
  {"id":"c2-19","action":"retag","value":["nn.params","cnn.shapes"]},
  {"id":"c2-20","action":"edit","field":"why","value":"Slide 16 : « On normalise les données » (train_images / 255.0 et test_images / 255.0) ; slide 35 : « Normalisation des données entre 0. et 1. ». Des entrées entre 0 et 255 rendraient aussi l'apprentissage moins stable."},
  {"id":"c2-24","action":"retag","value":["nn.activation","nn.lien_regression"]},
  {"id":"c2-24","action":"edit","field":"why","value":"Une valeur réelle quelconque ne doit pas être contrainte : le neurone de régression du slide 11 calcule y = m·x + b, sans fonction d'activation."},
  {"id":"c2-34","action":"retag","value":["nn.validation","reg.overfit"]},
  {"id":"c2-35","action":"edit","field":"q","value":"Quels sont les remèdes classiques au sur-apprentissage ?"},
  {"id":"c2-35","action":"edit","field":"why","value":"Dropout (couche du slide 33), augmentation de données (ImageDataGenerator du code fourni), suivi de la validation (slide 37) pour arrêter au bon moment. Le lien avec le sur-apprentissage est un complément au PDF."},
  {"id":"c2-58","action":"edit","field":"pairs[2][1]","value":"Valeur entre 0 et 1 (possible en sortie, slide 20)"},
  {"id":"c2-58","action":"edit","field":"pairs[3][1]","value":"Valeur dans ]−1, 1[ (tanh(2) ≈ 0.96, slide 10)"},
  {"id":"c2-58","action":"edit","field":"why","value":"ReLU en couche cachée et softmax en sortie de classification (slides 19-20) ; sigmoïde pour une valeur entre 0 et 1 (slide 20) ; tanh borne dans ]−1, 1[ (slide 10)."},
  {"id":"c2-66","action":"edit","field":"why","value":"zero_grad() efface les gradients calculés par backward() juste avant step() : la mise à jour se fait avec des gradients nuls. zero_grad doit être appelé avant backward, par exemple juste après le forward."},
  {"id":"c2-70","action":"edit","field":"why","value":"Un StandardScaler apprend μ et σ : fit sur le train, transform seul sur le test. (Le cours Régressions, slide 22, fait fit_transform sur X_test avec PolynomialFeatures : sans conséquence, car ce transformateur n'apprend aucune statistique des données.)"}
]
```

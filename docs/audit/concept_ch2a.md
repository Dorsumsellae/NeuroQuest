# Audit « concept vs exemple » : chapitre 2, notions nn.* et code.*

Critère : une question EXEMPLE exige de se souvenir d'un exemple précis du cours ou du lab (Fashion-MNIST, valeurs d'un slide, figure, code exact, numéro de slide) ; CONCEPT se répond en ayant compris la notion (un calcul est conceptuel si toutes ses données sont dans l'énoncé) ; MIXTE = concept testé mais habillé par un renvoi à l'exemple ou au slide.

## 1. Verdicts

### content/ch2.js (épreuves dont la 1re notion est nn.* ou code.*)

| id | verdict | ce qui était mémorisé |
|---|---|---|
| c2-01 | CONCEPT | — |
| c2-02 | CONCEPT | — |
| c2-03 | CONCEPT | — (définition du cours, sans exemple) |
| c2-04 | CONCEPT | — |
| c2-05 | CONCEPT | — |
| c2-06 | CONCEPT | — |
| c2-07 | CONCEPT | — (analogie biologique = notion du cours) |
| c2-08 | CONCEPT | — |
| c2-09 | CONCEPT | — (calcul, toutes les données dans l'énoncé) |
| c2-10 | EXEMPLE | Valeurs numériques du slide 10 pour a = 2 (σ ≈ 0.88, tanh ≈ 0.96), non calculables de tête |
| c2-11 | CONCEPT | — (calcul, données fournies) |
| c2-12 | MIXTE | La bonne réponse cite le notebook one_neuron_regression |
| c2-13 | CONCEPT | — |
| c2-14 | CONCEPT | — |
| c2-15 | CONCEPT | — (784 se déduit de la forme donnée) |
| c2-16 | MIXTE | ctx = modèle Fashion-MNIST du cours, inutile pour répondre |
| c2-17 | CONCEPT | — (calcul, tailles données) |
| c2-18 | CONCEPT | — (calcul, tailles données) |
| c2-19 | CONCEPT | — (calcul, tailles données) |
| c2-20 | CONCEPT | — |
| c2-21 | CONCEPT | — |
| c2-22 | CONCEPT | — |
| c2-23 | CONCEPT | — |
| c2-24 | CONCEPT | — |
| c2-25 | CONCEPT | — |
| c2-26 | MIXTE | Cadre Fashion-MNIST (10 000 images de test, 10 classes) recopié du notebook |
| c2-27 | CONCEPT | — |
| c2-28 | CONCEPT | — |
| c2-29 | CONCEPT | — |
| c2-30 | CONCEPT | — |
| c2-31 | CONCEPT | — (calcul, données fournies) |
| c2-32 | CONCEPT | — |
| c2-33 | CONCEPT | — |
| c2-34 | CONCEPT | — |
| c2-35 | CONCEPT | — |
| c2-58 | MIXTE | Paires citant « slide 20 » et la valeur tanh(2) ≈ 0.96 du slide 10 |
| c2-59 | MIXTE | « Pipeline Keras du cours » : ordre des slides 14-22 (load_data, /255) dont une partie est arbitraire |
| c2-61 | MIXTE | Code = modèle Fashion-MNIST du cours (Input 28×28, Dense 128/10) |
| c2-62 | MIXTE | Exemple « 24 lettres » du lab / de la leçon |
| c2-65 | CONCEPT | — (boucle PyTorch générique ; line 4 vérifiée) |
| c2-66 | CONCEPT | — (line 5 vérifiée) |
| c2-67 | CONCEPT | — |
| c2-69 | CONCEPT | — |
| c2-70 | CONCEPT | — |
| c2-71 | CONCEPT | — |

Bilan ch2.js : 45 épreuves, 37 CONCEPT, 8 à remplacer (bloc json ci-dessous).

### content/camp_ch2a.js (campagne, réécrite directement dans le fichier)

| id | notion | verdict | ce qui était mémorisé |
|---|---|---|---|
| k2a-01 | nn.types_ml | CONCEPT | — |
| k2a-02 | nn.types_ml | CONCEPT | — |
| k2a-03 | nn.types_ml | EXEMPLE | Exemple du slide 6 (corrélation âge / prévalence d'un cancer) |
| k2a-04 | nn.train_infer | CONCEPT | — |
| k2a-05 | nn.train_infer | CONCEPT | — |
| k2a-06 | nn.train_infer | CONCEPT | — |
| k2a-07 | nn.neurone | CONCEPT | — |
| k2a-08 | nn.neurone | CONCEPT | — |
| k2a-09 | nn.neurone | CONCEPT | — |
| k2a-10 | nn.poids_signe | CONCEPT | — |
| k2a-11 | nn.poids_signe | CONCEPT | — |
| k2a-12 | nn.poids_signe | CONCEPT | — |
| k2a-13 | nn.lien_regression | MIXTE | « D'après le slide Régression » : sans le schéma, la question ne précise pas l'absence d'activation |
| k2a-14 | nn.lien_regression | MIXTE | Renvoi au « neurone du slide 11 » et valeurs du cours |
| k2a-15 | nn.lien_regression | CONCEPT | — |
| k2a-16 | nn.backprop | CONCEPT | — |
| k2a-17 | nn.backprop | MIXTE | Valeurs y₁ = 0.25, y₂ = 0.79 du slide 12 |
| k2a-18 | nn.backprop | CONCEPT | — |
| k2a-19 | nn.keras_pipeline | MIXTE | « Dans le modèle du cours » |
| k2a-20 | nn.keras_pipeline | CONCEPT | — |
| k2a-21 | nn.keras_pipeline | CONCEPT | — |
| k2a-22 | nn.params | CONCEPT | — |
| k2a-23 | nn.params | CONCEPT | — |
| k2a-24 | nn.params | MIXTE | « Flatten du modèle du cours » ; leurre 784 tiré de l'exemple |
| k2a-25 | nn.normalisation | CONCEPT | — |
| k2a-26 | nn.normalisation | EXEMPLE | « Normalisation du cours » non rappelée (il fallait savoir que le cours divise par 255) |
| k2a-27 | nn.normalisation | CONCEPT | — |
| k2a-28 | nn.activation | CONCEPT | — |
| k2a-29 | nn.activation | EXEMPLE | Valeur σ(2) ≈ 0.88 lue sur le slide 10 |
| k2a-30 | nn.activation | MIXTE | « D'après les courbes du slide 10 » |
| k2a-31 | nn.softmax | EXEMPLE | « Le modèle du cours » et ses 10 classes Fashion-MNIST |
| k2a-32 | nn.softmax | CONCEPT | — |
| k2a-33 | nn.softmax | MIXTE | « Le slide 20 dit qu'on aurait pu… » |
| k2a-34 | nn.compile_fit | EXEMPLE | Ligne de code exacte du cours (train_images, epochs=10) |
| k2a-35 | nn.compile_fit | MIXTE | « Que récupère le cours avec test_loss, test_acc = … » |
| k2a-36 | nn.compile_fit | CONCEPT | — |
| k2a-37 | nn.loss_choice | MIXTE | « Dans le model.compile du cours » ; options = arguments exacts du slide 21 |
| k2a-38 | nn.loss_choice | EXEMPLE | « Fashion-MNIST… quelle loss utilise le cours ? » |
| k2a-39 | nn.loss_choice | MIXTE | Renvoi au slide 34 |
| k2a-40 | nn.epoch_lr | CONCEPT | — |
| k2a-41 | nn.epoch_lr | CONCEPT | — |
| k2a-42 | nn.epoch_lr | MIXTE | « Dans le cours » ; doublon de k2a-41 sans mise en situation |
| k2a-43 | nn.onehot | CONCEPT | — |
| k2a-44 | nn.onehot | EXEMPLE | Les 4 couleurs du tableau du slide 34 |
| k2a-45 | nn.onehot | EXEMPLE | « Dans le tableau du slide 34, Rouge apparaît deux fois » |
| k2a-46 | nn.validation | CONCEPT | — |
| k2a-47 | nn.validation | EXEMPLE | « Sur le graphe du slide 37 » |
| k2a-48 | nn.validation | CONCEPT | — |
| k2a-49 | code.fit_transform | CONCEPT | — |
| k2a-50 | code.fit_transform | CONCEPT | — |
| k2a-51 | code.fit_transform | CONCEPT | — |
| k2a-52 | code.pytorch | CONCEPT | — |
| k2a-53 | code.pytorch | CONCEPT | — |
| k2a-54 | code.pytorch | CONCEPT | — |
| k2a-55 | code.pieges | EXEMPLE | Liste de vérifications « proposée par la leçon » à réciter |
| k2a-56 | code.pieges | CONCEPT | — |
| k2a-57 | code.pieges | CONCEPT | — |

Bilan campagne : 57 questions, 36 CONCEPT laissées intactes, 21 réécrites (même id, notion, diff et rang Q1/Q2/Q3).

## 2. Remplacements proposés pour content/ch2.js

À appliquer avec `node tools/apply_audit.js --prefix=concept_ch2a --apply`.

```json
[
 {
  "id": "c2-10",
  "action": "replace",
  "value": {
   "id": "c2-10",
   "type": "calcul",
   "ch": 2,
   "notions": [
    "nn.neurone",
    "nn.activation"
   ],
   "diff": 2,
   "q": "La somme pondérée d'un neurone vaut a = −3 (très négative). Quelle sortie donne chaque activation ?",
   "ok": "Échelon : 0 ; sigmoïde : proche de 0 ; tanh : proche de −1",
   "ko": [
    "Échelon : 0 ; sigmoïde : proche de −1 ; tanh : proche de 0",
    "Échelon : −3 ; sigmoïde : −3 ; tanh : −3"
   ],
   "plain": "L'activation transforme le total a = −3 en sortie. L'échelon répond 0 sous le seuil ; la sigmoïde s'écrase vers son plancher 0 ; tanh vers son plancher −1.",
   "why": "Slide 10 : échelon à valeurs 0 ou 1, sigmoïde en S entre 0 et 1, tanh en S entre −1 et 1. Pour a très négatif, chaque courbe tend vers son minimum : σ(−3) ≈ 0.05, tanh(−3) ≈ −0.995.",
   "whyNot": "La sigmoïde ne descend jamais sous 0 et tanh(−3) est loin de 0 ; une activation ne renvoie pas a tel quel (sauf l'identité)."
  }
 },
 {
  "id": "c2-12",
  "action": "replace",
  "value": {
   "id": "c2-12",
   "type": "choix",
   "ch": 2,
   "notions": [
    "nn.lien_regression",
    "reg.one_neuron"
   ],
   "diff": 2,
   "q": "Pourquoi un neurone sans fonction d'activation est-il une régression linéaire ?",
   "ok": "Il calcule w·x + b, une droite, ajustée en minimisant la MSE",
   "ko": [
    "Il empile plusieurs couches cachées pour approcher la courbe",
    "Sa softmax transforme la sortie en une valeur continue"
   ],
   "plain": "Sans activation, le neurone calcule juste « poids × entrée + biais » : l'équation d'une droite. Ajuster cette droite en réduisant l'erreur moyenne au carré (MSE), c'est exactement une régression linéaire.",
   "why": "Slide 11 : un modèle à un seul neurone calcule m·x + b. Sans activation, rien ne vient courber cette droite, et on l'ajuste par descente de gradient sur la MSE, comme une régression linéaire.",
   "whyNot": "Un seul neurone = une seule couche, sans couche cachée ; une softmax renvoie des probabilités de classes, pas une valeur continue."
  }
 },
 {
  "id": "c2-16",
  "action": "replace",
  "value": {
   "id": "c2-16",
   "type": "choix",
   "ch": 2,
   "notions": [
    "nn.keras_pipeline"
   ],
   "diff": 1,
   "q": "Dans un modèle Keras, que signifie keras.layers.Dense(128, activation='relu') ?",
   "ok": "Une couche complètement connectée de 128 neurones avec activation ReLU",
   "ko": [
    "Une couche de convolution qui applique 128 filtres à l'image",
    "Une couche de sortie qui distingue 128 classes différentes"
   ],
   "plain": "C'est une couche de 128 neurones, chacun relié à toutes les valeurs d'entrée (Dense = « tout connecté »). ReLU garde les valeurs positives et remplace les négatives par 0.",
   "why": "Dense = fully connected : chaque neurone reçoit toutes les sorties de la couche précédente ; 128 = nombre de neurones ; relu = activation des couches cachées (slides 19-20).",
   "whyNot": "Les filtres sont ceux de Conv2D ; une couche de sortie de classification utilise softmax, pas relu."
  }
 },
 {
  "id": "c2-26",
  "action": "replace",
  "value": {
   "id": "c2-26",
   "type": "choix",
   "ch": 2,
   "notions": [
    "nn.compile_fit"
   ],
   "diff": 1,
   "ctx": "Un jeu de test contient 500 exemples ; le classifieur se termine par Dense(4, activation='softmax').",
   "q": "Que renvoie model.predict(x_test) ?",
   "ok": "Un tableau (500, 4) de probabilités, une ligne par exemple",
   "ko": [
    "Un tableau (500,) d'entiers : la classe prédite de chaque exemple",
    "Deux nombres : la loss et l'accuracy sur le jeu de test"
   ],
   "plain": "Pour chacun des 500 exemples, le modèle donne 4 probabilités, une par classe. On obtient donc un tableau de 500 lignes et 4 colonnes.",
   "why": "predict renvoie la sortie de la dernière couche pour chaque exemple : ici 4 probabilités softmax. La classe s'obtient ensuite avec np.argmax(predictions[i]) (slide 22).",
   "whyNot": "L'entier de classe vient de argmax, appliqué après predict ; loss et accuracy viennent de evaluate."
  }
 },
 {
  "id": "c2-58",
  "action": "replace",
  "value": {
   "id": "c2-58",
   "type": "assoc",
   "ch": 2,
   "notions": [
    "nn.activation",
    "nn.softmax"
   ],
   "diff": 2,
   "q": "Associez chaque activation à son comportement et à son usage.",
   "pairs": [
    [
     "ReLU",
     "Couches cachées : garde le positif, met le négatif à 0"
    ],
    [
     "Softmax",
     "Sortie multi-classes : probabilités qui somment à 1"
    ],
    [
     "Sigmoïde",
     "Une seule valeur entre 0 et 1, qui vaut 0.5 en a = 0"
    ],
    [
     "tanh",
     "Courbe en S entre −1 et 1, qui vaut 0 en a = 0"
    ]
   ],
   "plain": "ReLU (négatif → 0) sert dans les couches cachées ; Softmax donne des pourcentages qui font 100 % entre plusieurs classes ; la sigmoïde donne une valeur entre 0 et 1 (oui/non) ; tanh, une valeur entre −1 et 1.",
   "why": "ReLU en couche cachée et softmax en sortie de classification (slides 19-20) ; sigmoïde et tanh sont deux courbes en S, bornées respectivement dans ]0, 1[ et ]−1, 1[ (slide 10)."
  }
 },
 {
  "id": "c2-59",
  "action": "replace",
  "value": {
   "id": "c2-59",
   "type": "ordre",
   "ch": 2,
   "notions": [
    "nn.keras_pipeline",
    "nn.compile_fit"
   ],
   "diff": 1,
   "q": "Remettez dans l'ordre la mise en œuvre d'un classifieur avec Keras.",
   "items": [
    "Définir l'architecture couche par couche (Sequential)",
    "Compiler : choisir l'optimiseur, la loss et les métriques",
    "Entraîner sur les données annotées (fit)",
    "Mesurer la performance sur des données jamais vues (evaluate)",
    "Une fois validé, calculer les probabilités d'une nouvelle donnée (predict)",
    "Retenir la classe la plus probable (argmax)"
   ],
   "plain": "On construit le réseau, on règle sa façon d'apprendre (compile), on l'entraîne (fit), on vérifie sa note sur des données neuves, puis on s'en sert : des probabilités, et enfin la classe gagnante.",
   "why": "Chaque étape dépend de la précédente : compile exige un modèle construit, fit un modèle compilé, evaluate et predict un modèle entraîné, argmax des probabilités (déroulé des slides 19 à 22)."
  }
 },
 {
  "id": "c2-61",
  "action": "replace",
  "value": {
   "id": "c2-61",
   "type": "bug",
   "ch": 2,
   "notions": [
    "nn.loss_choice",
    "code.pieges"
   ],
   "diff": 2,
   "q": "12 mesures par patient, 4 diagnostics possibles ; y_train contient des entiers 0…3. Quelle ligne est incohérente ?",
   "code": [
    "model = keras.Sequential([",
    "    keras.layers.Input(shape=(12,)),",
    "    keras.layers.Dense(32, activation='relu'),",
    "    keras.layers.Dense(4, activation='softmax')])",
    "model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])",
    "model.fit(x_train, y_train, epochs=20)"
   ],
   "line": 4,
   "plain": "La ligne compile est fausse : 'categorical_crossentropy' attend des réponses en one-hot (liste de 0 avec un seul 1), alors que les labels sont de simples numéros. Il faut 'sparse_categorical_crossentropy'.",
   "why": "Avec des labels entiers il faut sparse_categorical_crossentropy (ou convertir les labels en one-hot avec to_categorical).",
   "whyNot": "12 entrées, une couche cachée relu, 4 sorties softmax pour 4 classes : l'architecture et l'appel à fit sont cohérents avec la tâche."
  }
 },
 {
  "id": "c2-62",
  "action": "replace",
  "value": {
   "id": "c2-62",
   "type": "bug",
   "ch": 2,
   "notions": [
    "nn.softmax",
    "code.pieges"
   ],
   "diff": 1,
   "q": "Classification de photos de feuilles en 6 espèces (labels one-hot). Quelle ligne est fausse ?",
   "code": [
    "model.add(Flatten())",
    "model.add(Dense(256, activation='relu'))",
    "model.add(Dropout(0.3))",
    "model.add(Dense(6, activation='relu'))",
    "model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])"
   ],
   "line": 3,
   "plain": "La dernière couche Dense(6) doit donner une probabilité par espèce, donc utiliser softmax. Avec relu, elle sort des scores positifs quelconques qui ne font pas 100 % au total.",
   "why": "La couche de sortie d'une classification multi-classes doit utiliser softmax pour produire des probabilités (slide 20), avec autant de neurones que de classes.",
   "whyNot": "Flatten, Dense(256, relu) et Dropout sont des couches cachées correctes ; categorical_crossentropy convient à des labels one-hot."
  }
 }
]
```

# Audit « concept vs exemple » : notions cnn.* (chapitre 2, partie CNN)

Critère : une question « EXEMPLE » exige de se souvenir d'un exemple précis du cours ou du TP (matrice du slide 32, schéma NVIDIA, CNN ASL, options d'ImageDataGenerator, nombre de couches d'un modèle nommé…). Une question « CONCEPT » se répond en ayant compris l'idée ; un calcul est conceptuel si toutes les données sont dans l'énoncé. « MIXTE » : idée conceptuelle mais cadrage ou détail qui renvoie à un exemple mémorisé.

Source de vérité : `Cours/IA-Hexagone-2.DeepLearning.pdf` (slides 26 à 41) et `content/lessons_ch2b.js`.

## 1. Verdicts

### 1.1 Questions générales (`content/ch2.js`, première notion cnn.*)

| id | verdict | ce qui était mémorisé | action |
|---|---|---|---|
| c2-36 | CONCEPT | — | garder |
| c2-37 | CONCEPT | — (reshape donné dans la question) | garder |
| c2-38 | CONCEPT | — | garder |
| c2-39 | CONCEPT | — (calcul avec données fournies) | garder |
| c2-40 | EXEMPLE | « la matrice du cours » (slide 32) : réponse connue par cœur | réécrite : nouvelle matrice 4×4 |
| c2-41 | CONCEPT | — (matrice fournie) | garder |
| c2-42 | CONCEPT | — | garder |
| c2-43 | CONCEPT | — | garder |
| c2-44 | CONCEPT | — | garder |
| c2-45 | CONCEPT | — (tenseur fourni ; le why cite l'ASL, sans besoin de s'en souvenir) | garder |
| c2-46 | CONCEPT | — (formule en ctx, données fournies) | garder |
| c2-47 | CONCEPT | — (architecture fournie) | garder |
| c2-48 | CONCEPT | — (couche fournie) | garder |
| c2-49 | MIXTE | il fallait reconnaître ImageDataGenerator et ses options du TP | réécrite : pourquoi tirer les transformations à chaque epoch |
| c2-50 | EXEMPLE | le choix horizontal_flip / vertical_flip du TP ASL | réécrite : même principe sur un classifieur chats / chiens |
| c2-51 | MIXTE | le nombre de couches de VGG16 / VGG19 | réécrite : pourquoi VGG est « simple mais lourd » |
| c2-52 | CONCEPT | — | garder |
| c2-53 | CONCEPT | — | garder |
| c2-54 | EXEMPLE | « ResNet50 a 50 couches » | réécrite : comportement d'un bloc résiduel quand F(x) ≈ 0 |
| c2-55 | CONCEPT | — | garder |
| c2-56 | MIXTE | paire VGG « 16 ou 19 couches » (détail mémorisé) | réécrite : paire VGG décrite par son idée |
| c2-57 | CONCEPT | — | garder |
| c2-60 | MIXTE | Input (28, 28, 1) et Dense(24) : shapes du CNN ASL | réécrite : éléments génériques |
| c2-63 | CONCEPT | — (code fourni, raisonnement sur la shape) | garder |
| c2-64 | CONCEPT | — (code fourni) | garder |
| c2-68 | CONCEPT | — | garder |

### 1.2 Campagne (`content/camp_ch2b.js`, réécrite directement)

| id | verdict | ce qui était mémorisé | action |
|---|---|---|---|
| k2b-01 | CONCEPT | — | garder |
| k2b-02 | CONCEPT | — | garder |
| k2b-03 | CONCEPT | — | garder |
| k2b-04 | CONCEPT | — | garder |
| k2b-05 | MIXTE | schéma NVIDIA (28, 28, 1) → (28, 28, 2), padding implicite | réécrite : Conv2D 8 filtres sur (32, 32, 3) |
| k2b-06 | CONCEPT | — | garder |
| k2b-07 | CONCEPT | — | garder |
| k2b-08 | EXEMPLE | matrice du slide 32 | réécrite : nouvelle matrice, résultat [[9, 15], [22, 19]] |
| k2b-09 | CONCEPT | — | garder |
| k2b-10 | CONCEPT | — | garder |
| k2b-11 | MIXTE | « le CNN ASL contient Dropout(0.2) » | réécrite : Dropout(0.3) générique |
| k2b-12 | CONCEPT | — | garder |
| k2b-13 | CONCEPT | — | garder |
| k2b-14 | MIXTE | schéma NVIDIA (28, 28, 2) → 1568 | réécrite : Flatten de (5, 5, 32) → 800 |
| k2b-15 | EXEMPLE | les 24 sorties du schéma NVIDIA | réécrite : Dense(10, softmax) d'un classifieur de fruits |
| k2b-16 | CONCEPT | — | garder |
| k2b-17 | CONCEPT | — (400 et 512 fournis) | garder |
| k2b-18 | EXEMPLE | quelle couche du CNN ASL pèse le plus (205 312) | réécrite : pourquoi les Dense concentrent les paramètres |
| k2b-19 | CONCEPT | — | garder |
| k2b-20 | MIXTE | options rotation_range / zoom_range du TP | réécrite : bornes de rotation et de zoom génériques |
| k2b-21 | EXEMPLE | horizontal_flip=True / vertical_flip=False du TP ASL | réécrite : pas de miroir sur des chiffres manuscrits |
| k2b-22 | MIXTE | sens de l'acronyme VGG | réécrite : idée architecturale de VGG |
| k2b-23 | EXEMPLE | schéma VGG16 du slide 38 | réécrite : 5 blocs conv + pooling sur 224×224 → 7×7 |
| k2b-24 | EXEMPLE | « 19 couches » de VGG19 | réécrite : sens du nombre et stratégie de profondeur |
| k2b-25 | CONCEPT | — | garder |
| k2b-26 | CONCEPT | — (x et F(x) fournis) | garder |
| k2b-27 | CONCEPT | — | garder |
| k2b-28 | CONCEPT | — | garder |
| k2b-29 | EXEMPLE | liste exacte des branches du slide 40 | réécrite : pourquoi plusieurs tailles de convolution |
| k2b-30 | CONCEPT | — | garder |
| k2b-31 | CONCEPT | — | garder |
| k2b-32 | MIXTE | cadrage « le CNN ASL » (liste des couches pourtant fournie) | réécrite : « un réseau » générique |
| k2b-33 | CONCEPT | — | garder |

Bilan : campagne 13 / 33 réécrites (en place) ; questions générales 7 / 26 à remplacer (bloc ci-dessous).

## 2. Remplacements proposés pour `content/ch2.js`

```json
[
{"id":"c2-40","action":"replace","value":{"id":"c2-40","type":"calcul","ch":2,"notions":["cnn.maxpool"],"diff":2,"q":"MaxPool2D 2×2 (stride 2) sur cette matrice. Résultat ?","code":"  6  14 |  2   9\n 11   3 | 17   4\n--------+--------\n  8   8 |  0  21\n  5  16 | 12   7","ok":"[[14, 17], [16, 21]]","ko":["[[6, 2], [8, 0]]","[[34, 32], [37, 40]]"],"plain":"On découpe la matrice en 4 carrés de 2×2 et on garde le plus grand nombre de chacun : 14 en haut à gauche, 17 en haut à droite, 16 en bas à gauche, 21 en bas à droite.","why":"Slide 32 : « sous-échantillonnage et sélection des valeurs max ». Blocs {6, 14, 11, 3} → 14 ; {2, 9, 17, 4} → 17 ; {8, 8, 5, 16} → 16 ; {0, 21, 12, 7} → 21.","whyNot":"[[6, 2], [8, 0]] prend le coin haut-gauche de chaque bloc ; [[34, 32], [37, 40]] additionne les blocs au lieu de garder leur maximum."}},
{"id":"c2-49","action":"replace","value":{"id":"c2-49","type":"choix","ch":2,"notions":["cnn.augmentation"],"diff":2,"q":"Pourquoi l'augmentation de données tire-t-elle de nouvelles transformations aléatoires à chaque epoch, au lieu de créer une fois pour toutes une copie modifiée du dataset ?","ok":"Le réseau voit des variantes différentes à chaque passage et ne peut pas mémoriser une image exacte","ko":["Pour que le jeu de test reçoive exactement les mêmes transformations que l'entraînement","Pour accélérer chaque epoch, car les images transformées sont plus légères à traiter"],"plain":"Si on fabriquait les variantes une seule fois, le réseau finirait par les apprendre par cœur elles aussi. En les tirant au hasard à chaque epoch, il ne voit jamais deux fois exactement la même image.","why":"Leçon cnn.augmentation : les transformations aléatoires (rotation, zoom, décalage, miroir) sont appliquées à chaque epoch ; le réseau ne voit jamais deux fois la même image, ce qui réduit le sur-apprentissage.","whyNot":"L'augmentation ne concerne que l'entraînement : on évalue sur les vraies images de test ; transformer les images à la volée ajoute du calcul, cela n'accélère pas l'epoch."}},
{"id":"c2-50","action":"replace","value":{"id":"c2-50","type":"choix","ch":2,"notions":["cnn.augmentation"],"diff":3,"ctx":"Un classifieur chats / chiens est entraîné sur des photos prises normalement (sol en bas, ciel en haut). On hésite entre deux augmentations : miroir gauche-droite et retournement haut-bas.","q":"Laquelle faut-il garder, et pourquoi ?","ok":"Le miroir gauche-droite seul : un animal tête en bas n'apparaît pas dans les vraies photos","ko":["Le retournement haut-bas seul : il produit des images plus éloignées de l'original","Les deux : plus les variantes sont nombreuses, mieux le modèle généralise toujours"],"plain":"Les variantes doivent ressembler à de vraies photos. Un chien tourné vers la gauche ou vers la droite, ça existe ; un chien tête en bas, le ciel sous ses pattes, jamais : on n'en fabrique pas.","why":"Leçon cnn.augmentation : « les transformations doivent rester réalistes : on ne crée que des images qui pourraient exister dans la réalité ». Le miroir gauche-droite respecte cette règle, le retournement haut-bas non.","whyNot":"Des variantes très différentes mais impossibles apprennent au modèle des cas qu'il ne rencontrera jamais ; ajouter des variantes n'aide que si elles restent plausibles."}},
{"id":"c2-51","action":"replace","value":{"id":"c2-51","type":"choix","ch":2,"notions":["cnn.vgg"],"diff":1,"q":"Pourquoi VGG est-il souvent décrit comme « simple mais lourd » ?","ok":"Il répète un même motif convolutions + max pooling, mais sa profondeur multiplie les poids","ko":["Il n'a qu'une seule couche, mais ses filtres couvrent toute l'image d'un coup","Il combine des branches parallèles complexes, mais il compte très peu de poids"],"plain":"VGG, c'est la même brique répétée : quelques convolutions, un pooling, et on recommence. Facile à comprendre, mais en empilant autant de couches (plus des Dense à la fin), on accumule énormément de poids.","why":"Slide 38 : VGG = modèles convolutionnels profonds (16 ou 19 couches). Leçon : empilement régulier de convolutions 3×3 et de max pooling, « simple et profond, mais très lourd ». Bilan slide 41 : un modèle profond comporte de très nombreux neurones et poids.","whyNot":"VGG est au contraire très profond, avec de petits filtres 3×3 ; les branches parallèles décrivent Inception (slide 40), pas VGG."}},
{"id":"c2-54","action":"replace","value":{"id":"c2-54","type":"choix","ch":2,"notions":["cnn.resnet"],"diff":2,"q":"Dans un bloc résiduel, les couches n'ont rien appris d'utile : F(x) ≈ 0. Que fait alors le bloc ?","ok":"Il recopie son entrée : sa sortie vaut à peu près x","ko":["Il bloque le signal : sa sortie vaut à peu près 0","Il double son entrée : sa sortie vaut à peu près 2x"],"plain":"Le raccourci ajoute toujours l'entrée au résultat des couches. Si les couches ne proposent aucune correction, il reste x + 0 = x : le bloc laisse passer l'information intacte au lieu de l'abîmer.","why":"Slide 39 : un bloc résiduel apprend x → F(x) + x. Avec F(x) ≈ 0, la sortie vaut ≈ x : ajouter un bloc ne peut pas dégrader le réseau, ce qui permet d'empiler des dizaines de couches sans dégradation.","whyNot":"Une sortie nulle serait celle d'un bloc sans raccourci (x → F(x)) ; 2x supposerait que le bloc ajoute x deux fois, alors qu'il calcule F(x) + x."}},
{"id":"c2-56","action":"replace","value":{"id":"c2-56","type":"assoc","ch":2,"notions":["cnn.vgg","cnn.resnet","cnn.inception","ae.unet"],"diff":2,"q":"Associez chaque architecture à son idée clé.","pairs":[["VGG","Empilement régulier de petites convolutions et de max pooling"],["ResNet","Blocs résiduels F(x) + x contre l'évanescence des gradients"],["Inception","Convolutions multi-échelles en parallèle"],["U-Net","Encodeur-décodeur en U avec skip connections pour la segmentation"]],"plain":"VGG empile des convolutions 3×3 ; ResNet ajoute des raccourcis F(x) + x ; Inception regarde à plusieurs échelles en parallèle ; U-Net, en forme de U, compresse puis reconstruit l'image pour la segmenter.","why":"VGG, ResNet et Inception sont les modèles avancés du chapitre 2 (slides 38 à 40) ; U-Net est vu avec les autoencodeurs."}},
{"id":"c2-60","action":"replace","value":{"id":"c2-60","type":"ordre","ch":2,"notions":["cnn.flatten_dense","cnn.conv2d","cnn.maxpool"],"diff":2,"q":"Remettez les couches d'un CNN de classification dans l'ordre.","items":["Input (image H × W × C)","Conv2D + ReLU","MaxPool2D","Flatten","Dense cachée + ReLU","Dense de sortie : un neurone par classe, softmax"],"plain":"L'image entre, des loupes extraient des motifs (Conv2D), on rétrécit (MaxPool), on met à plat (Flatten), une couche Dense combine tout, et la dernière couche vote entre les classes avec softmax.","why":"Extraction convolutionnelle, puis aplatissement en vecteur 1D, puis classifieur dense avec softmax en sortie (slides 28 à 33)."}}
]
```

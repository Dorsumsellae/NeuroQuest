# Audit prérequis — bloc ch2b (CNN)

Question posée pour chaque épreuve : un élève qui n'a lu que la micro-leçon de ses notions, les leçons des notions précédentes, le glossaire et le ctx peut-il trancher entre ok et les ko ?

Périmètre : 56 épreuves.
- content/camp_ch2b.js : 33 épreuves (k2b-01 à k2b-33).
- content/ch2.js, épreuves dont toutes les notions sont cnn.* : 23 épreuves (c2-36 à c2-55, c2-57, c2-60, c2-68).

Sources lues : leçons cnn.* (tools/dump_lessons.js), leçons nn.softmax et nn.activation (prérequis de k2b-15 et c2-60), glossaire (84 termes), cours IA-Hexagone-2.DeepLearning.pdf slides 27 à 41.

## Résultat

**56 épreuves sur 56 jugées OK, aucun manque.** Aucun correctif proposé.

## Points vérifiés de près (OK)

| id | point à vérifier | où le trouver |
|---|---|---|
| k2b-05, c2-39, k2b-16 | shape après Conv2D 'same' (canaux = filtres) | cnn.conv2d p4 et tip, cnn.shapes p2 |
| k2b-08, k2b-09, c2-40, c2-41 | max de chaque bloc 2×2, taille ÷ 2 | cnn.maxpool p2-p3 et ex |
| k2b-11 | 30 % mis à 0 (et non 30 % gardés) | cnn.dropout p3 |
| k2b-12 | Dropout inactif à la prédiction | cnn.dropout p4 et tip |
| k2b-15 | softmax : une probabilité par classe, somme 1 | cnn.flatten_dense p4 + nn.softmax p2 |
| k2b-17, c2-46 | paramètres d'une Dense et d'une Conv2D | cnn.shapes p4 ; ctx de c2-46 |
| k2b-18 | les Dense concentrent les paramètres | cnn.shapes tip ; filtres appris (cnn.conv2d p2) ; taille réduite par le pooling |
| c2-48 | 7 → 4 en MaxPool 'same' | cnn.maxpool tip |
| k2b-20, k2b-21, c2-49, c2-50 | bornes des transformations, réalisme, tirage à chaque epoch | cnn.augmentation p2-p4 et ex |
| k2b-23 | 224 / 2⁵ = 7 | cnn.maxpool p3 (÷ 2 par pooling) ; conforme au schéma du slide 38 (224×224 → 7×7×512) |
| k2b-26, c2-54 | sortie F(x) + x | cnn.resnet p3 et ex |
| c2-53 | « dégradation / saturation » | cnn.resnet p1 et tip (« saturation » vient du slide 39 ; l'ok est identifiable sans ce mot) |
| k2b-30 | concaténation des branches | cnn.inception p3 |
| c2-60 | ordre Input → Conv → Pool → Flatten → Dense → Dense softmax | cnn.shapes ex, cnn.flatten_dense p3-p4, nn.activation (ReLU) |

Toutes les autres épreuves portent sur la phrase centrale de leur leçon (définition du rôle de la couche ou du modèle) et sont OK.

## Correctifs

```json
[]
```

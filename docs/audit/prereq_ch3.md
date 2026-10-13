# Audit prérequis, bloc ch3 (autoencodeurs, U-Net)

Périmètre : 33 épreuves de `content/ch3.js` (c3-01 à c3-33) et 30 épreuves de `content/camp_ch3.js` (k3-01 à k3-30), soit 63 épreuves.
Sources vérifiées : micro-leçons ae.* (et notions précédentes : cnn.*, nn.types_ml, code.pieges, ano.seuil pour c3-23), glossaire (84 termes), ctx des questions, cours `IA-Hexagone-3.Autoencodeurs.pdf` (slides 15 à 19 relues pour les correctifs).

## Manques constatés

| id | manque constaté | correctif choisi |
|---|---|---|
| c3-28 (ordre U-Net) | La leçon ae.unet_skip dit que le décodeur concatène la carte de l'encodeur, mais pas à quel moment de l'étage : rien ne permet de placer « Conv2DTranspose » avant « Concaténation » puis « Convolutions qui fusionnent ». | Leçon ae.unet_skip, p (set) : une phrase sur l'ordre d'un étage de remontée : up-conv, puis concaténation avec la carte de même taille, puis convolutions 3×3 (slide 16 : up-conv 2x2 → copy and crop → conv 3x3, ReLU). |
| k3-17 (pont au niveau de même résolution) | La leçon parle du « niveau correspondant » sans dire que les deux cartes ont la même taille, ce qui justifie la concaténation. | Même phrase ajoutée à ae.unet_skip (« carte de l'encodeur de même taille »). |
| k3-20 (U-Net 3D vs 2D coupe par coupe), c3-16 | La leçon ae.unet_ext dit seulement que U-Net 3D « traite des volumes » ; elle ne dit pas que ses convolutions et poolings sont en 3D (filtres en cube), information nécessaire pour la réponse « filtres en cube / convolutions 3D ». | Leçon ae.unet_ext, p (append) : convolutions et max-poolings 3D, noyaux 3×3×3, qui parcourent le volume et combinent des coupes voisines (slide 18 : Conv3D (3x3x3), MaxPooling3D). |

## Épreuves jugées OK

60 épreuves sur 63 sont résolubles avec les leçons, le glossaire et le ctx, sans ajout. Remarques :
- c3-04 : « plongement / embedding » n'est pas dans la leçon ae.principe, mais il est dans le glossaire (alt de « espace latent »), donc OK.
- c3-12, c3-15 : le Dice est défini dans ae.unet_skip et le glossaire ; les ko sont éliminables.
- c3-23 : la règle de seuil est donnée dans le ctx.
- k3-08 : la formule de la MSE est donnée dans la question.
- k3-14 : « motifs plus abstraits » vient de cnn.conv2d (contours → textures → objets) et « plus de canaux = plus de paramètres » de la formule de cnn.conv2d.
- k3-27 : « non supervisée » se déduit de ae.non_supervise (notion précédente) et de ae.anomalie (entraînement sur le normal, anomalies rares).

## Bilan

- Épreuves vérifiées : 63.
- Manques : 3 épreuves (c3-28, k3-17, k3-20 ; c3-16 également renforcée).
- Correctifs : 2 « lesson » (ae.unet_skip p set, ae.unet_ext p append), 0 edit, 0 replace, 0 remove.

```json
[
  {"action":"lesson","lesson":"ae.unet_skip","field":"p","op":"set","value":["En réduisant l'image, l'encodeur perd les détails fins, un peu comme une photo trop compressée qui devient floue.","Les skip connections sont des ponts horizontaux du U : chaque niveau de l'encodeur envoie sa carte haute résolution au niveau correspondant du décodeur, qui la concatène (copy and crop) pour retrouver les détails.","Pour agrandir l'image dans le décodeur, U-Net n'utilise pas un simple agrandissement fixe mais une convolution inverse apprise : Conv2DTranspose.","À chaque étage de la remontée, l'ordre est donc : agrandir la carte (up-conv), la concaténer avec la carte de l'encodeur de même taille, puis appliquer des convolutions 3×3 qui fusionnent détails et contexte.","Comme le modèle est supervisé, on le juge avec une métrique : le Dice = 2|A∩B| / (|A|+|B|), où A est le masque prédit, B le masque réel et A∩B leur partie commune."]},
  {"action":"lesson","lesson":"ae.unet_ext","field":"p","op":"append","value":"Dans U-Net 3D, les convolutions et les max-poolings deviennent 3D (filtres en cube 3×3×3) : chaque filtre parcourt le volume et combine des coupes voisines."}
]
```

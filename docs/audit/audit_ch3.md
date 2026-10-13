# Audit des questions du chapitre 3 (content/ch3.js)

Source unique : `Cours/IA-Hexagone-3.Autoencodeurs.pdf` (27 pages). Numérotation : celle imprimée sur les slides. Elle suit la page du PDF jusqu'à 26 ; la dernière page (Bilan) porte le numéro **28** (le slide 27 « Exercice » est absent du PDF).

Verdicts : OK · HORS-PDF (contenu absent du PDF, souvent issu du lab / chap. 4) · ERREUR (contredit le PDF) · AMBIGU · MAL-TAGUÉ.

## 1. Tableau

| id | verdict | justification |
|---|---|---|
| c3-01 | OK | Slide 6 : « on ne peut pas obtenir d'image en sortie », réponses « plus spatialisées » ; Flatten visible slide 5. |
| c3-02 | OK | Slide 6 : « représentation des motifs à différentes échelles ». |
| c3-03 | OK | Slide 8 : encodeur → code, décodeur → reconstruction. |
| c3-04 | OK | Slide 8 : « code (i.e. plongement ou espace latent) ». Le terme « goulot d'étranglement » de la bonne réponse n'est pas dans le PDF (correctif mineur proposé). |
| c3-05 | OK | Slide 8 : « ressemble à un MLP ; nombre de couches et leur taille sont des éléments clé ». |
| c3-06 | OK | Slide 8 : « approche non-supervisée, on calcule l'erreur entre les images d'entrée/sortie ». fit(x, x) dans le why : complément utile. |
| c3-07 | HORS-PDF | Keras `fit` et les pertes MAE / binary_crossentropy ne figurent pas dans le PDF (seule la MSE, slide 26). Utile pour l'examen (code), à garder ; bonne réponse à alléger. |
| c3-08 | OK | Slides 10-13. Distracteurs trop faciles mais corrects. |
| c3-09 | OK | Slide 11 (réduction de dimensions) + schéma slide 9 (code plus petit). |
| c3-10 | OK | Slide 15 : supervisé, forme de U, référence en segmentation. Le why cite auteurs (slide 15) ; le whyNot parle de VGG16, absent de ce cours. |
| c3-11 | OK | Slide 15 : contractive path / expansive path. |
| c3-12 | OK | Slide 17 : « approche supervisée, métrique importante (Dice par exemple) ». |
| c3-13 | OK | Slide 17 : les skip connections comblent la perte de détails ; concaténation = « copy and crop » slide 16. |
| c3-14 | OK | Slide 17 : « convolution inverse apprise (Conv2DTranspose) ». |
| c3-15 | HORS-PDF | Le PDF cite seulement « Dice par exemple » (slide 17). Formule, recouvrement, vrais négatifs : absents. Utile, à garder en signalant le complément. |
| c3-16 | OK | Slides 18-20 (+ comparaison slide 21). |
| c3-17 | OK | Slide 22 : « apprendre le meilleur modèle », nnU-Net = no-new-U-Net ; schéma (heuristiques, paramètres inférés, entraînement, post-traitement). |
| c3-18 | OK | Slides 23-25 : hautes fréquences = détails. Le whyNot (« le bruit est aussi en haute fréquence ») est une extrapolation juste mais hors PDF. |
| c3-19 | OK | Slide 25 : « apprendre le résidu (DnCNN) », schéma Noisy → Residual Image. La comparaison à ResNet est hors PDF. |
| c3-20 | OK | Slide 24 : « décomposition en sous-images (FFDNet) ». |
| c3-21 | OK | Slide 26 : faible erreur = normale, grande erreur = anormale. |
| c3-22 | AMBIGU | Le PDF (slide 26) dit « faible erreur : donnée vue **fréquemment** » : il ne pose pas l'entraînement sur données exclusivement normales, ni de seuil. La règle « que du normal » vient du lab (chap. 4). Formulation à nuancer. |
| c3-23 | MAL-TAGUÉ | Seuil 0.5 et erreurs 0.0215 / 4.5252 : données du lab disques durs (chap. 4) ; aucun seuil dans le PDF. Relève de `ano.seuil`. |
| c3-24 | HORS-PDF | 256 pannes / 3 millions d'échantillons : lab chap. 4. Le raisonnement (non supervisé) est cohérent avec slide 26 ; ajouter le tag `ano.dataset`. |
| c3-25 | OK | Slide 28 (Bilan) : « représentation efficace des données dans l'espace latent ». |
| c3-26 | HORS-PDF | Slide 28 dit « d'autres applications non-image !! » sans parler de séries temporelles ni du chapitre suivant ; l'exemple non-image du PDF est le tableau réseau de la slide 26. Tag `ae.applications` inadapté (les slides Applications 10-13 ne parlent pas du non-image). |
| c3-27 | OK | Schéma sablier slide 9 + erreur entrée/sortie slide 8. |
| c3-28 | OK | Schéma U-Net slide 16 (conv 3x3 ReLU, max pool 2x2, 1024 au fond, up-conv 2x2, copy and crop, conv 1x1). |
| c3-29 | HORS-PDF | Paire Noise2Noise = « entraîné sur des paires d'images bruitées, sans image propre » : absent du PDF, qui dit seulement « modèle type U-Net (Noise2Noise) » (slide 23). Les 3 autres paires sont conformes. |
| c3-30 | MAL-TAGUÉ | Les paires testent encodeur/décodeur (ae.principe), skip connection (ae.unet_skip) et erreur de reconstruction (ae.anomalie) ; ae.applications n'est pas testé, ae.unet_skip manque. |
| c3-31 | HORS-PDF | Code Keras absent du PDF ; principe conforme à slide 8 (erreur entrée/sortie). Utile pour l'examen, à garder. |
| c3-32 | OK | Code hors PDF, mais l'idée (code plus petit que l'entrée, taille des couches = élément clé) est dans les slides 8-9. |
| c3-33 | MAL-TAGUÉ | U-Net n'y est qu'un distracteur : tag `ae.unet` à retirer. Le réglage du seuil avec les 40 défauts est hors PDF mais raisonnable. |

**Bilan : 33 épreuves — 23 OK, 6 HORS-PDF, 0 ERREUR, 1 AMBIGU, 3 MAL-TAGUÉ** (dont c3-04 OK avec retouche mineure).

## 2. Contradictions et écarts entre micro-leçons et PDF

1. **ae.applications** (`lessons_ch34.js`) : « comme une ACP mais non linéaire ». La slide 11 compare au contraire l'ACP à un **Linear Autoencoder**. À reformuler : « comparable à une ACP (slide 11 : PCA vs autoencodeur linéaire) ». Les exemples « pré-entraînement, extraction de caractéristiques, U-Net » pour « partie d'un réseau » sont hors PDF (la slide 13 montre un réseau de compression contenant un bloc AE/AD). Le tip range « détection d'anomalies » parmi les applications listées, alors que les slides 10-13 n'en citent que 4 (la détection d'anomalies est la section 5).
2. **ae.latent_bilan** : « optimisation bayésienne pour les hyperparamètres » et « séries temporelles (chapitre 4, disques durs) » sont absents du bilan (slide 28), qui cite seulement « non-image » et « ex. nnU-Net ».
3. **ae.anomalie** : « On entraîne l'autoencodeur uniquement sur des données normales », seuil 0.13, 256 pannes / 3 M : contenu du lab, pas du PDF. La slide 26 formule « donnée vue fréquemment = normale ». La formule MSE de la leçon est conforme à la slide 26.
4. **ae.denoise** : « Noise2Noise : paires d'images bruitées, sans image propre », « FFDNet : traitées rapidement », « DnCNN : même idée que ResNet », « le bruit et les détails sont tous deux de haute fréquence » : absents du PDF (le PDF dit seulement type U-Net / sous-images / résidu). Pas de contradiction, mais du contenu non vérifiable par le cours.
5. **ae.unet_skip** : la formule du Dice et son exemple numérique sont hors PDF (slide 17 : « Dice par exemple »).
6. **ae.non_supervise** : MAE et `fit(x_train, x_train)` hors PDF (seule la MSE apparaît, slide 26).
7. **ae.principe** : la leçon omet le point de la slide 8 « sa structure ressemble à un MLP ; nombre de couches et taille = éléments clé », pourtant testé par c3-05.
8. **ae.unet_ext** : descriptions de Dense U-Net (blocs denses) et Multi-res U-Net (plusieurs résolutions) non écrites dans le PDF (schémas seulement) ; cohérentes avec les schémas des slides 19-20.

Aucune contradiction franche dans ae.cnn_limite, ae.unet (schéma slide 16 bien restitué).

## 3. Notions du PDF non couvertes par le registre

- **Structure type MLP** (slide 8) : couverte par le label de ae.principe mais pas par sa leçon (voir ci-dessus).
- **Comparaison de compression CAE vs JPEG / JPEG2000 à ~0.29 bpp** (slide 10) et **ACP vs autoencodeur linéaire** (slide 11) : sous ae.applications, mais aucune question existante ne s'appuie sur ces schémas.
- **Ressources pratiques** (slide 14 : tutoriels Keras, débruitage) : non couvertes, sans enjeu d'examen.
- **Section 6 « Exercice »** (annoncée au plan, slide 2) : absente du PDF fourni, donc non couverte.
- **« Reconstruction »** citée comme usage au bilan (slide 28) : pas de notion dédiée, implicitement couverte par ae.principe.

Toutes les autres sections (CNN, principe, applications, U-Net, extensions, débruitage, anomalies, bilan) ont une notion.

## 4. Correctifs proposés

```json
[
  {"id":"c3-04","action":"edit","field":"ok","value":"Code, plongement (embedding) ou espace latent"},
  {"id":"c3-07","action":"edit","field":"ok","value":"model.fit(x_train, x_train) avec une erreur de reconstruction (par exemple la MSE)"},
  {"id":"c3-15","action":"edit","field":"why","value":"Slide 17 : « approche supervisée, métrique importante (Dice par exemple) ». Complément hors slides : Dice = 2|A∩B| / (|A|+|B|) ; l'accuracy par pixel serait trompeuse quand le fond domine."},
  {"id":"c3-22","action":"edit","field":"q","value":"Pourquoi entraîne-t-on l'autoencodeur sur des données très majoritairement normales ?"},
  {"id":"c3-22","action":"edit","field":"why","value":"Slide 26 : faible erreur = donnée vue fréquemment, « normale » ; grande erreur = « anormale ». Le lab (chap. 4) applique la règle stricte : entraînement sur le normal uniquement."},
  {"id":"c3-23","action":"retag","value":["ano.seuil"]},
  {"id":"c3-24","action":"retag","value":["ae.anomalie","ano.dataset","nn.types_ml"]},
  {"id":"c3-26","action":"edit","field":"ok","value":"Non : le bilan insiste sur d'autres applications non-image (par exemple les données réseau tabulaires de la slide 26)"},
  {"id":"c3-26","action":"edit","field":"why","value":"Slide 28 : « Et d'autres applications non-image !! » ; slide 26 : l'exemple de détection d'anomalies porte sur des champs tabulaires (duration, src_bytes, service, flag)."},
  {"id":"c3-26","action":"retag","value":["ae.latent_bilan"]},
  {"id":"c3-29","action":"edit","field":"pairs","value":[["Noise2Noise","Modèle type U-Net"],["FFDNet","Décomposition en sous-images"],["DnCNN","Apprentissage du résidu (le bruit)"],["Haute fréquence","Les détails à préserver pendant le débruitage"]]},
  {"id":"c3-30","action":"retag","value":["ae.principe","ae.unet_skip","ae.anomalie"]},
  {"id":"c3-33","action":"retag","value":["ae.anomalie"]}
]
```

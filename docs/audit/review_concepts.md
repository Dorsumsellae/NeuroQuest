# Relecture des 104 questions réécrites (orientation « concepts »)

Vérifications faites : exactitude (tous les calculs ont été refaits), autonomie, fidélité au cours. Les PDF ont été relus via les textes extraits (ch0 à ch4).

Calculs recalculés et justes : c2-40 (max [[14,17],[16,21]], sommes [[34,32],[37,40]]) ; k2b-08 (max [[9,15],[22,19]], min [[1,3],[0,5]], moyennes [[5.25,8.75],[9.25,10.5]]) ; c2-10 (σ(−3) ≈ 0.047, tanh(−3) ≈ −0.995) ; c4-22 (médiane 0.045 → 5 anomalies) ; k2a-14 (3·4−2 = 10 ; (3−2)·4 = 4) ; k2a-26 (51/255 = 0.2) ; k2b-14 (5·5·32 = 800 ; 5+5+32 = 42) ; k2b-18 ((27+1)·32 = 896 ; 3136·128+128 = 401 536) ; k2b-23 (224/2⁵ = 7) ; k2b-05 ; k1-29 ; k4-02 (20 / 300 000 ; 20·300 = 6 000) ; k2a-24 ; k3-23 (130 − 10 = 120).
Index de ligne des questions bug vérifiés : c1-36 (6), c2-61 (4), c2-62 (3), c4-44 (1).
Ordres et associations vérifiés sans ambiguïté : c2-56, c2-58, c2-59, c2-60, c3-28, c4-37, c4-38.

Non vérifiable sur le texte extrait (contenu en image dans le PDF), donc non signalé : valeurs des slides 16-17 du ch4 (lr 0.0227 / 0.0035, plage 1,5·10⁻³ – 3,5·10⁻³) utilisées par c4-31 et k4-29 ; erreurs 0.0215 / 4.5252 (slides 9-10) dans k4-33 ; noyaux 3×3×3 (slide 18 du ch3) dans c3-16 et k3-20.

## Problèmes relevés

- **k2b-11 — MINEUR** — Dropout ne possède pas de neurones propres : il met à 0 une partie des valeurs qu'il reçoit (les sorties de la couche précédente), et la proportion de 30 % est une probabilité, donc vraie en moyenne et pas à chaque pas. « 30 % des neurones de la couche sont éteints » laisse penser qu'il s'agit des neurones de la couche Dropout elle-même et que la proportion est exacte.
  - `ok` → « Environ 30 % des valeurs qu'elle reçoit sont mises à 0 au hasard »
  - `ko` → [« Seules 30 % des valeurs reçues restent actives, le reste est mis à 0 », « 30 % des pixels de chaque image sont effacés définitivement »]
  - `why` → « Leçon : le taux indique la proportion éteinte ; Dropout(0.3) met à zéro, au hasard et à chaque passage, chaque valeur reçue avec une probabilité de 0.3, soit environ 30 % des sorties de la couche précédente. Le slide 33 décrit le principe (suppression de liaisons) sans valeur de taux. »

- **k2a-47 — MINEUR** — La bonne réponse traduit accuracy par « précision ». Or la précision (precision) est une autre métrique, proche du rappel qu'utilise le ch4 : la réponse prête donc à confusion.
  - `ok` → « Le taux de bonnes réponses (accuracy) sur l'entraînement et sur la validation »

- **k3-26 — MINEUR** — L'explication affirme que l'erreur est la MSE et fonde le raisonnement sur la mise au carré. Le slide 26 ne fixe pas la loss, et le lab du ch4 utilise la MAE (voir c4-35). La conclusion reste juste avec la MAE : quelques grands écarts font monter n'importe quelle moyenne d'écarts. Le carré renforce seulement l'effet.
  - `plain` → « On compare l'original et la copie case par case. Quelques cases très ratées suffisent à faire monter l'erreur moyenne, encore plus si les écarts sont mis au carré (MSE) : si elle dépasse le seuil, l'alarme se déclenche. »
  - `why` → « Slide 26 : l'autoencodeur reconstruit les données ; faible erreur = donnée vue fréquemment, « normale » ; grande erreur = donnée « anormale ». L'erreur de reconstruction est une moyenne des écarts (MAE, ou MSE L = (1/N) Σ (xᵢ − x̂ᵢ)²) : quelques grands écarts suffisent à la faire grimper, d'autant plus s'ils sont mis au carré. »

- **c4-44 — MINEUR** — Le `whyNot` déclare correct le « reshape 3D ». Pourtant `reshape(-1, 16, …)` appliqué à toute la table découpe des blocs de 16 lignes qui peuvent chevaucher deux machines, ce qui contredit le principe « une séquence = S jours d'une même machine » (k4-04). Un étudiant attentif pourrait donc hésiter sur la ligne 2. Le plus simple est d'expliciter l'hypothèse dans le code.
  - `code` → ligne 2 remplacée par `x_train = scaler.fit_transform(df_train[features]).reshape(-1, 16, len(features))  # lignes triées : 16 jours consécutifs par machine`

Toutes les autres questions sont justes, répondables avec leur énoncé et fidèles au cours.

```json
[
  {"id":"k2b-11","action":"edit","field":"ok","value":"Environ 30 % des valeurs qu'elle reçoit sont mises à 0 au hasard"},
  {"id":"k2b-11","action":"edit","field":"ko","value":["Seules 30 % des valeurs reçues restent actives, le reste est mis à 0","30 % des pixels de chaque image sont effacés définitivement"]},
  {"id":"k2b-11","action":"edit","field":"why","value":"Leçon : le taux indique la proportion éteinte ; Dropout(0.3) met à zéro, au hasard et à chaque passage, chaque valeur reçue avec une probabilité de 0.3, soit environ 30 % des sorties de la couche précédente. Le slide 33 décrit le principe (suppression de liaisons) sans valeur de taux."},
  {"id":"k2a-47","action":"edit","field":"ok","value":"Le taux de bonnes réponses (accuracy) sur l'entraînement et sur la validation"},
  {"id":"k3-26","action":"edit","field":"plain","value":"On compare l'original et la copie case par case. Quelques cases très ratées suffisent à faire monter l'erreur moyenne, encore plus si les écarts sont mis au carré (MSE) : si elle dépasse le seuil, l'alarme se déclenche."},
  {"id":"k3-26","action":"edit","field":"why","value":"Slide 26 : l'autoencodeur reconstruit les données ; faible erreur = donnée vue fréquemment, « normale » ; grande erreur = donnée « anormale ». L'erreur de reconstruction est une moyenne des écarts (MAE, ou MSE L = (1/N) Σ (xᵢ − x̂ᵢ)²) : quelques grands écarts suffisent à la faire grimper, d'autant plus s'ils sont mis au carré."},
  {"id":"c4-44","action":"edit","field":"code","value":["df = pd.read_csv('releves_machines.csv')","df_train = df   # machines saines ET machines tombées en panne","x_train = scaler.fit_transform(df_train[features]).reshape(-1, 16, len(features))  # lignes triées : 16 jours consécutifs par machine","autoencoder.fit(x_train, x_train, epochs=20)","pred = autoencoder.predict(x_test)"]}
]
```

Questions relues : 104, problèmes : 4

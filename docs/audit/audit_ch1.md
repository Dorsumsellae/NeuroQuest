# Audit du chapitre 1 (Régressions) : `content/ch1.js`

Source de vérité : `Cours/IA-Hexagone-1.Regressions.pdf` (38 slides). Les slides 4, 10, 13, 14, 16, 18-20, 23, 31 et 36 ont été vérifiées sur rendu image (équations).

Bilan : 44 épreuves, **30 OK, 11 HORS-PDF, 0 ERREUR, 2 AMBIGU, 1 MAL-TAGUÉ**.

## 1. Verdicts par épreuve

| id | verdict | justification |
|---|---|---|
| c1-01 | OK | Slide 3 : relation variable dépendante / indépendantes, exemple cancer et âge. |
| c1-02 | OK | Slide 4 : x₀ = 1, ŷ = θᵀX. (Le whyNot sur l'inversibilité est hors PDF mais sans incidence.) |
| c1-03 | OK | Slide 4 : θ = paramètres, biais θ₀ et poids. |
| c1-04 | OK | Slide 4 : MSE = (1/m) Σ (θᵀX⁽ⁱ⁾ − y⁽ⁱ⁾)². |
| c1-05 | OK | Slide 5 : θ = (XᵀX)⁻¹Xᵀy. |
| c1-06 | OK | Slide 5 (« calculer la dérivée de la MSE à 0 ») et slides 37-38. |
| c1-07 | HORS-PDF | Le coût ou l'impossibilité d'inverser XᵀX n'est pas mentionné dans les slides (5, 8). Classique, à garder. |
| c1-08 | OK | Slide 10 : R² = 1 (figure de droite). |
| c1-09 | HORS-PDF | R² = r² n'est pas dans le PDF ; le slide 31 écrit seulement « Corrélation de Pearson (R²) », avec une échelle de −1 à 1. |
| c1-10 | OK | Slide 12 : « problème convexe », minimum global. |
| c1-11 | OK | Slide 13 : (2/m) Xᵀ(Xθ − y). |
| c1-12 | OK | Slide 14 : θ⁽ᵗ⁺¹⁾ = θ⁽ᵗ⁾ − η∇θMSE. |
| c1-13 | OK | Slide 14 : « η est le learning rate, t est l'itération ». |
| c1-14 | HORS-PDF | Le slide 15 dit seulement « faire varier η » ; les effets d'un η trop grand ne sont pas décrits. |
| c1-15 | HORS-PDF | Même remarque (slide 15) pour un η trop petit. |
| c1-16 | OK | Slides 15-17 : batch = tout X_b ; SGD = « une partie du dataset », un exemple tiré au hasard dans le code. |
| c1-17 | AMBIGU | Slide 16 : la raison donnée pour le recuit simulé est « pour éviter les minimas locaux ». La bonne réponse proposée (« se stabiliser près du minimum malgré le bruit ») est une autre raison, absente du slide : un étudiant qui répond d'après le slide ne trouve pas son option. |
| c1-18 | HORS-PDF | Le slide 16 n'attribue pas au bruit du SGD l'évitement des minima locaux, mais au recuit simulé. Le ko « rend inutile la normalisation » repose aussi sur une notion absente du PDF. |
| c1-19 | OK | Slides 16-17 : n_epochs, boucle `for i in range(m)` dans chaque epoch. |
| c1-20 | HORS-PDF | Le slide 17 évoque seulement en commentaire « extension possible : plus d'éléments tirés aléatoirement » ; tailles 32/128 et batch_size hors PDF. |
| c1-21 | OK | Slide 19. |
| c1-22 | OK | Slide 19 (exemple au degré 3, dont on déduit le degré 2). |
| c1-23 | HORS-PDF | Les mots sur-/sous-apprentissage ne figurent pas dans le PDF ; le slide 23 montre des degrés 2, 5, 10 et 100, pas 30. Correctif proposé : citer le degré 100 du slide 23. |
| c1-24 | HORS-PDF | Le jeu de validation n'apparaît pas dans le PDF. Utile pour la suite du module, à garder. |
| c1-25 | OK | Slide 27 : dropna(axis = 0, inplace = True). |
| c1-26 | OK | Slide 27 : df.sample(1000). (Le volume du fichier donné dans ctx est hors PDF mais anodin.) |
| c1-27 | OK | Slides 30-31. |
| c1-28 | HORS-PDF | Le neurone PyTorch n'apparaît pas dans le PDF (notebook uniquement). Notion reg.one_neuron entièrement hors PDF. |
| c1-29 | OK | Slides 7-8 : y = 4 + 3X + bruit, X_b avec la colonne de 1, ordre biais puis pente. |
| c1-30 | MAL-TAGUÉ | Contenu juste (slide 8), mais le tag `code.fit_transform` est sans rapport : le code ne contient ni fit ni transform. Retag vers reg.modele + reg.eq_normale. |
| c1-31 | OK | Slide 16 : t0/(t+t1) = 5/50 = 0.1. |
| c1-32 | OK | Slides 16-17 : 50 × 100 = 5 000. |
| c1-33 | OK | Slide 21 : PolynomialFeatures(degree=2, include_bias=False). |
| c1-34 | OK | Slide 20 : le code écrit bien `y = 0.5 + X**2 + X + 2` (sans doute une coquille pour 0.5*X**2, mais la question raisonne sur le code tel qu'écrit et le signale). |
| c1-35 | AMBIGU | La ligne désignée comme fautive (`pol.fit_transform(X_test…)`) est exactement le code du slide 22. La règle « transform sur le test » n'est pas dans le PDF et, pour PolynomialFeatures, le résultat est identique. Le why le reconnaît, mais la question présente comme erreur ce que le cours enseigne. |
| c1-36 | OK | Slide 24 : la classe du cours contient bien `self._Xdata = y`. |
| c1-37 | OK | Slide 15 : mise à jour `theta_t - eta*grads`. |
| c1-38 | OK | Slide 17 : `Xi = X_b[rand_idx:rand_idx+1]`. |
| c1-39 | OK | Slides 7-9. |
| c1-40 | OK | Slides 12 et 15. |
| c1-41 | HORS-PDF | Partiellement : la ligne mini-batch (« parallélisable sur GPU ») est hors PDF ; le reste est conforme (slides 5, 15-17). |
| c1-42 | OK | Slides 4, 10, 14, 19-21. |
| c1-43 | HORS-PDF | Notebook PyTorch (Adam, 10 000 epochs) absent du PDF. Le seul exercice approchant du PDF est le slide 18 (tracer la progression des paramètres). |
| c1-44 | OK | Slide 32 : ind_vars_cols exclut MEDV. |

## 2. Contradictions et écarts entre micro-leçons et PDF

1. **reg.sgd (et reg.convexe, reg.batch) : rôle du recuit simulé.** Le slide 16 dit : « Pour éviter les minimas locaux : recuit simulé ; learning rate décroissant ; en fonction des epochs ». La leçon reg.sgd attribue l'évitement des minima locaux au bruit du SGD, et donne au η décroissant le rôle de « se stabiliser ». C'est la seule vraie divergence avec le PDF ; elle se retrouve dans c1-17 et c1-18. Il faudrait ajouter la formulation du slide dans la leçon.
2. **reg.overfit** : le PDF n'emploie ni « sous-apprentissage » ni « sur-apprentissage » ni « jeu de validation ». Seul le slide 23 montre la figure (degrés 2, 5, 10, 100). L'exemple de la leçon (degré 30) n'est pas celui du slide (degré 100). Ce n'est pas une contradiction, mais la notion est essentiellement hors PDF.
3. **reg.one_neuron** : entièrement hors PDF (le notebook PyTorch n'est pas dans les slides).
4. **reg.minibatch** : mini-batch, batch_size et GPU sont hors PDF ; le slide 17 contient seulement le commentaire « extension possible : plus d'éléments tirés aléatoirement ». Epoch et itération sont en revanche dans le code des slides 16-17.
5. **reg.eta** : les effets d'un η trop grand ou trop petit sont hors PDF (slide 15 : « faire varier η »).
6. **reg.eq_normale** : l'inconvénient (inversion coûteuse ou impossible) est hors PDF.
7. **reg.r2 / reg.sweetviz** : « R² = r² » est hors PDF. Le slide 31 intitule la matrice « Corrélation de Pearson (R²) » alors que l'échelle va de −1 à 1 (c'est donc r) ; la leçon a raison sur le fond, mais l'étudiant peut être troublé par la notation du slide. La leçon reg.r2 signale correctement la notation SSE = Σ(ŷ − ȳ)² propre au cours (slide 10).
8. **reg.batch** : « peut rester bloquée dans un minimum local sur un problème non convexe » est hors PDF (le slide 12 dit au contraire que le problème est convexe).
9. **reg.poly** : conforme. La leçon reprend la coquille probable du slide 20 (`0.5 + X**2`), ce qui reste cohérent avec le code distribué.

## 3. Notions du PDF non couvertes par le registre

- **API scikit-learn LinearRegression** (slide 11 : `linear_model.LinearRegression()`, `fit`, `intercept_`, `coef_`) : seulement abordée indirectement via reg.poly.
- **Génération de données et tracé matplotlib** (slides 6-9, 28, 33-34 : `np.random.rand`, `np.c_`, `plt.scatter`, `plt.plot(X_test, y_predict, "r-")`, scatter 3D avec `projection='3d'`).
- **Comparaison des trajectoires BGD / SGD / équation normale** (slide 18 : progression de θ₀, θ₁ selon les itérations) : seulement évoquée dans la leçon reg.minibatch.
- **Packaging objet** (slide 24 : classe `PolyRegression`, réutilisation avec de nouvelles données) : couvert seulement par c1-36, tagué `code.pieges`.
- **Prise en main du dataset** (slide 26 : `dataset.shape`, `dataset.info()`) : dans la leçon reg.pandas mais pas testé.
- **Exercices d'exploration Boston / CalCOFI** (slides 25, 29, 32-35 : régressions à 1 puis plusieurs variables indépendantes, calcul des R²) : seulement c1-44.

## 4. Correctifs proposés

```json
[
  {"id":"c1-17","action":"edit","field":"ok","value":"Pour éviter les minima locaux, puis se caler près du minimum"},
  {"id":"c1-17","action":"edit","field":"why","value":"Slide 16 : « pour éviter les minimas locaux : recuit simulé ; learning rate décroissant ; en fonction des epochs ». Le pas, grand au début, se réduit au fil des itérations (t0/(t+t1)), ce qui permet aussi de se stabiliser près du minimum malgré le bruit du SGD."},
  {"id":"c1-18","action":"edit","field":"ko","value":["Il garantit une trajectoire lisse","Il rend le gradient exact à chaque itération"]},
  {"id":"c1-18","action":"edit","field":"why","value":"Slide 16 : le SGD utilise une partie du dataset à chaque itération, d'où des mises à jour bruitées (trajectoire en zigzag du slide 18). Le slide associe l'évitement des minima locaux au recuit simulé ; le bruit du SGD y contribue (hors PDF, leçon)."},
  {"id":"c1-23","action":"edit","field":"q","value":"Sur la figure du slide 23, la régression de degré 100 ajustée sur 100 points bruités donne…"},
  {"id":"c1-23","action":"edit","field":"why","value":"Slide 23 : la courbe de degré 100 reste plate au centre et part en pics aux bords pour coller à quelques points : elle suit le bruit et généralise mal (vocabulaire de la leçon)."},
  {"id":"c1-30","action":"retag","value":["reg.modele","reg.eq_normale"]},
  {"id":"c1-35","action":"edit","field":"why","value":"Attention : le slide 22 du cours écrit lui-même fit_transform sur X_test, et pour PolynomialFeatures le résultat est identique. La bonne pratique (hors PDF) est pourtant de n'appeler que transform sur le test : avec un StandardScaler, fit_transform recalculerait moyenne et écart-type sur le test. À retenir : fit_transform sur le train, transform sur le test."},
  {"id":"c1-35","action":"edit","field":"q","value":"Bonne pratique (au-delà du slide 22) : quelle ligne ne respecte pas « fit sur le train, transform sur le test » ?"},
  {"id":"c1-09","action":"edit","field":"why","value":"Le slide 31 affiche la corrélation de Pearson (notée « R² » sur le slide, mais l'échelle va de −1 à 1 : c'est r). Pour une régression linéaire à une variable avec biais, R² = r² (résultat hors PDF)."},
  {"id":"c1-41","action":"edit","field":"pairs","value":[["Équation normale","Solution exacte par inversion de matrice, sans learning rate"],["Batch GD","Gradient calculé sur les m échantillons, trajectoire lisse"],["SGD","Un échantillon au hasard par itération, trajectoire bruitée"],["Mini-batch","Plusieurs échantillons tirés au hasard par itération"]]}
]
```

Aucune suppression n'est proposée : les questions HORS-PDF portent sur des notions classiques (learning rate, sur-apprentissage, validation, neurone linéaire) qui restent utiles pour la suite du module.

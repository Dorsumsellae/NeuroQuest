# Audit prérequis : bloc ch1 (régressions)

Périmètre : 28 épreuves de `content/ch1.js` (c1-01 à c1-28) et 51 épreuves de `content/camp_ch1.js` (k1-01 à k1-51), soit **79 épreuves**.
Notions : reg.principe → reg.one_neuron (ordre de `content/notions.js`).
Sources lues : micro-leçons (`node tools/dump_lessons.js`), glossaire (84 termes), PDF `IA-Hexagone-1.Regressions.pdf` (et `IA-Hexagone-2.DeepLearning.pdf` pour vérifier que l'ensemble de validation est bien dans le cours).

## Manques constatés

| id | Manque constaté | Correctif choisi |
|---|---|---|
| k1-11 | Le code utilise `np.c_[np.ones(...), X_test]` et `.dot` : aucune leçon ni le glossaire n'explique que `np.c_` colle une colonne de 1 à gauche de X, ni que `.dot` est le produit matriciel. Sans cela, l'élève ne peut pas déduire avec certitude que y_predict = 4 + 3x. | Leçon `reg.eq_normale`, champ `ex` (set) : ajout de la ligne de code du cours `X_b = np.c_[np.ones((m, 1)), X]` (slide 8) et du rôle de `.dot`. Utile aussi pour k1-20, k1-29 et la leçon `reg.batch` qui emploient `X_b`. |
| k1-47 | La leçon `reg.sweetviz` et le glossaire disent seulement « proche de ±1 = liées par une droite ». Le sens du signe (positif : elles montent ensemble ; négatif : l'une baisse quand l'autre monte) n'est dit nulle part : impossible de trancher entre l'ok et le ko « fort lien négatif ». (k1-48 se tranche déjà, mais profite aussi du correctif.) | Leçon `reg.sweetviz`, champ `p` (set, 4 phrases) : la phrase sur r précise le sens du signe. Slide 31 : corrélation de Pearson, échelle de −1 à +1. |

## Épreuves jugées OK : 77 / 79

Elles se résolvent à partir de la leçon de la notion, des leçons précédentes, du glossaire et du ctx (calcul mental au plus) :

- ch1.js (28/28) : c1-01 à c1-28. Remarques :
  - c1-09 (R² = r²) : le tip de `reg.r2` le dit. Le slide 31 titre lui-même « Corrélation de Pearson (R²) », le point est donc bien relié au cours.
  - c1-18 : le zigzag (leçon `reg.sgd`), le tip de `reg.convexe` (« d'où l'intérêt du SGD pour sortir des minima locaux ») et le blocage du batch dans un minimum local (leçon `reg.batch`) suffisent.
  - c1-24 : l'ensemble de validation est dans la leçon `reg.overfit` et dans le PDF 2 (« L'ensemble de validation sert à vérifier que le modèle généralise bien à chaque epoch »).
- camp_ch1.js (49/51) : tout sauf k1-11 et k1-47. Remarques :
  - k1-03 : la leçon `reg.principe` (features = informations pour prédire la cible ; Boston : « toutes les autres colonnes ») suffit.
  - k1-29 : biais + un poids par feature = 4 valeurs (leçon `reg.modele`).
  - k1-30 : le code SGD est donné dans la question. Le « 1/m de la moyenne » (leçon `reg.gradient`) et le SGD « un seul exemple » (leçon `reg.sgd`) suffisent.
  - k1-35 et k1-36 : calcul direct à partir de l'expression donnée et de l'exemple de la leçon `reg.minibatch`.

## Correctifs

```json
[
  {"action":"lesson","lesson":"reg.eq_normale","field":"ex","op":"set","value":"Dans le cours, on génère y = 4 + 3X + bruit. En code, X_b = np.c_[np.ones((m, 1)), X] colle une colonne de 1 à gauche de X, et .dot fait le produit matriciel. L'équation normale renvoie θ ≈ [4, 3] : d'abord le biais (colonne de 1), puis la pente. Jamais exactement [4, 3] à cause du bruit."},
  {"action":"lesson","lesson":"reg.sweetviz","field":"p","op":"set","value":["Face à une base avec des dizaines de colonnes, on veut un aperçu rapide avant de modéliser.","Sweetviz génère en deux lignes un rapport HTML d'analyse exploratoire : sv.analyze(dataset) puis show_html().","Le rapport montre les distributions, les valeurs manquantes et les corrélations de Pearson entre colonnes.","La corrélation de Pearson r va de −1 à 1 : proche de 1, les deux variables montent ensemble en suivant une droite ; proche de −1, l'une baisse quand l'autre monte ; proche de 0, aucun lien linéaire."]}
]
```

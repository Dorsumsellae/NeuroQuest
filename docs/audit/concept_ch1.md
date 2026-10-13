# Audit « concept vs exemple » — chapitre 1 (notions reg.*)

Critère : une question « exemple » exige de se souvenir d'un exemple précis du cours ou du TP (dataset et colonnes, figure, valeur d'un slide, code exact) ; une question « concept » reste répondable par quelqu'un qui a compris la notion. Un calcul est conceptuel si toutes les données sont dans l'énoncé.

Bilan : campagne 8 / 51 réécrites (directement dans `content/camp_ch1.js`) ; questions générales 5 / 44 proposées en remplacement (bloc json final, `content/ch1.js` non modifié).

## 1. Questions générales (`content/ch1.js`)

| id | verdict | ce qui était mémorisé |
|---|---|---|
| c1-01 | CONCEPT | — (le cancer n'est qu'une illustration dans plain/why) |
| c1-02 | CONCEPT | — |
| c1-03 | CONCEPT | — |
| c1-04 | CONCEPT | — |
| c1-05 | CONCEPT | — |
| c1-06 | CONCEPT | — |
| c1-07 | CONCEPT | — |
| c1-08 | CONCEPT | — |
| c1-09 | CONCEPT | — |
| c1-10 | CONCEPT | — |
| c1-11 | CONCEPT | — |
| c1-12 | CONCEPT | — |
| c1-13 | CONCEPT | — |
| c1-14 | CONCEPT | — |
| c1-15 | CONCEPT | — |
| c1-16 | CONCEPT | — |
| c1-17 | CONCEPT | — |
| c1-18 | CONCEPT | — |
| c1-19 | CONCEPT | — |
| c1-20 | CONCEPT | — |
| c1-21 | CONCEPT | — |
| c1-22 | CONCEPT | — (calcul, données dans l'énoncé) |
| c1-23 | MIXTE | « Sur la figure du slide 23 » : renvoyait à la figure du cours → situation générique (degré 100 sur 100 points bruités) |
| c1-24 | CONCEPT | — |
| c1-25 | CONCEPT | — |
| c1-26 | MIXTE | ctx « TP CalCOFI : bottle.csv » → fichier volumineux générique |
| c1-27 | CONCEPT | — |
| c1-28 | CONCEPT | — |
| c1-29 | CONCEPT | — (code et loi y = 4 + 3X + bruit fournis : teste biais vs pente) |
| c1-30 | CONCEPT | — (code fourni) |
| c1-31 | CONCEPT | — (formule et valeurs fournies) |
| c1-32 | CONCEPT | — (code fourni) |
| c1-33 | CONCEPT | — |
| c1-34 | CONCEPT | — (code fourni) |
| c1-35 | CONCEPT | — (code générique, bonne pratique fit/transform) |
| c1-36 | MIXTE | « erreur de recopie dans cette classe du cours » laissait croire qu'il fallait connaître le TP → énoncé dit ce que la classe doit faire ; code et ligne 6 inchangés |
| c1-37 | CONCEPT | — |
| c1-38 | CONCEPT | — (shapes fournies en ctx) |
| c1-39 | CONCEPT | — (étapes génériques) |
| c1-40 | CONCEPT | — |
| c1-41 | CONCEPT | — |
| c1-42 | CONCEPT | — |
| c1-43 | MIXTE | ctx reprenant les réglages exacts du notebook (Adam lr=0.1, 10 000 epochs) → situation générique |
| c1-44 | EXEMPLE | dataset Boston et ses colonnes (MEDV, CRIM, LSTAT, DIS) → tableau de logements générique |

## 2. Questions de campagne (`content/camp_ch1.js`, réécrites en place)

| id | verdict | ce qui était mémorisé |
|---|---|---|
| k1-01 | CONCEPT | — |
| k1-02 | EXEMPLE | exemple du slide 3 (prévalence d'un cancer / âge) → consommation électrique / température |
| k1-03 | EXEMPLE | TP Boston, colonne MEDV, liste ind_vars_cols → piège « cible incluse dans les entrées » |
| k1-04 | CONCEPT | — |
| k1-05 | CONCEPT | — (calcul, données fournies) |
| k1-06 | CONCEPT | — |
| k1-07 | CONCEPT | — |
| k1-08 | CONCEPT | — |
| k1-09 | CONCEPT | — |
| k1-10 | CONCEPT | — |
| k1-11 | CONCEPT | — (θ ≈ [[4],[3]] et code fournis : teste la lecture biais/pente) |
| k1-12 | CONCEPT | — |
| k1-13 | CONCEPT | — |
| k1-14 | CONCEPT | — (sommes fournies) |
| k1-15 | CONCEPT | — (convention de notation SSE du cours) |
| k1-16 | CONCEPT | — |
| k1-17 | CONCEPT | — |
| k1-18 | CONCEPT | — |
| k1-19 | CONCEPT | — |
| k1-20 | CONCEPT | — |
| k1-21 | CONCEPT | — |
| k1-22 | CONCEPT | — |
| k1-23 | CONCEPT | — |
| k1-24 | CONCEPT | — (critère d'arrêt de l'algorithme) |
| k1-25 | CONCEPT | — |
| k1-26 | CONCEPT | — |
| k1-27 | CONCEPT | — (η et n_it donnés dans l'énoncé) |
| k1-28 | CONCEPT | — |
| k1-29 | MIXTE | « code batch du cours » : il fallait se rappeler que X_b a 2 colonnes → X à 3 features, forme de θ |
| k1-30 | CONCEPT | — (les deux formules sont dans l'énoncé) |
| k1-31 | CONCEPT | — |
| k1-32 | CONCEPT | — (formule et valeurs fournies) |
| k1-33 | CONCEPT | — |
| k1-34 | CONCEPT | — |
| k1-35 | CONCEPT | — (code et valeurs fournis) |
| k1-36 | CONCEPT | — |
| k1-37 | CONCEPT | — |
| k1-38 | CONCEPT | — (appel complet fourni) |
| k1-39 | CONCEPT | — |
| k1-40 | CONCEPT | — |
| k1-41 | EXEMPLE | figure du slide 23 (courbes de degré 2, 5, 10, 100) → symptôme visuel générique du sur-apprentissage |
| k1-42 | CONCEPT | — |
| k1-43 | MIXTE | « Dans le TP CalCOFI » → DataFrame générique |
| k1-44 | EXEMPLE | colonnes T_degC / Salnty du dataset CalCOFI → colonnes surface / prix |
| k1-45 | CONCEPT | — |
| k1-46 | CONCEPT | — |
| k1-47 | EXEMPLE | code couleur de la figure Sweetviz (bleu foncé) → coefficient de Pearson +0.95 |
| k1-48 | EXEMPLE | code couleur de la figure Sweetviz (rouge foncé) → piège « −0.95 = aucun lien ? » |
| k1-49 | CONCEPT | — |
| k1-50 | CONCEPT | — (loi y = 1000·x + 2 donnée dans l'énoncé) |
| k1-51 | CONCEPT | — |

## 3. Remplacements proposés pour `content/ch1.js`

```json
[
{"id":"c1-23","action":"replace","value":{"id":"c1-23","type":"choix","ch":1,"notions":["reg.overfit"],"diff":1,"q":"On ajuste un polynôme de degré 100 sur 100 points bruités qui suivent une tendance simple. Que risque-t-on ?","ok":"Un sur-apprentissage : la courbe suit le bruit et généralise mal","ko":["Un sous-apprentissage : la courbe est trop simple pour les données","Rien : plus le degré est haut, plus le modèle est fiable"],"plain":"Avec autant de réglages que de points, la courbe peut passer par chacun, bruit compris : elle récite les données au lieu de saisir la tendance.","why":"Un degré très élevé donne un modèle trop souple : il colle à chaque point, y compris au bruit, et se trompe sur de nouvelles données (leçon ; slide 23 : la courbe de degré 100 part en pics aux bords).","whyNot":"Le sous-apprentissage correspond à un degré trop faible (droite sur une parabole) ; une erreur d'entraînement plus basse ne garantit pas une meilleure prédiction sur de nouvelles données."}},
{"id":"c1-26","action":"replace","value":{"id":"c1-26","type":"choix","ch":1,"notions":["reg.pandas"],"diff":1,"ctx":"Un fichier CSV contient plusieurs centaines de milliers de lignes ; on veut explorer et tracer rapidement deux de ses colonnes.","q":"À quoi sert df.sample(1000) ?","ok":"Tirer 1000 lignes au hasard pour alléger calculs et tracés","ko":["Garder les 1000 premières lignes du tableau","Trier le tableau puis garder 1000 lignes"],"plain":"Le fichier est énorme : on pioche 1000 lignes au hasard pour travailler sur un échantillon plus léger, plus rapide à calculer et à tracer.","why":"sample tire des lignes au hasard : l'échantillon reste représentatif du tableau entier tout en étant léger (slide 27 : df = df.sample(1000) sur un dataset volumineux).","whyNot":"Les 1000 premières lignes s'obtiennent avec head(1000) et ne sont pas forcément représentatives ; le tri se fait avec sort_values."}},
{"id":"c1-36","action":"replace","value":{"id":"c1-36","type":"bug","ch":1,"notions":["code.pieges"],"diff":1,"q":"Cette classe doit mémoriser les entrées X et la cible y. Quelle ligne est fausse ?","code":["class PolyRegression:","    def __init__(self):","        self._Xdata = []","        self._ydata = []","    def setAttr(self, X, y):","        self._Xdata = X","        self._Xdata = y"],"line":6,"plain":"Faute de frappe : la dernière ligne range y dans _Xdata, ce qui écrase X ; il fallait ranger y dans _ydata.","why":"La dernière ligne écrase _Xdata avec y : les entrées sont perdues et la cible n'est jamais stockée. Il fallait self._ydata = y.","whyNot":"Le constructeur initialise bien les deux attributs ; l'affectation de X est correcte."}},
{"id":"c1-43","action":"replace","value":{"id":"c1-43","type":"choix","ch":1,"notions":["reg.one_neuron","reg.eta"],"diff":2,"ctx":"Un neurone unique nn.Linear(1, 1) est entraîné avec la MSE ; on essaie deux optimiseurs et plusieurs learning rates.","q":"Comment comparer l'effet de ces réglages sur l'entraînement ?","ok":"Tracer la loss en fonction des epochs et comparer vitesse et stabilité","ko":["Comparer le nombre de paramètres de chaque modèle","Augmenter le bruit des données et regarder la loss"],"plain":"On dessine la courbe de l'erreur au fil des epochs pour chaque réglage : on voit lequel descend le plus vite et le plus régulièrement.","why":"La courbe de la loss au fil des epochs montre la vitesse de descente, les oscillations (η trop grand) ou la lenteur (η trop petit) : c'est l'exercice proposé, « tracer le graphe de la loss en fonction des epochs ».","whyNot":"Le nombre de paramètres ne change pas avec l'optimiseur (toujours w et b) ; modifier les données fausserait la comparaison des réglages."}},
{"id":"c1-44","action":"replace","value":{"id":"c1-44","type":"choix","ch":1,"notions":["reg.principe","reg.pandas"],"diff":1,"ctx":"Tableau de logements : colonnes surface, nb_pieces, quartier, annee et prix. On veut prédire le prix.","q":"Quelle est la variable dépendante et comment choisit-on les indépendantes ?","ok":"prix ; les indépendantes sont toutes les autres colonnes","ko":["surface ; les indépendantes sont quartier et annee","Aucune : toutes les colonnes, prix compris, sont indépendantes"],"plain":"On veut prédire le prix, c'est la cible ; toutes les autres colonnes servent d'indices pour le deviner, et le prix ne doit pas en faire partie.","why":"La variable dépendante est celle qu'on veut prédire (slide 3) ; les indépendantes sont les autres colonnes, la cible exclue, comme dans [col for col in dataset.columns if col not in [cible]] (slide 32).","whyNot":"La surface est une entrée, pas ce qu'on prédit ; mettre le prix parmi les entrées donnerait la réponse au modèle."}}
]
```

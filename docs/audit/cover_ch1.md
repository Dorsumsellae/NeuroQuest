# Audit de couverture — ch1 (IA-Hexagone-0.Introduction.pdf, 13 diapos ; IA-Hexagone-1.Regressions.pdf, 38 diapos)

Périmètre lu : Introduction diapos 1 à 13, Régressions diapos 1 à 38.
Ignorées : Introduction 1 (garde), 2 (plan), 3-5 et 9 pour les dates (Dartmouth, chronologie, anecdotes : historique hors examen ; seuls les ingrédients techniques du deep learning de la diapo 9 sont retenus). Régressions 1 (garde), 2 (plan).
Leçons vérifiées : toutes les `reg.*`, plus `nn.types_ml` et `nn.train_infer` (ch2) pour l'Introduction. `reg.one_neuron` vient du notebook (hors PDF) : non modifiée.

## Tableau élément → diapo → statut → correctif

### Introduction (PDF 0)

| # | Élément enseignable | Diapo | Statut | Correctif |
|---|---|---|---|---|
| I1 | Machine learning : simuler un comportement humain, alimenter un modèle (ex. réseau de neurones) avec des données, apprentissage pour une tâche (classification, détection, prédiction), décision sur un nouvel exemple | 6 | partiel (tâches et « simuler un comportement humain » absents) | `nn.types_ml` p1 réécrite |
| I2 | Data science : analyser des données pour en extraire des informations, modèles statistiques, cas d'usage corrélation âge / prévalence d'un cancer sur une population | 6-7 | partiel (cas d'usage absent) | `nn.types_ml` p5 |
| I3 | ML supervisé : données + annotations, paires donnée/annotation | 7 | couvert (`nn.types_ml`) | p2 précisée (« paires ») |
| I4 | ML non supervisé : données seules | 7 | couvert (`nn.types_ml`) | — |
| I5 | ML par renforcement : agent, meilleures actions dans un environnement | 7 | couvert (`nn.types_ml`) | — |
| I6 | IA générative : modèles de langage (textes), modèles de diffusion (images), contenus générés à partir d'un prompt | 8 | partiel (LLM / diffusion absents) | `nn.types_ml` p6 |
| I7 | Agents : automatiser les tâches et les outils (webscraping) | 8 | absent | `nn.types_ml` p7 |
| I8 | Deep learning = approche neuronale sophistiquée + calcul haute performance + big data ; LLM = large language models | 9 | absent | nouvelle notion `reg.ia_enjeux` |
| I9 | Étape 1 apprentissage : données (textes, images, annotations, renforcement), modèle optimisé selon les données et la tâche | 10 | couvert (`nn.train_infer`) | — |
| I10 | Étape 2 inférence : nouvelle requête, données au format semblable à l'entraînement | 11 | couvert (`nn.train_infer`) | — |
| I11 | IA faible (imiter le comportement humain) vs IA généralisée (apprendre les tâches comme un humain) | 12 | absent | `reg.ia_enjeux` |
| I12 | Réserves : IA avec les machines et/ou les symboles manipulés ? conscience simulée vs réelle ? | 12 | absent | `reg.ia_enjeux` |
| I13 | Apports de l'IA : notion de contrôle, logique de l'enchaînement des opérations mentales, automatisme | 13 | absent | `reg.ia_enjeux` |
| I14 | Tractabilité : big data, espace des solutions, explosion combinatoire | 13 | absent | `reg.ia_enjeux` |

### Régressions (PDF 1)

| # | Élément enseignable | Diapo | Statut | Correctif |
|---|---|---|---|---|
| R1 | Principe : relation entre une variable dépendante et une ou plusieurs indépendantes ; exemple prévalence d'un cancer / âge | 3 | couvert (`reg.principe`) | — |
| R2 | Modèle ŷ = θ₀ + θ₁x₁ + … + θₙxₙ | 4 | couvert (`reg.modele`) | — |
| R3 | Notation ŷ = h_θ(X) = θᵀX ; θ = biais θ₀ et poids ; X vecteur descripteur avec x₀ = 1 ; m échantillons | 4 | partiel (h_θ, « vecteur descripteur », m absents) | `reg.modele` p5 |
| R4 | MSE(X, h_θ) = (1/m) Σ (θᵀX⁽ⁱ⁾ − y⁽ⁱ⁾)² | 4 | couvert (`reg.mse`) | — |
| R5 | Équation normale θ̂ = (XᵀX)⁻¹Xᵀy, données X, cibles y | 5 | couvert (`reg.eq_normale`) | — |
| R6 | Idée de preuve : dérivée de la MSE à 0 | 5 | couvert (`reg.eq_normale`) | — |
| R7 | Imports numpy (calcul numérique), matplotlib.pyplot (tracé), np.test(label='slow') | 6 | absent | `reg.eq_normale` ex |
| R8 | Dataset : m = 100, X = 2*np.random.rand(m, 1), y = 4 + 3*X + np.random.randn(m, 1), alternative make_regression, plt.scatter / xlabel / show | 7 | partiel (seul « y = 4 + 3X + bruit ») | `reg.eq_normale` ex |
| R9 | X_b = np.c_[np.ones((m,1)), X] ; theta = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y) | 8 | partiel (np.linalg.inv absent) | `reg.eq_normale` ex |
| R10 | Prédiction : X_test = np.array([[0],[2]]), X_test_b avec colonne de 1, y_predict = X_test_b.dot(theta) | 8 | absent | `reg.eq_normale` ex |
| R11 | plt.plot(X_test, y_predict, "r-") : droite rouge sur le nuage | 9 | absent | `reg.eq_normale` ex |
| R12 | R² = Σ(ŷᵢ − ȳ)² / Σ(yᵢ − ȳ)² = SSE/SST | 10 | couvert (`reg.r2`) | — |
| R13 | Illustrations R² = 0.81 et R² = 1 | 10 | couvert (`reg.r2` ex) | — |
| R14 | scikit-learn : linear_model.LinearRegression(), fit(X, y), intercept_, coef_ | 11 | partiel (seulement évoqué dans `reg.poly`) | `reg.eq_normale` p7 |
| R15 | Optimisation dans l'espace des paramètres, minimum global de la MSE, problème convexe | 12 | couvert (`reg.convexe`) | — |
| R16 | Descente de gradient : init aléatoire, itérations avec un pas, arrêt après un nombre d'itérations | 12 | couvert (`reg.update`) | — |
| R17 | Dérivée partielle ∂MSE/∂θⱼ = (2/m) Σ (θᵀX⁽ⁱ⁾ − y⁽ⁱ⁾) xⱼ⁽ⁱ⁾ | 13 | couvert (`reg.gradient`) | — |
| R18 | Vecteur gradient = (2/m) Xᵀ(Xθ − y) | 13 | couvert (`reg.gradient`) | — |
| R19 | Gradient « vers le haut », θ⁽ᵗ⁺¹⁾ = θ⁽ᵗ⁾ − η∇MSE, η learning rate, t itération | 14 | couvert (`reg.update`) | — |
| R20 | Code batch GD : eta = 0.1, n_it = 1000, theta_t = np.random.randn(2, 1), grads, mise à jour | 15 | couvert (`reg.batch` ex) | — |
| R21 | Faire varier η | 15 | couvert (`reg.eta`) | — |
| R22 | SGD : une partie du dataset à chaque itération | 16 | couvert (`reg.sgd`) | — |
| R23 | Recuit simulé : learning rate décroissant selon les epochs, n_epochs = 50, t0, t1 = 5, 50, learning_annealing(t) = t0/(t+t1) | 16 | couvert (`reg.sgd`) | — |
| R24 | Boucle SGD : rand_idx = np.random.randint(m), Xi = X_b[rand_idx:rand_idx+1], grads = 2 * Xi.T.dot(Xi.dot(theta) - yi) (sans /m), eta = learning_annealing(ep * m + i) | 17 | partiel (code de la boucle absent) | `reg.sgd` p5 |
| R25 | « Extension possible : plus d'éléments tirés aléatoirement » | 17 | partiel (mini-batch expliqué, lien au code absent) | `reg.sgd` p6 |
| R26 | Comparatif des trajectoires BGD / SGD / équation normale dans le plan (θ₀, θ₁) ; exercice : tracer les paramètres selon les itérations | 18 | partiel (lisse / zigzag cités, figure et point NEqn absents) | `reg.minibatch` p5 |
| R27 | Régression polynomiale : combinaisons jusqu'au degré, exemple a, b degré 3, régression linéaire sur les features générées | 19 | couvert (`reg.poly`) | — |
| R28 | Dataset poly : X = 6*np.random.rand(m, 1) - 3, y = 0.5 + X**2 + X + 2 + bruit | 20 | couvert (`reg.poly` ex) | — |
| R29 | PolynomialFeatures(degree=2, include_bias=False), fit_transform(X), affichage X[0] / X_poly[0] | 21 | partiel (fit_transform absent) | `reg.poly` p5 |
| R30 | LinearRegression().fit(X_poly, y), intercept_ (biais), coef_ (coefficients) | 21 | couvert (`reg.poly` ex, tip) | repris dans `reg.poly` p5 |
| R31 | Prédire : X_test 1D → reshape(-1, 1), pol_features.fit_transform, lin_reg.predict | 22 | absent | `reg.poly` p6 |
| R32 | Exercice : régressions de degrés 2, 5, 10, 100 ; le degré 100 devient instable | 23 | partiel (l'exemple de la leçon parle d'un degré 30 absent du PDF) | `reg.overfit` ex corrigé |
| R33 | Packaging : classe PolyRegression, __init__ (self._Xdata, self._ydata), setAttr(X, y) ; bug du cours self._Xdata = y | 24 | absent | `reg.poly` p7 + tip |
| R34 | Database complexe : données océanographiques CalCOFI (csv fourni) | 25 | couvert (`reg.pandas` ex) | « océanographiques » ajouté en p5 |
| R35 | pd.read_csv("bottle.csv"), .shape, .info() | 26 | couvert (`reg.pandas`) | — |
| R36 | df = dataset[['T_degC', 'Salnty']], head(), isna().sum(), dropna(axis=0, inplace=True), sample(1000) | 27 | couvert (`reg.pandas`) | — |
| R37 | plt.scatter température / salinité | 28 | couvert (`reg.pandas` ex) | — |
| R38 | Exercice : différentes régressions, R² correspondants, plus d'échantillons, autres correspondances | 29 | absent | `reg.pandas` p5 |
| R39 | Sweetviz : import sweetviz as sv, sv.analyze(dataset), show_html() | 30 | couvert (`reg.sweetviz`) | — |
| R40 | Matrice de corrélation de Pearson (titrée R²), échelle −1 (rouge) à +1 (bleu) | 31 | partiel (lecture des couleurs absente) | `reg.sweetviz` p5 |
| R41 | Dataset Boston, cible MEDV, ind_vars_cols = [col for col in dataset.columns if col not in ['MEDV']] | 32 | partiel (code absent) | `reg.principe` p5 |
| R42 | Prix médian expliqué par 1 variable : plt.scatter(dataset.CRIM, dataset.MEDV) | 33 | absent | `reg.principe` p6 |
| R43 | Prix médian expliqué par 2 variables : fig.add_subplot(projection='3d'), ax.scatter(LSTAT, DIS, MEDV) | 34 | absent | `reg.principe` p6 |
| R44 | Exercice : corrélations avec le prix médian, de 1 à plusieurs variables, à la main et/ou Sweetviz | 35 | absent | `reg.principe` p7 |
| R45 | Preuve : notations matricielles Y, Θ, X (première colonne de 1) | 36 | partiel | `reg.eq_normale` p3 |
| R46 | MSE(Θ) = (1/m)(Y − XΘ)ᵀ(Y − XΘ) | 36 | absent | `reg.eq_normale` p3 |
| R47 | Dérivée selon Θ : −2XᵀY + 2XᵀXΘ | 37 | couvert (`reg.eq_normale`) | p4 |
| R48 | Dérivée nulle : XᵀXΘ = XᵀY puis Θ = (XᵀX)⁻¹XᵀY | 38 | partiel (étape intermédiaire absente) | `reg.eq_normale` p5 |

Remarque de fidélité : l'ancien exemple de `reg.overfit` (« degré 30 sur 100 points ») ne venait d'aucune diapo ; il est remplacé par l'exercice de la diapo 23 (degrés 2, 5, 10, 100).

## Nouvelle notion

`reg.ia_enjeux` (ch 1, fiche 01, section « pont vers le deep learning »), insérée après `reg.one_neuron` : ingrédients du deep learning (Intro 9), IA faible / généralisée et réserves (Intro 12), apports et tractabilité (Intro 13). Ces éléments ne tenaient pas dans `nn.types_ml` (déjà à 7 phrases avec I1, I2, I6, I7). Épreuves k1-52, k1-53, k1-54 dans camp_ch1.

## Correctifs

```json
[
{"action":"lesson","lesson":"nn.types_ml","field":"p","op":"set","value":[
"Le machine learning cherche à simuler un comportement humain : on alimente un modèle (par exemple un réseau de neurones) avec des données pour qu'il apprenne une tâche (classification, détection, prédiction…), puis on lui présente un nouvel exemple et il donne sa décision.",
"Supervisé : on fournit les données ET la bonne réponse (l'annotation, ou label) ; la machine apprend à partir des paires donnée/annotation, comme un élève qui a le corrigé.",
"Non supervisé : on fournit les données seules, et le modèle découvre leur structure tout seul (c'est le cas de l'autoencodeur).",
"Par renforcement : un agent agit dans un environnement et apprend, par essais et récompenses, les meilleures actions.",
"À côté, la data science analyse des données avec des modèles statistiques pour en tirer des informations, par exemple la corrélation entre l'âge et la prévalence d'un cancer sur une population.",
"L'IA générative apprend avec des modèles de langage (les LLM, large language models, pour les textes) ou des modèles de diffusion (pour les images), puis génère des contenus à partir d'un prompt.",
"Elle sert aussi à construire des agents, qui automatisent des tâches et des outils (par exemple du webscraping)."
]},
{"action":"lesson","lesson":"reg.modele","field":"p","op":"set","value":[
"Une régression linéaire, c'est une machine à deviner un nombre à partir d'autres nombres.",
"Elle prend chaque entrée, la multiplie par un poids, additionne le tout et ajoute un biais : c'est la formule ŷ = θ₀ + θ₁x₁ + … + θₙxₙ.",
"Pour écrire ça en une seule multiplication de vecteurs (θᵀX), on ajoute une entrée fictive x₀ qui vaut toujours 1 : le biais devient un poids comme les autres.",
"Apprendre, c'est trouver les valeurs des poids θ qui donnent les prédictions les plus proches des vraies valeurs.",
"Notations du cours : ŷ = h_θ(X) = θᵀX ; θ regroupe les paramètres du modèle (le biais θ₀ et les poids), X est le vecteur descripteur (les features, avec x₀ = 1), et on cherche θ à partir de m échantillons."
]},
{"action":"lesson","lesson":"reg.eq_normale","field":"p","op":"set","value":[
"Pour une régression linéaire, il existe un raccourci : une formule qui calcule d'un coup les paramètres θ qui minimisent la MSE.",
"C'est l'équation normale : θ = (XᵀX)⁻¹ Xᵀ y, où X est le tableau des données (une ligne par exemple, avec la colonne de 1), Xᵀ sa transposée, ⁻¹ l'inverse d'une matrice et y le vecteur des vraies valeurs.",
"Idée de la preuve : en notation matricielle (Y les cibles, Θ les paramètres θ₀…θₙ, X avec une première colonne de 1), la MSE s'écrit MSE(Θ) = (1/m)(Y − XΘ)ᵀ(Y − XΘ).",
"On dérive selon Θ, les inconnues : le cours obtient −2XᵀY + 2XᵀXΘ.",
"Au minimum, la dérivée est nulle : XᵀXΘ = XᵀY ; on multiplie à gauche par (XᵀX)⁻¹ et on trouve Θ = (XᵀX)⁻¹XᵀY.",
"Avantage : résultat exact, aucun réglage à choisir. Inconvénient : il faut inverser XᵀX, ce qui coûte cher avec beaucoup de features et devient impossible si XᵀX n'est pas inversible.",
"Avec scikit-learn : lin_reg = linear_model.LinearRegression(), puis lin_reg.fit(X, y) ; lin_reg.intercept_ donne le biais θ₀ et lin_reg.coef_ les poids. On lui passe X sans colonne de 1."
]},
{"action":"lesson","lesson":"reg.eq_normale","field":"ex","op":"set","value":"Code du cours : import numpy as np (calcul numérique), import matplotlib.pyplot as plt (graphiques) ; np.test(label='slow') vérifie que NumPy fonctionne. Données : m = 100, X = 2*np.random.rand(m, 1) (X entre 0 et 2), y = 4 + 3*X + np.random.randn(m, 1) (le bruit) ; make_regression de scikit-learn est une alternative. X_b = np.c_[np.ones((m, 1)), X] colle la colonne de 1 à gauche, puis theta = np.linalg.inv(X_b.T.dot(X_b)).dot(X_b.T).dot(y) (inv = inverse, .dot = produit matriciel) donne θ ≈ [4, 3] : le biais puis la pente, jamais exactement à cause du bruit. Prédire : X_test = np.array([[0], [2]]), on lui ajoute aussi la colonne de 1 (X_test_b), puis y_predict = X_test_b.dot(theta) ; plt.plot(X_test, y_predict, \"r-\") trace la droite en rouge par-dessus le nuage plt.scatter(X, y)."},
{"action":"lesson","lesson":"reg.sgd","field":"p","op":"set","value":[
"Plutôt que de lire tout le dataset avant chaque pas, la descente de gradient stochastique (SGD) tire un seul exemple au hasard et met θ à jour avec lui.",
"Chaque pas est très rapide, mais le gradient est approximatif : la trajectoire zigzague.",
"Le cours (slide 16) précise : « pour éviter les minimas locaux : recuit simulé », c'est-à-dire un learning rate décroissant en fonction des epochs.",
"Grand au début, le pas permet d'explorer et de passer au-dessus des minima locaux ; il diminue ensuite pour se caler près du minimum malgré le bruit : η = t0/(t + t1).",
"Code du cours : pour chaque epoch, m fois, rand_idx = np.random.randint(m) tire un indice, Xi = X_b[rand_idx:rand_idx+1] et yi = y[rand_idx:rand_idx+1] prennent cet exemple, grads = 2 * Xi.T.dot(Xi.dot(theta) - yi) (pas de /m : un seul exemple), eta = learning_annealing(ep * m + i), puis theta = theta - eta*grads.",
"Le commentaire du code « extension possible : plus d'éléments tirés aléatoirement » mène au mini-batch : tirer plusieurs exemples à chaque itération."
]},
{"action":"lesson","lesson":"reg.minibatch","field":"p","op":"set","value":[
"Une itération, c'est une mise à jour de θ. Une epoch, c'est un passage complet sur tout le dataset.",
"En SGD, une epoch contient donc m itérations, une par exemple.",
"Le mini-batch est le compromis : à chaque itération on tire un petit paquet de b exemples (32, 128…).",
"Le gradient est moins bruité qu'en SGD, moins coûteux qu'en batch, et le paquet se calcule en parallèle sur GPU : c'est le batch_size de Keras et PyTorch.",
"Comparatif du cours (exercice : tracer les paramètres au fil des itérations) : dans le plan (θ₀, θ₁), le batch suit une courbe lisse, le SGD zigzague puis s'agite autour de la solution, et l'équation normale donne directement le point ≈ (4, 3)."
]},
{"action":"lesson","lesson":"reg.poly","field":"p","op":"set","value":[
"Une droite ne peut pas suivre une courbe en U. L'astuce : fabriquer de nouvelles colonnes à partir des anciennes.",
"On calcule toutes les combinaisons des features jusqu'au degré voulu (carrés, produits…), puis on fait une régression linéaire classique sur ces colonnes.",
"Avec une feature x au degré 2, les colonnes sont [x, x²] et le modèle devient ŷ = θ₀ + θ₁x + θ₂x².",
"Le modèle reste linéaire en θ : on réutilise la MSE, l'équation normale et la descente de gradient sans rien changer.",
"En code : pol_features = PolynomialFeatures(degree=2, include_bias=False), puis X_poly = pol_features.fit_transform(X) calcule les nouvelles colonnes (comparer X[0] et X_poly[0] pour les voir) ; ensuite lin_reg = LinearRegression(), lin_reg.fit(X_poly, y), et intercept_ donne le biais, coef_ les coefficients.",
"Pour prédire sur de nouvelles valeurs : X_test, un tableau 1D, est mis en colonne par X_test.reshape(-1, 1), transformé par pol_features.fit_transform, puis y_test = lin_reg.predict(X_test_poly).",
"Le cours range enfin ce code dans une classe PolyRegression (packaging objet) : __init__ crée self._Xdata et self._ydata vides, setAttr(X, y) les remplit, pour réutiliser les fonctions avec de nouvelles données."
]},
{"action":"lesson","lesson":"reg.poly","field":"ex","op":"set","value":"Deux features a et b au degré 2 : on ajoute a², b², ab. Au degré 3 : a², b², a³, b³, ab, a²b, ab². Dataset du cours : X = 6*np.random.rand(m, 1) - 3 (X entre −3 et 3) et y = 0.5 + X**2 + X + 2 + bruit ; on obtient intercept ≈ 2.5 et coef ≈ [1, 1]."},
{"action":"lesson","lesson":"reg.poly","field":"tip","op":"set","value":"PolynomialFeatures(degree=2, include_bias=False) donne [x, x²] sans colonne de 1, car LinearRegression gère déjà le biais. Piège de code : dans setAttr du cours, la 2ᵉ ligne écrit self._Xdata = y, alors qu'il faudrait self._ydata = y."},
{"action":"lesson","lesson":"reg.overfit","field":"ex","op":"set","value":"Une droite (degré 1) sur une parabole : sous-apprentissage. Exercice du cours (slide 23) : tracer les régressions de degrés 2, 5, 10 et 100 sur la parabole bruitée. Les degrés 2, 5 et 10 suivent le nuage ; le degré 100 devient instable (pics verticaux aux bords, plateau au milieu) : trop de souplesse. Le degré 2 colle à la vraie forme."},
{"action":"lesson","lesson":"reg.pandas","field":"p","op":"set","value":[
"Pandas est la bibliothèque Python qui manipule des tableaux de données (des DataFrame), un peu comme un tableur.",
"pd.read_csv charge un fichier, .shape donne (lignes, colonnes), .info() les types et le nombre de valeurs non nulles par colonne.",
"df.isna().sum() compte les valeurs manquantes (NaN) par colonne ; df.dropna(axis=0, inplace=True) supprime les lignes qui en contiennent, directement dans df.",
"df.sample(1000) tire 1000 lignes au hasard pour alléger les calculs et les graphiques.",
"Exercice du cours sur ces données océanographiques (CalCOFI) : calculer différentes régressions entre température et salinité, calculer les R² correspondants, augmenter le nombre d'échantillons et chercher d'autres correspondances entre les colonnes."
]},
{"action":"lesson","lesson":"reg.sweetviz","field":"p","op":"set","value":[
"Face à une base avec des dizaines de colonnes, on veut un aperçu rapide avant de modéliser.",
"Sweetviz génère en deux lignes un rapport HTML d'analyse exploratoire : sv.analyze(dataset) puis show_html().",
"Le rapport montre les distributions, les valeurs manquantes et les corrélations de Pearson entre colonnes.",
"La corrélation de Pearson r va de −1 à 1 : proche de 1, les deux variables montent ensemble en suivant une droite ; proche de −1, l'une baisse quand l'autre monte ; proche de 0, aucun lien linéaire.",
"Dans la matrice de corrélation du rapport (titrée « Corrélation de Pearson (R²) » dans le cours), le bleu marque une corrélation proche de +1, le rouge proche de −1, le blanc proche de 0."
]},
{"action":"lesson","lesson":"reg.principe","field":"p","op":"set","value":[
"Une régression sert à prédire une valeur chiffrée : un prix, une salinité, un taux de maladie.",
"La valeur à prédire s'appelle la variable dépendante (ou cible, notée y) : elle dépend des autres.",
"Les informations dont on dispose pour la prédire sont les variables indépendantes (ou features, notées x).",
"Faire une régression, c'est chercher la relation qui relie la cible aux features à partir d'exemples connus.",
"Dans le code du cours (dataset Boston), on garde comme variables indépendantes toutes les colonnes sauf la cible : ind_vars_cols = [col for col in dataset.columns if col not in ['MEDV']].",
"Pour voir le prix expliqué par 1 variable, on trace un nuage 2D : plt.scatter(dataset.CRIM, dataset.MEDV) ; par 2 variables, un nuage 3D : ax = fig.add_subplot(projection='3d') puis ax.scatter(dataset.LSTAT, dataset.DIS, dataset.MEDV).",
"Exercice du cours : chercher les corrélations entre les variables et le prix médian, avec 1 puis plusieurs variables indépendantes, par des régressions à la main et/ou avec Sweetviz."
]},
{"action":"notion","after":"reg.one_neuron",
 "notion":{"id":"reg.ia_enjeux","ch":1,"label":"Deep learning, IA faible / généralisée, apports et tractabilité de l'IA","fiche":"01","section":"pont vers le deep learning"},
 "lesson":{"title":"Ce que l'IA apporte, et jusqu'où elle va",
  "p":[
   "Le deep learning est une approche neuronale sophistiquée, rendue possible par deux autres ingrédients : le calcul haute performance et le big data (de très grandes quantités de données).",
   "Le cours distingue deux visions de l'IA. L'IA faible imite le comportement humain.",
   "L'IA généralisée serait un système capable d'apprendre les tâches comme un humain.",
   "Deux réserves sont posées : développe-t-on une IA avec les machines ou avec les symboles qu'elles manipulent ? Et quelle différence entre une conscience simulée et une conscience réelle ?",
   "Ce que l'IA apporte : une notion de contrôle, une logique de l'enchaînement des opérations mentales, et l'automatisme.",
   "Elle est aussi pertinente pour la tractabilité, c'est-à-dire rendre traitables des problèmes face au big data, à un immense espace des solutions ou à une explosion combinatoire (le nombre de possibilités explose quand le problème grandit)."
  ],
  "ex":"Un modèle qui classe des photos de vêtements imite une compétence humaine sur une tâche précise : c'est de l'IA faible. Une IA généralisée, elle, apprendrait n'importe quelle nouvelle tâche comme un humain.",
  "tip":"IA faible = imiter le comportement humain ; IA généralisée = apprendre les tâches comme un humain. Deep learning = approche neuronale + calcul haute performance + big data."},
 "items":[
  {"id":"k1-52","type":"choix","ch":1,"notions":["reg.ia_enjeux"],"diff":1,"camp":true,"src":"Introduction, slide 12","q":"Selon le cours, qu'est-ce qui distingue l'IA faible de l'IA généralisée ?","ok":"L'IA faible imite le comportement humain ; l'IA généralisée apprendrait les tâches comme un humain","ko":["L'IA faible apprend sans données ; l'IA généralisée apprend avec des annotations","L'IA faible tourne sur un ordinateur classique ; l'IA généralisée exige le calcul haute performance"],"plain":"L'une se contente de reproduire ce que fait un humain ; l'autre saurait apprendre n'importe quelle tâche, comme un humain.","why":"Introduction, slide 12 : deux visions, l'IA faible (imiter le comportement humain) et l'IA généralisée (système capable d'apprendre les tâches comme un humain).","whyNot":"La présence ou non d'annotations distingue supervisé et non supervisé ; le calcul haute performance est un ingrédient du deep learning, pas le critère entre IA faible et généralisée."},
  {"id":"k1-53","type":"choix","ch":1,"notions":["reg.ia_enjeux"],"diff":1,"camp":true,"src":"Introduction, slide 9","q":"Selon le cours, quels ingrédients accompagnent l'approche neuronale sophistiquée pour donner le deep learning ?","ok":"Le calcul haute performance et le big data","ko":["L'équation normale et le recuit simulé","Les modèles statistiques et la corrélation de Pearson"],"plain":"Des réseaux de neurones très gros ne servent à rien sans machines puissantes pour les calculer et sans énormément de données pour les entraîner.","why":"Introduction, slide 9 : le deep learning réunit une approche neuronale sophistiquée, le calcul haute performance et le big data.","whyNot":"L'équation normale et le recuit simulé sont des outils de la régression (chapitre 1) ; les modèles statistiques et la corrélation relèvent de la data science."},
  {"id":"k1-54","type":"choix","ch":1,"notions":["reg.ia_enjeux"],"diff":1,"camp":true,"src":"Introduction, slide 13","q":"Un problème a tant de combinaisons possibles qu'on ne peut pas toutes les essayer une à une. Quel point de la pertinence de l'IA cela illustre-t-il ?","ok":"La tractabilité face à l'explosion combinatoire","ko":["L'IA faible, qui imite un comportement humain","L'inférence, qui exige des données au même format qu'à l'entraînement"],"plain":"Quand le nombre de possibilités explose, l'IA aide à rendre le problème traitable au lieu de tout tester.","why":"Introduction, slide 13 : la tractabilité couvre le big data, l'espace des solutions du problème à traiter et l'explosion combinatoire.","whyNot":"L'IA faible est une vision de l'IA (slide 12), pas un enjeu de taille de problème ; l'inférence est l'étape où le modèle entraîné répond, sans lien avec le nombre de combinaisons."}
 ]}
]
```

## Résumé

- Éléments recensés : 62 (14 Introduction, 48 Régressions).
- Couverts : 30 ; partiels : 16 ; absents : 16.
- Leçons complétées : 10 (`nn.types_ml`, `reg.modele`, `reg.eq_normale`, `reg.sgd`, `reg.minibatch`, `reg.poly`, `reg.overfit`, `reg.pandas`, `reg.sweetviz`, `reg.principe`), dont une correction de fidélité (`reg.overfit` ex : degré 30 inventé remplacé par les degrés 2/5/10/100 de la diapo 23).
- Notions créées : 1 (`reg.ia_enjeux`, après `reg.one_neuron`, épreuves k1-52 à k1-54).

// Glossaire : termes techniques rendus cliquables dans les questions, les salles et les explications.
// t = terme affiché, alt = autres écritures reconnues, d = définition en une phrase, pour un débutant.
window.NQ = window.NQ || {};
window.NQ.glossary = [
{"t":"MSE","alt":["Mean Squared Error","erreur quadratique moyenne"],"d":"Moyenne des carrés des écarts entre ce que le modèle prédit et la vraie valeur : plus elle est petite, plus le modèle est bon."},
{"t":"learning rate","alt":["taux d'apprentissage","η"],"d":"Taille du pas que fait l'algorithme à chaque mise à jour des paramètres : trop grand, il dépasse la cible ; trop petit, il n'avance pas."},
{"t":"gradient","alt":["∇"],"d":"Direction dans laquelle l'erreur augmente le plus vite ; on marche dans le sens opposé pour la faire baisser."},
{"t":"descente de gradient","alt":["gradient descent","batch GD","BGD"],"d":"Méthode d'apprentissage : on corrige un peu les paramètres à chaque étape dans le sens qui réduit l'erreur, et on recommence."},
{"t":"SGD","alt":["stochastic gradient descent","descente de gradient stochastique"],"d":"Descente de gradient où chaque étape ne regarde qu'un seul exemple tiré au hasard : rapide mais un peu désordonnée."},
{"t":"epoch","alt":["epochs","époque"],"d":"Un passage complet sur toutes les données d'entraînement. Dix epochs = le modèle a vu dix fois chaque exemple."},
{"t":"biais","alt":["θ₀","bias","intercept"],"d":"Le paramètre qui décale la prédiction indépendamment des entrées, comme l'ordonnée à l'origine d'une droite."},
{"t":"poids","alt":["weights","θ","w"],"d":"Les nombres que le modèle ajuste pendant l'apprentissage : chaque entrée est multipliée par son poids."},
{"t":"softmax","alt":[],"d":"Fonction de sortie qui transforme des scores en probabilités positives dont la somme fait 1, une par classe."},
{"t":"ReLU","alt":["Rectified Linear Unit"],"d":"Fonction d'activation très simple : elle garde les valeurs positives et met les négatives à zéro."},
{"t":"sigmoïde","alt":["sigmoid","fonction logistique"],"d":"Fonction en forme de S qui écrase n'importe quel nombre entre 0 et 1, pratique pour une probabilité."},
{"t":"fonction d'activation","alt":["activation"],"d":"Petite fonction appliquée à la sortie d'un neurone pour la rendre non linéaire, sans quoi empiler des couches ne servirait à rien."},
{"t":"loss","alt":["fonction de perte","fonction de coût","perte"],"d":"Le nombre qui mesure à quel point le modèle se trompe ; tout l'apprentissage consiste à le faire baisser."},
{"t":"optimiseur","alt":["optimizer"],"d":"L'algorithme qui applique les corrections aux poids à partir du gradient (SGD, Adam, RMSprop…)."},
{"t":"hyperparamètre","alt":["hyperparamètres"],"d":"Réglage choisi avant l'entraînement et non appris par le modèle : learning rate, nombre de couches, taux de dropout…"},
{"t":"StandardScaler","alt":[],"d":"Outil scikit-learn qui centre et réduit chaque colonne (moyenne 0, écart-type 1), en apprenant moyenne et écart-type sur le train."},
{"t":"optimisation bayésienne","alt":["Bayesian Optimization"],"d":"Recherche d'hyperparamètres qui choisit chaque nouvel essai en s'appuyant sur les résultats des essais précédents, pour en faire moins."},
{"t":"SMART","alt":["SMART stats"],"d":"Mesures d'autodiagnostic qu'un disque dur enregistre chaque jour (erreurs de lecture, secteurs réalloués…)."},
{"t":"seuil","alt":["threshold"],"d":"Valeur limite de l'erreur de reconstruction au-delà de laquelle on déclare une anomalie."},
{"t":"transformer","alt":["transformers"],"d":"Famille de réseaux très puissants pour les séquences (base des LLM), mais lourds à entraîner."},
{"t":"canal","alt":["canaux"],"d":"Une couche de couleur d'une image : 1 canal en niveaux de gris, 3 canaux en couleur (rouge, vert, bleu)."}
];

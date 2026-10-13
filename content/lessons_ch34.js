// Micro-leçons des chapitres 3 et 4 (autoencodeurs, U-Net, détection d'anomalies).
window.NQ = window.NQ || {}; window.NQ.lessons = window.NQ.lessons || {};
Object.assign(window.NQ.lessons, {
"ae.cnn_limite": {
  "title": "Pourquoi un CNN classique ne rend pas d'image",
  "p": [
    "Un CNN de classification répond à une question du type « qu'y a-t-il sur la photo ? » : il sort une étiquette, pas une image.",
    "Ses premières couches sont pourtant utiles : elles repèrent des motifs à différentes échelles (contours, textures, formes).",
    "Mais à la fin, Flatten aplatit les cartes en une longue liste de nombres et les couches Dense les mélangent : on perd l'information de position (on dit que ce n'est plus spatialisé).",
    "Pour une tâche d'analyse (segmentation, reconstruction, débruitage), il faut une sortie qui soit elle-même une image : c'est le rôle d'un décodeur, d'où l'autoencodeur et le U-Net."
  ],
  "ex": "Sur un scanner, un CNN peut dire « il y a un foie ». Pour colorier exactement les pixels du foie (segmentation), il faut une sortie de la taille de l'image, pixel par pixel.",
  "svg": "cnn",
  "tip": "Classifier = une étiquette par image ; analyser = une valeur par pixel. Après Flatten + Dense, la position des pixels est perdue."
},
"ae.non_supervise": {
  "title": "Apprendre sans étiquettes : la cible, c'est l'entrée",
  "p": [
    "Imaginez qu'on vous demande de résumer un texte puis de le réécrire à partir du résumé seul : on vérifie votre travail en comparant avec l'original, sans correcteur extérieur.",
    "C'est exactement ce que fait l'autoencodeur : il compare sa sortie x̂ (la reconstruction) à son entrée x. L'écart s'appelle l'erreur de reconstruction.",
    "On mesure cet écart avec la MSE (moyenne des carrés des écarts) ou la MAE (moyenne des écarts en valeur absolue).",
    "Aucune annotation humaine n'est nécessaire : c'est pour cela qu'on parle d'apprentissage non supervisé."
  ],
  "ex": "En Keras : autoencoder.fit(x_train, x_train). Le même tableau sert d'entrée et de cible. Écrire fit(x_train, y_train) avec des labels serait une erreur.",
  "svg": "sablier",
  "tip": "Dans fit, les deux arguments sont identiques : x_train, x_train. Pas de y."
},
"ae.applications": {
  "title": "À quoi sert un autoencodeur",
  "p": [
    "Comme l'autoencodeur apprend un résumé compact (le code) de ses données, il sert partout où ce résumé est utile.",
    "Compression : on stocke le code, plus petit que l'image. Réduction de dimensions : le code remplace les nombreuses variables d'origine ; le cours (slide 11) compare l'ACP à un autoencodeur linéaire.",
    "Débruitage : on lui donne une image bruitée en entrée et l'image propre comme cible, il apprend à nettoyer.",
    "Partie d'un réseau : un bloc encodeur / décodeur peut s'insérer dans une architecture plus grande, par exemple de compression."
  ],
  "ex": "Une image 28×28 (784 nombres) résumée en 32 nombres : on divise la taille par plus de 24 tout en pouvant la reconstruire approximativement.",
  "svg": "sablier",
  "tip": "Les quatre applications citées (slides 10 à 13) : compression, réduction de dimensions, débruitage, partie d'un réseau. La détection d'anomalies fait l'objet d'une section à part."
},
"ae.unet": {
  "title": "U-Net, le réseau qui colorie chaque pixel",
  "p": [
    "La segmentation consiste à attribuer une classe à chaque pixel, comme colorier un organe sur un scanner.",
    "U-Net est un autoencodeur dessiné en forme de U : la branche descendante (encodeur, appelée contractive path) réduit la résolution et augmente le nombre de canaux, la branche montante (décodeur, appelée expansive path) fait l'inverse.",
    "Descente : convolutions 3×3 + ReLU puis max-pooling 2×2, avec 64 → 128 → 256 → 512 → 1024 canaux. Remontée : up-convolutions 2×2 (convolutions qui agrandissent l'image), convolutions 3×3, puis une convolution 1×1 finale qui donne, pour chaque pixel, un score par classe.",
    "Contrairement à l'autoencodeur classique, U-Net est supervisé : il apprend à partir de masques annotés (la bonne réponse, pixel par pixel)."
  ],
  "ex": "Entrée : un scanner du ventre. Sortie : une image de même taille où chaque pixel vaut 1 s'il appartient au foie, 0 sinon.",
  "svg": "unet",
  "tip": "U-Net = autoencodeur SUPERVISÉ pour la segmentation ; encodeur = contractive path, décodeur = expansive path."
},
"ae.unet_skip": {
  "title": "Les ponts du U-Net : skip connections et Dice",
  "p": [
    "En réduisant l'image, l'encodeur perd les détails fins, un peu comme une photo trop compressée qui devient floue.",
    "Les skip connections sont des ponts horizontaux du U : chaque niveau de l'encodeur envoie sa carte haute résolution au niveau correspondant du décodeur, qui la concatène (copy and crop) pour retrouver les détails.",
    "Pour agrandir l'image dans le décodeur, U-Net n'utilise pas un simple agrandissement fixe mais une convolution inverse apprise : Conv2DTranspose.",
    "Comme le modèle est supervisé, on le juge avec une métrique : le Dice = 2|A∩B| / (|A|+|B|), où A est le masque prédit, B le masque réel et A∩B leur partie commune."
  ],
  "ex": "Masque prédit de 100 pixels, masque réel de 100 pixels, 80 en commun : Dice = 2×80 / (100+100) = 0.8. Un recouvrement parfait donne 1.",
  "svg": "unet",
  "tip": "Les skip connections ne réduisent pas les paramètres : elles réinjectent les détails perdus par la contraction."
},
"ae.unet_ext": {
  "title": "Les variantes du U-Net",
  "p": [
    "Le U de base a été décliné pour d'autres besoins, en gardant l'idée encodeur + décodeur + ponts.",
    "U-Net 3D traite des volumes (un scanner complet, empilement de coupes) au lieu d'images plates. Dense U-Net utilise des blocs denses, où chaque couche reçoit les sorties de toutes les précédentes. Multi-res U-Net combine plusieurs résolutions à chaque niveau.",
    "nnU-Net (« no-new-U-Net ») n'invente pas de nouvelle architecture : il apprend automatiquement la meilleure configuration (prétraitement, architecture, réglages) pour un dataset donné."
  ],
  "ex": "Le cours compare ces variantes sur la segmentation des vaisseaux du foie : même tâche, architectures différentes, résultats comparés.",
  "tip": "nnU-Net = « pas de nouveau U-Net » : on apprend la configuration, pas une nouvelle architecture."
},
"ae.denoise": {
  "title": "Débruiter sans effacer les détails",
  "p": [
    "Débruiter une image, c'est comme retirer le grésillement d'un enregistrement sans couper les aigus de la voix.",
    "La difficulté : le bruit et les détails sont tous deux des motifs de haute fréquence (variations rapides d'un pixel à l'autre). Lisser trop fort efface aussi les détails.",
    "Noise2Noise : un modèle type U-Net entraîné sur des paires d'images bruitées de la même scène, sans jamais voir d'image propre.",
    "FFDNet : découpe l'image en sous-images plus petites, traitées rapidement. DnCNN : apprend le résidu, c'est-à-dire le bruit lui-même, puis image propre = entrée − bruit prédit (même idée que ResNet)."
  ],
  "ex": "Un pixel bruité vaut 130, DnCNN prédit un bruit de +10 : le pixel nettoyé vaut 130 − 10 = 120.",
  "tip": "DnCNN = résidu (le bruit) ; FFDNet = sous-images ; Noise2Noise = paires bruitées, pas d'image propre."
},
"ae.anomalie": {
  "title": "Repérer l'anormal par l'erreur de reconstruction",
  "p": [
    "Un détecteur de fumée ne connaît pas tous les incendies possibles : il connaît l'air normal et sonne quand ça ne lui ressemble plus.",
    "L'autoencodeur apprend à bien reconstruire les données qu'il voit souvent : pour le cours (slide 26), une donnée « vue fréquemment » est normale. En pratique (lab), on l'entraîne sur des données normales uniquement.",
    "Face à une donnée jamais vue (une anomalie), il la reconstruit mal : l'erreur de reconstruction, L = (1/N) Σ (xᵢ − x̂ᵢ)² sur les N valeurs de l'échantillon, devient grande.",
    "Un seuil sur cette erreur tranche : en dessous, normal ; au-dessus, anomalie."
  ],
  "ex": "Dans le lab, le seuil suggéré vaut environ 0.13 : une séquence d'erreur 0.02 est classée normale, une séquence d'erreur 4.5 anormale. Utile quand les anomalies sont rares : 256 pannes sur environ 3 millions d'échantillons.",
  "svg": "anomalie",
  "tip": "Faible erreur de reconstruction = donnée habituelle, normale ; grande erreur = donnée anormale. C'est le seuil sur cette erreur qui décide."
},
"ae.latent_bilan": {
  "title": "Tout repose sur un bon résumé : l'espace latent",
  "p": [
    "Le fil rouge du chapitre : un bon modèle d'image commence par résumer efficacement ses données. Ce résumé interne s'appelle l'espace latent.",
    "Avec la même idée encodeur → code → décodeur, on obtient de nombreuses architectures : segmentation, compression, reconstruction, débruitage.",
    "Et pas seulement pour des images : le bilan insiste sur « d'autres applications non-image », comme les données tabulaires de la détection d'anomalies.",
    "On peut même apprendre le modèle lui-même : c'est l'idée de nnU-Net, qui choisit automatiquement sa configuration."
  ],
  "ex": "Le même schéma sert à colorier un foie sur un scanner (U-Net) et à repérer un disque dur qui va tomber en panne (AE sur 16 jours × 21 mesures).",
  "svg": "sablier",
  "tip": "Bilan du cours : une représentation efficace dans l'espace latent, et des applications aussi non-image."
},
"ano.dataset": {
  "title": "Le dataset : des disques durs surveillés chaque jour",
  "p": [
    "Un disque dur s'autosurveille un peu comme un bilan de santé quotidien : il enregistre des compteurs internes appelés statistiques SMART (erreurs de lecture, températures, secteurs réalloués…).",
    "Le dataset Backblaze contient une ligne par disque et par jour : Date, Serial Number, Model, Capacity, Failure, puis les SMART stats.",
    "Les SMART occupent 90 colonnes : 45 valeurs brutes et leurs 45 versions normalisées. Le lab ne garde que les brutes, soit 21 features utiles.",
    "La colonne Failure vaut 0 si le disque va bien, et 1 le dernier jour où il fonctionne encore avant la panne."
  ],
  "ex": "Un disque suivi 300 jours a 299 lignes avec Failure = 0 puis une ligne Failure = 1 le jour 300. Au total : 256 pannes pour environ 3 millions d'échantillons.",
  "tip": "Failure = 1 ne veut pas dire « en panne depuis longtemps » : c'est le DERNIER jour opérationnel avant la panne."
},
"ano.sequences": {
  "title": "Découper le temps en séquences de 16 jours",
  "p": [
    "Un seul jour de mesures dit peu de choses ; c'est l'évolution sur plusieurs jours qui trahit un disque fatigué, comme une fièvre qui monte.",
    "On découpe donc l'historique de chaque disque en séquences de S jours consécutifs, chaque jour ayant 21 features : une séquence est un tableau S × 21.",
    "Dans le lab, S = 16, et la fenêtre glisse de 8 jours à chaque fois : jours 1 à 16, puis 9 à 24, etc.",
    "À l'entraînement, on n'utilise que des séquences de disques sains. En test, on prend les 16 derniers jours d'un disque, on le reconstruit et on mesure l'erreur."
  ],
  "ex": "Le train fourni contient 4 625 séquences de 16 jours × 21 features (74 000 lignes), sans aucune séquence se terminant par une panne ; le test en contient 834.",
  "tip": "Une entrée = une séquence (16, 21), pas un jour isolé ; et le train ne contient aucune panne."
},
"ano.lstm": {
  "title": "Le LSTM, un réseau qui a de la mémoire",
  "p": [
    "Pour lire une phrase, on se souvient des mots précédents. Un LSTM (Long Short-Term Memory) fait pareil avec une série temporelle : il lit les jours un par un en gardant une mémoire.",
    "Cette mémoire s'appelle l'état de cellule c(t) ; à chaque pas, la cellule produit aussi une sortie h(t).",
    "Trois portes règlent la mémoire : la forget gate décide ce qu'on oublie de c(t−1), l'input gate ce qu'on ajoute, l'output gate ce qu'on montre en sortie.",
    "Les portes utilisent une sigmoïde (logistique, valeur entre 0 = fermé et 1 = ouvert) ; le contenu utilise tanh (valeur entre −1 et 1). Cela permet de retenir des dépendances longues."
  ],
  "ex": "Jour 1 à 16 d'un disque : au jour 16, le LSTM peut encore tenir compte d'une hausse d'erreurs apparue au jour 3, grâce à c(t).",
  "svg": "lstm",
  "tip": "Trois portes : forget, input, output. Sigmoïde pour les portes, tanh pour le contenu."
},
"ano.seq2seq": {
  "title": "L'autoencodeur Seq2Seq : séquence → code → séquence",
  "p": [
    "Idée : lire toute la séquence, la résumer en un seul vecteur, puis réécrire la séquence à partir de ce résumé.",
    "L'encodeur est un LSTM avec return_sequences=False : il ne renvoie que son dernier état, un vecteur de taille lstm_width. C'est le code.",
    "Le décodeur a besoin d'une séquence en entrée : RepeatVector recopie le code S fois pour refabriquer un axe du temps.",
    "Puis un LSTM avec return_sequences=True (une sortie par jour) et un dernier LSTM à n_features unités, activation tanh, qui redonne les 21 features. La loss est la MAE."
  ],
  "ex": "Input (16, 21) → LSTM(128) donne (128,) → RepeatVector(16) donne (16, 128) → LSTM(128, True) donne (16, 128) → LSTM(21, True) donne (16, 21). Dans le lab, lstm_width = 128.",
  "svg": "seq2seq",
  "tip": "return_sequences=False sur l'encodeur (un vecteur), True sur le décodeur (une sortie par pas de temps). Sinon RepeatVector reçoit une séquence et plante."
},
"ano.conv1d": {
  "title": "La convolution 1D : une loupe qui glisse sur le temps",
  "p": [
    "Une convolution 2D fait glisser un petit filtre sur une image en hauteur et en largeur. Une convolution 1D le fait glisser sur un seul axe : le temps.",
    "Le noyau (kernel) couvre plusieurs jours consécutifs et avance d'un jour à chaque pas. Sur le schéma du cours (slides 12-13), un noyau glisse le long de chaque feature.",
    "Sans padding, la longueur de sortie vaut longueur d'entrée − taille du noyau + 1. Sur le schéma du cours, la sortie garde une colonne par feature ; en Keras, le nombre de colonnes de sortie est le nombre de filtres.",
    "MaxPooling1D(2) divise la longueur par 2, UpSampling1D(2) la multiplie par 2."
  ],
  "ex": "Entrée (8 jours, 5 features), noyau de taille 5 glissant sur les jours : 8 − 5 + 1 = 4 positions, sortie (4, 5). Dans le lab : 16 → 8 → 4 → 8 → 16 avec pooling puis up-sampling.",
  "svg": "conv1d",
  "tip": "Sans padding, la longueur devient L − k + 1 ; l'axe du temps vient en premier."
},
"ano.conv1d_vs_lstm": {
  "title": "AE Conv1D ou AE LSTM : lequel choisir",
  "p": [
    "Les deux sont des autoencodeurs pour séquences ; seule la façon de lire le temps change : mémoire pas à pas pour le LSTM, filtres glissants pour Conv1D.",
    "L'AE Conv1D suit le schéma Conv1D → MaxPooling1D → Conv1D → MaxPooling1D → Conv1D (goulot) → UpSampling1D → Conv1D → UpSampling1D → Conv1D de sortie.",
    "La dernière Conv1D a 21 filtres et un noyau de taille 1 pour retrouver les 21 features de départ.",
    "Avantages cités par le cours : moins consommateur qu'un LSTM, plus robuste au bruit et aux données manquantes."
  ],
  "ex": "Séquence (16, 21) → pooling → (8, …) → pooling → (4, …) → goulot (4, 4) → up-sampling → (8, …) → (16, …) → sortie (16, 21).",
  "svg": "conv1d",
  "tip": "Conv1D : moins coûteux, plus robuste au bruit et aux trous. Il reste non supervisé : l'accuracy n'a pas de sens, on suit la loss."
},
"ano.pretraitement": {
  "title": "Préparer les données sans tricher",
  "p": [
    "Les features SMART ont des échelles très différentes (des compteurs à quelques unités, d'autres à des millions) ; on les remet à la même échelle.",
    "Le StandardScaler centre et réduit : il soustrait la moyenne et divise par l'écart-type de chaque colonne.",
    "Ces moyennes et écarts-types sont appris (fit) sur le train uniquement, puis appliqués (transform) au train et au test. Faire un fit sur le test, c'est utiliser des informations qu'on n'aurait pas en production : une fuite de données.",
    "Enfin on remet les données en 3D, (nombre de séquences, longueur de séquence, nombre de features) : le format attendu par LSTM et Conv1D."
  ],
  "ex": "4 625 séquences de 16 jours × 21 features (74 000 lignes) : x_train.reshape(-1, 16, 21) donne un tableau de shape (4625, 16, 21).",
  "tip": "scaler.fit_transform(x_train) puis scaler.transform(x_test). Jamais fit_transform sur le test."
},
"ano.seuil": {
  "title": "Où placer la barre entre normal et anomalie",
  "p": [
    "Comme la sensibilité d'une alarme : trop sensible, elle sonne pour rien ; pas assez, elle rate le cambrioleur.",
    "Après prédiction, chaque séquence de test reçoit une erreur de reconstruction. Règle : erreur ≤ seuil donne normal, erreur > seuil donne anomalie.",
    "Le lab trie les erreurs et prend sort_mse[num_normal_disks] : si on sait qu'il y a N disques normaux, le seuil est l'erreur placée juste après les N plus petites (Python compte à partir de 0). C'est un point de départ, car on ne connaît pas N en vrai.",
    "Baisser le seuil augmente le rappel (part des vraies pannes détectées) mais aussi les faux positifs (disques sains signalés)."
  ],
  "ex": "Pour des disques durs, on vise un rappel maximal : rater une panne (perte de données) coûte plus cher qu'une fausse alerte (un disque vérifié pour rien).",
  "svg": "anomalie",
  "tip": "Le seuil est un choix métier. Seuil bas = rappel haut + plus de faux positifs ; les deux bougent dans le même sens."
},
"ano.roc": {
  "title": "La courbe ROC : tous les seuils d'un coup",
  "p": [
    "Plutôt que de juger un seul seuil, on les essaie tous et on trace le résultat : c'est la courbe ROC.",
    "En abscisse, le taux de faux positifs (FPR : part des séquences normales classées anomalie) ; en ordonnée, le taux de vrais positifs (TPR, ou rappel : part des anomalies détectées). Chaque point = un seuil.",
    "Le point idéal est en haut à gauche : 0 % de fausses alertes et 100 % des pannes détectées.",
    "L'AUC est l'aire sous cette courbe : 1 pour un détecteur parfait, 0.5 pour un tirage au hasard (la diagonale)."
  ],
  "ex": "Un seuil donne FPR = 10 % et TPR = 90 % : point (0.1, 0.9), proche du coin idéal. Une AUC de 0.95 indique une très bonne séparation normal / anomalie.",
  "svg": "roc",
  "tip": "ROC = TPR en fonction de FPR ; AUC 1 = parfait, 0.5 = hasard. Avec des pannes rares, l'accuracy seule est trompeuse."
},
"ano.bayes": {
  "title": "Régler les hyperparamètres intelligemment",
  "p": [
    "Les hyperparamètres sont les réglages qu'on choisit avant l'entraînement : lstm_width (taille du LSTM), learning_rate, dropout… Chaque essai coûte un entraînement complet de plusieurs minutes.",
    "Tout tester (une grille) coûterait trop cher. L'optimisation bayésienne fait comme un chercheur d'or : elle construit une carte de ce qu'elle croit savoir et choisit où creuser ensuite.",
    "Cette carte est un processus gaussien : pour chaque réglage, il prédit un score moyen et une incertitude. Une fonction d'acquisition choisit le prochain essai en équilibrant exploitation (zones prometteuses) et exploration (zones inconnues).",
    "Avec bayes_opt : BayesianOptimization(f, pbounds) puis maximize(init_points, n_iter), où init_points = essais aléatoires de départ et n_iter = essais guidés."
  ],
  "ex": "lstm_width 68 et lr 0.0227 : la loss remonte et stagne vers 0.5 (divergence). lstm_width 116 et lr 0.0035 : la loss décroît régulièrement. Sur la carte du slide 17, les bons modèles ont un learning rate faible (≈ 10⁻³) à petite comme à grande largeur : c'est le learning rate qui fait la différence. Le score « objective » affiché au slide 16 est à maximiser.",
  "svg": "bayes",
  "tip": "Optimisation bayésienne = moins d'entraînements qu'une grille, car chaque essai est choisi d'après les précédents."
},
"ano.transformers": {
  "title": "Les transformers, la piste pour aller plus loin",
  "p": [
    "Le bilan du cours rappelle qu'encodeur et décodeur peuvent être construits de plusieurs façons : convolutions, LSTM…",
    "Pour mieux comprendre les séquences, une piste plus puissante existe : les transformers, des réseaux qui regardent tous les pas de temps à la fois au lieu de les lire un par un.",
    "Le prix à payer est une surcharge significative : beaucoup plus de calcul et besoin de beaucoup plus de données."
  ],
  "ex": "Pour nos séquences de 16 jours × 21 features, un AE LSTM ou Conv1D suffit ; un transformer serait plus lourd à entraîner pour un gain incertain.",
  "tip": "À retenir du bilan : transformers possibles pour les séquences, mais avec une surcharge significative."
}
});
window.NQ.glossary = window.NQ.glossary || [];
window.NQ.glossary.push(
{"t":"autoencodeur","alt":["autoencodeurs","auto-encodeur"],"d":"Réseau qui compresse son entrée en un petit code (encodeur) puis la reconstruit à partir de ce code (décodeur)."},
{"t":"encodeur","alt":["Encodeur","encoder"],"d":"Première moitié d'un autoencodeur : elle réduit l'entrée en un petit résumé appelé code."},
{"t":"décodeur","alt":["Décodeur","decoder"],"d":"Seconde moitié d'un autoencodeur : elle reconstruit l'entrée à partir du code."},
{"t":"espace latent","alt":["code latent","plongement","embedding","goulot d'étranglement","goulot","bottleneck"],"d":"Le petit résumé interne (le code) que l'encodeur produit, au point le plus étroit du réseau."},
{"t":"erreur de reconstruction","alt":["Erreur de reconstruction"],"d":"Écart entre l'entrée et la sortie reconstruite d'un autoencodeur ; grande, elle signale une donnée inhabituelle."},
{"t":"U-Net","alt":["U-net"],"d":"Autoencodeur supervisé en forme de U, utilisé pour la segmentation d'images, avec des ponts entre encodeur et décodeur."},
{"t":"nnU-Net","alt":["no-new-U-Net"],"d":"Méthode qui apprend automatiquement la meilleure configuration d'un U-Net (prétraitement, architecture, réglages) pour un dataset donné."},
{"t":"segmentation","alt":["carte de segmentation"],"d":"Tâche qui attribue une classe à chaque pixel d'une image, par exemple colorier un organe sur un scanner."},
{"t":"skip connection","alt":["skip connections","Skip connection"],"d":"Pont qui envoie une carte de l'encodeur directement au décodeur pour lui redonner les détails perdus."},
{"t":"Conv2DTranspose","alt":["convolution transposée","up-conv"],"d":"Couche qui agrandit une image en apprenant comment le faire, au lieu d'un simple agrandissement fixe."},
{"t":"Dice","alt":["coefficient de Dice"],"d":"Mesure du recouvrement entre le masque prédit et le masque réel : 2×(partie commune) / (taille A + taille B), 1 = parfait."},
{"t":"LSTM","alt":["Long Short-Term Memory"],"d":"Réseau récurrent qui lit une série pas à pas en gardant une mémoire réglée par trois portes (forget, input, output)."},
{"t":"RepeatVector","alt":["Repeat Vector"],"d":"Couche Keras qui recopie un vecteur S fois pour en faire une séquence de S pas de temps."},
{"t":"return_sequences","alt":["return_sequences=True","return_sequences=False"],"d":"Option d'un LSTM : True renvoie une sortie à chaque pas de temps, False seulement la dernière."},
{"t":"Conv1D","alt":["convolution 1D","convolutions 1D"],"d":"Convolution dont le filtre glisse le long d'un seul axe, le temps, sur toutes les features à la fois."},
{"t":"rappel","alt":["Rappel","recall"],"d":"Part des vraies anomalies que le modèle détecte : 90 % de rappel = 9 pannes sur 10 repérées."},
{"t":"faux positif","alt":["faux positifs","Faux positif"],"d":"Donnée normale que le modèle signale à tort comme anomalie : une fausse alerte."},
{"t":"courbe ROC","alt":["ROC"],"d":"Courbe qui montre, pour tous les seuils, le taux de vrais positifs en fonction du taux de faux positifs."},
{"t":"AUC","alt":["aire sous la courbe"],"d":"Aire sous la courbe ROC : 1 pour un détecteur parfait, 0.5 pour un tirage au hasard."}
);

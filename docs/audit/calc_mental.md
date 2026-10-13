# Calculs faisables de tête (contrôle sans calculatrice)

Les questions dont la réponse demandait une multiplication ou une division posée (784 × 128, 3 136 × 64, 676 × 50, 60 000 / 32, 74 000 / 16…) sont reformulées : soit on reconnaît la bonne **expression** (ce qui teste la méthode, poids + biais, etc.), soit les nombres sont choisis pour se calculer de tête.

| id | avant | après |
|---|---|---|
| c2-17, k2a-23 | 100 480 | 784 × 128 + 128 |
| c2-19 | 200 768 | 3 136 × 64 + 64 |
| k2b-17 | 205 312 | 400 × 512 + 512 |
| c2-46 | 33 800 | (3 × 3 × 75 + 1) × 50 |
| c2-47 | 3 136 | 7 × 7 × 64 |
| c2-31 | 60 000 images, batch 32 → 18 750 | 6 400 images, batch 32 → 2 000 |
| k4-20 | 74 000 lignes → (4625, 16, 21) | 1 600 lignes → (100, 16, 21) |

```json
[
{"id":"c2-17","action":"edit","field":"q","value":"Combien de paramètres a une couche Dense(128) qui reçoit les 784 valeurs d'un Flatten ? (sans calculer le résultat)"},
{"id":"c2-17","action":"edit","field":"ok","value":"784 × 128 + 128"},
{"id":"c2-17","action":"edit","field":"ko","value":["784 × 128","784 + 128"]},
{"id":"c2-17","action":"edit","field":"plain","value":"Chacun des 128 neurones a un poids pour chacune des 784 entrées (784 × 128), plus un biais par neurone (+ 128)."},
{"id":"c2-17","action":"edit","field":"why","value":"Paramètres d'une Dense = entrées × neurones (poids) + neurones (biais) = 784 × 128 + 128 (= 100 480, à ne pas calculer à l'examen)."},
{"id":"c2-17","action":"edit","field":"whyNot","value":"784 × 128 oublie les 128 biais ; 784 + 128 additionne au lieu de relier chaque entrée à chaque neurone."},
{"id":"k2a-23","action":"edit","field":"q","value":"Dense(128) reçoit les 784 valeurs de Flatten. Quelle expression donne son nombre de paramètres ?"},
{"id":"k2a-23","action":"edit","field":"ok","value":"784 × 128 + 128"},
{"id":"k2a-23","action":"edit","field":"ko","value":["784 × 128","(784 + 1) × (128 + 1)"]},
{"id":"k2a-23","action":"edit","field":"plain","value":"Chaque neurone a un poids par entrée et un biais : 784 × 128 poids, plus 128 biais."},
{"id":"k2a-23","action":"edit","field":"why","value":"Règle de la leçon : entrées × neurones + neurones = 784 × 128 + 128 (= 100 480)."},
{"id":"k2a-23","action":"edit","field":"whyNot","value":"784 × 128 oublie les 128 biais ; (784 + 1) × (128 + 1) ajoute à tort un neurone de sortie supplémentaire."},
{"id":"c2-19","action":"edit","field":"q","value":"Un Flatten de 3 136 valeurs est suivi d'une Dense(64). Quelle expression donne son nombre de paramètres ?"},
{"id":"c2-19","action":"edit","field":"ok","value":"3 136 × 64 + 64"},
{"id":"c2-19","action":"edit","field":"ko","value":["3 136 × 64","3 136 + 64"]},
{"id":"c2-19","action":"edit","field":"plain","value":"Même règle que pour toute couche Dense : nombre d'entrées × nombre de neurones (les poids), plus un biais par neurone."},
{"id":"c2-19","action":"edit","field":"why","value":"3 136 × 64 poids + 64 biais (= 200 768)."},
{"id":"c2-19","action":"edit","field":"whyNot","value":"3 136 × 64 oublie les 64 biais ; 3 136 + 64 est une addition."},
{"id":"k2b-17","action":"edit","field":"q","value":"Le vecteur Flatten de 400 valeurs entre dans une Dense(512). Quelle expression donne le nombre de paramètres de cette couche ?"},
{"id":"k2b-17","action":"edit","field":"ok","value":"400 × 512 + 512"},
{"id":"k2b-17","action":"edit","field":"ko","value":["400 × 512","400 + 512"]},
{"id":"k2b-17","action":"edit","field":"plain","value":"Chacun des 512 neurones a un poids pour chacune des 400 entrées, plus un petit réglage à lui (le biais) : 400 × 512 + 512."},
{"id":"k2b-17","action":"edit","field":"why","value":"Leçon : Dense = entrées × neurones + neurones (un biais par neurone) : 400 × 512 + 512 (= 205 312)."},
{"id":"k2b-17","action":"edit","field":"whyNot","value":"400 × 512 oublie les 512 biais ; 400 + 512 additionne entrées et neurones au lieu de les multiplier."},
{"id":"c2-46","action":"edit","field":"q","value":"Conv2D(50, (3,3)) appliquée à un tenseur de 75 canaux : quelle expression donne son nombre de paramètres ?"},
{"id":"c2-46","action":"edit","field":"ok","value":"(3 × 3 × 75 + 1) × 50"},
{"id":"c2-46","action":"edit","field":"ko","value":["3 × 3 × 75 × 50","(3 × 3 + 1) × 50"]},
{"id":"c2-46","action":"edit","field":"plain","value":"Chaque filtre regarde 3 × 3 cases sur les 75 canaux à la fois, plus 1 biais ; et il y a 50 filtres."},
{"id":"c2-46","action":"edit","field":"why","value":"Par filtre : 3 × 3 × 75 poids + 1 biais ; avec 50 filtres : (3 × 3 × 75 + 1) × 50 (= 33 800)."},
{"id":"c2-46","action":"edit","field":"whyNot","value":"3 × 3 × 75 × 50 oublie le biais de chaque filtre ; (3 × 3 + 1) × 50 ignore les 75 canaux d'entrée."},
{"id":"c2-47","action":"edit","field":"q","value":"Image 28×28×1 → Conv2D(32, 3×3, same) → MaxPool 2×2 → Conv2D(64, 3×3, same) → MaxPool 2×2 → Flatten. Quelle expression donne la taille du vecteur ?"},
{"id":"c2-47","action":"edit","field":"ok","value":"7 × 7 × 64"},
{"id":"c2-47","action":"edit","field":"ko","value":["14 × 14 × 64","28 × 28 × 64"]},
{"id":"c2-47","action":"edit","field":"plain","value":"Les convolutions 'same' gardent la taille ; chaque MaxPool 2×2 la divise par 2 : 28 → 14 → 7. Il reste un bloc 7 × 7 avec 64 canaux, mis à plat."},
{"id":"c2-47","action":"edit","field":"why","value":"28 → 14 → 7 ; le dernier Conv2D a 64 filtres, donc 64 canaux : 7 × 7 × 64 valeurs (= 3 136)."},
{"id":"c2-47","action":"edit","field":"whyNot","value":"14 × 14 × 64 oublie le second pooling ; 28 × 28 × 64 oublie les deux poolings."},
{"id":"c2-31","action":"edit","field":"q","value":"6 400 images, batch_size = 32, epochs = 10. Combien de mises à jour de poids ?"},
{"id":"c2-31","action":"edit","field":"ok","value":"2 000"},
{"id":"c2-31","action":"edit","field":"ko","value":["64 000","200"]},
{"id":"c2-31","action":"edit","field":"plain","value":"Les 6 400 images sont découpées en paquets de 32, soit 200 paquets ; chaque paquet donne une correction des poids. Sur 10 passages complets (epochs) : 200 × 10 = 2 000."},
{"id":"c2-31","action":"edit","field":"why","value":"6 400 / 32 = 200 itérations par epoch × 10 epochs = 2 000 mises à jour."},
{"id":"c2-31","action":"edit","field":"whyNot","value":"64 000 compterait une mise à jour par image (6 400 × 10) ; 200 ne compte qu'une seule epoch."},
{"id":"k4-20","action":"edit","field":"ctx","value":"Après mise à l'échelle, x_train est un tableau de 1 600 lignes (jours) × 21 features, à découper en séquences de 16 jours."},
{"id":"k4-20","action":"edit","field":"ok","value":"(100, 16, 21)"},
{"id":"k4-20","action":"edit","field":"ko","value":["(1600, 16, 21)","(16, 100, 21)"]},
{"id":"k4-20","action":"edit","field":"plain","value":"On range les 1 600 jours en paquets de 16 : 1 600 / 16 = 100 séquences. Chaque séquence garde ses 16 jours et ses 21 features."},
{"id":"k4-20","action":"edit","field":"why","value":"Leçon : format 3D (nombre de séquences, longueur de séquence, nombre de features) attendu par LSTM et Conv1D ; 1 600 / 16 = 100 séquences."},
{"id":"k4-20","action":"edit","field":"whyNot","value":"1 600 séquences demanderaient 16 fois plus de lignes ; l'axe des séquences vient en premier, pas la longueur."}
]
```

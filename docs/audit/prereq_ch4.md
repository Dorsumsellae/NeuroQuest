# Audit prérequis : bloc ch4 (détection d'anomalies, séquences)

Périmètre : 44 épreuves de `content/ch4.js` (c4-01 à c4-44) et 33 de `content/camp_ch4.js` (k4-01 à k4-33), soit 77 épreuves.
Sources : micro-leçons ano.* et notions précédentes (reg.*, nn.*, cnn.*, ae.*), glossaire (84 termes), ctx, et le cours `IA-Hexagone-4.Pratique-Autoencodeurs.pdf` (slides 1 à 20).

## Manques constatés

| id | Manque constaté | Correctif choisi |
|---|---|---|
| c4-01, k4-01 | La leçon ano.dataset ne dit pas que les données sont des **séries temporelles** dont l'ordre (l'évolution) compte. C'est pourtant ce qui sépare ok des ko (« l'ordre n'apporte rien », « image »). ano.dataset est la première notion du chapitre. | Leçon ano.dataset, p : ajout d'une phrase (slide 4 : « Les données sont stockées de manière journalière (séries temporelles) »). |
| c4-25 | La réponse (quantile des erreurs sur des données normales, point de la ROC au rappel visé) n'est ni dans le cours PDF ni dans les leçons. La ROC n'est vue qu'à la notion suivante. | Remplacement (même id, type choix, notion ano.seuil) par une question sur un point déjà enseigné : pourquoi `sort_mse[num_normal_disks]` n'est qu'un point de départ. |
| c4-36 | ModelCheckpoint, save_best_only et load_weights n'apparaissent dans aucune leçon, ni dans le glossaire, ni dans le cours PDF. | Remplacement (même id, type choix, notion nn.validation) : lire des courbes loss / val_loss d'un AE (sur-apprentissage). Le contenu vient de la leçon nn.validation, avec les courbes train/test du slide 16. |
| k4-33 | La leçon ano.transformers ne dit pas qu'avec un encodeur/décodeur transformer, l'anomalie se repère toujours par l'erreur de reconstruction. L'élève doit le déduire de ae.anomalie. | Leçon ano.transformers, p : ajout d'une phrase (slide 20 : pour la détection non supervisée, les encodeurs/décodeurs « peuvent être conçus de différentes manières » ; slides 9-10 : erreur de reconstruction). |

## Épreuves jugées OK

73 épreuves sur 77 sont jugées OK sans correctif. Pour chacune, les leçons, le glossaire et le ctx suffisent pour trancher.
- ch4 : 42 sur 44 (toutes sauf c4-25 et c4-36). c4-01 sera aussi couverte une fois la leçon ano.dataset complétée.
- camp_ch4 : 31 sur 33 (toutes sauf k4-01 et k4-33, couvertes par les deux ajouts aux leçons).

Points vérifiés de près et jugés suffisants :
- c4-17 : la réponse se trouve par élimination. Le glossaire dit qu'un filtre est une « grille de poids appris », et la leçon ano.conv1d_vs_lstm décrit un goulot.
- c4-34 : le tip de ano.conv1d_vs_lstm dit que « l'accuracy n'a pas de sens ».
- k4-03 : le raisonnement se fait directement depuis le ctx (rappel nul).
- k4-08 : la porte se reconnaît à son nom (leçon ano.lstm).
- k4-29 et c4-31 : un learning rate trop grand fait diverger la loss (leçons reg.eta et nn.epoch_lr).

## Correctifs

```json
[
{"action":"lesson","lesson":"ano.dataset","field":"p","op":"append","value":"Les relevés sont stockés jour après jour : ce sont des séries temporelles, et c'est l'évolution d'un même disque dans le temps qui compte."},
{"action":"lesson","lesson":"ano.transformers","field":"p","op":"append","value":"Quelle que soit la brique choisie (convolutions, LSTM ou transformers), on reste un autoencodeur : l'anomalie se repère toujours par une grande erreur de reconstruction."},
{"action":"replace","id":"c4-25","value":{"id":"c4-25","type":"choix","ch":4,"notions":["ano.seuil"],"diff":3,"q":"Pourquoi la règle threshold = sort_mse[num_normal_disks] n'est-elle qu'un point de départ ?","ok":"Elle suppose de connaître le nombre de disques normaux du test, ce qu'on ignore en production","ko":["Elle classe forcément toutes les séquences de test comme normales","Elle ne fonctionne qu'avec la MAE et pas avec la MSE"],"plain":"La règle place la barre juste après les N plus petites erreurs, N étant le nombre de disques sains. En vrai, on ne sait pas d'avance combien de disques vont bien : il faut donc ensuite ajuster ce seuil.","why":"Leçon ano.seuil : le lab trie les erreurs et prend sort_mse[num_normal_disks] ; « c'est un point de départ, car on ne connaît pas N en vrai ». Le seuil reste un choix métier (rappel contre faux positifs).","whyNot":"Les erreurs placées après l'indice N dépassent le seuil et deviennent des anomalies : tout n'est pas classé normal. La règle porte sur des erreurs triées, quelle que soit la façon de les calculer (MAE ou MSE)."}},
{"action":"replace","id":"c4-36","value":{"id":"c4-36","type":"choix","ch":4,"notions":["nn.validation"],"diff":2,"ctx":"autoencoder.fit(x_train, x_train, epochs=20, validation_split=0.1). Loss du train au fil des epochs : 0.30 → 0.20 → 0.15. val_loss : 0.32 → 0.25 → 0.35.","q":"Que montre l'évolution de la val_loss ?","ok":"Un début de sur-apprentissage : l'autoencodeur mémorise les séquences du train","ko":["Le modèle généralise de mieux en mieux, puisque la loss du train baisse","Les données de validation servent à corriger les poids, d'où la remontée"],"plain":"La loss du train continue de baisser, mais celle de la validation remonte : le modèle apprend par cœur ses exemples au lieu de bien reconstruire des séquences qu'il n'a jamais vues.","why":"Leçon nn.validation : une loss de train qui baisse et une loss de validation qui remonte signalent un sur-apprentissage. validation_split=0.1 met 10 % des séquences de côté pour calculer la val_loss. Slide 16 : on compare les courbes de loss du train et du test au fil des epochs.","whyNot":"La baisse de la loss du train ne prouve pas que le modèle généralise : c'est la validation qui le vérifie. Les données de validation ne corrigent pas les poids, elles servent seulement à mesurer."}}
]
```

# Audit prérequis — bloc ch2a (neurones, MLP, Keras, code)

Périmètre : 57 épreuves de `content/camp_ch2a.js` (k2a-01 à k2a-57) + 47 épreuves de `content/ch2.js` portant au moins une notion du bloc (c2-01 à c2-35, c2-58, c2-59, c2-61 à c2-67, c2-69 à c2-71 ; les épreuves mixtes c2-19, c2-35, c2-63, c2-64 sont incluses). Total : **104 épreuves vérifiées**.

Référence : micro-leçons (`node tools/dump_lessons.js`), notions précédentes dans l'ordre de `notions.js`, glossaire (84 termes), ctx, et `Cours/IA-Hexagone-2.DeepLearning.pdf`.

## Résultat

- **101 épreuves OK** : la leçon de la notion (ou une leçon précédente, ou le glossaire) contient tout ce qu'il faut pour départager ok et ko.
- **3 manques**, corrigés en complétant 3 micro-leçons (aucune question modifiée).

| id | Manque constaté | Correctif choisi |
|---|---|---|
| c2-07 | La correspondance biologique « forces synaptiques = poids wᵢ » (avec dendrites = entrées, axone = sortie) n'est dans aucune leçon. La leçon nn.poids_signe parle seulement de « force d'une connexion », ce qui ne permet pas d'écarter les ko « dendrites » et « axone ». | Leçon nn.neurone, p (append) : une phrase qui reprend la correspondance du slide 4 (« le neurone de McCulloch et Pitts » : dendrites = entrées xᵢ, forces synaptiques = poids wᵢ, axone = sortie y). Le nom McCulloch et Pitts, utilisé par k2a-07 et c2-06, est aussi rattaché ainsi au neurone formel. |
| k2a-47 | Le préfixe `val_` (val_accuracy, val_loss) n'est expliqué nulle part : l'élève doit deviner que val_accuracy se mesure sur la validation. | Leçon nn.validation, p (set) : la phrase [3] précise que Keras affiche les mesures de validation avec le préfixe val_ (val_loss, val_accuracy). C'est la légende de la courbe du slide 37 (accuracy / val_accuracy). |
| k2a-55 | Aucune leçon ne dit qu'un code faux peut quand même s'exécuter sans erreur. Or c'est justement la réponse attendue (le ko dit « Keras refuse d'exécuter un modèle incohérent »). | Leçon code.pieges, p (append) : « Ces erreurs ne font pas forcément planter le code : il s'exécute, mais le modèle apprend mal ou prédit faux. » Le PDF ne le dit pas mot pour mot. La phrase généralise ce que le cours montre déjà : un test non normalisé fausse les prédictions sans erreur (slide 16, Intro slide 11). Le même exemple figure déjà dans la leçon nn.normalisation. |

### Points vérifiés et jugés OK (rappels utiles)

- k2a-07 / c2-06 (« neurone de McCulloch et Pitts ») : on peut répondre sans connaître le nom, car une seule formule est correcte. Le correctif de c2-07 relie quand même ce nom au neurone formel.
- c2-11 : les trois choix donnent y = 1, donc seul le calcul de a départage. C'est du calcul mental : 0.2 − 1.0 + 1.2 − 0.3 = 0.1.
- c2-58 : la leçon ne dit pas que tanh(0) = 0. On trouve quand même l'association par élimination : sigmoïde entre 0 et 1, tanh entre −1 et 1.
- c2-63 / c2-64 (épreuves mixtes cnn.tenseur) : le reshape (1, 28, 28, 1) est dans l'exemple de nn.train_infer, et le format (N, 28, 28, 1) dans code.pieges p[1].
- c2-31 : le ctx précise déjà qu'il y a une mise à jour par batch, et la leçon nn.epoch_lr donne la règle.
- c2-35 : les remèdes au sur-apprentissage (dropout, augmentation de données, moins d'epochs) sont dans le tip de nn.validation. Le slide 33 présente le Dropout ; le lien avec le sur-apprentissage est un complément au PDF, déjà signalé dans le why.

## Sources PDF (IA-Hexagone-2.DeepLearning.pdf)

- Slide 4 : « Formalisation : le neurone de McCulloch et Pitts » ; Dendrites : entrées xᵢ ; Forces synaptiques : poids wᵢ ; Axone : sortie y ; Seuil d'activation θ.
- Slide 37 : « L'ensemble de validation sert à vérifier que le modèle généralise bien à chaque epoch », courbes « accuracy » et « val_accuracy » par epoch.
- Slide 16 + Intro slide 11 : normalisation /255 sur le train et sur le test ; à l'inférence, il faut un « format semblable aux données de l'entraînement ».

## Correctifs

```json
[
  {"action":"lesson","lesson":"nn.neurone","field":"p","op":"append","value":"Dans le neurone formel de McCulloch et Pitts, chaque variable a son modèle biologique : les dendrites sont les entrées xᵢ, les forces synaptiques sont les poids wᵢ, l'axone est la sortie y."},
  {"action":"lesson","lesson":"nn.validation","field":"p","op":"set","value":["Un modèle peut réciter parfaitement ses exemples d'entraînement sans savoir traiter de nouvelles images : c'est le sur-apprentissage.","Pour le repérer, on garde de côté des données qui ne servent pas à corriger les poids : l'ensemble de validation.","À chaque epoch, on mesure la loss et l'accuracy sur ces données pour vérifier que le modèle généralise.","En Keras : model.fit(x, y, epochs=10, validation_split=0.1) ou validation_data=(x_val, y_val) ; les mesures faites sur la validation s'affichent avec le préfixe val_ (val_loss, val_accuracy), à côté de loss et accuracy pour l'entraînement."]},
  {"action":"lesson","lesson":"code.pieges","field":"p","op":"append","value":"Ces erreurs ne font pas forcément planter le code : il s'exécute, mais le modèle apprend mal ou prédit faux."}
]
```

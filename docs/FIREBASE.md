# Activer le classement partagé avec Firebase (gratuit)

Le jeu écrit toujours les scores en local. Quand `js/firebase-config.js` contient une configuration, il envoie aussi chaque score dans une base Firestore et affiche le classement commun à tous les joueurs. L'offre gratuite Spark suffit largement pour une promo (50 000 lectures et 20 000 écritures par jour) et ne demande pas de carte bancaire.

## 1. Créer le projet (5 minutes)

1. Aller sur https://console.firebase.google.com et se connecter avec un compte Google.
2. **Ajouter un projet**, nom `neuroquest` (ou autre), désactiver Google Analytics, créer.
3. Dans le menu de gauche : **Build → Firestore Database → Créer une base de données**. Choisir un emplacement européen (`eur3`), démarrer en **mode production** (on écrit les règles juste après).
4. Dans **Paramètres du projet** (roue dentée) → **Vos applications** → icône **Web** `</>`. Nom `neuroquest-web`, ne pas cocher Hosting, enregistrer. Copier l'objet `firebaseConfig` affiché.

## 2. Coller la configuration

Ouvrir `js/firebase-config.js` et remplacer `null` par l'objet copié :

```js
window.NQ_FIREBASE_CONFIG = {
  apiKey: "AIza…",
  authDomain: "<projet>.firebaseapp.com",
  projectId: "<projet>",
  storageBucket: "<projet>.firebasestorage.app",
  messagingSenderId: "…",
  appId: "…"
};
```

(Le projet actuel du jeu est `neuroquest-9e856` ; sa configuration réelle est dans `js/firebase-config.js`.)

### Si le classement reste « injoignable »

Ouvrir la console du navigateur (F12). Le message « Cloud Firestore API has not been used in project … or it is disabled » signifie que la base n'a pas été créée : refaire l'étape 3 (Build → Firestore Database → Créer une base de données). Le message « Missing or insufficient permissions » signifie que les règles de l'étape 3 ne sont pas publiées. Le message « The query requires an index » renvoie à l'étape 4.

Cette configuration peut être publiée sans risque : elle identifie le projet, elle ne donne aucun droit. Ce sont les règles ci-dessous qui protègent la base.

## 3. Règles Firestore

Dans **Firestore Database → Règles**, remplacer tout par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{id} {
      // Tout le monde peut lire le classement
      allow read: if true;
      // On ne peut qu'ajouter un score, jamais le modifier ni le supprimer,
      // avec des champs contrôlés (nom court, score entier raisonnable)
      allow create: if request.resource.data.keys().hasOnly(['name', 'score', 'difficulty', 'chapter', 'date', 'ts'])
        && request.resource.data.name is string && request.resource.data.name.size() <= 20
        && request.resource.data.score is int && request.resource.data.score >= 0 && request.resource.data.score <= 100000
        && request.resource.data.difficulty in ['decouverte', 'facile', 'normal', 'expert']
        && request.resource.data.chapter is int && request.resource.data.chapter >= 0 && request.resource.data.chapter <= 4;
      allow update, delete: if false;
    }
  }
}
```

Publier les règles.

## 4. Index

La première ouverture du classement avec un filtre de difficulté affichera dans la console du navigateur un lien « The query requires an index » : cliquer dessus, Firebase crée l'index composite (`difficulty` croissant, `score` décroissant) en une minute. On peut aussi le créer à la main dans **Firestore → Index**.

## 5. Vérifier

Ouvrir le jeu, jouer une partie, puis **Classement** : les scores viennent de Firestore (le titre indique « partagé »). Si Firebase est injoignable (hors ligne), le jeu affiche le classement local et le signale.

## Limites et bon sens

- Les noms de joueurs sont libres : convenir d'un pseudo par personne.
- Pas d'authentification : n'importe qui ayant le lien peut ajouter un score. Les règles bornent les valeurs, pas la bonne foi.
- Pour effacer un score, utiliser la console Firestore.

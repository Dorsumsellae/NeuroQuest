// Configuration du classement partagé (Firebase, offre gratuite Spark).
// Laisser null pour un classement local uniquement (le jeu fonctionne hors ligne).
// Pour activer le partage : suivre docs/FIREBASE.md puis coller ici l'objet "firebaseConfig"
// fourni par la console Firebase, par exemple :
// window.NQ_FIREBASE_CONFIG = {
//   apiKey: "…", authDomain: "neuroquest-xxxx.firebaseapp.com", projectId: "neuroquest-xxxx",
//   storageBucket: "neuroquest-xxxx.appspot.com", messagingSenderId: "…", appId: "…"
// };
// Cette configuration n'est pas un secret : la protection vient des règles Firestore (voir le guide).
window.NQ_FIREBASE_CONFIG = null;

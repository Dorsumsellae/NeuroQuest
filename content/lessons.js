// Micro-leçons : affichées la première fois qu'une notion apparaît en partie (hors boss).
// Clé = id de notion. title = titre parlant, p = 3 à 5 phrases simples, ex = exemple concret,
// svg = nom d'un schéma défini dans js/ui_lesson.js (optionnel), tip = phrase à retenir.
window.NQ = window.NQ || {};
window.NQ.lessons = {
"reg.modele": {
  "title": "Prédire avec une droite",
  "p": [
    "Une régression linéaire, c'est une machine à deviner un nombre à partir d'autres nombres.",
    "Elle prend chaque entrée, la multiplie par un poids, additionne le tout et ajoute un biais : c'est la formule ŷ = θ₀ + θ₁x₁ + … + θₙxₙ.",
    "Pour écrire ça en une seule multiplication de vecteurs (θᵀX), on ajoute une entrée fictive x₀ qui vaut toujours 1 : le biais devient un poids comme les autres.",
    "Apprendre, c'est trouver les valeurs des poids θ qui donnent les prédictions les plus proches des vraies valeurs."
  ],
  "ex": "Prix d'une maison ≈ 50 000 + 2 000 × surface − 500 × distance au centre. Ici θ₀ = 50 000 est le biais, 2 000 et −500 sont les poids.",
  "svg": "droite",
  "tip": "x₀ = 1 n'est pas une donnée : c'est une astuce pour ranger le biais dans le vecteur θ."
},
"nn.neurone": {
  "title": "Le neurone artificiel",
  "p": [
    "Un neurone artificiel imite très grossièrement un neurone biologique : des entrées, une somme, une sortie.",
    "Chaque entrée xᵢ est multipliée par un poids wᵢ (la force de la connexion), on additionne, et on retranche un seuil θ : a = Σ xᵢwᵢ − θ (attention : ici θ est le seuil, pas le vecteur de paramètres de la régression).",
    "Le résultat passe dans une fonction d'activation f : un échelon (0 ou 1) ou une sigmoïde dans la version historique, le plus souvent une ReLU aujourd'hui.",
    "Un poids positif pousse le neurone à s'activer (excitation), un poids négatif le freine (inhibition)."
  ],
  "ex": "Entrées (2, 4, 1), poids (0.5, 0.2, 0.3), seuil 0.1 : a = 1 + 0.8 + 0.3 − 0.1 = 2.0. Avec un échelon la sortie vaut 1 ; avec une sigmoïde, environ 0.88.",
  "svg": "neurone",
  "tip": "Un neurone sans fonction d'activation, c'est exactement une régression linéaire."
},
"ae.principe": {
  "title": "L'autoencodeur, une machine à compresser puis reconstruire",
  "p": [
    "Un autoencodeur est un réseau qui apprend à recopier son entrée… en passant par un goulot très étroit.",
    "L'encodeur réduit l'image (ou la série de mesures) en un petit vecteur : le code, aussi appelé espace latent.",
    "Le décodeur fait le chemin inverse et tente de reconstruire l'entrée à partir de ce code.",
    "Comme le code est petit, le réseau est obligé de ne garder que l'essentiel : c'est ce qui le rend utile pour compresser, débruiter ou repérer ce qui sort de l'ordinaire."
  ],
  "ex": "Une image 28×28 = 784 nombres entre, 32 nombres au milieu, 784 nombres ressortent. Si la sortie ressemble à l'entrée, le code a capturé l'important.",
  "svg": "sablier",
  "tip": "Pas besoin d'étiquettes : la cible, c'est l'entrée elle-même. C'est un apprentissage non supervisé."
}
};

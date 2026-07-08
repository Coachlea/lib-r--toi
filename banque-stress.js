// ============================================================================
// BANQUE STRUCTURANTE — CATÉGORIE STRESS
// Référence d'implémentation. Les autres catégories (anxiete, colere,
// blocage_innomme, tabac, alcool, grignotage_alimentaire, autre_addiction,
// reseaux_sociaux, series_streaming, jeux_video, ecrans_general,
// procrastination_pure, perfectionnisme, motivation, estime_de_soi,
// regard_des_autres, voix_interieure, relations_toxiques,
// dependance_affective, schemas_repetitifs) doivent être écrites avec la
// même logique d'investigation propre à leur mécanisme — PAS par
// remplacement lexical. Voir cahier des charges section 7.
// ============================================================================

var BANQUE_STRUCTURANTE_STRESS = {
  // SEMAINE 1 — CARTOGRAPHIER (le stress spécifiquement : charge, contrôle, anticipation)
  1: [
    { id: "stress_s1_01", dimension: "situations", personnalisable: false,
      texte: "Décris une situation récente où le stress est monté fort. Qu'est-ce qui s'est passé, précisément ?" },
    { id: "stress_s1_02", dimension: "sensations_corporelles", personnalisable: false,
      texte: "Quand ce stress est monté, qu'est-ce qui se passait concrètement dans ton corps ?" },
    { id: "stress_s1_03", dimension: "pensees_automatiques", personnalisable: false,
      texte: "Quelle pensée précise tournait en boucle à ce moment-là ?" },
    { id: "stress_s1_04", dimension: "emotions", personnalisable: false,
      texte: "Sous ce stress, quelle émotion plus précise pouvais-tu identifier — peur, colère, tristesse, autre chose ?" },
    { id: "stress_s1_05", dimension: "comportements", personnalisable: false,
      texte: "Qu'est-ce que tu as fait concrètement quand ce stress est monté ? Décris l'action, pas l'intention." },
    { id: "stress_s1_06", dimension: "consequences", personnalisable: true,
      texte: "Qu'est-ce que ce stress a changé dans ta soirée, ta nuit ou ta journée qui a suivi ?" },
    { id: "stress_s1_07", dimension: "situations", personnalisable: false,
      texte: "Dans quels contextes ce genre de stress revient-il le plus souvent — travail, famille, argent, santé, autre ?" }
  ],

  // SEMAINE 2 — DÉCLENCHEURS spécifiques au stress (charge, ambiguïté, contrôle, imprévu)
  2: [
    { id: "stress_s2_01", dimension: "declencheurs", personnalisable: false,
      texte: "Est-ce que c'est plutôt la quantité de choses à gérer, ou le fait de ne pas savoir précisément ce qu'on attend de toi, qui te stresse le plus ?" },
    { id: "stress_s2_02", dimension: "declencheurs", personnalisable: false,
      texte: "Un imprévu de dernière minute — un changement de plan, une urgence — te stresse-t-il plus qu'une charge de travail importante mais prévisible ?" },
    { id: "stress_s2_03", dimension: "personnes_importantes", personnalisable: false,
      texte: "Y a-t-il une personne précise dont les messages ou les demandes font monter ton stress plus vite que les autres ?" },
    { id: "stress_s2_04", dimension: "declencheurs", personnalisable: true,
      texte: "Est-ce que le manque d'information claire sur une situation te stresse plus que la situation elle-même ?" },
    { id: "stress_s2_05", dimension: "declencheurs", personnalisable: false,
      texte: "Le stress monte-t-il plus fort quand tu sens que tu n'as pas le contrôle sur ce qui va se passer ?" },
    { id: "stress_s2_06", dimension: "declencheurs", personnalisable: false,
      texte: "Y a-t-il un moment de la journée ou de la semaine où ce stress apparaît presque systématiquement ?" }
  ],

  // SEMAINE 3 — BOUCLE AUTOMATIQUE (déclencheur → sensation → pensée → émotion → comportement → conséquence)
  3: [
    { id: "stress_s3_01", dimension: "comportements", personnalisable: true,
      texte: "Entre la pensée qui déclenche le stress et le moment où tu passes à l'action (vérifier, contrôler, t'agiter), qu'est-ce qui se passe juste avant ?" },
    { id: "stress_s3_02", dimension: "consequences", personnalisable: false,
      texte: "Une fois que tu as fait cette action (vérifier, contrôler, anticiper), est-ce que le stress redescend vraiment, ou seulement quelques minutes ?" },
    { id: "stress_s3_03", dimension: "emotions", personnalisable: false,
      texte: "Après avoir cédé à cette réaction automatique, ressens-tu de la culpabilité, du soulagement, ou autre chose ?" },
    { id: "stress_s3_04", dimension: "comportements", personnalisable: false,
      texte: "Est-ce que cette même séquence se répète plusieurs fois dans la même journée, ou plutôt une fois puis ça s'arrête ?" },
    { id: "stress_s3_05", dimension: "pensees_automatiques", personnalisable: false,
      texte: "Juste avant que le stress ne retombe (ou reparte), quelle pensée apparaît en dernier ?" }
  ],

  // SEMAINE 4 — ORIGINE ET FONCTION (prudence maximale, jamais de causalité imposée)
  4: [
    { id: "stress_s4_01", dimension: "besoins", personnalisable: false,
      texte: "Ce besoin de tout anticiper ou de tout contrôler, te souviens-tu d'un moment de ta vie où il est devenu plus fort ?" },
    { id: "stress_s4_02", dimension: "fonctions_protection", personnalisable: true,
      texte: "Est-ce que ce stress (ou la façon dont tu y réagis) semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" },
    { id: "stress_s4_03", dimension: "besoins", personnalisable: false,
      texte: "As-tu déjà vécu une période où l'imprévisibilité (au travail, en famille) a mis beaucoup de tension autour de toi ?" },
    { id: "stress_s4_04", dimension: "fonctions_protection", personnalisable: false,
      texte: "Qu'est-ce que tu redoutes le plus si tu arrêtais complètement d'anticiper et de contrôler ?" }
  ],

  // SEMAINE 5 — TEST DANS LA VIE RÉELLE (surtout génération IA basée sur hypothèses, fallback minimal)
  5: [
    { id: "stress_s5_fallback_01", dimension: "declencheurs", personnalisable: true,
      texte: "Cette semaine, est-ce qu'une situation proche de celle dont on a parlé s'est reproduite ? Raconte-moi précisément ce qui s'est passé." }
  ],

  // SEMAINE 6 — LEVIERS (surtout génération IA, fallback minimal)
  6: [
    { id: "stress_s6_fallback_01", dimension: "consequences", personnalisable: true,
      texte: "Cette semaine, y a-t-il eu un moment où le stress est monté mais est redescendu plus vite que d'habitude ? Qu'est-ce qui était différent ?" }
  ],

  // SEMAINE 7 — PROTOCOLE (co-construction, surtout génération IA)
  7: [
    { id: "stress_s7_fallback_01", dimension: "comportements", personnalisable: true,
      texte: "Si tu devais résumer en une phrase ce qui t'aide vraiment quand le stress commence à monter, ce serait quoi ?" }
  ],

  // SEMAINE 8 — RESTITUTION COMPARATIVE (surtout génération IA avec extrait jour 1)
  8: [
    { id: "stress_s8_fallback_01", dimension: "consequences", personnalisable: true,
      texte: "Par rapport au tout début du programme, qu'est-ce qui te semble différent dans ta façon de vivre le stress aujourd'hui ?" }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { BANQUE_STRUCTURANTE_STRESS: BANQUE_STRUCTURANTE_STRESS };
}

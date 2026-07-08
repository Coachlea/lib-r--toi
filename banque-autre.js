// ============================================================================
// BANQUES STRUCTURANTES — AUTRE (anxiete, colere, blocage_innomme — stress dans banque-stress.js)
// - anxiete : anticipation diffuse, peur du futur, rumination — distinct du stress
//   (le stress réagit à une charge/situation présente ; l'anxiété anticipe un futur incertain)
// - colere : injustice ressentie, limites non posées, frustration retournée ou explosée
// - blocage_innomme : investigation ouverte, sans mécanisme présupposé, la personne
//   ne sait pas encore nommer son problème — les questions restent volontairement larges
// ============================================================================

var BANQUE_STRUCTURANTE_ANXIETE = {
  1: [
    { id: "anxiete_s1_01", dimension: "situations", personnalisable: false, texte: "Décris un moment récent où l'anxiété est montée en pensant à quelque chose qui n'était pas encore arrivé." },
    { id: "anxiete_s1_02", dimension: "sensations_corporelles", personnalisable: false, texte: "Qu'est-ce qui se passe dans ton corps quand cette anticipation anxieuse démarre ?" },
    { id: "anxiete_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quel scénario précis ton esprit imagine-t-il le plus souvent dans ces moments-là ?" },
    { id: "anxiete_s1_04", dimension: "emotions", personnalisable: false, texte: "Quelle émotion précède ou accompagne cette anticipation — peur, malaise diffus, autre ?" },
    { id: "anxiete_s1_05", dimension: "comportements", personnalisable: false, texte: "Qu'est-ce que tu fais concrètement pour essayer de calmer cette anxiété — vérifier, éviter, en parler, autre ?" },
    { id: "anxiete_s1_06", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que cette anxiété t'empêche de faire ou de vivre pleinement en ce moment ?" }
  ],
  2: [
    { id: "anxiete_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Cette anxiété est-elle liée à un sujet précis (santé, avenir, relations, travail) ou plutôt diffuse et générale ?" },
    { id: "anxiete_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un moment de la journée (souvent le soir, ou au réveil) où cette anticipation anxieuse est la plus forte ?" },
    { id: "anxiete_s2_03", dimension: "personnes_importantes", personnalisable: false, texte: "Cette anxiété concerne-t-elle souvent des personnes précises dans ta vie (leur sécurité, leur jugement, autre) ?" }
  ],
  3: [
    { id: "anxiete_s3_01", dimension: "comportements", personnalisable: true, texte: "Une fois que l'anxiété est montée, est-ce que ruminer ou vérifier la fait vraiment diminuer, ou seulement un court moment ?" },
    { id: "anxiete_s3_02", dimension: "consequences", personnalisable: false, texte: "Le scénario redouté se réalise-t-il souvent, ou l'anxiété anticipe-t-elle des choses qui n'arrivent finalement pas ?" }
  ],
  4: [
    { id: "anxiete_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand cette façon d'anticiper est-elle présente dans ta vie, si tu arrives à situer un moment ?" },
    { id: "anxiete_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce qu'anticiper ainsi semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "anxiete_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, cette anticipation anxieuse est-elle apparue dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "anxiete_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as réussi à ne pas anticiper le pire scénario ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "anxiete_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à calmer l'anticipation anxieuse, ce serait quoi ?" }],
  8: [{ id: "anxiete_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de vivre l'incertitude ?" }]
};

var BANQUE_STRUCTURANTE_COLERE = {
  1: [
    { id: "colere_s1_01", dimension: "situations", personnalisable: false, texte: "Décris la dernière fois que tu as ressenti une colère forte. Qu'est-ce qui s'est passé exactement ?" },
    { id: "colere_s1_02", dimension: "sensations_corporelles", personnalisable: false, texte: "Comment la colère se manifeste dans ton corps — chaleur, tension, autre chose ?" },
    { id: "colere_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée accompagne cette colère — 'ce n'est pas juste', 'on ne me respecte pas', autre ?" },
    { id: "colere_s1_04", dimension: "emotions", personnalisable: false, texte: "Est-ce qu'il y a parfois une autre émotion présente en même temps que la colère — tristesse, peur, autre chose — ou est-ce surtout la colère seule ?" },
    { id: "colere_s1_05", dimension: "comportements", personnalisable: false, texte: "Comment réagis-tu concrètement — tu l'exprimes, tu la ravales, tu t'isoles, autre chose ?" },
    { id: "colere_s1_06", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que cette colère te coûte, dans tes relations ou avec toi-même ?" }
  ],
  2: [
    { id: "colere_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce plutôt un sentiment d'injustice, un manque de respect ressenti, ou une limite non respectée qui déclenche le plus ta colère ?" },
    { id: "colere_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il une personne précise avec qui la colère monte plus vite qu'avec d'autres ?" },
    { id: "colere_s2_03", dimension: "personnes_importantes", personnalisable: false, texte: "Y a-t-il des personnes avec qui tu n'oses pas exprimer ta colère, quelle que soit la situation ?" }
  ],
  3: [
    { id: "colere_s3_01", dimension: "comportements", personnalisable: true, texte: "Entre le moment où la colère monte et le moment où tu réagis (ou te tais), qu'est-ce qui se passe ?" },
    { id: "colere_s3_02", dimension: "consequences", personnalisable: false, texte: "Après avoir exprimé ou ravalé ta colère, ressens-tu du soulagement, de la culpabilité, autre chose ?" }
  ],
  4: [
    { id: "colere_s4_01", dimension: "besoins", personnalisable: false, texte: "Est-ce que montrer ta colère a toujours été facile pour toi, ou est-ce que quelque chose t'a amenée à la retenir davantage à un moment de ta vie ?" },
    { id: "colere_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que cette colère (ou le fait de la retenir) semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "colere_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, ta colère est-elle apparue dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "colere_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as exprimé ta colère de façon plus posée que d'habitude ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "colere_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à exprimer ta colère sainement, ce serait quoi ?" }],
  8: [{ id: "colere_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de vivre et d'exprimer ta colère ?" }]
};

// blocage_innomme : la personne n'a pas encore de mot pour son problème. Les questions
// restent volontairement ouvertes — le rôle du moteur ici est justement de laisser émerger
// la catégorie réelle plutôt que d'en présupposer une (cf. pistes_transversales).
var BANQUE_STRUCTURANTE_BLOCAGE_INNOMME = {
  1: [
    { id: "blocage_s1_01", dimension: "situations", personnalisable: false, texte: "Décris ce qui te bloque dans ta vie en ce moment — le plus concrètement possible, même si c'est difficile à nommer." },
    { id: "blocage_s1_02", dimension: "sensations_corporelles", personnalisable: false, texte: "Comment ce blocage se manifeste-t-il dans ton corps quand tu y penses ?" },
    { id: "blocage_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée revient le plus souvent en lien avec ce blocage ?" },
    { id: "blocage_s1_04", dimension: "emotions", personnalisable: false, texte: "Quelle émotion domine quand tu penses à ce blocage ?" },
    { id: "blocage_s1_05", dimension: "comportements", personnalisable: false, texte: "Comment ce blocage se traduit-il dans tes actions au quotidien ?" },
    { id: "blocage_s1_06", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que ce blocage t'empêche de faire, d'être ou de ressentir ?" }
  ],
  2: [
    { id: "blocage_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Dans quels moments ou contextes précis ce blocage se manifeste-t-il le plus fort ?" },
    { id: "blocage_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il une situation, une personne, ou un contexte qui semble toujours réveiller ce blocage ?" }
  ],
  3: [
    { id: "blocage_s3_01", dimension: "comportements", personnalisable: true, texte: "Qu'est-ce que tu as déjà essayé pour avancer malgré ce blocage — et qu'est-ce qui a marché, même un peu ?" },
    { id: "blocage_s3_02", dimension: "consequences", personnalisable: false, texte: "Y a-t-il eu un moment récent où ce blocage était moins présent ? Qu'est-ce qui était différent ?" }
  ],
  4: [
    { id: "blocage_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand ressens-tu ce blocage — y a-t-il eu un événement qui a précédé son apparition ?" },
    { id: "blocage_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce blocage semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "blocage_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, ce blocage est-il apparu dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "blocage_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as avancé malgré le blocage ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "blocage_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à avancer malgré ce blocage, ce serait quoi ?" }],
  8: [{ id: "blocage_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta compréhension de ce blocage ?" }]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BANQUE_STRUCTURANTE_ANXIETE: BANQUE_STRUCTURANTE_ANXIETE,
    BANQUE_STRUCTURANTE_COLERE: BANQUE_STRUCTURANTE_COLERE,
    BANQUE_STRUCTURANTE_BLOCAGE_INNOMME: BANQUE_STRUCTURANTE_BLOCAGE_INNOMME
  };
}

// ============================================================================
// BANQUES STRUCTURANTES — CONFIANCE (estime_de_soi, regard_des_autres, voix_interieure)
// - estime_de_soi : valeur personnelle intrinsèque, sentiment de légitimité
// - regard_des_autres : comparaison sociale, peur du jugement, besoin d'approbation
// - voix_interieure : dialogue interne critique, autocritique, exigence envers soi
// ============================================================================

var BANQUE_STRUCTURANTE_ESTIME_DE_SOI = {
  1: [
    { id: "estime_s1_01", dimension: "situations", personnalisable: false, texte: "Décris un moment récent où tu as douté de ta propre valeur, peu importe le contexte." },
    { id: "estime_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée revient le plus souvent sur toi-même dans ces moments-là ?" },
    { id: "estime_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion accompagne ce doute sur toi-même ?" },
    { id: "estime_s1_04", dimension: "comportements", personnalisable: false, texte: "Comment ce doute se traduit-il dans tes actions — tu évites, tu te justifies, tu te dévalorises devant les autres, autre chose ?" },
    { id: "estime_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que ce manque de confiance t'empêche de faire ou d'oser dans ta vie ?" }
  ],
  2: [
    { id: "estime_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Ce doute sur ta valeur est-il plus fort dans un domaine précis (travail, relations, physique, autre) ou plutôt général ?" },
    { id: "estime_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il une situation particulière (recevoir un compliment, réussir quelque chose) où ce doute apparaît presque à contretemps ?" }
  ],
  3: [
    { id: "estime_s3_01", dimension: "comportements", personnalisable: true, texte: "Quand tu réussis quelque chose, comment réagis-tu intérieurement — tu minimises, tu doutes que ce soit mérité, autre chose ?" },
    { id: "estime_s3_02", dimension: "consequences", personnalisable: false, texte: "Ce doute t'empêche-t-il parfois de reconnaître une vraie réussite comme telle ?" }
  ],
  4: [
    { id: "estime_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de quand ce doute sur ta valeur est apparu la première fois dans ta vie ?" },
    { id: "estime_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce doute sur toi-même semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "estime_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, ce doute est-il apparu dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "estime_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as reconnu ta valeur plus facilement que d'habitude ? Qu'est-ce qui était différent ?" }],
  7: [{ id: "estime_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à reconnaître ta valeur, ce serait quoi ?" }],
  8: [{ id: "estime_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de te percevoir ?" }]
};

var BANQUE_STRUCTURANTE_REGARD_DES_AUTRES = {
  1: [
    { id: "regard_s1_01", dimension: "situations", personnalisable: false, texte: "Décris une situation récente où le regard ou le jugement possible des autres t'a bloquée." },
    { id: "regard_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît sur ce que les autres pourraient penser de toi dans ces moments-là ?" },
    { id: "regard_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion domine à l'idée d'être jugée ou mal perçue ?" },
    { id: "regard_s1_04", dimension: "comportements", personnalisable: false, texte: "Comment ajustes-tu ton comportement pour éviter un jugement possible ?" },
    { id: "regard_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que cette préoccupation du regard des autres t'empêche de faire ou de dire ?" }
  ],
  2: [
    { id: "regard_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Ce souci du regard des autres est-il plus fort avec des inconnus, avec des proches, ou dans les deux cas ?" },
    { id: "regard_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il une personne précise dont l'avis pèse plus que les autres dans ta façon d'agir ?" }
  ],
  3: [
    { id: "regard_s3_01", dimension: "comportements", personnalisable: true, texte: "Avant de dire ou de faire quelque chose, à quel point anticipes-tu la réaction des autres ?" },
    { id: "regard_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois que tu as agi malgré la peur du jugement, la réaction redoutée s'est-elle vraiment produite ?" }
  ],
  4: [
    { id: "regard_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu d'un moment de ta vie où le jugement des autres a compté particulièrement fort ?" },
    { id: "regard_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que cette vigilance au regard des autres semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "regard_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, ce souci du regard des autres est-il apparu dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "regard_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as agi sans trop te soucier du jugement possible ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "regard_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à te détacher du regard des autres, ce serait quoi ?" }],
  8: [{ id: "regard_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de gérer le regard des autres ?" }]
};

var BANQUE_STRUCTURANTE_VOIX_INTERIEURE = {
  1: [
    { id: "voix_s1_01", dimension: "situations", personnalisable: false, texte: "Décris un moment récent où ta voix intérieure a été particulièrement dure envers toi." },
    { id: "voix_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quels mots exacts utilise cette voix intérieure quand elle te critique ?" },
    { id: "voix_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion suit généralement ce dialogue intérieur critique ?" },
    { id: "voix_s1_04", dimension: "comportements", personnalisable: false, texte: "Comment réagis-tu concrètement face à cette voix — tu l'écoutes, tu essaies de la contredire, autre chose ?" },
    { id: "voix_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que cette voix intérieure critique t'empêche de faire ou de ressentir ?" }
  ],
  2: [
    { id: "voix_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Cette voix critique est-elle plus forte après un échec, avant une tentative, ou de façon presque continue ?" },
    { id: "voix_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un domaine précis (travail, apparence, relations) où cette voix est la plus sévère ?" }
  ],
  3: [
    { id: "voix_s3_01", dimension: "comportements", personnalisable: true, texte: "Est-ce que tu reconnais cette voix comme étant la tienne, ou as-tu l'impression qu'elle reprend les mots de quelqu'un d'autre ?" },
    { id: "voix_s3_02", dimension: "consequences", personnalisable: false, texte: "Cette voix t'a-t-elle déjà empêchée d'essayer quelque chose que tu avais envie de tenter ?" }
  ],
  4: [
    { id: "voix_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de qui parlait ainsi de toi, ou à toi, avant que cette voix ne devienne la tienne ?" },
    { id: "voix_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que cette voix sévère semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "voix_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, cette voix critique est-elle apparue dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "voix_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as réussi à répondre différemment à cette voix ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "voix_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à adoucir cette voix intérieure, ce serait quoi ?" }],
  8: [{ id: "voix_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ton dialogue intérieur ?" }]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BANQUE_STRUCTURANTE_ESTIME_DE_SOI: BANQUE_STRUCTURANTE_ESTIME_DE_SOI,
    BANQUE_STRUCTURANTE_REGARD_DES_AUTRES: BANQUE_STRUCTURANTE_REGARD_DES_AUTRES,
    BANQUE_STRUCTURANTE_VOIX_INTERIEURE: BANQUE_STRUCTURANTE_VOIX_INTERIEURE
  };
}

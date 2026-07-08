// ============================================================================
// BANQUES STRUCTURANTES — RELATIONS (relations_toxiques, dependance_affective, schemas_repetitifs)
// - relations_toxiques : dynamiques précises de nuisance dans une relation actuelle/récente
// - dependance_affective : peur de l'abandon, effacement de soi, besoin de l'autre pour se sentir bien
// - schemas_repetitifs : motif qui revient sur PLUSIEURS relations distinctes, pas une seule
// ============================================================================

var BANQUE_STRUCTURANTE_RELATIONS_TOXIQUES = {
  1: [
    { id: "reltox_s1_01", dimension: "situations", personnalisable: false, texte: "Décris une situation récente dans cette relation où tu t'es sentie mal après un échange." },
    { id: "reltox_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît après ce genre d'échange — 'c'est de ma faute', 'je devrais partir', 'ça va s'arranger', autre ?" },
    { id: "reltox_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion domine le plus souvent dans cette relation ?" },
    { id: "reltox_s1_04", dimension: "comportements", personnalisable: false, texte: "Comment réagis-tu concrètement face à ce genre de situation — tu t'excuses, tu te tais, tu réponds, autre chose ?" },
    { id: "reltox_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que cette relation te coûte aujourd'hui — énergie, confiance en toi, autre chose ?" }
  ],
  2: [
    { id: "reltox_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Y a-t-il un comportement précis de cette personne qui déclenche le plus souvent ce mal-être — critiques, silences, promesses non tenues, autre ?" },
    { id: "reltox_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Ce comportement est-il isolé, ou est-ce qu'il revient régulièrement selon un motif que tu commences à reconnaître ?" }
  ],
  3: [
    { id: "reltox_s3_01", dimension: "comportements", personnalisable: true, texte: "Après un moment difficile dans cette relation, qu'est-ce qui te pousse à rester ou à revenir malgré tout ?" },
    { id: "reltox_s3_02", dimension: "consequences", personnalisable: false, texte: "Y a-t-il eu des moments où tu as pris de la distance ? Comment tu te sentais à ce moment-là ?" }
  ],
  4: [
    { id: "reltox_s4_01", dimension: "besoins", personnalisable: false, texte: "Qu'est-ce qui te retient le plus dans cette relation — la peur de la solitude, l'espoir que ça change, autre chose ?" },
    { id: "reltox_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que rester dans cette relation semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "reltox_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une situation proche de celle identifiée s'est-elle reproduite dans cette relation ? Raconte-moi." }],
  6: [{ id: "reltox_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as réagi différemment que d'habitude dans cette relation ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "reltox_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à te protéger dans cette relation, ce serait quoi ?" }],
  8: [{ id: "reltox_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de vivre cette relation ?" }]
};

var BANQUE_STRUCTURANTE_DEPENDANCE_AFFECTIVE = {
  1: [
    { id: "dependaffect_s1_01", dimension: "situations", personnalisable: false, texte: "Décris un moment récent où l'absence de nouvelles ou de disponibilité de l'autre t'a beaucoup angoissée." },
    { id: "dependaffect_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît dans ces moments — 'il/elle va me quitter', 'je ne compte pas assez', autre ?" },
    { id: "dependaffect_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion domine quand tu sens un manque de disponibilité ou d'attention de l'autre ?" },
    { id: "dependaffect_s1_04", dimension: "comportements", personnalisable: false, texte: "Comment réagis-tu concrètement — tu multiplies les messages, tu t'effaces, tu te justifies, autre chose ?" },
    { id: "dependaffect_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que ce besoin de rassurance constant te coûte dans cette relation ou dans ta vie ?" }
  ],
  2: [
    { id: "dependaffect_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce surtout un silence, un ton différent, ou une absence prolongée qui déclenche le plus cette angoisse ?" },
    { id: "dependaffect_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Cette angoisse de l'abandon est-elle présente uniquement dans cette relation, ou l'as-tu déjà ressentie ailleurs ?" }
  ],
  3: [
    { id: "dependaffect_s3_01", dimension: "comportements", personnalisable: true, texte: "Jusqu'où vas-tu pour éviter que l'autre s'éloigne — renoncer à tes envies, éviter les conflits, autre chose ?" },
    { id: "dependaffect_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois rassurée par l'autre, cette angoisse disparaît-elle vraiment, ou revient-elle rapidement ?" }
  ],
  4: [
    { id: "dependaffect_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de la première fois où la peur d'être abandonnée a été aussi forte ?" },
    { id: "dependaffect_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce besoin constant de rassurance semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "dependaffect_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, cette angoisse est-elle apparue dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "dependaffect_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as toléré un silence ou une distance sans paniquer comme d'habitude ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "dependaffect_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à te rassurer par toi-même, ce serait quoi ?" }],
  8: [{ id: "dependaffect_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de vivre l'absence ou la distance de l'autre ?" }]
};

var BANQUE_STRUCTURANTE_SCHEMAS_REPETITIFS = {
  1: [
    { id: "schemasrep_s1_01", dimension: "situations", personnalisable: false, texte: "En repensant à tes relations passées, quel motif revient le plus souvent, indépendamment de la personne ?" },
    { id: "schemasrep_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée sur toi-même ou sur les relations revient dans plusieurs de ces histoires ?" },
    { id: "schemasrep_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion retrouves-tu systématiquement à un moment similaire de tes relations ?" },
    { id: "schemasrep_s1_04", dimension: "comportements", personnalisable: false, texte: "Y a-t-il un comportement que tu reproduis dans plusieurs relations, même avec des personnes très différentes ?" },
    { id: "schemasrep_s1_05", dimension: "consequences", personnalisable: true, texte: "Comment ces relations finissent-elles généralement, ou quel schéma s'installe-t-il souvent ?" }
  ],
  2: [
    { id: "schemasrep_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce plutôt au début, au milieu, ou à un moment précis de conflit que ce schéma apparaît le plus souvent ?" },
    { id: "schemasrep_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un type de personne ou de dynamique vers lequel tu te sens attirée de façon répétée ?" }
  ],
  3: [
    { id: "schemasrep_s3_01", dimension: "comportements", personnalisable: true, texte: "Quand tu sens ce schéma se reproduire dans une nouvelle relation, le reconnais-tu sur le moment, ou seulement après coup ?" },
    { id: "schemasrep_s3_02", dimension: "consequences", personnalisable: false, texte: "As-tu déjà réussi à faire différemment dans une relation où ce schéma commençait à apparaître ?" }
  ],
  4: [
    { id: "schemasrep_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de la première relation (ou du premier contexte, pas forcément amoureux) où ce schéma est apparu ?" },
    { id: "schemasrep_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce schéma répété semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "schemasrep_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, as-tu remarqué ce schéma apparaître dans une relation actuelle ? Raconte-moi ce qui s'est passé." }],
  6: [{ id: "schemasrep_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as reconnu ce schéma en train de démarrer et réagi différemment ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "schemasrep_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à repérer ce schéma tôt, ce serait quoi ?" }],
  8: [{ id: "schemasrep_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta capacité à reconnaître ce schéma ?" }]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BANQUE_STRUCTURANTE_RELATIONS_TOXIQUES: BANQUE_STRUCTURANTE_RELATIONS_TOXIQUES,
    BANQUE_STRUCTURANTE_DEPENDANCE_AFFECTIVE: BANQUE_STRUCTURANTE_DEPENDANCE_AFFECTIVE,
    BANQUE_STRUCTURANTE_SCHEMAS_REPETITIFS: BANQUE_STRUCTURANTE_SCHEMAS_REPETITIFS
  };
}

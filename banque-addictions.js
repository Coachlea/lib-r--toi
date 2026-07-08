// ============================================================================
// BANQUES STRUCTURANTES — ADDICTIONS (tabac, alcool, grignotage_alimentaire, autre_addiction)
// Chaque sous-catégorie explore un mécanisme distinct, pas un remplacement lexical :
// - tabac : ritualisation du geste, moments d'ancrage dans la journée, association geste/pause
// - alcool : contexte social vs solitaire, fonction émotionnelle, minimisation
// - grignotage_alimentaire : émotion-faim vs faim physique, rapport au corps, culpabilité post-acte
// - autre_addiction : cadre générique quand le comportement ne rentre dans aucune des 3 cases
// ============================================================================

var BANQUE_STRUCTURANTE_TABAC = {
  1: [
    { id: "tabac_s1_01", dimension: "situations", personnalisable: false, texte: "À quels moments précis de ta journée la cigarette revient-elle presque automatiquement (réveil, pause, après repas, stress, autre) ?" },
    { id: "tabac_s1_02", dimension: "sensations_corporelles", personnalisable: false, texte: "Juste avant d'allumer une cigarette, qu'est-ce que tu ressens dans le corps — tension, vide, envie physique précise ?" },
    { id: "tabac_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée précède le geste — 'j'ai besoin d'une pause', 'ça va m'aider à me concentrer', autre chose ?" },
    { id: "tabac_s1_04", dimension: "comportements", personnalisable: false, texte: "Est-ce que la cigarette est associée à un geste ou un contexte précis (téléphone, café, voiture, sortie du travail) ?" },
    { id: "tabac_s1_05", dimension: "consequences", personnalisable: true, texte: "Après avoir fumé, qu'est-ce qui change vraiment — un soulagement réel, ou juste l'arrêt d'un manque ?" },
    { id: "tabac_s1_06", dimension: "emotions", personnalisable: false, texte: "Y a-t-il une émotion que la cigarette t'aide à ne pas ressentir pleinement ?" }
  ],
  2: [
    { id: "tabac_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce que c'est plutôt l'ennui, le stress, la sociabilité (fumer avec d'autres), ou l'habitude pure qui déclenche le plus souvent l'envie ?" },
    { id: "tabac_s2_02", dimension: "declencheurs", personnalisable: false, texte: "Y a-t-il des lieux ou des personnes avec qui tu fumes presque automatiquement, même sans en avoir vraiment envie ?" },
    { id: "tabac_s2_03", dimension: "personnes_importantes", personnalisable: false, texte: "Est-ce que quelqu'un de ton entourage fume aussi, et est-ce que ça influence tes propres moments de cigarette ?" },
    { id: "tabac_s2_04", dimension: "declencheurs", personnalisable: true, texte: "Le manque physique (nicotine) ou le besoin de faire une pause dans ta journée pèse-t-il le plus dans l'envie de fumer ?" }
  ],
  3: [
    { id: "tabac_s3_01", dimension: "comportements", personnalisable: true, texte: "Entre l'envie et le moment où tu allumes la cigarette, est-ce que tu essaies parfois de résister ? Qu'est-ce qui se passe si tu attends un peu ?" },
    { id: "tabac_s3_02", dimension: "consequences", personnalisable: false, texte: "Ressens-tu de la culpabilité juste après avoir fumé, ou plutôt un vrai soulagement sans arrière-goût ?" },
    { id: "tabac_s3_03", dimension: "comportements", personnalisable: false, texte: "Est-ce qu'une cigarette en amène souvent une autre dans la même plage horaire, ou est-ce vraiment ponctuel ?" }
  ],
  4: [
    { id: "tabac_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de la période de ta vie où fumer est devenu une vraie habitude, pas juste occasionnel ?" },
    { id: "tabac_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que fumer semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "tabac_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, y a-t-il eu un moment où l'envie est montée exactement comme on l'avait identifié ? Raconte-moi ce qui s'est passé." }],
  6: [{ id: "tabac_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as résisté à l'envie, ou attendu avant de céder ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "tabac_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à espacer les cigarettes, ce serait quoi ?" }],
  8: [{ id: "tabac_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui te semble différent dans ta relation à la cigarette ?" }]
};

var BANQUE_STRUCTURANTE_ALCOOL = {
  1: [
    { id: "alcool_s1_01", dimension: "situations", personnalisable: false, texte: "Dans quel contexte bois-tu le plus souvent — entre amis, seule, en soirée, en semaine ou plutôt le week-end ?" },
    { id: "alcool_s1_02", dimension: "emotions", personnalisable: false, texte: "Quelle est l'émotion la plus présente juste avant de prendre un verre — envie de fête, envie de décompresser, autre chose ?" },
    { id: "alcool_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée précède le premier verre — 'j'en ai besoin pour me détendre', 'ça va être plus facile de parler aux gens', autre ?" },
    { id: "alcool_s1_04", dimension: "sensations_corporelles", personnalisable: false, texte: "Qu'est-ce que tu ressens dans le corps quand l'envie de boire monte ?" },
    { id: "alcool_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que l'alcool change concrètement pour toi sur le moment — et qu'est-ce que ça change le lendemain ?" }
  ],
  2: [
    { id: "alcool_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Bois-tu plus facilement seule pour gérer une émotion, ou en groupe pour te sentir plus à l'aise socialement ?" },
    { id: "alcool_s2_02", dimension: "personnes_importantes", personnalisable: false, texte: "Y a-t-il des personnes précises avec qui boire semble presque automatique ?" },
    { id: "alcool_s2_03", dimension: "declencheurs", personnalisable: true, texte: "Est-ce qu'un sentiment de solitude, d'ennui, ou au contraire de célébration précède le plus souvent l'envie de boire ?" }
  ],
  3: [
    { id: "alcool_s3_01", dimension: "comportements", personnalisable: true, texte: "Une fois que tu as commencé à boire, est-ce facile de t'arrêter à un verre, ou est-ce que ça enchaîne souvent ?" },
    { id: "alcool_s3_02", dimension: "consequences", personnalisable: false, texte: "Le lendemain d'une soirée où tu as bu plus que prévu, quelles pensées reviennent le plus souvent ?" },
    { id: "alcool_s3_03", dimension: "emotions", personnalisable: false, texte: "Ressens-tu de la culpabilité après avoir bu, ou plutôt un sentiment neutre selon les situations ?" }
  ],
  4: [
    { id: "alcool_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de la période où boire est devenu plus qu'occasionnel dans ta vie ?" },
    { id: "alcool_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que boire semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "alcool_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une situation proche de celle qu'on a identifiée s'est-elle reproduite ? Raconte-moi ce qui s'est passé." }],
  6: [{ id: "alcool_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as bu moins que d'habitude dans un contexte qui d'habitude t'y pousse ? Qu'est-ce qui était différent ?" }],
  7: [{ id: "alcool_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à garder le contrôle, ce serait quoi ?" }],
  8: [{ id: "alcool_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta relation à l'alcool ?" }]
};

var BANQUE_STRUCTURANTE_GRIGNOTAGE = {
  1: [
    { id: "grignotage_s1_01", dimension: "situations", personnalisable: false, texte: "À quel moment de la journée grignotes-tu le plus souvent en dehors des repas ?" },
    { id: "grignotage_s1_02", dimension: "emotions", personnalisable: false, texte: "Juste avant de grignoter, est-ce vraiment de la faim physique, ou plutôt une émotion — stress, ennui, tristesse, autre ?" },
    { id: "grignotage_s1_03", dimension: "sensations_corporelles", personnalisable: false, texte: "Comment reconnais-tu la différence entre une vraie faim physique et une envie de grignoter émotionnelle, dans ton corps ?" },
    { id: "grignotage_s1_04", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît juste avant de te diriger vers la nourriture ?" },
    { id: "grignotage_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que tu ressens juste après avoir grignoté — soulagement, culpabilité, indifférence ?" }
  ],
  2: [
    { id: "grignotage_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Le grignotage arrive-t-il plus souvent quand tu es seule, stressée, ou après une contrariété précise ?" },
    { id: "grignotage_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un aliment ou un type de nourriture précis vers lequel tu te tournes presque toujours dans ces moments-là ?" },
    { id: "grignotage_s2_03", dimension: "personnes_importantes", personnalisable: false, texte: "Le grignotage est-il plus fréquent seule qu'en présence d'autres personnes ?" }
  ],
  3: [
    { id: "grignotage_s3_01", dimension: "comportements", personnalisable: true, texte: "Entre l'émotion qui monte et le moment où tu grignotes, qu'est-ce qui se passe juste avant ?" },
    { id: "grignotage_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois que tu as grignoté, est-ce que l'émotion de départ a vraiment diminué, ou est-ce qu'elle revient rapidement ?" },
    { id: "grignotage_s3_03", dimension: "emotions", personnalisable: false, texte: "La culpabilité après coup relance-t-elle parfois une nouvelle envie de grignoter ?" }
  ],
  4: [
    { id: "grignotage_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de quand la nourriture est devenue une façon de gérer tes émotions ?" },
    { id: "grignotage_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que grignoter semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "grignotage_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une situation proche de celle identifiée s'est-elle reproduite ? Raconte-moi précisément." }],
  6: [{ id: "grignotage_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où l'émotion est montée mais où tu n'as pas grignoté ? Qu'est-ce qui était différent ?" }],
  7: [{ id: "grignotage_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment dans ces moments-là, ce serait quoi ?" }],
  8: [{ id: "grignotage_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de gérer ces moments ?" }]
};

var BANQUE_STRUCTURANTE_AUTRE_ADDICTION = {
  1: [
    { id: "autreadd_s1_01", dimension: "situations", personnalisable: false, texte: "Décris une situation récente où ce comportement est revenu fort. Qu'est-ce qui s'est passé précisément ?" },
    { id: "autreadd_s1_02", dimension: "sensations_corporelles", personnalisable: false, texte: "Qu'est-ce qui se passe dans ton corps juste avant de céder à ce comportement ?" },
    { id: "autreadd_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée précède le passage à l'acte ?" },
    { id: "autreadd_s1_04", dimension: "emotions", personnalisable: false, texte: "Quelle émotion est la plus présente juste avant ?" },
    { id: "autreadd_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que ce comportement change vraiment sur le moment, et après coup ?" }
  ],
  2: [
    { id: "autreadd_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Dans quels contextes ce comportement revient-il le plus souvent ?" },
    { id: "autreadd_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Est-ce plutôt l'ennui, le stress, la solitude ou autre chose qui déclenche le plus ce comportement ?" }
  ],
  3: [
    { id: "autreadd_s3_01", dimension: "comportements", personnalisable: true, texte: "Entre l'envie et le passage à l'acte, qu'est-ce qui se passe ? Essaies-tu parfois de résister ?" },
    { id: "autreadd_s3_02", dimension: "consequences", personnalisable: false, texte: "Après avoir cédé, qu'est-ce que tu ressens — soulagement, culpabilité, autre chose ?" }
  ],
  4: [
    { id: "autreadd_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand ce comportement fait-il partie de ta vie ?" },
    { id: "autreadd_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce comportement semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "autreadd_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une situation similaire à celle identifiée s'est-elle reproduite ? Raconte-moi ce qui s'est passé." }],
  6: [{ id: "autreadd_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as résisté ou attendu avant de céder ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "autreadd_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment, ce serait quoi ?" }],
  8: [{ id: "autreadd_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui te semble différent ?" }]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BANQUE_STRUCTURANTE_TABAC: BANQUE_STRUCTURANTE_TABAC,
    BANQUE_STRUCTURANTE_ALCOOL: BANQUE_STRUCTURANTE_ALCOOL,
    BANQUE_STRUCTURANTE_GRIGNOTAGE: BANQUE_STRUCTURANTE_GRIGNOTAGE,
    BANQUE_STRUCTURANTE_AUTRE_ADDICTION: BANQUE_STRUCTURANTE_AUTRE_ADDICTION
  };
}

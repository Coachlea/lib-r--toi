// ============================================================================
// BANQUES STRUCTURANTES — ÉCRANS (reseaux_sociaux, series_streaming, jeux_video, ecrans_general)
// - reseaux_sociaux : scroll automatique, comparaison sociale, recherche de validation
// - series_streaming : évasion/anesthésie, binge, remplissage du vide
// - jeux_video : accomplissement, compétition, évasion sociale ou fuite du réel
// - ecrans_general : habitude diffuse, ennui, transition entre activités
// ============================================================================

var BANQUE_STRUCTURANTE_RESEAUX_SOCIAUX = {
  1: [
    { id: "reseaux_s1_01", dimension: "situations", personnalisable: false, texte: "À quel moment ouvres-tu le plus souvent les réseaux sociaux sans même y penser — réveil, transport, avant de dormir, autre ?" },
    { id: "reseaux_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée précède l'ouverture de l'application — 'juste 2 minutes', 'voir si j'ai des notifications', autre ?" },
    { id: "reseaux_s1_03", dimension: "emotions", personnalisable: false, texte: "En scrollant, quelle émotion apparaît le plus souvent — comparaison, ennui, curiosité, autre ?" },
    { id: "reseaux_s1_04", dimension: "sensations_corporelles", personnalisable: false, texte: "Comment ton corps réagit-il quand tu vois une notification ou un like — une petite montée, un vide, autre chose ?" },
    { id: "reseaux_s1_05", dimension: "consequences", personnalisable: true, texte: "Comment te sens-tu en sortant de l'application, la plupart du temps ?" }
  ],
  2: [
    { id: "reseaux_s2_01", dimension: "declencheurs", personnalisable: false, texte: "L'ennui, la solitude, ou le besoin d'une pause déclenchent-ils le plus souvent l'envie d'ouvrir l'application ?" },
    { id: "reseaux_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Est-ce qu'un moment précis de solitude ou d'attente (transport, file d'attente) déclenche presque automatiquement le réflexe de scroller ?" },
    { id: "reseaux_s2_03", dimension: "personnes_importantes", personnalisable: false, texte: "Y a-t-il des comptes ou des personnes précises dont les publications déclenchent plus de comparaison ou d'inconfort chez toi ?" }
  ],
  3: [
    { id: "reseaux_s3_01", dimension: "comportements", personnalisable: true, texte: "Entre l'ouverture de l'application et le moment où tu la refermes, combien de temps passe généralement, et comment tu le remarques (ou pas) ?" },
    { id: "reseaux_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois l'application refermée, est-ce que l'émotion de départ (ennui, comparaison) a diminué, ou est-elle même plus forte ?" },
    { id: "reseaux_s3_03", dimension: "emotions", personnalisable: false, texte: "Ressens-tu parfois une forme de culpabilité ou de perte de temps juste après avoir scrollé longtemps ?" }
  ],
  4: [
    { id: "reseaux_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand les réseaux sociaux ont-ils pris cette place importante dans ta journée ?" },
    { id: "reseaux_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que scroller semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "reseaux_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, un moment d'ennui ou de solitude a-t-il déclenché le réflexe de scroller comme d'habitude ? Raconte-moi ce qui s'est passé." }],
  6: [{ id: "reseaux_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as résisté à l'envie d'ouvrir l'application ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "reseaux_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à limiter le scroll automatique, ce serait quoi ?" }],
  8: [{ id: "reseaux_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta relation aux réseaux sociaux ?" }]
};

var BANQUE_STRUCTURANTE_SERIES_STREAMING = {
  1: [
    { id: "series_s1_01", dimension: "situations", personnalisable: false, texte: "À quel moment de la journée ou de la soirée te retrouves-tu à enchaîner les épisodes ?" },
    { id: "series_s1_02", dimension: "emotions", personnalisable: false, texte: "Juste avant de lancer un épisode de plus, quelle émotion est présente — fatigue, envie de fuir quelque chose, simple habitude ?" },
    { id: "series_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît quand un épisode se termine et que tu enchaînes sur le suivant ?" },
    { id: "series_s1_04", dimension: "comportements", personnalisable: false, texte: "Est-ce que regarder des séries remplace souvent une autre activité que tu avais prévue (dormir, sortir, autre) ?" },
    { id: "series_s1_05", dimension: "consequences", personnalisable: true, texte: "Comment te sens-tu après une session de plusieurs épisodes d'affilée ?" }
  ],
  2: [
    { id: "series_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce plutôt la fatigue, l'envie d'éviter de penser à quelque chose, ou l'ennui qui te pousse le plus à lancer une série ?" },
    { id: "series_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un moment de la journée où l'idée de faire autre chose (travailler, dormir, sortir) te semble plus difficile que de regarder un épisode de plus ?" }
  ],
  3: [
    { id: "series_s3_01", dimension: "comportements", personnalisable: true, texte: "Qu'est-ce qui te fait dire 'encore un épisode' plutôt que de t'arrêter là où tu avais prévu ?" },
    { id: "series_s3_02", dimension: "consequences", personnalisable: false, texte: "Le lendemain d'une soirée où tu as enchaîné beaucoup d'épisodes, comment tu te sens — reposée, frustrée, indifférente ?" }
  ],
  4: [
    { id: "series_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand regarder des séries est devenu une façon de finir tes journées ou d'éviter certains moments ?" },
    { id: "series_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que regarder des séries semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "series_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, un moment identifié (fatigue, envie d'éviter quelque chose) a-t-il déclenché une session prolongée ? Raconte-moi." }],
  6: [{ id: "series_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as arrêté après un seul épisode, comme prévu ? Qu'est-ce qui était différent ?" }],
  7: [{ id: "series_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à t'arrêter quand tu le souhaites, ce serait quoi ?" }],
  8: [{ id: "series_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de regarder des séries ?" }]
};

var BANQUE_STRUCTURANTE_JEUX_VIDEO = {
  1: [
    { id: "jeux_s1_01", dimension: "situations", personnalisable: false, texte: "À quel moment de la journée as-tu le plus envie de jouer ?" },
    { id: "jeux_s1_02", dimension: "emotions", personnalisable: false, texte: "Qu'est-ce que le jeu t'apporte le plus — un sentiment d'accomplissement, une évasion, du lien avec d'autres joueurs, autre chose ?" },
    { id: "jeux_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît quand tu te dis 'encore une partie' plutôt que de t'arrêter ?" },
    { id: "jeux_s1_04", dimension: "comportements", personnalisable: false, texte: "Est-ce que jouer remplace souvent une autre activité que tu avais prévue ?" },
    { id: "jeux_s1_05", dimension: "consequences", personnalisable: true, texte: "Comment te sens-tu après une longue session de jeu — satisfait, vide, frustré, autre ?" }
  ],
  2: [
    { id: "jeux_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce plutôt l'envie de progresser, de retrouver d'autres joueurs, ou d'échapper à quelque chose qui te pousse le plus à jouer ?" },
    { id: "jeux_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un moment de stress ou de difficulté dans ta vie réelle où le jeu devient presque un réflexe pour t'échapper ?" }
  ],
  3: [
    { id: "jeux_s3_01", dimension: "comportements", personnalisable: true, texte: "Qu'est-ce qui te pousse à faire 'encore une partie' plutôt que de t'arrêter là où tu avais prévu ?" },
    { id: "jeux_s3_02", dimension: "consequences", personnalisable: false, texte: "Après une session longue, ressens-tu de la satisfaction, de la frustration de ne pas t'être arrêté avant, ou autre chose ?" }
  ],
  4: [
    { id: "jeux_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand jouer occupe-t-il cette place importante dans ta vie ?" },
    { id: "jeux_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que jouer semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "jeux_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une situation identifiée a-t-elle déclenché une session prolongée comme d'habitude ? Raconte-moi." }],
  6: [{ id: "jeux_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu t'es arrêté comme prévu ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "jeux_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à garder le contrôle sur le temps de jeu, ce serait quoi ?" }],
  8: [{ id: "jeux_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta relation au jeu ?" }]
};

var BANQUE_STRUCTURANTE_ECRANS_GENERAL = {
  1: [
    { id: "ecransgen_s1_01", dimension: "situations", personnalisable: false, texte: "À quel moment de la journée prends-tu ton téléphone ou allumes-tu un écran presque sans y penser ?" },
    { id: "ecransgen_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée précède ce geste automatique vers l'écran ?" },
    { id: "ecransgen_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion est présente le plus souvent juste avant — ennui, envie de combler un vide, curiosité, autre ?" },
    { id: "ecransgen_s1_04", dimension: "comportements", personnalisable: false, texte: "Est-ce que cet écran remplace souvent un moment de silence, d'attente, ou de transition entre deux activités ?" },
    { id: "ecransgen_s1_05", dimension: "consequences", personnalisable: true, texte: "Comment te sens-tu après avoir passé du temps sur un écran sans but précis ?" }
  ],
  2: [
    { id: "ecransgen_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce surtout l'ennui, l'attente, ou l'envie d'éviter un silence qui déclenche le réflexe vers l'écran ?" },
    { id: "ecransgen_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un moment précis de la journée où ce réflexe est presque automatique, sans réel besoin derrière ?" }
  ],
  3: [
    { id: "ecransgen_s3_01", dimension: "comportements", personnalisable: true, texte: "Une fois l'écran allumé, est-ce facile de le reposer après quelques minutes, ou est-ce que le temps file sans que tu le remarques ?" },
    { id: "ecransgen_s3_02", dimension: "consequences", personnalisable: false, texte: "Après ce temps passé sur l'écran, qu'est-ce que tu ressens — satisfaction, vide, indifférence ?" }
  ],
  4: [
    { id: "ecransgen_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand cet automatisme vers l'écran fait-il partie de ton quotidien ?" },
    { id: "ecransgen_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce geste automatique semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "ecransgen_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, un moment d'ennui ou d'attente a-t-il déclenché le réflexe vers l'écran comme d'habitude ? Raconte-moi." }],
  6: [{ id: "ecransgen_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as résisté à ce réflexe ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "ecransgen_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à reprendre le contrôle, ce serait quoi ?" }],
  8: [{ id: "ecransgen_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta relation aux écrans ?" }]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BANQUE_STRUCTURANTE_RESEAUX_SOCIAUX: BANQUE_STRUCTURANTE_RESEAUX_SOCIAUX,
    BANQUE_STRUCTURANTE_SERIES_STREAMING: BANQUE_STRUCTURANTE_SERIES_STREAMING,
    BANQUE_STRUCTURANTE_JEUX_VIDEO: BANQUE_STRUCTURANTE_JEUX_VIDEO,
    BANQUE_STRUCTURANTE_ECRANS_GENERAL: BANQUE_STRUCTURANTE_ECRANS_GENERAL
  };
}

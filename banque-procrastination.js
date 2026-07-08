// ============================================================================
// BANQUES STRUCTURANTES — PROCRASTINATION (procrastination_pure, perfectionnisme, motivation)
// - procrastination_pure : mécanique de l'évitement, dernière minute, report systématique
// - perfectionnisme : peur du résultat imparfait, tout-ou-rien, paralysie devant la tâche
// - motivation : perte d'élan, manque de sens, énergie qui ne suit pas l'intention
// ============================================================================

var BANQUE_STRUCTURANTE_PROCRASTINATION_PURE = {
  1: [
    { id: "procrastpure_s1_01", dimension: "situations", personnalisable: false, texte: "Quelle tâche remets-tu le plus souvent à plus tard ces derniers temps ?" },
    { id: "procrastpure_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît quand tu vois cette tâche sur ta liste — 'je le ferai plus tard', 'j'ai le temps', autre ?" },
    { id: "procrastpure_s1_03", dimension: "comportements", personnalisable: false, texte: "Que fais-tu concrètement à la place de cette tâche quand tu la reportes ?" },
    { id: "procrastpure_s1_04", dimension: "emotions", personnalisable: false, texte: "Quelle émotion est présente quand tu penses à cette tâche non commencée ?" },
    { id: "procrastpure_s1_05", dimension: "consequences", personnalisable: true, texte: "Comment ça se passe finalement quand tu t'y mets à la dernière minute ?" }
  ],
  2: [
    { id: "procrastpure_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Est-ce plutôt le côté ennuyeux, la taille de la tâche, ou l'absence d'échéance immédiate qui te pousse à la reporter ?" },
    { id: "procrastpure_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un moment de la journée où tu remets systématiquement les tâches importantes à plus tard ?" }
  ],
  3: [
    { id: "procrastpure_s3_01", dimension: "comportements", personnalisable: true, texte: "Qu'est-ce qui finit par te faire démarrer la tâche — l'urgence, la pression, autre chose ?" },
    { id: "procrastpure_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois lancée dans la tâche, est-ce que ça se passe aussi mal que tu le redoutais avant de commencer ?" }
  ],
  4: [
    { id: "procrastpure_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand remettre les choses à plus tard est-il devenu un vrai réflexe pour toi ?" },
    { id: "procrastpure_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que reporter la tâche semble t'apporter quelque chose sur le moment, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "procrastpure_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une tâche a-t-elle été reportée exactement comme on l'avait identifié ? Raconte-moi." }],
  6: [{ id: "procrastpure_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as démarré une tâche plus tôt que d'habitude ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "procrastpure_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à démarrer, ce serait quoi ?" }],
  8: [{ id: "procrastpure_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon de gérer les tâches que tu remets à plus tard ?" }]
};

var BANQUE_STRUCTURANTE_PERFECTIONNISME = {
  1: [
    { id: "perfectionnisme_s1_01", dimension: "situations", personnalisable: false, texte: "Décris une tâche récente que tu n'as pas commencée ou finie par peur qu'elle ne soit pas assez bien." },
    { id: "perfectionnisme_s1_02", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée apparaît quand tu envisages de rendre ou montrer un travail imparfait ?" },
    { id: "perfectionnisme_s1_03", dimension: "emotions", personnalisable: false, texte: "Quelle émotion domine face à l'idée de faire quelque chose 'juste correctement' plutôt que parfaitement ?" },
    { id: "perfectionnisme_s1_04", dimension: "comportements", personnalisable: false, texte: "Est-ce que tu recommences, peaufines, ou repousses le rendu final de façon récurrente ?" },
    { id: "perfectionnisme_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que ce besoin de perfection te coûte concrètement — temps, énergie, occasions manquées ?" }
  ],
  2: [
    { id: "perfectionnisme_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Le perfectionnisme est-il plus fort quand d'autres personnes vont voir ton travail, ou même quand tu es seule face à la tâche ?" },
    { id: "perfectionnisme_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un type de tâche précis (créatif, professionnel, personnel) où ce besoin de perfection est le plus fort ?" }
  ],
  3: [
    { id: "perfectionnisme_s3_01", dimension: "comportements", personnalisable: true, texte: "Qu'est-ce qui te fait finalement rendre ou montrer le travail, malgré l'envie de continuer à le peaufiner ?" },
    { id: "perfectionnisme_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois le travail rendu, la peur de départ était-elle justifiée, ou les choses se sont-elles bien passées malgré tout ?" }
  ],
  4: [
    { id: "perfectionnisme_s4_01", dimension: "besoins", personnalisable: false, texte: "Te souviens-tu de quand ce besoin de perfection est devenu aussi présent dans ta vie ?" },
    { id: "perfectionnisme_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que viser la perfection semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "perfectionnisme_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, une tâche a-t-elle réactivé ce besoin de perfection comme d'habitude ? Raconte-moi ce qui s'est passé." }],
  6: [{ id: "perfectionnisme_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où tu as rendu un travail 'suffisamment bien' sans le peaufiner à l'excès ? Qu'est-ce qui a aidé ?" }],
  7: [{ id: "perfectionnisme_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à lâcher prise sur la perfection, ce serait quoi ?" }],
  8: [{ id: "perfectionnisme_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ta façon d'aborder un travail à rendre ?" }]
};

var BANQUE_STRUCTURANTE_MOTIVATION = {
  1: [
    { id: "motivation_s1_01", dimension: "situations", personnalisable: false, texte: "Dans quel domaine de ta vie sens-tu le plus un manque d'élan ces derniers temps ?" },
    { id: "motivation_s1_02", dimension: "emotions", personnalisable: false, texte: "Quelle émotion est la plus présente quand tu penses à ce que tu devrais faire mais que tu n'arrives pas à démarrer ?" },
    { id: "motivation_s1_03", dimension: "pensees_automatiques", personnalisable: false, texte: "Quelle pensée revient le plus souvent — 'à quoi bon', 'je n'y arriverai pas', 'ça ne sert à rien', autre ?" },
    { id: "motivation_s1_04", dimension: "sensations_corporelles", personnalisable: false, texte: "Comment se manifeste ce manque d'élan dans ton corps — fatigue, lourdeur, autre chose ?" },
    { id: "motivation_s1_05", dimension: "consequences", personnalisable: true, texte: "Qu'est-ce que ce manque de motivation change concrètement dans ta vie en ce moment ?" }
  ],
  2: [
    { id: "motivation_s2_01", dimension: "declencheurs", personnalisable: false, texte: "Ce manque d'élan est-il plus présent face à des tâches sans sens pour toi, ou même face à des choses que tu aimes normalement ?" },
    { id: "motivation_s2_02", dimension: "declencheurs", personnalisable: true, texte: "Y a-t-il un événement récent qui a précédé cette baisse de motivation, ou est-ce plus diffus ?" }
  ],
  3: [
    { id: "motivation_s3_01", dimension: "comportements", personnalisable: true, texte: "Qu'est-ce qui t'aide, même un peu, à te remettre en mouvement quand l'élan n'est pas là ?" },
    { id: "motivation_s3_02", dimension: "consequences", personnalisable: false, texte: "Une fois que tu as réussi à démarrer malgré tout, comment tu te sens ensuite ?" }
  ],
  4: [
    { id: "motivation_s4_01", dimension: "besoins", personnalisable: false, texte: "Depuis quand ressens-tu cette baisse d'élan — y a-t-il eu un tournant ?" },
    { id: "motivation_s4_02", dimension: "fonctions_protection", personnalisable: true, texte: "Est-ce que ce manque d'élan semble t'apporter quelque chose, t'éviter quelque chose, ou ni l'un ni l'autre ?" }
  ],
  5: [{ id: "motivation_s5_fallback_01", dimension: "declencheurs", personnalisable: true, texte: "Cette semaine, ce manque d'élan est-il revenu dans un contexte proche de celui identifié ? Raconte-moi." }],
  6: [{ id: "motivation_s6_fallback_01", dimension: "consequences", personnalisable: true, texte: "Y a-t-il eu un moment où l'élan est revenu plus facilement que d'habitude ? Qu'est-ce qui était différent ?" }],
  7: [{ id: "motivation_s7_fallback_01", dimension: "comportements", personnalisable: true, texte: "Si tu devais résumer ce qui t'aide vraiment à retrouver l'élan, ce serait quoi ?" }],
  8: [{ id: "motivation_s8_fallback_01", dimension: "consequences", personnalisable: true, texte: "Par rapport au début du programme, qu'est-ce qui a changé dans ton niveau d'énergie et d'élan ?" }]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BANQUE_STRUCTURANTE_PROCRASTINATION_PURE: BANQUE_STRUCTURANTE_PROCRASTINATION_PURE,
    BANQUE_STRUCTURANTE_PERFECTIONNISME: BANQUE_STRUCTURANTE_PERFECTIONNISME,
    BANQUE_STRUCTURANTE_MOTIVATION: BANQUE_STRUCTURANTE_MOTIVATION
  };
}

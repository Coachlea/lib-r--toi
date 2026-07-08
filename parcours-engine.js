// ============================================================================
// PARCOURS-ENGINE.JS
// Moteur du parcours d'investigation personnalisée — Libère-toi
// Remplace la logique de rotation statique (jour % questions.length)
// À inclure dans index_8.html via <script src="parcours-engine.js"></script>
//
// INVARIANT DE COÛT (ne jamais violer) : ce fichier ne fait et ne doit JAMAIS
// faire d'appel réseau/IA. Zones d'ombre, statut/confiance des hypothèses,
// idempotence, progression du protocole, suivi des expérimentations et le choix
// structurante-vs-IA sont calculés intégralement en local. Le seul coût IA du
// parcours est : 1 appel /api/extract obligatoire par réponse utilisateur
// (contexte compact, jamais l'historique complet), et 0 ou 1 appel optionnel
// /api/generate-question — déclenché uniquement quand ce module décide qu'une
// question structurante ou un fallback ne suffit pas (voir selectionnerQuestion).
// Si une modification future de ce fichier introduit un appel réseau, c'est une
// régression de coût à corriger avant de merger.
// ============================================================================

var DIMENSIONS = [
  "situations", "declencheurs", "sensations_corporelles", "pensees_automatiques",
  "emotions", "comportements", "consequences", "besoins",
  "fonctions_protection", "personnes_importantes"
];

var OBJECTIFS_SEMAINE = {
  1: "cartographie",
  2: "declencheurs",
  3: "boucle_automatique",
  4: "origine_fonction",
  5: "test_reel",
  6: "leviers",
  7: "protocole",
  8: "restitution"
};

// Dimensions principalement travaillées par objectif de semaine (sert au calcul des zones d'ombre)
var DIMENSIONS_PAR_OBJECTIF = {
  cartographie: ["situations", "sensations_corporelles", "pensees_automatiques", "emotions", "comportements", "consequences"],
  declencheurs: ["declencheurs", "personnes_importantes"],
  boucle_automatique: ["comportements", "consequences", "emotions", "pensees_automatiques"],
  origine_fonction: ["besoins", "fonctions_protection"],
  test_reel: [], // travaille sur les hypothèses existantes, pas de nouvelle dimension
  leviers: [],
  protocole: [],
  restitution: []
};

var PROTOCOLE_CHAMPS_ORDRE = [
  "signaux_faibles", "declencheurs_principaux", "pensee_automatique", "emotion_principale",
  "reaction_automatique", "fonction_de_la_reaction", "ce_qui_entretient", "ce_qui_aide",
  "nouvelle_reponse_possible", "plan_si_rechute"
];

// Association champ de protocole -> dimension mémoire dont on tire la synthèse à proposer
// pour confirmation (null = synthèse libre construite à partir de plusieurs sources).
var PROTOCOLE_SOURCE = {
  signaux_faibles: "sensations_corporelles",
  declencheurs_principaux: "declencheurs",
  pensee_automatique: "pensees_automatiques",
  emotion_principale: "emotions",
  reaction_automatique: "comportements",
  fonction_de_la_reaction: "fonctions_protection",
  ce_qui_entretient: "consequences",
  ce_qui_aide: null,
  nouvelle_reponse_possible: null,
  plan_si_rechute: null
};

// ----------------------------------------------------------------------------
// PLAN DE PARCOURS — modélise réellement les programmes 4 et 8 semaines.
// Le programme 8 semaines garde la correspondance 1 semaine = 1 phase (historique).
// Le programme 4 semaines COMPRESSE plusieurs phases par semaine plutôt que de
// s'arrêter après 4 objectifs : il doit réellement atteindre cartographie,
// déclencheurs, boucle, origine/fonction (semaines 1-2, condensé) PUIS test réel,
// leviers, protocole ET restitution (semaines 3-4, condensé) — jamais une simple
// troncature à mi-parcours. Pas de duplication de banque : chaque phase continue
// de piocher dans la banque structurante de SA phase d'origine (voir
// PHASE_VERS_SEMAINE_BANQUE), qu'elle soit vécue en semaine dédiée (8 semaines)
// ou combinée avec une autre (4 semaines).
// ----------------------------------------------------------------------------
var PLAN_PARCOURS = {
  8: [
    { semaine: 1, phases: ["cartographie"] },
    { semaine: 2, phases: ["declencheurs"] },
    { semaine: 3, phases: ["boucle_automatique"] },
    { semaine: 4, phases: ["origine_fonction"] },
    { semaine: 5, phases: ["test_reel"] },
    { semaine: 6, phases: ["leviers"] },
    { semaine: 7, phases: ["protocole"] },
    { semaine: 8, phases: ["restitution"] }
  ],
  4: [
    { semaine: 1, phases: ["cartographie"] },
    { semaine: 2, phases: ["declencheurs", "boucle_automatique"] },
    { semaine: 3, phases: ["origine_fonction", "test_reel"] },
    { semaine: 4, phases: ["leviers", "protocole", "restitution"] }
  ]
};

// Chaque phase pioche toujours dans la banque structurante écrite pour SA semaine
// d'origine (1-8), indépendamment de la semaine réelle du programme compressé.
var PHASE_VERS_SEMAINE_BANQUE = {
  cartographie: 1, declencheurs: 2, boucle_automatique: 3, origine_fonction: 4,
  test_reel: 5, leviers: 6, protocole: 7, restitution: 8
};

function obtenirPlanParcours(dureeSemaine) {
  // Repli explicite et documenté : toute durée non modélisée (ni 4 ni 8) utilise
  // le plan 8 semaines tronqué au nombre de semaines réel — un choix prudent
  // (pas de comportement inventé) plutôt qu'un plan silencieusement approximatif.
  if (PLAN_PARCOURS[dureeSemaine]) return PLAN_PARCOURS[dureeSemaine];
  return PLAN_PARCOURS[8].slice(0, dureeSemaine);
}

function obtenirPhasesSemaine(memoire) {
  var plan = obtenirPlanParcours(memoire.meta.duree_programme);
  var etape = plan.find(function(p) { return p.semaine === memoire.meta.semaine_actuelle; });
  return etape ? etape.phases : [OBJECTIFS_SEMAINE[memoire.meta.semaine_actuelle] || "cartographie"];
}

function obtenirLibellePhasesSemaine(memoire) {
  return obtenirPhasesSemaine(memoire).join(" + ");
}

// ----------------------------------------------------------------------------
// 0. GÉNÉRATION D'IDENTIFIANTS STABLES (sans collision après suppression)
// N'utilise jamais la longueur d'un tableau (h + length+1) qui peut collisionner
// après suppression/manipulation de la mémoire. Un compteur monotone est conservé
// dans meta et n'est jamais décrémenté ni réutilisé.
// ----------------------------------------------------------------------------
function genererIdStable(memoire, prefixe) {
  if (typeof memoire.meta.prochain_id_numero !== "number" || isNaN(memoire.meta.prochain_id_numero)) {
    memoire.meta.prochain_id_numero = 1;
  }
  var n = memoire.meta.prochain_id_numero;
  memoire.meta.prochain_id_numero = n + 1;
  return prefixe + n;
}

// ----------------------------------------------------------------------------
// 1. INITIALISATION DE LA MÉMOIRE (nouveau client)
// ----------------------------------------------------------------------------
function initParcoursMemoire(categorie, dureeSemaine) {
  var objectifs = {};
  for (var s = 1; s <= 8; s++) {
    objectifs[s] = { nom: OBJECTIFS_SEMAINE[s], statut: s === 1 ? "en_cours" : "non_commence", completude: 0.0 };
  }
  var dimensions = {};
  DIMENSIONS.forEach(function(d) { dimensions[d] = { elements: [], completude: 0.0 }; });

  return {
    meta: {
      categorie: categorie,
      duree_programme: dureeSemaine || 4,
      semaine_actuelle: 1,
      jour_actuel: 0,
      date_debut: new Date().toISOString(),
      derniere_maj: new Date().toISOString(),
      origine: "observee", // 'observee' | 'reconstruite' — voir migrerClientExistant()
      date_migration: null, // ISO — fixée uniquement par migrerClientExistant()
      prochain_id_numero: 1 // compteur monotone pour genererIdStable() — jamais décrémenté
    },
    objectifs_semaine: objectifs,
    dimensions: dimensions,
    hypotheses: [],
    origin_hypotheses: [],
    experiments: [],
    exceptions: [],
    effective_levers: [],
    personal_protocol: {
      signaux_faibles: [], declencheurs_principaux: [], pensee_automatique: null,
      emotion_principale: null, reaction_automatique: null, fonction_de_la_reaction: null,
      ce_qui_entretient: null, ce_qui_aide: [], nouvelle_reponse_possible: null, plan_si_rechute: null
    },
    progress_markers: [],
    zones_ombre: [],
    questions_deja_posees: [],
    reponses_traitees: [], // clés "semaine-jour" déjà passées par le moteur d'extraction (idempotence)

    // Notion neutre de "fonction du comportement" (durcissement bloc 9) : ne présuppose
    // jamais qu'un comportement protège nécessairement de quelque chose. Coexiste avec
    // la dimension 'fonctions_protection' (conservée pour compatibilité avec les banques
    // existantes) sans forcer son remplissage.
    // statut : 'non_exploree' | 'aucune_identifiee' | 'incertaine' | 'identifiee'
    fonction_comportement: { statut: "non_exploree", description: null },

    // Ce que la personne a décrit initialement comme SON problème (verbatim si disponible) —
    // sert de point de comparaison avec ce qui émerge réellement au fil du parcours.
    probleme_initial: null,

    // Schémas transversaux : ce qui déborde de la catégorie choisie. La catégorie reste
    // une porte d'entrée, jamais une case qui enferme l'analyse.
    pistes_transversales: [],
    contradictions_relevees: [],

    // Alertes de sécurité rencontrées (jamais transformées en hypothèse psychologique)
    alertes_securite: [],

    // Protocole personnel (semaine 7) — co-construit champ par champ, jamais rempli en silence.
    protocole_confirmation: {
      // Pour chaque champ de personal_protocol : 'non_propose' | 'propose' | 'confirme' | 'corrige'
      signaux_faibles: "non_propose", declencheurs_principaux: "non_propose",
      pensee_automatique: "non_propose", emotion_principale: "non_propose",
      reaction_automatique: "non_propose", fonction_de_la_reaction: "non_propose",
      ce_qui_entretient: "non_propose", ce_qui_aide: "non_propose",
      nouvelle_reponse_possible: "non_propose", plan_si_rechute: "non_propose"
    }
  };
}

// ----------------------------------------------------------------------------
// 2. CALCUL DE COMPLÉTUDE PAR DIMENSION
// Règles (durcissement) :
// - 0 élément => 0
// - 1 élément => encore très incomplet (~0.25)
// - 2 éléments => ne doit pas dépasser 0.7 automatiquement
// - l'absence d'hypothèse liée n'accorde plus 30% de "confiance gratuite" —
//   elle est neutre (ni pénalisée, ni artificiellement créditée)
// - la diversité (longueur/variété du texte des éléments) compte plus que le
//   simple volume répété
// ----------------------------------------------------------------------------
function diversiteElements(elements) {
  if (!elements || elements.length === 0) return 0;
  // Heuristique simple et testable : proportion de mots distincts (hors doublons
  // quasi identiques déjà filtrés en amont) parmi tous les mots des éléments.
  // Sert à éviter qu'un volume élevé d'éléments très similaires gonfle le score.
  var tousLesMots = [];
  var setUnique = new Set();
  elements.forEach(function(e) {
    (String(e).toLowerCase().match(/[a-zàâäéèêëïîôöùûüç]{3,}/g) || []).forEach(function(m) {
      tousLesMots.push(m);
      setUnique.add(m);
    });
  });
  if (tousLesMots.length === 0) return 0.5; // éléments trop courts pour juger : neutre
  return setUnique.size / tousLesMots.length; // 1 = tout distinct, proche de 0 = très répétitif
}

function calculerCompletude(memoire, dimension) {
  var dim = memoire.dimensions[dimension];
  if (!dim || dim.elements.length === 0) return 0.0;

  var n = dim.elements.length;
  // Barème volumique volontairement plus conservateur qu'avant : 1 élément reste
  // très incomplet, 2 éléments ne suffisent pas à eux seuls à passer le seuil de 0.7.
  // Palier non-linéaire, plafonné à 4+ éléments pour la partie "volume".
  var baremeVolume = { 1: 0.25, 2: 0.45, 3: 0.6 };
  var volumeScore = n >= 4 ? 0.7 : (baremeVolume[n] || 0);

  var diversite = diversiteElements(dim.elements); // 0..1
  var facteurDiversite = Math.min(n / 3, 1); // la diversité ne compte pleinement qu'à partir de plusieurs éléments distincts

  var hypothesesLiees = memoire.hypotheses.filter(function(h) { return h.dimension === dimension; });
  var bonusHypotheses = 0;
  if (hypothesesLiees.length > 0) {
    var confianceMoyenne = hypothesesLiees.reduce(function(a, h) { return a + h.confiance; }, 0) / hypothesesLiees.length;
    // Une hypothèse confirmée/corrigée sur cette dimension renforce la complétude ;
    // une hypothèse encore incertaine ne pénalise ni ne crédite artificiellement.
    bonusHypotheses = (confianceMoyenne - 0.5) * 0.2; // ex: confiance 0.8 => +0.06 ; confiance 0.3 => -0.04
  }

  var score = volumeScore * 0.6 + diversite * 0.25 * facteurDiversite + bonusHypotheses;
  return Math.max(0, Math.min(1, score));
}

function recalculerToutesCompletudes(memoire) {
  DIMENSIONS.forEach(function(d) {
    memoire.dimensions[d].completude = calculerCompletude(memoire, d);
  });
}

// ----------------------------------------------------------------------------
// 3. ZONES D'OMBRE
// ----------------------------------------------------------------------------
// urgence = poids_objectif × (1 - completude) × age_du_manque, plafonné pour éviter le harcèlement
function calculerZonesOmbre(memoire) {
  recalculerToutesCompletudes(memoire);
  var phasesActives = obtenirPhasesSemaine(memoire);
  // Union des dimensions ciblées par TOUTES les phases actives cette semaine (une semaine
  // compressée en 4 semaines peut viser plusieurs objectifs à la fois, ex: declencheurs + boucle).
  var dimensionsCibles = [];
  phasesActives.forEach(function(phase) {
    (DIMENSIONS_PAR_OBJECTIF[phase] || []).forEach(function(d) {
      if (dimensionsCibles.indexOf(d) === -1) dimensionsCibles.push(d);
    });
  });
  var zones = [];

  dimensionsCibles.forEach(function(dim) {
    var completude = memoire.dimensions[dim].completude;
    if (completude < 0.7) {
      var tentatives = (memoire.dimensions[dim].tentatives || 0);
      var ageDuManque = Math.min(1 + tentatives * 0.3, 2.5); // monte avec les tentatives, mais plafonne
      // Après 3 tentatives infructueuses, on réduit volontairement l'urgence (ne pas harceler)
      var facteurHarcelement = tentatives >= 3 ? 0.25 : 1;
      var urgence = (1 - completude) * ageDuManque * facteurHarcelement;
      zones.push({ dimension: dim, completude: completude, urgence: urgence, tentatives: tentatives });
    }
  });

  // Hypothèses à vérifier = zones d'ombre à part entière (indépendamment de la complétude globale)
  memoire.hypotheses.forEach(function(h) {
    if (h.statut === "a_verifier" && h.confiance >= 0.3 && h.confiance < 0.75) {
      zones.push({ hypothese_id: h.id, urgence: 0.9, type: "verification_hypothese" });
    }
  });

  // Expérimentations en attente de résultat = priorité haute si le délai est écoulé
  memoire.experiments.forEach(function(e) {
    if (e.resultat === null && (memoire.meta.semaine_actuelle - e.semaine) >= 1) {
      zones.push({ experiment_id: e.id, urgence: 1.0, type: "suivi_experimentation" });
    }
  });

  zones.sort(function(a, b) { return b.urgence - a.urgence; });
  memoire.zones_ombre = zones;
  return zones;
}

// ----------------------------------------------------------------------------
// 4. ALGORITHME DE SÉLECTION DE LA QUESTION DU JOUR
// Retourne une DESCRIPTION de la question à poser : soit une question structurante
// fixe (banque), soit une demande de génération IA (type + éléments pertinents).
// La génération IA elle-même se fait via l'appel réseau /api/generate-question
// (fait par l'appelant, pas par cette fonction pure).
// ----------------------------------------------------------------------------
function selectionnerQuestion(memoire, banqueStructurante) {
  var phasesActives = obtenirPhasesSemaine(memoire);
  var objectifNom = phasesActives.join(" + "); // libellé combiné, ex: "declencheurs + boucle_automatique"

  // PHASE PROTOCOLE : co-construite champ par champ, jamais remplie en silence par
  // l'extraction générale. Priorité absolue sur toute autre logique dès que la phase
  // "protocole" est active cette semaine (semaine 7 en 8 semaines, semaine 4 en 4 semaines).
  // IMPORTANT (durcissement) : cette sélection est PURE vis-à-vis de protocole_confirmation —
  // elle ne marque JAMAIS un champ comme "propose" elle-même. Un rendu interrompu, une
  // erreur réseau ou un refresh avant l'affichage réel ne doit jamais faire perdre le champ.
  // Le marquage réel se fait uniquement via marquerQuestionProtocolePresentee(), appelée
  // par l'appelant seulement APRÈS que la question a été effectivement affichée à la personne.
  if (phasesActives.indexOf("protocole") !== -1) {
    var champSuivant = PROTOCOLE_CHAMPS_ORDRE.find(function(c) {
      var statut = memoire.protocole_confirmation[c];
      return statut === "non_propose";
    });
    if (champSuivant) {
      var sourceDim = PROTOCOLE_SOURCE[champSuivant];
      var elements = [];
      if (sourceDim && memoire.dimensions[sourceDim]) elements = memoire.dimensions[sourceDim].elements.slice(-3);
      else if (champSuivant === "ce_qui_aide") elements = memoire.effective_levers.map(function(l){ return l.description; });
      else if (champSuivant === "nouvelle_reponse_possible") elements = memoire.effective_levers.map(function(l){ return l.description; });
      else if (champSuivant === "plan_si_rechute") elements = memoire.exceptions.map(function(e){ return e.description; });
      return {
        mode: "generation_ia", type: "protocole_confirmation", champ_protocole: champSuivant,
        objectif: objectifNom, elements_pertinents: elements,
        raison: "Co-construction du protocole personnel — champ '" + champSuivant + "' proposé pour confirmation/correction par la personne (jamais rempli automatiquement)."
      };
    }
    // Tous les champs ont été proposés et traités : la phase protocole peut être considérée close.
    // Si d'autres phases sont actives la même semaine (ex: 4 semaines : leviers+protocole+restitution),
    // on continue plus bas vers la logique normale pour ces phases restantes.
  }

  var zones = calculerZonesOmbre(memoire);
  // Banque combinée : union des banques structurantes de TOUTES les phases actives cette
  // semaine, chacune puisée à sa semaine d'origine (voir PHASE_VERS_SEMAINE_BANQUE) — jamais
  // de duplication de contenu, juste une combinaison de ce qui existe déjà par phase.
  var banqueSemaine = [];
  phasesActives.forEach(function(phase) {
    var semaineBanque = PHASE_VERS_SEMAINE_BANQUE[phase];
    (banqueStructurante[semaineBanque] || []).forEach(function(q) {
      if (memoire.questions_deja_posees.indexOf(q.id) === -1) banqueSemaine.push(q);
    });
  });

  // Cas 1 : expérimentation en attente de suivi (priorité maximale, quel que soit l'objectif de semaine)
  var suiviExperimentation = zones.find(function(z) { return z.type === "suivi_experimentation"; });
  if (suiviExperimentation) {
    var exp = memoire.experiments.find(function(e) { return e.id === suiviExperimentation.experiment_id; });
    return {
      mode: "generation_ia",
      type: "suivi_experimentation",
      objectif: objectifNom,
      elements_pertinents: [exp.proposition],
      raison: "Expérimentation e" + exp.id + " proposée en semaine " + exp.semaine + ", résultat jamais recueilli."
    };
  }

  // Cas 2 : hypothèse à vérifier ET matière suffisante pour construire une question de vérification
  var verifHypothese = zones.find(function(z) { return z.type === "verification_hypothese"; });
  if (verifHypothese) {
    var hyp = memoire.hypotheses.find(function(h) { return h.id === verifHypothese.hypothese_id; });
    if (hyp && hyp.preuves_pour && hyp.preuves_pour.length >= 1) {
      return {
        mode: "generation_ia",
        type: "verification",
        objectif: objectifNom,
        elements_pertinents: [hyp.contenu, hyp.preuves_pour[hyp.preuves_pour.length - 1].extrait],
        raison: "Hypothèse " + hyp.id + " (confiance " + hyp.confiance.toFixed(2) + ") à vérifier dans la vie réelle."
      };
    }
  }

  // Cas 3 : zone d'ombre de dimension urgente ET assez de matière pour personnaliser
  var zoneDimension = zones.find(function(z) { return z.dimension && z.urgence > 0.3; });
  if (zoneDimension) {
    var elementsExistants = memoire.dimensions[zoneDimension.dimension].elements;
    if (elementsExistants.length >= 1) {
      return {
        mode: "generation_ia",
        type: "approfondissement",
        objectif: objectifNom,
        elements_pertinents: elementsExistants.slice(-2),
        raison: "Zone d'ombre sur '" + zoneDimension.dimension + "' (complétude " + zoneDimension.completude.toFixed(2) + "), matière existante à approfondir."
      };
    }
    // Pas encore de matière du tout → question structurante pour amorcer le sujet
    var candidateStruct = banqueSemaine.find(function(q) { return q.dimension === zoneDimension.dimension; });
    if (candidateStruct) {
      // Enregistrer la tentative pour l'anti-harcèlement
      memoire.dimensions[zoneDimension.dimension].tentatives = (memoire.dimensions[zoneDimension.dimension].tentatives || 0) + 1;
      return { mode: "structurante", question: candidateStruct, raison: "Amorce de la dimension '" + zoneDimension.dimension + "', pas encore de matière." };
    }
  }

  // Cas 4 : question structurante générale de la semaine, non encore posée
  if (banqueSemaine.length > 0) {
    var q = banqueSemaine[0];
    if (q.personnalisable && memoire.dimensions[q.dimension] && memoire.dimensions[q.dimension].elements.length >= 1) {
      return {
        mode: "generation_ia",
        type: "structurante_personnalisee",
        objectif: objectifNom,
        elements_pertinents: memoire.dimensions[q.dimension].elements.slice(-2),
        base_structurante: q.texte,
        raison: "Question structurante personnalisable, matière disponible."
      };
    }
    return { mode: "structurante", question: q, raison: "Question structurante standard de la semaine." };
  }

  // Cas 5 : banque épuisée, aucune zone d'ombre urgente → approfondissement libre de l'élément le plus riche
  var dimensionLaPlusRiche = DIMENSIONS.map(function(d) {
    return { dim: d, n: memoire.dimensions[d].elements.length };
  }).sort(function(a, b) { return b.n - a.n; })[0];

  return {
    mode: "generation_ia",
    type: "approfondissement",
    objectif: objectifNom,
    elements_pertinents: dimensionLaPlusRiche.n ? memoire.dimensions[dimensionLaPlusRiche.dim].elements.slice(-2) : [],
    raison: "Banque structurante épuisée pour cette semaine, approfondissement libre."
  };
}

// ----------------------------------------------------------------------------
// 5. STATUT CENTRALISÉ D'UNE HYPOTHÈSE
// Toute transition de statut passe par cette fonction unique — plus de logique
// de transition dispersée dans preuves_ajoutees(). Règles :
// - clamp défensif de la confiance (bornes 0..1, NaN -> 0.3) ;
// - confirmee exige >= 2 observation_id DISTINCTS et non nuls dans preuves_pour
//   (deux réponses parlant du même épisode ne comptent que pour un seul
//   observation_id, donc ne suffisent jamais à elles seules) ;
// - si l'hypothèse provient d'une reconstruction de migration, confirmee exige
//   EN PLUS au moins une preuve dont origine === 'observee' (post-migration) ;
// - une correction explicite utilisateur (statut 'corrigee') est prioritaire :
//   une preuve automatique contradictoire ne peut pas l'écraser silencieusement,
//   il faut une accumulation contradictoire nette (>=2 observations distinctes
//   contre, confiance basse) pour rouvrir l'investigation, et jamais directement
//   vers 'rejetee' sans nouvelle correction/rejet explicite ;
// - une hypothèse 'nouvelle' fraîchement créée (une seule preuve, aucune preuve
//   contre) reste 'nouvelle' tant qu'aucune observation supplémentaire n'arrive.
// ----------------------------------------------------------------------------
function calculerStatutHypothese(hyp) {
  if (typeof hyp.confiance !== "number" || isNaN(hyp.confiance)) hyp.confiance = 0.3;
  hyp.confiance = Math.max(0, Math.min(1, hyp.confiance));

  var preuvesPour = hyp.preuves_pour || [];
  var preuvesContre = hyp.preuves_contre || [];
  var obsPourDistinctes = new Set(preuvesPour.filter(function(p) { return !!p.observation_id; }).map(function(p) { return p.observation_id; }));
  var obsContreDistinctes = new Set(preuvesContre.filter(function(p) { return !!p.observation_id; }).map(function(p) { return p.observation_id; }));
  var aUneProuveObservee = preuvesPour.some(function(p) { return p.origine === "observee"; });
  var peutEtreConfirmee = obsPourDistinctes.size >= 2 && (!hyp.origine_migration || aUneProuveObservee);

  if (hyp.statut === "corrigee") {
    if (obsContreDistinctes.size >= 2 && hyp.confiance < 0.3) hyp.statut = "a_verifier";
    return hyp.statut;
  }

  if (peutEtreConfirmee && hyp.confiance >= 0.75) { hyp.statut = "confirmee"; return hyp.statut; }
  if (hyp.confiance <= 0.2 && obsContreDistinctes.size >= 1) { hyp.statut = "rejetee"; return hyp.statut; }
  if (hyp.statut === "nouvelle" && obsPourDistinctes.size <= 1 && obsContreDistinctes.size === 0) { return hyp.statut; }
  hyp.statut = "a_verifier";
  return hyp.statut;
}

// ----------------------------------------------------------------------------
// 5bis. NORMALISATION DÉFENSIVE D'UNE EXTRACTION IA (entrée non fiable)
// L'extraction est produite par un modèle génératif : on ne lui fait jamais
// confiance aveuglément. Chaque sous-champ est validé/nettoyé ; les entrées
// invalides sont ignorées silencieusement (avec un warning), jamais fatales.
// ----------------------------------------------------------------------------
function estChaineNonVide(v) { return typeof v === "string" && v.trim().length > 0; }

function normaliserExtraction(extraction, warnings) {
  var e = (extraction && typeof extraction === "object" && !Array.isArray(extraction)) ? extraction : {};
  function tableauValide(champ) {
    if (e[champ] === undefined) return [];
    if (!Array.isArray(e[champ])) { warnings.push("champ '" + champ + "' attendu comme tableau, ignoré"); return []; }
    return e[champ];
  }
  var fonctionComportement = null;
  if (e.fonction_comportement && typeof e.fonction_comportement === "object") {
    var statutsValides = ["aucune_identifiee", "incertaine", "identifiee"];
    if (statutsValides.indexOf(e.fonction_comportement.statut) !== -1) {
      fonctionComportement = {
        statut: e.fonction_comportement.statut,
        description: estChaineNonVide(e.fonction_comportement.description) ? e.fonction_comportement.description : null
      };
    } else {
      warnings.push("fonction_comportement ignorée : statut invalide (" + e.fonction_comportement.statut + ")");
    }
  }
  return {
    dimensions_maj: tableauValide("dimensions_maj"),
    nouvelles_hypotheses: tableauValide("nouvelles_hypotheses"),
    preuves_ajoutees: tableauValide("preuves_ajoutees"),
    corrections: tableauValide("corrections"),
    exceptions: tableauValide("exceptions"),
    resultats_experimentation: tableauValide("resultats_experimentation"),
    marqueurs_progres: tableauValide("marqueurs_progres"),
    pistes_transversales: tableauValide("pistes_transversales"),
    fonction_comportement: fonctionComportement
  };
}

// ----------------------------------------------------------------------------
// 6. FUSION D'UNE EXTRACTION VALIDÉE DANS LA MÉMOIRE (avec idempotence)
// origineAppel : 'observee' (par défaut, réponse en temps réel) ou 'reconstruite'
// (retraitement d'un historique lors d'une migration — voir migrerClientExistant).
// ----------------------------------------------------------------------------
function appliquerExtraction(memoire, extractionBrute, semaine, jour, origineAppel) {
  var warnings = [];
  var origine = (origineAppel === "reconstruite") ? "reconstruite" : "observee";
  var cleJour = semaine + "-" + jour;
  if (memoire.reponses_traitees.indexOf(cleJour) !== -1) {
    return { deja_traite: true, warnings: [] }; // idempotence : ne pas enrichir deux fois pour la même réponse
  }
  memoire.reponses_traitees.push(cleJour);

  var extraction = normaliserExtraction(extractionBrute, warnings);
  var maintenant = new Date().toISOString();
  var hypothesesTouchees = new Set();

  extraction.dimensions_maj.forEach(function(d) {
    if (!d || typeof d !== "object") { warnings.push("dimension_maj ignorée (pas un objet)"); return; }
    var dim = memoire.dimensions[d.dimension];
    if (!dim) { warnings.push("dimension inconnue ignorée: " + d.dimension); return; }
    if (!estChaineNonVide(d.element)) { warnings.push("element vide/non-string ignoré pour dimension " + d.dimension); return; }
    var existeDeja = dim.elements.some(function(e) { return e.toLowerCase().trim() === d.element.toLowerCase().trim(); });
    if (!existeDeja) dim.elements.push(d.element);
  });

  extraction.nouvelles_hypotheses.forEach(function(h) {
    if (!h || typeof h !== "object" || !estChaineNonVide(h.contenu)) { warnings.push("nouvelle_hypothese ignorée (contenu invalide)"); return; }
    var id = genererIdStable(memoire, "h");
    var confianceInit = (typeof h.confiance_initiale === "number" && !isNaN(h.confiance_initiale)) ? Math.max(0, Math.min(1, h.confiance_initiale)) : 0.3;
    var observationId = estChaineNonVide(h.observation_id) ? h.observation_id.trim() : (semaine + "-" + jour);
    memoire.hypotheses.push({
      id: id, type: (typeof h.type === "string" ? h.type : "generale"), contenu: h.contenu, dimension: h.dimension || null,
      statut: "nouvelle", confiance: confianceInit,
      semaine_apparition: semaine,
      origine_migration: origine === "reconstruite",
      preuves_pour: [{ semaine: semaine, jour: jour, extrait: h.extrait_source || "", date: maintenant, observation_id: observationId, origine: origine }],
      preuves_contre: [], corrections_utilisateur: []
    });
  });

  extraction.preuves_ajoutees.forEach(function(p) {
    if (!p || typeof p !== "object") { warnings.push("preuve ignorée (pas un objet)"); return; }
    var hyp = memoire.hypotheses.find(function(h) { return h.id === p.hypothese_id; });
    if (!hyp) { warnings.push("preuve ignorée: hypothese_id inconnu (" + p.hypothese_id + ")"); return; }
    if (p.sens !== "pour" && p.sens !== "contre") { warnings.push("preuve ignorée: sens invalide (" + p.sens + ")"); return; }
    if (!estChaineNonVide(p.extrait)) { warnings.push("preuve ignorée: extrait vide"); return; }
    var liste = p.sens === "pour" ? hyp.preuves_pour : hyp.preuves_contre;
    var dejaLa = liste.some(function(pr) { return pr.extrait === p.extrait; });
    if (dejaLa) return; // doublon strict : pas de hausse artificielle
    var observationId = estChaineNonVide(p.observation_id) ? p.observation_id.trim() : null; // jamais inventé
    liste.push({ semaine: semaine, jour: jour, extrait: p.extrait, date: maintenant, observation_id: observationId, origine: origine });
    if (p.sens === "pour") hyp.confiance = Math.max(0, Math.min(1, hyp.confiance + 0.2));
    else hyp.confiance = Math.max(0, Math.min(1, hyp.confiance - 0.3));
    hypothesesTouchees.add(hyp.id);
  });

  extraction.corrections.forEach(function(c) {
    if (!c || typeof c !== "object") { warnings.push("correction ignorée (pas un objet)"); return; }
    var hyp = memoire.hypotheses.find(function(h) { return h.id === c.hypothese_id; });
    if (!hyp) { warnings.push("correction ignorée: hypothese_id inconnu (" + c.hypothese_id + ")"); return; }
    if (!estChaineNonVide(c.nouvelle_formulation)) { warnings.push("correction ignorée: nouvelle_formulation vide (hypothese " + c.hypothese_id + ")"); return; }
    hyp.corrections_utilisateur.push({ semaine: semaine, jour: jour, ancien_contenu: hyp.contenu, extrait: c.extrait || "", date: maintenant });
    hyp.contenu = c.nouvelle_formulation;
    hyp.statut = "corrigee";
    hyp.confiance = 0.7; // une correction explicite de l'utilisateur vaut plus qu'une simple inférence IA
    hypothesesTouchees.delete(hyp.id); // le statut 'corrigee' est déjà fixé, pas besoin de recalcul générique
  });

  // Recalcul centralisé du statut, une seule fois par hypothèse touchée, après avoir
  // appliqué TOUTES les preuves du payload (évite les états transitoires incohérents
  // si plusieurs preuves pour la même hypothèse arrivent dans un seul appel).
  hypothesesTouchees.forEach(function(id) {
    var hyp = memoire.hypotheses.find(function(h) { return h.id === id; });
    if (hyp) calculerStatutHypothese(hyp);
  });

  extraction.exceptions.forEach(function(e) {
    if (!e || !estChaineNonVide(e.description)) { warnings.push("exception ignorée (description vide)"); return; }
    memoire.exceptions.push({ semaine: semaine, jour: jour, description: e.description, extrait: e.extrait || "" });
  });

  extraction.resultats_experimentation.forEach(function(r) {
    if (!r || typeof r !== "object") { warnings.push("resultat_experimentation ignoré (pas un objet)"); return; }
    var resultatsValides = ["positif", "negatif", "mitige", "inconnu"];
    if (resultatsValides.indexOf(r.resultat) === -1) { warnings.push("resultat_experimentation ignoré: valeur inconnue (" + r.resultat + ")"); return; }
    var exp = memoire.experiments.find(function(e) { return e.id === r.experiment_id; });
    if (!exp) { warnings.push("resultat_experimentation ignoré: experiment_id inconnu (" + r.experiment_id + ")"); return; }
    exp.resultat = r.resultat;
    exp.extrait_resultat = r.extrait || "";
    if (r.resultat === "positif") memoire.effective_levers.push({ description: exp.proposition, source_experiment: exp.id });
  });

  extraction.marqueurs_progres.forEach(function(m) {
    if (!m || !estChaineNonVide(m.description)) { warnings.push("marqueur_progres ignoré (description vide)"); return; }
    memoire.progress_markers.push({ semaine: semaine, jour: jour, description: m.description, extrait: m.extrait || "" });
  });

  extraction.pistes_transversales.forEach(function(p) {
    if (!p || !estChaineNonVide(p.contenu)) { warnings.push("piste_transversale ignorée (contenu vide)"); return; }
    var dejaNotee = memoire.pistes_transversales.some(function(pt) { return pt.contenu.toLowerCase().trim() === p.contenu.toLowerCase().trim(); });
    if (!dejaNotee) memoire.pistes_transversales.push({ semaine: semaine, jour: jour, contenu: p.contenu, extrait: p.extrait || "" });
  });

  if (extraction.fonction_comportement) {
    memoire.fonction_comportement = extraction.fonction_comportement;
  }

  memoire.meta.derniere_maj = maintenant;
  return { deja_traite: false, warnings: warnings };
}

// ----------------------------------------------------------------------------
// 5bis. COMPARAISON AVEC LE PROBLÈME INITIAL / DÉTECTION DE CONTRADICTIONS
// Heuristique par recouvrement de mots (pas de compréhension sémantique fine) — repère
// quand une piste transversale revient plusieurs fois et semble assez éloignée de ce que
// la personne avait initialement décrit. Reste une PISTE à signaler prudemment en
// restitution, jamais une conclusion imposée.
// ----------------------------------------------------------------------------
function motsSignificatifs(texte) {
  var motsVides = ["le", "la", "les", "de", "des", "du", "un", "une", "je", "tu", "il", "elle", "et", "ou", "que", "qui", "dans", "avec", "pour", "sur", "ce", "cette", "mon", "ma", "mes", "ton", "ta", "tes", "est", "suis", "ai", "quand"];
  return (texte || "").toLowerCase().replace(/[^a-zàâäéèêëïîôöùûüç\s]/g, " ").split(/\s+/).filter(function(m) { return m.length > 2 && motsVides.indexOf(m) === -1; });
}

function recouvrement(a, b) {
  var motsA = new Set(motsSignificatifs(a));
  var motsB = motsSignificatifs(b);
  if (motsA.size === 0 || motsB.length === 0) return 0;
  var communs = motsB.filter(function(m) { return motsA.has(m); }).length;
  return communs / Math.min(motsA.size, motsB.length);
}

function detecterContradictions(memoire) {
  if (!memoire.probleme_initial) return [];
  var groupes = [];
  memoire.pistes_transversales.forEach(function(p) {
    var groupe = groupes.find(function(g) { return recouvrement(g.contenu_ref, p.contenu) > 0.4; });
    if (groupe) groupe.occurrences.push(p);
    else groupes.push({ contenu_ref: p.contenu, occurrences: [p] });
  });
  var contradictions = groupes
    .filter(function(g) { return g.occurrences.length >= 2 && recouvrement(memoire.probleme_initial, g.contenu_ref) < 0.15; })
    .map(function(g) {
      return {
        contenu: g.contenu_ref,
        nb_occurrences: g.occurrences.length,
        extraits: g.occurrences.map(function(o) { return o.extrait; }),
        note: "Cette piste revient plusieurs fois et semble assez distincte de ce que tu avais décrit au départ ('" + memoire.probleme_initial + "'). À vérifier avec toi, jamais à imposer."
      };
    });
  memoire.contradictions_relevees = contradictions;
  return contradictions;
}

// ----------------------------------------------------------------------------
// 5ter. CONFIRMATION DU PROTOCOLE PERSONNEL (semaine 7)
// Applique le résultat d'une extraction de type 'protocole_confirmation' — jamais la même
// logique que l'extraction générale : ici on attend une confirmation/correction explicite
// de la personne sur UN champ précis du protocole, jamais un remplissage silencieux.
// ----------------------------------------------------------------------------
// Marque explicitement qu'un champ de protocole a réellement été présenté à la personne.
// À appeler UNIQUEMENT après un affichage réussi (jamais depuis selectionnerQuestion,
// qui reste pure vis-à-vis de cet état — voir commentaire ci-dessus).
function marquerQuestionProtocolePresentee(memoire, champ) {
  if (!champ || !memoire.protocole_confirmation.hasOwnProperty(champ)) return { ok: false };
  if (memoire.protocole_confirmation[champ] === "non_propose") {
    memoire.protocole_confirmation[champ] = "propose";
  }
  return { ok: true };
}

function appliquerConfirmationProtocole(memoire, champ, resultat) {
  if (!champ || !memoire.personal_protocol.hasOwnProperty(champ)) return { ok: false, raison: "champ_inconnu" };
  if (!resultat || typeof resultat !== "object") return { ok: false, raison: "resultat_invalide" };
  if (resultat.confirmation === "confirme") {
    var formulation = estChaineNonVide(resultat.formulation_retenue) ? resultat.formulation_retenue : null;
    if (!formulation && !estChaineNonVide(memoire.personal_protocol[champ])) {
      // Rien à confirmer : ni formulation fournie, ni contenu existant. Refuser plutôt
      // que de verrouiller silencieusement un champ vide.
      return { ok: false, raison: "confirmation_vide" };
    }
    memoire.personal_protocol[champ] = formulation || memoire.personal_protocol[champ];
    memoire.protocole_confirmation[champ] = "confirme";
  } else if (resultat.confirmation === "corrige") {
    if (!estChaineNonVide(resultat.nouvelle_formulation)) {
      return { ok: false, raison: "nouvelle_formulation_vide" }; // refusé, jamais de correction vide silencieuse
    }
    memoire.personal_protocol[champ] = resultat.nouvelle_formulation;
    memoire.protocole_confirmation[champ] = "corrige";
  } else {
    memoire.protocole_confirmation[champ] = "non_propose"; // réponse ambiguë : sera reproposé
  }
  return { ok: true };
}

// ----------------------------------------------------------------------------
// 6. MIGRATION D'UN CLIENT EXISTANT (reconstruction a posteriori)
// Ne prétend jamais qu'une hypothèse a été "confirmée dans le temps" — tout ce qui
// est reconstruit reste marqué origine='reconstruite' et ne peut être confirmé
// qu'après au moins une observation réellement post-migration (règle intégrée
// directement dans calculerStatutHypothese via hyp.origine_migration, pas
// seulement appliquée après coup).
// ----------------------------------------------------------------------------
function migrerClientExistant(reponsesExistantes, categorie, dureeSemaine) {
  var memoire = initParcoursMemoire(categorie, dureeSemaine);
  memoire.meta.origine = "reconstruite";
  memoire.meta.date_migration = new Date().toISOString();
  memoire.meta.note_migration = "Mémoire reconstruite a posteriori à partir de " + Object.keys(reponsesExistantes).length + " réponses existantes. Aucune hypothèse n'est considérée comme vérifiée dans le temps réel tant qu'elle n'a pas été confirmée par une nouvelle observation après migration.";

  var cles = Object.keys(reponsesExistantes).filter(function(k) { return k !== "diagnostic"; }).sort();
  memoire.meta.semaine_actuelle = cles.length ? Math.max.apply(null, cles.map(function(k) { return reponsesExistantes[k].semaine || 1; })) : 1;

  // La reconstruction fine (dimension par dimension) nécessite un passage du moteur d'extraction
  // sur chaque réponse historique, via appliquerExtraction(memoire, extraction, semaine, jour,
  // 'reconstruite') — l'appelant doit passer explicitement ce 4e argument pour que chaque preuve
  // reconstruite soit marquée origine='reconstruite' et ne compte jamais seule pour confirmer.
  memoire.reponses_a_retraiter = cles;
  return memoire;
}

// Filet de sécurité rétrocompatible pour les mémoires créées AVANT ce durcissement
// (hypothèses sans hyp.origine_migration défini). La règle vit maintenant dans
// calculerStatutHypothese ; cette fonction se contente de réparer les anciennes
// structures puis de laisser le calcul centralisé trancher.
function plafonnerHypothesesReconstruites(memoire, dateMigration) {
  var seuilMigration = new Date(dateMigration || memoire.meta.date_migration || 0);
  memoire.hypotheses.forEach(function(h) {
    if (typeof h.origine_migration === "undefined") {
      // Ancienne mémoire : on déduit l'origine depuis les dates de preuves si possible.
      var toutesAnterieures = (h.preuves_pour || []).length > 0 && h.preuves_pour.every(function(p) { return new Date(p.date || 0) <= seuilMigration; });
      h.origine_migration = toutesAnterieures;
      if (h.origine_migration) {
        (h.preuves_pour || []).forEach(function(p) { if (!p.origine) p.origine = "reconstruite"; });
      }
    }
    calculerStatutHypothese(h);
  });
}

// ----------------------------------------------------------------------------
// Export (compatible <script> classique : tout est en var globales) +
// CommonJS si jamais utilisé côté Node pour les tests.
// ----------------------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initParcoursMemoire: initParcoursMemoire,
    calculerCompletude: calculerCompletude,
    calculerZonesOmbre: calculerZonesOmbre,
    selectionnerQuestion: selectionnerQuestion,
    appliquerExtraction: appliquerExtraction,
    calculerStatutHypothese: calculerStatutHypothese,
    genererIdStable: genererIdStable,
    obtenirPlanParcours: obtenirPlanParcours,
    obtenirPhasesSemaine: obtenirPhasesSemaine,
    obtenirLibellePhasesSemaine: obtenirLibellePhasesSemaine,
    migrerClientExistant: migrerClientExistant,
    plafonnerHypothesesReconstruites: plafonnerHypothesesReconstruites,
    detecterContradictions: detecterContradictions,
    appliquerConfirmationProtocole: appliquerConfirmationProtocole,
    marquerQuestionProtocolePresentee: marquerQuestionProtocolePresentee,
    PROTOCOLE_CHAMPS_ORDRE: PROTOCOLE_CHAMPS_ORDRE,
    DIMENSIONS: DIMENSIONS,
    OBJECTIFS_SEMAINE: OBJECTIFS_SEMAINE
  };
}

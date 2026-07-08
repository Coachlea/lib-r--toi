const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_HOST = "zalqoyfgiyzbjodsbszy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DUbnhLeTcevhBWm08yYpEA_WSawvojm";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_ORIGIN = "https://programme-liberetoi.fr";

// Limite les tentatives de réinitialisation de mot de passe par IP (protège contre le brute-force sur le code)
const compteurReset = new Map();
const LIMITE_RESET = 8;
const FENETRE_RESET_MS = 15 * 60 * 1000; // 15 minutes

function depasseLimiteReset(ip) {
  const maintenant = Date.now();
  const entree = compteurReset.get(ip);
  if (!entree || maintenant > entree.reset) {
    compteurReset.set(ip, { count: 1, reset: maintenant + FENETRE_RESET_MS });
    return false;
  }
  entree.count++;
  return entree.count > LIMITE_RESET;
}

function supabaseRequest(method, path, body, extraHeaders) {
 return new Promise((resolve, reject) => {
   const payload = body ? JSON.stringify(body) : null;
   const headers = {
     "Content-Type": "application/json",
     "apikey": SUPABASE_KEY,
     "Authorization": "Bearer " + SUPABASE_KEY,
     "Prefer": "return=minimal"
   };
   if (extraHeaders) Object.assign(headers, extraHeaders);
   if (payload) headers["Content-Length"] = Buffer.byteLength(payload);
   const options = { hostname: SUPABASE_HOST, path: "/rest/v1/" + path, method: method, headers: headers };
   const req = https.request(options, res => {
     let data = "";
     res.on("data", chunk => data += chunk);
     res.on("end", () => {
       console.log("Supabase status:", res.statusCode, "data:", data.substring(0, 100));
       resolve({ status: res.statusCode, data: data });
     });
   });
   req.on("error", reject);
   if (payload) req.write(payload);
   req.end();
 });
}

// Vérifie qu'un token Supabase correspond bien à un utilisateur connecté (cliente ou coach)
function verifierUtilisateurSupabase(token) {
  return new Promise((resolve) => {
    if (!token) return resolve(null);
    const options = {
      hostname: SUPABASE_HOST,
      path: "/auth/v1/user",
      method: "GET",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + token
      }
    };
    const req = https.request(options, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(res.statusCode === 200 && parsed.id ? parsed : null);
        } catch (e) { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.end();
  });
}

// Limite simple de requêtes IA par utilisateur (protège la facture même en cas de bug ou d'abus)
const compteurRequetes = new Map();
const LIMITE_REQUETES = 40;
const FENETRE_MS = 10 * 60 * 1000; // 10 minutes

function depasseLimite(userId) {
  const maintenant = Date.now();
  const entree = compteurRequetes.get(userId);
  if (!entree || maintenant > entree.reset) {
    compteurRequetes.set(userId, { count: 1, reset: maintenant + FENETRE_MS });
    return false;
  }
  entree.count++;
  return entree.count > LIMITE_REQUETES;
}

setInterval(() => { http.get("http://localhost:" + PORT + "/").on("error", () => {}); }, 14 * 60 * 1000);

// ===================================================================
// MOTEUR PARCOURS_MEMOIRE — extraction structurée + génération de question
// ===================================================================

// Statuts valides pour une hypothèse (voir doc de conception)
const STATUTS_HYPOTHESE = ["nouvelle", "a_verifier", "confirmee", "corrigee", "rejetee"];
const DIMENSIONS_VALIDES = [
  "situations", "declencheurs", "sensations_corporelles", "pensees_automatiques",
  "emotions", "comportements", "consequences", "besoins",
  "fonctions_protection", "personnes_importantes"
];

// Mots/tournures interdits dans toute question ou extraction générée par l'IA
// (garde-fou anti-diagnostic, voir section 15 du cahier des charges)
const TOURNURES_INTERDITES = [
  "tu as un trouble", "tu souffres de", "cliniquement", "diagnostic",
  "tu es dépressive", "tu es dépendante affective", "trouble anxieux",
  "c'est un traumatisme", "tu as un traumatisme", "trouble de la personnalité"
];

function contientTournureInterdite(texte) {
  const t = (texte || "").toLowerCase();
  return TOURNURES_INTERDITES.some(mot => t.includes(mot));
}

// Appel brut à Claude, réutilisé par les deux nouvelles routes
function appellerClaude(prompt, maxTokens) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens || 700,
      messages: [{ role: "user", content: prompt }]
    });
    const options = {
      hostname: "api.anthropic.com", path: "/v1/messages", method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(payload)
      }
    };
    const apiReq = https.request(options, apiRes => {
      let data = "";
      apiRes.on("data", chunk => data += chunk);
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const texte = Array.isArray(parsed.content) ? parsed.content.map(b => b.text || "").join("") : "";
          resolve(texte);
        } catch (e) { reject(new Error("Réponse Claude illisible")); }
      });
    });
    apiReq.on("error", reject);
    apiReq.write(payload);
    apiReq.end();
  });
}

// Extrait un bloc JSON d'un texte qui peut contenir des ``` ou du texte autour
function extraireJSON(texte) {
  if (!texte) return null;
  let nettoye = texte.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
  const debut = nettoye.indexOf("{");
  const fin = nettoye.lastIndexOf("}");
  if (debut === -1 || fin === -1 || fin < debut) return null;
  nettoye = nettoye.substring(debut, fin + 1);
  try { return JSON.parse(nettoye); } catch (e) { return null; }
}

// Valide strictement la structure renvoyée par le moteur d'extraction.
// Rejette (en filtrant) tout élément mal formé plutôt que de tout faire échouer,
// et surtout : rejette tout "extrait" qui n'apparaît pas mot pour mot dans la réponse brute
// (garantie de traçabilité — on ne laisse jamais l'IA fabriquer une citation).
function validerExtraction(json, reponseBrute) {
  if (!json || typeof json !== "object") return null;
  const brut = (reponseBrute || "").toLowerCase();
  const out = {
    dimensions_maj: [], nouvelles_hypotheses: [], preuves_ajoutees: [],
    corrections: [], exceptions: [], resultats_experimentation: [], marqueurs_progres: []
  };

  function extraitValide(extrait) {
    if (!extrait || typeof extrait !== "string") return false;
    if (extrait.split(/\s+/).length > 30) return false; // extrait doit rester court
    return brut.includes(extrait.trim().toLowerCase());
  }

  (json.dimensions_maj || []).forEach(function(d) {
    if (d && DIMENSIONS_VALIDES.includes(d.dimension) && extraitValide(d.extrait)) {
      out.dimensions_maj.push({ dimension: d.dimension, element: String(d.element || "").slice(0, 200), extrait: d.extrait });
    }
  });

  (json.nouvelles_hypotheses || []).forEach(function(h) {
    if (h && h.contenu && extraitValide(h.extrait_source)) {
      out.nouvelles_hypotheses.push({
        type: h.type || "generale",
        contenu: String(h.contenu).slice(0, 400),
        statut: "nouvelle",
        confiance_initiale: 0.3,
        extrait_source: h.extrait_source
      });
    }
  });

  (json.preuves_ajoutees || []).forEach(function(p) {
    if (p && p.hypothese_id && extraitValide(p.extrait) && (p.sens === "pour" || p.sens === "contre")) {
      out.preuves_ajoutees.push({ hypothese_id: String(p.hypothese_id), sens: p.sens, extrait: p.extrait });
    }
  });

  (json.corrections || []).forEach(function(c) {
    if (c && c.hypothese_id && extraitValide(c.extrait)) {
      out.corrections.push({ hypothese_id: String(c.hypothese_id), nouvelle_formulation: String(c.nouvelle_formulation || "").slice(0, 400), extrait: c.extrait });
    }
  });

  (json.exceptions || []).forEach(function(e) {
    if (e && e.description && extraitValide(e.extrait)) out.exceptions.push({ description: String(e.description).slice(0, 300), extrait: e.extrait });
  });

  (json.resultats_experimentation || []).forEach(function(r) {
    if (r && r.experiment_id && extraitValide(r.extrait)) {
      out.resultats_experimentation.push({ experiment_id: String(r.experiment_id), resultat: String(r.resultat || "").slice(0, 300), extrait: r.extrait });
    }
  });

  (json.marqueurs_progres || []).forEach(function(m) {
    if (m && m.description && extraitValide(m.extrait)) out.marqueurs_progres.push({ description: String(m.description).slice(0, 300), extrait: m.extrait });
  });

  // Pistes transversales : schémas qui débordent de la catégorie choisie par la personne.
  // Formulation obligatoirement prudente, jamais imposée — validée comme le reste (extrait exact requis).
  out.pistes_transversales = [];
  (json.pistes_transversales || []).forEach(function(p) {
    if (p && p.contenu && extraitValide(p.extrait) && !contientTournureInterdite(p.contenu)) {
      out.pistes_transversales.push({ contenu: String(p.contenu).slice(0, 300), extrait: p.extrait });
    }
  });

  return out;
}

function construirePromptExtraction(ctx) {
  return "Tu es un moteur d'extraction structuré pour un programme de coaching écrit. Tu ne dialogues pas avec la personne, tu analyses une réponse pour en extraire des éléments factuels. "
  + "Catégorie CHOISIE PAR LA PERSONNE (porte d'entrée, pas une case qui enferme l'analyse) : " + ctx.categorie + ". Semaine " + ctx.semaine + " (objectif : " + ctx.objectif_semaine + "), jour " + ctx.jour + ". "
  + "Question posée : \"" + ctx.question + "\". "
  + "Réponse brute de la personne : \"" + ctx.reponse + "\". "
  + (ctx.contexte_memoire ? "Éléments déjà connus pertinents : " + JSON.stringify(ctx.contexte_memoire) + ". " : "")
  + (ctx.probleme_initial ? "Ce que la personne avait initialement décrit comme son problème : \"" + ctx.probleme_initial + "\". " : "")
  + "Réponds UNIQUEMENT avec un objet JSON strict, sans aucun texte autour, sans \`\`\`, respectant exactement ce format : "
  + "{\"dimensions_maj\":[{\"dimension\":\"une des valeurs: " + DIMENSIONS_VALIDES.join("|") + "\",\"element\":\"résumé court de l'élément\",\"extrait\":\"extrait EXACT et court (max 25 mots) copié mot pour mot depuis la réponse brute ci-dessus\"}],"
  + "\"nouvelles_hypotheses\":[{\"type\":\"declencheur|boucle|origine|fonction_protection\",\"contenu\":\"formulation prudente, jamais affirmative\",\"extrait_source\":\"extrait EXACT copié mot pour mot depuis la réponse\"}],"
  + "\"preuves_ajoutees\":[{\"hypothese_id\":\"id existant si fourni dans le contexte\",\"sens\":\"pour|contre\",\"extrait\":\"extrait EXACT copié mot pour mot\"}],"
  + "\"corrections\":[{\"hypothese_id\":\"id\",\"nouvelle_formulation\":\"...\",\"extrait\":\"extrait EXACT\"}],"
  + "\"exceptions\":[{\"description\":\"...\",\"extrait\":\"extrait EXACT\"}],"
  + "\"resultats_experimentation\":[{\"experiment_id\":\"id\",\"resultat\":\"positif|negatif|mitige|inconnu\",\"extrait\":\"extrait EXACT\"}],"
  + "\"marqueurs_progres\":[{\"description\":\"...\",\"extrait\":\"extrait EXACT\"}],"
  + "\"pistes_transversales\":[{\"contenu\":\"un schéma qui semble déborder de la catégorie choisie ('" + ctx.categorie + "'), formulé avec prudence (jamais affirmatif, jamais 'tu as' — utilise 'il semble que' ou 'une autre piste possible serait'), et SEULEMENT si la réponse le suggère clairement, pas par défaut\",\"extrait\":\"extrait EXACT copié mot pour mot\"}],"
  + "\"fonction_comportement\":{\"statut\":\"une des valeurs: aucune_identifiee|incertaine|identifiee\",\"description\":\"si statut=identifiee, décrit brièvement ce que le comportement semble apporter ou éviter, sinon null\"}} "
  + "RÈGLES ABSOLUES : chaque champ \"extrait\" ou \"extrait_source\" doit être une citation EXACTE et courte de la réponse brute fournie, jamais reformulée, jamais inventée. "
  + "N'invente jamais un élément qui ne repose pas sur un extrait réel. Si la réponse est trop pauvre ou évasive (ex: \"je sais pas\"), renvoie des tableaux vides plutôt que d'inventer. "
  + "IMPORTANT sur fonction_comportement : ne force JAMAIS une fonction protectrice ou une utilité au comportement décrit. Beaucoup de comportements n'ont pas de fonction identifiable, ou la personne ne le sait simplement pas encore. Utilise \"aucune_identifiee\" si rien dans la réponse ne suggère de fonction, \"incertaine\" si c'est ambigu, et réserve \"identifiee\" aux cas où la réponse le suggère clairement. "
  + "Ne pose jamais de diagnostic, ne nomme jamais un trouble médical ou psychologique. Toute hypothèse doit rester formulée avec prudence (\"il semble que\", \"une piste possible est\"). "
  + "La catégorie choisie est une porte d'entrée, pas une case fermée : si le contenu réel de la réponse pointe clairement vers autre chose (ex. la personne a choisi 'stress' mais décrit surtout un évitement de tâches proche de la procrastination), note-le dans pistes_transversales SANS jamais l'imposer ni le présenter comme LE vrai problème. "
  + "Si un tableau est vide, renvoie [].";
}

function construirePromptQuestion(ctx) {
  if (ctx.type === "protocole_confirmation") {
    return "Tu es Coach Raphaëlle. Tu construis avec la personne son protocole personnel de fin de programme, champ par champ. "
    + "Champ actuel à valider avec elle : \"" + (ctx.champ_protocole || "") + "\". "
    + "Voici ce qui ressort de ses réponses précédentes pour ce champ (à lui proposer, PAS à lui annoncer comme acquis) : " + JSON.stringify(ctx.elements_pertinents || []) + ". "
    + "Formule une question qui lui présente cette synthèse avec prudence et lui demande explicitement si elle confirme, si elle corrigerait, ou si elle formulerait ça autrement avec ses propres mots. "
    + "Règles absolues : à la deuxième personne (tu), maximum 45 mots, jamais présenté comme un fait acquis, jamais de diagnostic. Ne renvoie QUE la question, sans préambule.";
  }
  return "Tu es Coach Raphaëlle. Tu dois poser UNE SEULE question à une personne suivant un programme de coaching écrit sur le thème \"" + ctx.categorie + "\", en semaine " + ctx.semaine + " (objectif de la semaine : " + ctx.objectif + "). "
  + "Type de question à générer : " + ctx.type + ". "
  + "Éléments réels déjà connus sur cette personne à utiliser pour personnaliser la question (ne cite que ce qui est ici, n'invente rien d'autre) : " + JSON.stringify(ctx.elements_pertinents || []) + ". "
  + (ctx.consigne_supplementaire ? "Consigne supplémentaire : " + ctx.consigne_supplementaire + ". " : "")
  + "Règles absolues : une seule question, à la deuxième personne (tu), maximum 40 mots, jamais de diagnostic, jamais d'affirmation psychologique présentée comme certaine, formulation prudente si tu avances une hypothèse implicite. "
  + "Ne renvoie QUE la question, sans guillemets, sans préambule, sans explication.";
}

// ===================================================================
// SIGNAUX D'ALERTE DE SÉCURITÉ
// Détection déterministe (pas laissée à l'appréciation du modèle) — s'exécute
// AVANT tout appel au moteur d'extraction. Si un signal est détecté, on ne
// génère JAMAIS d'hypothèse psychologique sur ce texte : on sort immédiatement
// de la logique d'investigation normale.
//
// LIMITE ASSUMÉE : ceci reste une détection par motifs de texte, pas une
// compréhension sémantique. Elle vise à ne jamais rater un signal réel (biais
// volontaire vers le sur-déclenchement plutôt que l'inverse), avec deux garde-fous
// explicites contre les faux positifs les plus évidents : la négation directe
// ("je ne veux pas en finir") et la citation/référence tierce non personnelle
// ("j'ai lu la phrase ... dans un livre"). Ce n'est PAS un système clinique.
// ===================================================================
var SIGNAUX_ALERTE = [
  { type: "suicide_autodestruction", motifs: [
      /\bme\s+suicid/i, /\benvie\s+de\s+mourir/i, /\bplus\s+envie\s+de\s+vivre/i,
      /\bmettre\s+fin\s+(a|à)\s+mes\s+jours/i, /\b(je\s+veux|veut|voulait|voudrait)\s+(en\s+finir|mourir)\b/i,
      /\bme\s+scarifi/i, /\bme\s+faire\s+du\s+mal\b/i, /\bm[e']?automutil/i,
      /\bpr(e|é)f(e|é)rerais\s+ne\s+pas\s+me\s+r(e|é)veiller\b/i,
      /\bserez\s+tranquilles?\s+sans\s+moi\b/i, /\bmieux\s+sans\s+moi\b/i,
      /\btrop\s+de\s+(comprim(e|é)s|m(e|é)dicaments|cachets)\b/i,
      /\bpr(e|é)pare\s+mes\s+affaires\s+pour\s+apr(e|è)s\b/i
  ]},
  { type: "danger_violence", motifs: [
      /\bme\s+frapp\w*/i, /\bme\s+tap\w*/i, /\bme\s+bat\b/i, /\bm[ '’]?a\s+(frapp|tap|battu|(e|é)trangl)/i,
      /\bla\s+frapp\w*/i, /\ble\s+frapp\w*/i, /\bla\s+bat\b/i, /\ble\s+bat\b/i,
      /\bviolence\s+conjugale\b/i, /\bj[ '’]?ai\s+peur\s+qu[ '’]?il\s+me\s+tue\b/i,
      /\bmenace\s+de\s+me\s+tuer\b/i, /\blève\s+la\s+main\s+sur\s+moi\b/i,
      /\bj[ '’]?ai\s+peur\s+de\s+rentrer\s+chez\s+moi\b/i,
      /\bviol(e|é)e?\b/i, /\bagress(ion|é|e)\s+sexuel/i, /\bforc(e|é)e?\s+(a|à)\s+avoir\s+des?\s+rapports?\b/i
  ]},
  { type: "emprise_danger", motifs: [
      /\bil\s+contr(o|ô)le\s+tout\b/i, /\bje\s+ne\s+peux\s+plus\s+sortir\s+seule\b/i,
      /\bil\s+m[ '’]?emp(e|ê)che\s+de\s+voir\s+mes\s+amis\b/i,
      /\bv(e|é)rifie\s+mon\s+t(e|é)l(e|é)phone\b/i, /\blit\s+mes\s+messages\b/i,
      /\bcontr(o|ô)le\s+(mon\s+argent|mes?\s+finances)\b/i, /\bpas\s+acc(e|è)s\s+(a|à)\s+mon\s+compte\b/i,
      /\bne\s+vois\s+plus\s+ma\s+famille\s+(a|à)\s+cause\s+de\s+lui\b/i,
      /\bveut\s+savoir\s+o(u|ù)\s+je\s+suis\s+tout\s+le\s+temps\b/i, /\bme\s+suit\b/i,
      /\bmenace\s+.*\s+si\s+je\s+pars\b/i
  ]},
  { type: "addiction_danger_immediat", motifs: [
      /\bsurdos/i, /\bj[ '’]?ai\s+pris\s+trop\s+de\s+m(e|é)dicaments\b/i,
      /\bje\s+n[ '’]?arrive\s+plus\s+(a|à)\s+respirer\b/i
  ]}
];

// Négation directe : suppression du déclenchement (pas seulement une baisse d'urgence)
var MOTIFS_NEGATION = [
  /\bne\s+veux\s+pas\s+(en\s+finir|mourir)\b/i,
  /\bpas\s+envie\s+de\s+mourir\b/i,
  /\bje\s+n[ '’]?ai\s+jamais\s+voulu\s+(en\s+finir|mourir)\b/i
];

// Citation / référence non personnelle (livre, film, chanson) : suppression complète
var MOTIFS_CITATION = [
  /\b(j[ '’]?ai\s+lu|dans\s+un\s+livre|dans\s+une\s+chanson|dans\s+un\s+film|dans\s+une\s+s(e|é)rie)\b.{0,40}(mourir|en\s+finir|suicide)/i,
  /(mourir|en\s+finir|suicide).{0,40}\b(dans\s+un\s+livre|dans\s+une\s+chanson|dans\s+un\s+film)\b/i
];

// Marqueurs de tiers (le signal concerne quelqu'un d'autre, pas la personne elle-même)
var MOTIFS_TIERS = [
  /\bmon\s+(frère|père|fils|cousin|oncle|grand-père|ami|copain|coll(e|è)gue)\b/i,
  /\bma\s+(sœur|soeur|mère|fille|cousine|tante|grand-mère|amie|copine|coll(e|è)gue)\b/i,
  /\b(il|elle)\s+(disait|a\s+dit|voulait|racontait)\s+qu[ '’]?(il|elle)\b/i
];

// Marqueurs temporels passés (le fait daterait, pas une situation actuelle)
var MOTIFS_PASSE = [
  /\bil\s+y\s+a\s+.{0,20}(ans?|mois|semaines?)\b/i, /\b(a|à)\s+l[ '’]?(e|é)poque\b/i,
  /\bautrefois\b/i, /\bquand\s+j[ '’]?(e|é)tais\b/i, /\bc[ '’]?(e|é)tait\s+avant\b/i
];
var MOTIFS_RECENT = [/\bhier\b/i, /\bla\s+semaine\s+derni(e|è)re\b/i, /\bce\s+week-?end\b/i];

function detecterSignalAlerte(texte) {
  if (!texte) return null;
  for (var i = 0; i < MOTIFS_CITATION.length; i++) {
    if (MOTIFS_CITATION[i].test(texte)) return null; // référence à une œuvre, pas un vécu personnel
  }
  for (var i2 = 0; i2 < MOTIFS_NEGATION.length; i2++) {
    if (MOTIFS_NEGATION[i2].test(texte)) return null; // négation explicite
  }

  for (var g = 0; g < SIGNAUX_ALERTE.length; g++) {
    var groupe = SIGNAUX_ALERTE[g];
    for (var m = 0; m < groupe.motifs.length; m++) {
      if (groupe.motifs[m].test(texte)) {
        var estTiers = MOTIFS_TIERS.some(function(re) { return re.test(texte); });
        var estPasse = MOTIFS_PASSE.some(function(re) { return re.test(texte); });
        var estRecent = MOTIFS_RECENT.some(function(re) { return re.test(texte); });
        var temporalite = estPasse ? "passee" : (estRecent ? "recente" : "actuelle");
        var cible = estTiers ? "tiers" : "utilisateur";
        var niveauUrgence = "immediate";
        if (cible === "tiers" || temporalite === "passee") niveauUrgence = (cible === "tiers" && temporalite === "passee") ? "vigilance" : "elevee";
        return {
          type: groupe.type,
          niveau_urgence: niveauUrgence,
          temporalite: temporalite,
          cible: cible,
          confiance: (estTiers || estPasse) ? 0.6 : 0.85 // indicateur interne, jamais affiché tel quel à la personne
        };
      }
    }
  }
  return null;
}

// Messages de prudence fixes, jamais générés par l'IA — pré-écrits, validés une fois pour toutes.
// Un message adapté existe pour le cas où le signal concerne un tiers (pas la personne elle-même).
var MESSAGES_PRUDENCE = {
  suicide_autodestruction: "Ce que tu viens d'écrire me touche et je veux que tu saches que tu n'as pas à traverser ça seule. Je ne suis pas la bonne ressource pour t'accompagner sur ce que tu vis là, mais des personnes formées peuvent t'aider tout de suite : le 3114 (numéro national de prévention du suicide, gratuit, 24h/24) ou le 15 (SAMU) en cas d'urgence. Tu peux aussi en parler à quelqu'un de confiance autour de toi. On reprendra le programme quand tu te sentiras prête — rien n'est perdu.",
  danger_violence: "Ce que tu décris est grave et je veux que tu sois en sécurité avant tout. Le 3919 (Violences Femmes Info, gratuit, anonyme) ou le 17 en cas de danger immédiat peuvent t'accompagner concrètement. Je ne vais pas continuer à analyser ça comme un simple mécanisme de coaching — ta sécurité passe avant le programme.",
  emprise_danger: "Ce que tu décris ressemble à une situation d'emprise, et ça mérite un accompagnement spécialisé, pas juste un programme de coaching écrit. Le 3919 (Violences Femmes Info) peut t'aider à voir clair sur ce que tu vis et sur les options qui s'offrent à toi, en toute confidentialité.",
  addiction_danger_immediat: "Si tu es en danger immédiat, appelle le 15 (SAMU) ou le 112 tout de suite. Le 3114 est aussi disponible pour en parler. Ta sécurité passe avant tout le reste."
};

var MESSAGES_PRUDENCE_TIERS = {
  suicide_autodestruction: "Ce que tu me racontes sur cette personne est important, même si ça date. Si tu es inquiète pour elle aujourd'hui, le 3114 (numéro national de prévention du suicide) peut aussi conseiller les proches sur comment réagir et en parler.",
  danger_violence: "Ce que tu décris pour cette personne est sérieux. Le 3919 (Violences Femmes Info) peut aussi conseiller les proches sur comment l'aider sans se mettre en danger elle-même ou toi.",
  emprise_danger: "Ce que tu décris pour cette personne ressemble à une emprise. Le 3919 peut conseiller les proches sur la meilleure façon d'aborder ça avec elle.",
  addiction_danger_immediat: "Si cette personne est en danger immédiat maintenant, le 15 (SAMU) ou le 112 doivent être appelés sans attendre."
};

function messagePrudencePour(alerte) {
  if (alerte.cible === "tiers" && MESSAGES_PRUDENCE_TIERS[alerte.type]) return MESSAGES_PRUDENCE_TIERS[alerte.type];
  return MESSAGES_PRUDENCE[alerte.type];
}

// Le moteur d'extraction ne doit jamais recevoir ce texte pour analyse psychologique
// s'il contient un signal d'alerte : on court-circuite avant l'appel IA.
async function extraireAvecRetry(ctx) {
  const prompt = construirePromptExtraction(ctx);
  let texte = await appellerClaude(prompt, 700);
  let json = extraireJSON(texte);
  if (!json) {
    const promptCorrectif = prompt + " ATTENTION : ta réponse précédente n'était pas un JSON valide. Renvoie uniquement le JSON, rien d'autre.";
    texte = await appellerClaude(promptCorrectif, 700);
    json = extraireJSON(texte);
  }
  if (!json) return { ok: false, fallback: true };
  const valide = validerExtraction(json, ctx.reponse);
  return { ok: true, extraction: valide };
}

// Prompt dédié à la confirmation du protocole personnel (semaine 7) — jamais la même
// logique que l'extraction générale : ici on demande explicitement si la personne
// confirme, corrige, ou reformule une synthèse proposée sur UN champ précis.
function construirePromptExtractionProtocole(ctx) {
  return "Tu analyses la réponse d'une personne à une question de confirmation de son protocole personnel de coaching (champ : " + ctx.champ_protocole + "). "
  + "Synthèse qui lui a été proposée pour ce champ, basée sur ses réponses précédentes : " + JSON.stringify(ctx.elements_pertinents || []) + ". "
  + "Sa réponse : \"" + ctx.reponse + "\". "
  + "Réponds UNIQUEMENT avec un JSON strict, sans texte autour, sans \`\`\`, au format : "
  + "{\"confirmation\":\"confirme|corrige|ambigu\",\"formulation_retenue\":\"si confirme, reformulation courte et fidèle à ses mots\",\"nouvelle_formulation\":\"si corrige, la nouvelle version selon ses mots à elle\",\"extrait\":\"extrait EXACT copié mot pour mot de sa réponse\"}. "
  + "Ne jamais inventer un extrait. Si la réponse ne permet pas de trancher clairement, renvoie \"ambigu\".";
}

function validerExtractionProtocole(json, reponseBrute) {
  if (!json || typeof json !== "object") return null;
  var brut = (reponseBrute || "").toLowerCase();
  if (["confirme", "corrige", "ambigu"].indexOf(json.confirmation) === -1) return null;
  if (!json.extrait || !brut.includes(String(json.extrait).trim().toLowerCase())) return null;
  return {
    confirmation: json.confirmation,
    formulation_retenue: json.formulation_retenue ? String(json.formulation_retenue).slice(0, 300) : null,
    nouvelle_formulation: json.nouvelle_formulation ? String(json.nouvelle_formulation).slice(0, 300) : null,
    extrait: json.extrait
  };
}

async function extraireProtocoleAvecRetry(ctx) {
  var prompt = construirePromptExtractionProtocole(ctx);
  var texte = await appellerClaude(prompt, 300);
  var json = extraireJSON(texte);
  if (!json) {
    texte = await appellerClaude(prompt + " ATTENTION : renvoie uniquement le JSON valide, rien d'autre.", 300);
    json = extraireJSON(texte);
  }
  if (!json) return { ok: false, fallback: true };
  var valide = validerExtractionProtocole(json, ctx.reponse);
  if (!valide) return { ok: false, fallback: true };
  return { ok: true, resultat: valide };
}

// Appelle Claude pour générer une question, avec une tentative de correction si les garde-fous sont violés
async function genererQuestionAvecRetry(ctx) {
  const prompt = construirePromptQuestion(ctx);
  let texte = (await appellerClaude(prompt, 150)).trim();
  function invalide(q) {
    return !q || q.length > 320 || !q.trim().endsWith("?") || contientTournureInterdite(q);
  }
  if (invalide(texte)) {
    const promptCorrectif = prompt + " ATTENTION : ta réponse précédente ne respectait pas les règles (trop longue, pas une question, ou formulation interdite). Recommence en respectant strictement les règles.";
    texte = (await appellerClaude(promptCorrectif, 150)).trim();
  }
  if (invalide(texte)) return { ok: false, fallback: true };
  return { ok: true, question: texte };
}

const crypto = require("crypto");
const STRIPE_WEBHOOK_SECRET = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();

// Vérifie que la requête vient bien de Stripe (et pas d'un imposteur) en recalculant la signature
function verifierSignatureStripe(payloadBrut, signatureHeader, secret) {
  try {
    const parts = signatureHeader.split(",").reduce((acc, part) => {
      const [k, v] = part.split("=");
      acc[k] = v;
      return acc;
    }, {});
    const timestamp = parts["t"];
    const signatureRecue = parts["v1"];
    if (!timestamp || !signatureRecue) return false;
    const signaturePayload = timestamp + "." + payloadBrut;
    const signatureAttendue = crypto.createHmac("sha256", secret).update(signaturePayload, "utf8").digest("hex");
    const bufRecue = Buffer.from(signatureRecue, "utf8");
    const bufAttendue = Buffer.from(signatureAttendue, "utf8");
    if (bufRecue.length !== bufAttendue.length) return false;
    return crypto.timingSafeEqual(bufRecue, bufAttendue);
  } catch (e) { return false; }
}

const server = http.createServer((req, res) => {
 res.setHeader("Access-Control-Allow-Origin", SITE_ORIGIN);
 res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
 res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
 if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

 if (req.method === "POST" && req.url === "/api/stripe-webhook") {
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", async () => {
     try {
       const signature = req.headers["stripe-signature"];
       if (!verifierSignatureStripe(body, signature, STRIPE_WEBHOOK_SECRET)) {
         console.log("Webhook Stripe: signature invalide, requete rejetee");
         console.log("  -> STRIPE_WEBHOOK_SECRET defini:", !!STRIPE_WEBHOOK_SECRET, "longueur:", STRIPE_WEBHOOK_SECRET.length);
         console.log("  -> en-tete stripe-signature recu:", signature ? signature.substring(0, 30) + "..." : "AUCUN");
         res.writeHead(400);
         res.end("Signature invalide");
         return;
       }
       const event = JSON.parse(body);
       if (event.type === "checkout.session.completed") {
         const session = event.data.object;
         const code = session.client_reference_id;
         if (code) {
           const result = await supabaseRequest("PATCH", "clients?code=eq." + encodeURIComponent(code), { statut: "actif" });
           console.log("Paiement confirme pour code " + code + ", statut:", result.status);
         } else {
           console.log("Webhook Stripe: checkout.session.completed sans client_reference_id");
         }
       }
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify({ received: true }));
     } catch (e) {
       console.log("ERREUR webhook Stripe:", e.message);
       res.writeHead(400);
       res.end(JSON.stringify({ error: e.message }));
     }
   });
   return;
 }

 if (req.method === "GET" && req.url === "/api/load") {
   supabaseRequest("GET", "liberetoi_data?id=eq.1&select=payload")
     .then(result => {
       try {
         const rows = JSON.parse(result.data);
         if (rows && rows.length > 0 && rows[0].payload) {
           const p = rows[0].payload;
           console.log("LOAD: clients=" + (p.clients||[]).length + " reponses_keys=" + Object.keys(p.reponses||{}).length);
           res.writeHead(200, { "Content-Type": "application/json" });
           res.end(JSON.stringify(p));
         } else {
           res.writeHead(200, { "Content-Type": "application/json" });
           res.end(JSON.stringify({ clients: [], reponses: {}, rapports: {} }));
         }
       } catch(e) {
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ clients: [], reponses: {}, rapports: {} }));
       }
     }).catch(e => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
   return;
 }

 if (req.method === "POST" && req.url === "/api/save") {
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", async () => {
     try {
       const data = JSON.parse(body);
       const repKeys = Object.keys(data.reponses || {});
       console.log("SAVE: clients=" + (data.clients||[]).length + " reponses_ids=" + JSON.stringify(repKeys));
       const result = await supabaseRequest("POST", "liberetoi_data", { id: 1, payload: data }, { "Prefer": "resolution=merge-duplicates,return=minimal" });
       console.log("Supabase upsert status:", result.status);
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify({ ok: true }));
     } catch(e) {
       console.log("ERREUR SAVE:", e.message);
       res.writeHead(400);
       res.end(JSON.stringify({ error: e.message }));
     }
   });
   return;
 }

 if (req.method === "POST" && req.url === "/api/generate") {
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", async () => {
     try {
       // Vérifie qu'une vraie session Supabase (cliente ou coach) est fournie
       const authHeader = req.headers["authorization"] || "";
       const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
       const utilisateur = await verifierUtilisateurSupabase(token);
       if (!utilisateur) {
         res.writeHead(401, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Non autorisé. Connecte-toi pour utiliser cette fonctionnalité." }));
         return;
       }
       if (depasseLimite(utilisateur.id)) {
         res.writeHead(429, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Trop de requêtes. Réessaie dans quelques minutes." }));
         return;
       }

       const { prompt, max_tokens } = JSON.parse(body);
       const payload = JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: max_tokens || 800, messages: [{ role: "user", content: prompt }] });
       const options = { hostname: "api.anthropic.com", path: "/v1/messages", method: "POST", headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" } };
       const apiReq = https.request(options, apiRes => {
         let data = "";
         apiRes.on("data", chunk => data += chunk);
         apiRes.on("end", () => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(data); });
       });
       apiReq.on("error", e => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
       apiReq.write(payload);
       apiReq.end();
     } catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: e.message })); }
   });
   return;
 }

 if (req.method === "POST" && req.url === "/api/extract") {
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", async () => {
     try {
       const authHeader = req.headers["authorization"] || "";
       const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
       const utilisateur = await verifierUtilisateurSupabase(token);
       if (!utilisateur) {
         res.writeHead(401, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Non autorisé." }));
         return;
       }
       if (depasseLimite(utilisateur.id)) {
         res.writeHead(429, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Trop de requêtes. Réessaie dans quelques minutes." }));
         return;
       }
       const ctx = JSON.parse(body);
       if (!ctx || !ctx.reponse || !ctx.categorie) {
         res.writeHead(400, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Contexte incomplet." }));
         return;
       }
       // Log sans exposer le contenu sensible complet (juste des métadonnées)
       console.log("EXTRACT: categorie=" + ctx.categorie + " semaine=" + ctx.semaine + " jour=" + ctx.jour + " longueur_reponse=" + ctx.reponse.length);

       // GARDE-FOU SÉCURITÉ : détection déterministe AVANT tout appel IA.
       // Si un signal est détecté, on ne génère jamais d'hypothèse psychologique sur ce texte.
       var alerte = detecterSignalAlerte(ctx.reponse);
       if (alerte) {
         console.log("ALERTE SÉCURITÉ détectée : type=" + alerte.type + " urgence=" + alerte.niveau_urgence + " temporalite=" + alerte.temporalite + " cible=" + alerte.cible + " categorie=" + ctx.categorie + " semaine=" + ctx.semaine + " jour=" + ctx.jour + " (aucune extraction psychologique effectuée)");
         res.writeHead(200, { "Content-Type": "application/json" });
         res.end(JSON.stringify({
           ok: true,
           alerte: { type: alerte.type, niveau_urgence: alerte.niveau_urgence, temporalite: alerte.temporalite, cible: alerte.cible, message: messagePrudencePour(alerte) },
           extraction: { dimensions_maj: [], nouvelles_hypotheses: [], preuves_ajoutees: [], corrections: [], exceptions: [], resultats_experimentation: [], marqueurs_progres: [], pistes_transversales: [] }
         }));
         return;
       }

       let resultat;
       try {
         if (ctx.type === "protocole_confirmation") {
           resultat = await extraireProtocoleAvecRetry(ctx);
         } else {
           resultat = await extraireAvecRetry(ctx);
         }
       } catch (e) {
         console.log("ERREUR extraction (appel IA):", e.message);
         resultat = { ok: false, fallback: true };
       }
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify(resultat));
     } catch (e) {
       console.log("ERREUR /api/extract:", e.message);
       // Important : même en cas d'erreur, on répond 200 avec fallback:true
       // pour que le frontend sache qu'il doit sauvegarder la réponse brute sans bloquer le parcours.
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify({ ok: false, fallback: true, error: e.message }));
     }
   });
   return;
 }

 if (req.method === "POST" && req.url === "/api/generate-question") {
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", async () => {
     try {
       const authHeader = req.headers["authorization"] || "";
       const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
       const utilisateur = await verifierUtilisateurSupabase(token);
       if (!utilisateur) {
         res.writeHead(401, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Non autorisé." }));
         return;
       }
       if (depasseLimite(utilisateur.id)) {
         res.writeHead(429, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Trop de requêtes. Réessaie dans quelques minutes." }));
         return;
       }
       const ctx = JSON.parse(body);
       if (!ctx || !ctx.categorie || !ctx.type) {
         res.writeHead(400, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Contexte incomplet." }));
         return;
       }
       console.log("GENERATE-QUESTION: categorie=" + ctx.categorie + " semaine=" + ctx.semaine + " type=" + ctx.type + " raison=" + JSON.stringify(ctx.raison || null));
       let resultat;
       try {
         resultat = await genererQuestionAvecRetry(ctx);
       } catch (e) {
         console.log("ERREUR génération question (appel IA):", e.message);
         resultat = { ok: false, fallback: true };
       }
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify(resultat));
     } catch (e) {
       console.log("ERREUR /api/generate-question:", e.message);
       res.writeHead(200, { "Content-Type": "application/json" });
       res.end(JSON.stringify({ ok: false, fallback: true, error: e.message }));
     }
   });
   return;
 }

 if (req.method === "POST" && req.url === "/api/log-selection") {
   // Route de traçabilité pure : journalise la raison de sélection de CHAQUE question
   // (structurante ou générée), même quand aucun appel IA n'est fait. Ne fait aucun appel
   // externe, ne touche à aucune donnée — juste un log serveur consultable dans Render.
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", () => {
     try {
       const authHeader = req.headers["authorization"] || "";
       const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
       // Pas de blocage strict ici (log best-effort), mais on vérifie quand même la session
       // pour éviter qu'un tiers non authentifié ne spam les logs.
       verifierUtilisateurSupabase(token).then(function(utilisateur) {
         if (!utilisateur) { res.writeHead(204); res.end(); return; }
         const info = JSON.parse(body);
         console.log("SELECTION: categorie=" + info.categorie + " semaine=" + info.semaine + " jour=" + info.jour
           + " mode=" + info.mode + " type=" + (info.type || "-") + " raison=\"" + (info.raison || "") + "\"");
         res.writeHead(204);
         res.end();
       }).catch(function() { res.writeHead(204); res.end(); });
     } catch (e) { res.writeHead(204); res.end(); }
   });
   return;
 }

 if (req.method === "POST" && req.url === "/api/reset-password") {
   let body = "";
   req.on("data", chunk => body += chunk);
   req.on("end", async () => {
     try {
       const ip = req.socket.remoteAddress || "inconnu";
       if (depasseLimiteReset(ip)) {
         res.writeHead(429, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Trop de tentatives. Réessaie dans 15 minutes." }));
         return;
       }
       const { email, code, newPassword } = JSON.parse(body);
       if (!email || !code || !newPassword || newPassword.length < 6) {
         res.writeHead(400, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Champs invalides." }));
         return;
       }
       const check = await supabaseRequest("GET", "clients?email=ilike." + encodeURIComponent(email.toLowerCase()) + "&code=ilike." + encodeURIComponent(code.toUpperCase()) + "&select=auth_id");
       const rows = JSON.parse(check.data);
       if (!rows || rows.length === 0 || !rows[0].auth_id) {
         res.writeHead(401, { "Content-Type": "application/json" });
         res.end(JSON.stringify({ error: "Email ou code incorrect." }));
         return;
       }
       const authId = rows[0].auth_id;
       const payload = JSON.stringify({ password: newPassword });
       const options = {
         hostname: SUPABASE_HOST,
         path: "/auth/v1/admin/users/" + authId,
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
           "apikey": SUPABASE_SERVICE_KEY,
           "Authorization": "Bearer " + SUPABASE_SERVICE_KEY,
           "Content-Length": Buffer.byteLength(payload)
         }
       };
       const adminReq = https.request(options, adminRes => {
         let data = "";
         adminRes.on("data", chunk => data += chunk);
         adminRes.on("end", () => {
           if (adminRes.statusCode >= 200 && adminRes.statusCode < 300) {
             res.writeHead(200, { "Content-Type": "application/json" });
             res.end(JSON.stringify({ ok: true }));
           } else {
             console.log("Erreur admin update password:", adminRes.statusCode, data.substring(0,200));
             res.writeHead(500, { "Content-Type": "application/json" });
             res.end(JSON.stringify({ error: "Erreur lors de la mise à jour du mot de passe." }));
           }
         });
       });
       adminReq.on("error", e => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
       adminReq.write(payload);
       adminReq.end();
     } catch(e) {
       res.writeHead(400, { "Content-Type": "application/json" });
       res.end(JSON.stringify({ error: e.message }));
     }
   });
   return;
 }

 res.writeHead(200, { "Content-Type": "text/plain" });
 res.end("Liber-toi backend actif");
});

if (require.main === module) {
  server.listen(PORT, () => console.log("Serveur lance sur port " + PORT));
}

module.exports = { detecterSignalAlerte: detecterSignalAlerte, MESSAGES_PRUDENCE: MESSAGES_PRUDENCE, MESSAGES_PRUDENCE_TIERS: MESSAGES_PRUDENCE_TIERS, messagePrudencePour: messagePrudencePour };

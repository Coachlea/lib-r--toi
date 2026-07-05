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

const crypto = require("crypto");
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

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

server.listen(PORT, () => console.log("Serveur lance sur port " + PORT));

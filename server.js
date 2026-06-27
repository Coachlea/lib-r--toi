const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_HOST = "zalqoyfgiyzbjodsbszy.supabase.co";

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

setInterval(() => { http.get("http://localhost:" + PORT + "/").on("error", () => {}); }, 14 * 60 * 1000);

const server = http.createServer((req, res) => {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
 res.setHeader("Access-Control-Allow-Headers", "Content-Type");
 if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

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
   req.on("end", () => {
     try {
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

 res.writeHead(200, { "Content-Type": "text/plain" });
 res.end("Liber-toi backend actif");
});

server.listen(PORT, () => console.log("Serveur lance sur port " + PORT));

const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_HOST = "zalqoyfgiyzbjodsbszy.supabase.co";

function supabaseRequest(method, path, body) {
 return new Promise((resolve, reject) => {
   const payload = body ? JSON.stringify(body) : null;
   const options = {
     hostname: SUPABASE_HOST,
     path: "/rest/v1/" + path,
     method: method,
     headers: {
       "Content-Type": "application/json",
       "apikey": SUPABASE_KEY,
       "Authorization": "Bearer " + SUPABASE_KEY,
       "Prefer": "return=minimal"
     }
   };
   if (payload) options.headers["Content-Length"] = Buffer.byteLength(payload);
   const req = https.request(options, res => {
     let data = "";
     res.on("data", chunk => data += chunk);
     res.on("end", () => resolve(data || "{}"));
   });
   req.on("error", reject);
   if (payload) req.write(payload);
   req.end();
 });
}

setInterval(() => {
 http.get("http://localhost:" + PORT + "/").on("error", () => {});
}, 14 * 60 * 1000);

const server = http.createServer((req, res) => {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
 res.setHeader("Access-Control-Allow-Headers", "Content-Type");

 if (req.method === "OPTIONS") {
   res.writeHead(204);
   res.end();
   return;
 }

 if (req.method === "GET" && req.url === "/api/load") {
   su

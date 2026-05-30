const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = "https://zalqoyfgiyzbjodsbszy.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;

function supabaseRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "zalqoyfgiyzbjodsbszy.supabase.co",
      path: "/rest/v1/" + path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer": "return=representation"
      }
    };
    const req = https.request(options, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/api/clients") {
    supabaseRequest("GET", "clients?select=*").then(data => {
      const rows = JSON.parse(data);
      const clients = rows.map(r => r.data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(clients));
    }).catch(e => {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/clients") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const clients = JSON.parse(body);
        for (const c of clients) {
          await supabaseRequest("POST", "clients?on_conflict=id", [{ id: c.id, data: c }])
            .catch(() => supabaseRequest("PATCH", "clients?id=eq." + c.id, { data: c }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
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
        const payload = JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: max_tokens || 800,
          messages: [{ role: "user", content: prompt }]
        });
        const options = {
          hostname: "api.anthropic.com",
          path: "/v1/messages",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
          }
        };
        const apiReq = https.request(options, apiRes => {
          let data = "";
          apiRes.on("data", chunk => data += chunk);
          apiRes.on("end", () => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(data);
          });
        });
        apiReq.on("error", e => {
          res.writeHead(500);
          res.end(JSON.stringify({ error: e.message }));
        });
        apiReq.write(payload);
        apiReq.end();
      } catch(e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Liber-toi backend actif");
  }
});

server.listen(PORT, () => console.log("Serveur lance sur port " + PORT));

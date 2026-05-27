const http = require("http");
const https = require("https");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204); res.end(); return;
  }

  if (req.method === "POST" && req.url === "/api/generate") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const { prompt, max_tokens } = JSON.parse(body);
      const payload = JSON.stringify({
        model: "claude-sonnet-4-20250514",
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
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      });
      apiReq.write(payload);
      apiReq.end();
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Liber-toi backend actif");
  }
});

server.listen(PORT, () => console.log("Serveur lancé sur port " + PORT));

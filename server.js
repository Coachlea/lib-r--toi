const http = require(“http”);

const server = http.createServer((req, res) => {
res.writeHead(200, { “Content-Type”: “text/plain” });
res.end(“Liber-toi backend actif”);
});

server.listen(10000, () => {
console.log(“Serveur lancé”);
});

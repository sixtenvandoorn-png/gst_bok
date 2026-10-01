const http = require("http");
const fs = require("fs");

http.createServer((req, res) => {

  // 1. Formuläret skickas: spara inlägget i textfilen
  if (req.method === "POST" && req.url === "/save") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const params = new URLSearchParams(body);
      fs.appendFileSync("inlagg.txt", params.get("message") + "\n");
      res.writeHead(303, { Location: "/" });
      res.end();
    });
    return;
  }

  // 2. Annars: visa sidan med alla inlägg
  let entries = "";
  if (fs.existsSync("inlagg.txt")) {
    entries = fs.readFileSync("inlagg.txt", "utf8");
  }

  const page = fs.readFileSync("page.html", "utf8");
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page.replace("{{entries}}", entries));

}).listen(3000, () => console.log("http://localhost:3000"));
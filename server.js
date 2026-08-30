require("dd-trace").init({
  dynamicInstrumentation: { enabled: true },
});

const http = require("http");
const { CityIndex } = require("./services/delivery-promise/src/promise/CityIndex");
const { CityConfig } = require("./services/delivery-promise/src/promise/CityConfig");
const { RegionDatasetLoader } = require("./services/delivery-promise/src/promise/RegionDatasetLoader");
const { DeliveryPromiseService } = require("./services/delivery-promise/src/promise/DeliveryPromiseService");

const cityIndex = new CityIndex();
// Region dataset keys are ASCII slugs, e.g. "Sao Paulo" (no diacritics).
cityIndex.add(new CityConfig("Sao Paulo", 2, "BRL"));
cityIndex.add(new CityConfig("Buenos Aires", 3, "ARS"));
cityIndex.add(new CityConfig("Santiago", 3, "CLP"));
cityIndex.add(new CityConfig("Mexico City", 2, "MXN"));

const regionDatasetLoader = new RegionDatasetLoader();
regionDatasetLoader.reload(
  JSON.stringify({
    latam: {
      Brazil: ["Sao Paulo"],
      Argentina: ["Buenos Aires"],
      Chile: ["Santiago"],
      Mexico: ["Mexico City"],
    },
  })
);

const deliveryPromiseService = new DeliveryPromiseService(regionDatasetLoader, cityIndex);

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/estimate") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let request;
      try {
        request = JSON.parse(body || "{}");
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
        return;
      }
      const promise = deliveryPromiseService.estimate(request);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(promise));
    });
    return;
  }

  if (req.method === "GET" && req.url === "/__debug/agent-info") {
    http.get("http://127.0.0.1:8126/info", (agentRes) => {
      let data = "";
      agentRes.on("data", (chunk) => (data += chunk));
      agentRes.on("end", () => {
        res.writeHead(agentRes.statusCode, { "Content-Type": "application/json" });
        res.end(data);
      });
    }).on("error", (err) => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`delivery-promise-service listening on port ${port}`);
});

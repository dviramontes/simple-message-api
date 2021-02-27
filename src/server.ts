import express from "express";
import bodyParser = require("body-parser");
import { api, healthCheck } from "./routes";
import { pingDatabase } from "./db";

const PORT = process.env.PORT || 4000;

(async () => {
  const app = express();

  // middleware
  app.use(bodyParser.json());
  app.use("/ping", healthCheck);
  app.use("/api", api);

  await pingDatabase();

  app.listen(PORT);

  console.log(`server running on ${PORT}`);
})();

import express from "express";
import bodyParser = require("body-parser");
import { api, healthCheck } from "./routes";
import { pingDatabase, resetDB } from "./db";

require("dotenv").config(); // load .env

const PORT = process.env.PORT || 4000;

(async () => {
  const app = express();

  // middleware
  app.use(bodyParser.json());
  app.use("/ping", healthCheck);
  app.use("/api", api);

  await pingDatabase();

  if (process.env.RESET_DB === "true") {
    // await resetDB();
  }

  app.listen(PORT);

  console.log(`-- server running on ${PORT}`);
})();

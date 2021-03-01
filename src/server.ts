import express from "express";
import bodyParser = require("body-parser");
import { api, healthCheck } from "./routes";
import { initDB, pingDatabase } from "./db";

// eslint-disable-next-line
require("dotenv").config(); // load .env

const app: express.Express = express();

(async () => {
  const PORT = process.env.PORT || 4000;

  // middleware
  app.use(bodyParser.json());
  app.use("/ping", healthCheck);
  app.use("/api", api);

  await pingDatabase();

  if (process.env.INIT_DB === "true") {
    await initDB();
  }

  app.listen(PORT);

  console.log(`-- server running on ${PORT}`);
})();

export default app;

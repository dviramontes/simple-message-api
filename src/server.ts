import express from "express";
import bodyParser = require("body-parser");
import { healthCheck } from "./routes";
import { pingDatabase } from "./db";

const PORT = process.env.PORT || 4000;

(async () => {
  const app = express();

  // middleware
  app.use(bodyParser.json());
  app.use("/ping", healthCheck);

  await pingDatabase();

  app.listen(PORT);

  console.log(`server running on ${PORT}`);
})();

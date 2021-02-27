import express from "express";
import bodyParser = require("body-parser");
import { healthCheck } from "./routes";
const PORT = process.env.PORT || 4000;
const app = express();

// middleware
app.use(bodyParser.json());
app.use("/ping", healthCheck);

app.listen(PORT, () => console.log(`server running on ${PORT}`));

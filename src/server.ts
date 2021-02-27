import express from "express";

const PORT = process.env.PORT || 4000;
const app = express();

app.get("/ping", (req, res) => res.send("pong"));

app.listen(PORT, () => console.log(`server running on ${PORT}`));

import express from "express";
import {
  pingHandler,
  getAllMessagesHandler,
  createMessageHandler,
  getMessageHandler,
  createUserHandler,
  getUserHandler,
  createConvoHandler,
  getConvoHandler,
} from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/all-messages", getAllMessagesHandler);

api.post("/convo", createConvoHandler);
api.get("/convo/:id", getConvoHandler);

api.post("/message", createMessageHandler);
api.get("/message/:id", getMessageHandler);

api.post("/user", createUserHandler);
api.get("/user/:id", getUserHandler);

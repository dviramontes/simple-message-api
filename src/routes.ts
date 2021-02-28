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
  getAllUsersHandler,
} from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/all-messages", getAllMessagesHandler);

api.post("/convos", createConvoHandler);
api.get("/convos/:id", getConvoHandler);

api.post("/messages", createMessageHandler);
api.get("/messages/:id", getMessageHandler);

api.post("/users", createUserHandler);
api.get("/users/:id", getUserHandler);
api.get("/users", getAllUsersHandler);

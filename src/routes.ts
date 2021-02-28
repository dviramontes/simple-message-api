import express from "express";
import {
  pingHandler,
  getAllMessagesHandler,
  createMessageHandler,
  getMessageHandler,
  createUserHandler,
  getUserHandler,
  createChatHandler,
  getChatHandler,
  getAllUsersHandler,
} from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/all-messages", getAllMessagesHandler);

api.post("/chats", createChatHandler);
api.get("/chats/:id", getChatHandler);

api.post("/messages", createMessageHandler);
api.get("/messages/:id", getMessageHandler);

api.post("/users", createUserHandler);
api.get("/users/:id", getUserHandler);
api.get("/users", getAllUsersHandler);

import express from "express";
import { pingHandler, getAllMessages, createMessage } from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

export const api = express.Router();

api.get("/all-messages", getAllMessages);
api.post("/message", createMessage)

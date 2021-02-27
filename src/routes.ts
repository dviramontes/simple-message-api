import express from "express";
import { pingHandler } from "./handlers";

export const healthCheck = express.Router();

healthCheck.all("/", pingHandler);

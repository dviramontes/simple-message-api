import { Request, Response } from "express";
import {allMessagesController, createMessageController} from "./controllers";
import { isEmpty, uniqueId } from "lodash";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const getAllMessages = async (req: Request, res: Response) => {
  const result = await allMessagesController();
  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).send(result.value);
  }
};

export const createMessage = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.status(400).send("missing request body");
    return;
  }

  let { uuid = "", content, recipientId, senderId } = req.body;
  if (isEmpty(uuid)) {
    uuid = uniqueId("user_");
  }

  console.log({uuid});

  const result = await createMessageController(uuid, content, recipientId, senderId);
  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).send(result.value);
  }
}

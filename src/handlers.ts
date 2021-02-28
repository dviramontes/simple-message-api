import { Request, Response } from "express";
import {
  allMessagesController,
  convoExists,
  createConvo,
  createMessage,
  getconvoById,
  getMessage,
  getOrCreateUser,
  getUserById,
} from "./controllers";
import { isEmpty, uniqueId, isNull } from "lodash";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const createConvoHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.status(400).send("missing request body");
    return;
  }

  const { userId, recipientId } = req.body;

  const getConvoResult = await convoExists(userId, recipientId);

  if (getConvoResult.isErr()) {
    return res.status(500).send(getConvoResult.error);
  }

  if (getConvoResult.isOk()) {
    if (isNull(getConvoResult.value)) {
      const createConvoResult = await createConvo(userId, recipientId);

      if (createConvoResult.isOk()) {
        return res.status(200).json(createConvoResult.value);
      }
      if (createConvoResult.isErr()) {
        return res.status(500).send(createConvoResult.error);
      }
    }
    return res.status(200).json(getConvoResult.value);
  }
};

export const getConvoHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params)) {
    res.status(400).send("missing :id url param");
    return;
  }

  const { id } = req.params;

  const result = await getconvoById(+id);

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).json(result.value);
  }
};

export const getAllMessagesHandler = async (req: Request, res: Response) => {
  const result = await allMessagesController();
  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).json(result.value);
  }
};

export const createMessageHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.status(400).send("missing request body");
    return;
  }

  const { convoId, sendById, content } = req.body;

  const result = await createMessage(convoId, sendById, content);

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).send("message posted successfully");
  }
};

export const getMessageHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params)) {
    res.status(400).send("missing :id url param");
    return;
  }

  const { id } = req.params;

  const result = await getMessage(+id);

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).json(result.value || {});
  }
};

export const createUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.status(400).send("missing request body");
    return;
  }

  let { uuid } = req.body;
  if (isEmpty(uuid)) {
    uuid = uniqueId("user_");
  }

  const result = await getOrCreateUser(uuid);

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).json(result.value);
  }
};

export const getUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params)) {
    res.status(400).send("missing user :id url param");
    return;
  }

  const { id } = req.params;

  const result = await getUserById(+id);

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    if (result.value) {
      return res.status(200).json(result.value);
    }
    return res.status(404).send(`user with id: ${id}, not found`);
  }
};

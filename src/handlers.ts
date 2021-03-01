import { Request, Response } from "express";
import {
  allMessagesController,
  chatExists,
  createChat,
  createMessage,
  getAllUsers,
  getchatById,
  getMessage,
  getOrCreateUser,
  getUserById,
} from "./controllers";
import { isEmpty, uniqueId, isNull } from "lodash";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const createChatHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.status(400).send("missing request body");
    return;
  }

  const { userId, recipientId } = req.body;

  const getChatResult = await chatExists(userId, recipientId);

  if (getChatResult.isErr()) {
    return res.status(500).send(getChatResult.error);
  }

  if (getChatResult.isOk()) {
    if (isNull(getChatResult.value)) {
      const createChatResult = await createChat(userId, recipientId);

      if (createChatResult.isOk()) {
        return res.status(200).json(createChatResult.value);
      }
      if (createChatResult.isErr()) {
        return res.status(500).send(createChatResult.error);
      }
    }
    return res.status(200).json(getChatResult.value);
  }
};

export const getChatHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params)) {
    res.status(400).send("missing :id url param");
    return;
  }

  const { id } = req.params;

  const result = await getchatById(+id);

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

  const { chatId, sendById, content } = req.body;

  const result = await createMessage(chatId, sendById, content);

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    if (isNull(result.value)) {
      return res.status(500).send("message posted failed");
    }
    return res.status(200).json({
      id: result.value.id,
      message: "message posted successfully",
    });
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

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const result = await getAllUsers();

  if (result.isErr()) {
    return res.status(500).send(result.error);
  }

  if (result.isOk()) {
    return res.status(200).json(result.value);
  }
};

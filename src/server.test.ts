import supertest from "supertest";
import app from "./server";
import { resetDB } from "./db";

const request = supertest(app);

describe("API", () => {
  let firstUserid: number;
  let secondUserid: number;
  let thirdUserId: number;
  let firstChatId: number;
  let secondChatId: number;
  let messageId: number;

  it("should reply to /ping health-check", async () => {
    const res = await request.get("/ping");
    expect(res.headers["content-type"]).toMatch(/text\/html/);
    expect(res.text).toEqual("pong");
  });

  describe("Users", () => {
    it("should be able to create users", async () => {
      const createRes = await request
        .post("/api/users")
        .send({ uuid: "user1" })
        .set("Accept", "application/json");

      expect(createRes.status).toEqual(200);
      expect(createRes.body.uuid).toEqual("user1");

      firstUserid = +createRes.body.id;

      const userId = createRes.body.id;
      const getRes = await request.get(`/api/users/${userId}`);
      expect(getRes.status).toEqual(200);
      expect(getRes.body.uuid).toEqual("user1");
    });

    it("should be able to retrieve all users", async () => {
      const createRes = await request
        .post("/api/users")
        .send({ uuid: "user2" })
        .set("Accept", "application/json");

      expect(createRes.status).toEqual(200);

      secondUserid = +createRes.body.id;

      const getRes = await request.get("/api/users");

      expect(getRes.status).toEqual(200);
      expect(getRes.body.length).toEqual(2);
      expect(getRes.body[1].uuid).toEqual("user2");
    });
  });

  describe("Chats", () => {
    it("should be able to create a new chat", async () => {
      const createRes = await request // create a new chat between user1 and user2
        .post("/api/chats")
        .send({
          userId: firstUserid,
          recipientId: secondUserid,
        })
        .set("Accept", "application/json");

      firstChatId = createRes.body.id;

      expect(createRes.status).toEqual(200);
      expect(createRes.body).not.toBeNull();
    });
  });

  describe("Messages", () => {
    it("should be able to create a message", async () => {
      const createRes = await request // send a message on chat 1: user1 <> user2
        .post("/api/messages")
        .send({
          content: "hola!",
          sendById: firstUserid,
          chatId: firstChatId,
        })
        .set("Accept", "application/json");

      messageId = createRes.body.id;

      expect(createRes.status).toEqual(200);
      expect(createRes.body.message).toMatch(/message posted successfully/);
    });

    it("should be able to retrieve a single message by id", async () => {
      const getRes = await request.get(`/api/messages/${messageId}`);

      expect(getRes.status).toEqual(200);
      expect(getRes.body.id).toEqual(messageId);
      expect(getRes.body.content).toMatch(/hola!/);
    });

    describe("all messages endpoint", () => {
      beforeAll(async () => {
        const createUserRes = await request
          .post("/api/users")
          .send({ uuid: "user3" })
          .set("Accept", "application/json");

        thirdUserId = createUserRes.body.id;

        const createChatRes = await request // create a new chat between user1 and user3
          .post("/api/chats")
          .send({
            userId: firstUserid,
            recipientId: thirdUserId,
          })
          .set("Accept", "application/json");

        secondChatId = createChatRes.body.id;

        await request // send a message on chat 2: user1 <> user3
          .post("/api/messages")
          .send({
            content: "¿que tal?!",
            sendById: firstUserid,
            chatId: secondChatId,
          })
          .set("Accept", "application/json");

        await request // send another message on chat 2: user1 <> user3
          .post("/api/messages")
          .send({
            content: "todo bien, ¿Y tu?",
            sendById: thirdUserId,
            chatId: secondChatId,
          })
          .set("Accept", "application/json");
      });

      it("should be able to retrieve all messages", async () => {
        const getRes = await request.get(`/api/all-messages`);

        expect(getRes.status).toEqual(200);
        expect(getRes.body.length).toEqual(3);
      });

      describe("Chats", () => {
        it("should only be able to retrieve the messages in a specific chat", async () => {
          const getRes1 = await request.get(`/api/chats/${firstChatId}`);

          // there is only one message between user1 and user2
          expect(getRes1.status).toEqual(200);
          expect(getRes1.body.length).toEqual(1);

          const getRes2 = await request.get(`/api/chats/${secondChatId}`);

          // and there are two messages between user1 and user3
          expect(getRes2.status).toEqual(200);
          expect(getRes2.body.length).toEqual(2);
        });
      });
    });
  });
});

afterAll(async () => {
  await resetDB();
});

import supertest from "supertest";
import app from "./server";

const request = supertest(app);

describe("API", () => {
  it("should reply to /ping health-check", async () => {
    const res = await request.get("/ping");
    expect(res.headers["content-type"]).toMatch(/text\/html/);
    expect(res.text).toEqual("pong");
  });

  it("should be able to create users", async () => {
    const createRes = await request
      .post("/api/users")
      .send({ uuid: "testUser123" })
      .set("Accept", "application/json");

    expect(createRes.status).toEqual(200);
    expect(createRes.body.uuid).toEqual("testUser123");

    const userId = createRes.body.id;
    const getRes = await request.get(`/api/users/${userId}`);
    expect(getRes.status).toEqual(200);
    expect(getRes.body.uuid).toEqual("testUser123");
  });
});

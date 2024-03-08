import request from "supertest";
import { App } from "supertest/types";
import exp from "constants";
import { LIST_KEY, RedisClient, createApp } from "./app";
import * as redis from 'redis';

let app: App;
let client: RedisClient;

const REDIS_URL = "redis://default:test_env@localhost:6380";

beforeAll(async () => {
  client = redis.createClient({
    url: REDIS_URL
  });
  await client.connect();

  app = createApp(client);
}); 

beforeEach(async () => {
  await client.flushDb();
});

afterAll(async () => {
  await client.flushDb();
  await client.quit();
});

describe("jest", ()=>{
  it("responds with a success message", async () => {
    const response = await request(app)
      .post("/messages")
      .send({ message: "Hello" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Message sent");
  });
});

describe("GET /messages", () => {
  it("responds with a list of messages", async () => {
    await client.lPush(LIST_KEY, ["msg1", "msg2"]);

    const response = await request(app).get("/messages");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(["msg2", "msg1"]);
  });
});
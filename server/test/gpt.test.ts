import app, { server, socket } from "../app.js";
import { redisClient } from "../utils/cache.js";
import { rabbitMqClient, channel } from "../utils/producer.js";
import { createJWT } from "../utils/createJWT.js";
import request from "supertest";

afterAll(async () => {
  socket.close(); // disconnect socket when tests are done
  redisClient.quit(); // disconnect Redis when tests are done
  await channel.close(); // disconnect RabbitMQ when tests are done
  await rabbitMqClient.close(); // disconnect RabbitMQ when tests are done
  server.close();
});

describe("POST /gpt/start", () => {
  test("should response with status code 200", async () => {
    const JWT = await createJWT(
      "native",
      1,
      "test@gmail.com",
      "TEST",
      "picture",
      "0x1234567",
      false
    );

    const response = await request(app)
      .post("/gpt/start")
      .set("Cookie", [`JWT=${JWT.jwt}`])
      .send({ symbol: "ETH" });

    expect(response.statusCode).toBe(200);
  });
});

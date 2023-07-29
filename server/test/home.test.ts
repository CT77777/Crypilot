import app, { server, socket } from "../app.js";
import { redisClient } from "../utils/cache.js";
import { rabbitMqClient, channel } from "../utils/producer.js";
import request from "supertest";

afterAll(async () => {
  socket.close(); // disconnect socket when tests are done
  redisClient.quit(); // disconnect Redis when tests are done
  await channel.close(); // disconnect RabbitMQ when tests are done
  await rabbitMqClient.close(); // disconnect RabbitMQ when tests are done
  server.close();
});

describe("GET /", () => {
  describe("No JWT", () => {
    // should response with status code 200
    test("should response with status code 200", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
    });
  });
  describe("JWT exist", () => {
    // should response with status code 302
    test("should response with status code 302", async () => {
      const response = await request(app).get("/").set("Cookie", ["JWT=jwt"]);
      expect(response.statusCode).toBe(302);
    });
  });
});

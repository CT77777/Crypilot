import app, { server, socket } from "../app.js";
import { redisClient } from "../utils/cache.js";
import { rabbitMqClient, channel } from "../utils/producer.js";
import dbPool from "../models/dbPool.js";
import { RowDataPacket, FieldPacket } from "mysql2";
import request from "supertest";

afterAll(async () => {
  const response: [RowDataPacket[], FieldPacket[]] = await dbPool.query(
    `SELECT id FROM users WHERE email = "test@gmail.com"`
  );
  const { id } = response[0][0];
  await dbPool.query(`DELETE FROM user_providers WHERE user_id = ${id}`);
  await dbPool.query(`DELETE FROM user_wallets WHERE user_id = ${id}`);
  await dbPool.query(`DELETE FROM users WHERE id = ${id}`);

  socket.close(); // disconnect socket when tests are done
  redisClient.quit(); // disconnect Redis when tests are done
  await channel.close(); // disconnect RabbitMQ when tests are done
  await rabbitMqClient.close(); // disconnect RabbitMQ when tests are done
  await dbPool.end();
  server.close();
});

describe("Test user route", () => {
  describe("POST /user/register", () => {
    test("should response with status code 302", async () => {
      const response = await request(app).post("/user/register").send({
        email: "test@gmail.com",
        password: "123",
        username: "TEST",
      });

      expect(response.statusCode).toBe(302);
    });

    test("should response with status code 400 when registering repeat email", async () => {
      const response = await request(app).post("/user/register").send({
        email: "test@gmail.com",
        password: "123",
        username: "TEST",
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /user/login", () => {
    test("should response with status code 200", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          data: {
            email: "test@gmail.com",
            password: "123",
            username: "TEST",
          },
        });

      expect(response.statusCode).toBe(200);
    });

    test("should response with status code 400 when login not exist email", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          data: {
            email: "notExist@gmail.com",
            password: "123",
            username: "TEST",
          },
        });

      expect(response.statusCode).toBe(400);
    });
  });
});

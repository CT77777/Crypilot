import express from "express";
import homeRouter from "./routes/homeRoute.js";
import userRouter from "./routes/userRoute.js";
import marketRouter from "./routes/marketRoute.js";
import tradeRouter from "./routes/tradeRoute.js";
import walletRouter from "./routes/walletRoute.js";
import gptRouter from "./routes/gptRoute.js";
import cookieParser from "cookie-parser";
import { io } from "socket.io-client";
import { redisClient } from "./utils/cache.js";
import fs from "fs";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "../client/views");

app.use(express.static("../client"));

app.use(express.urlencoded({ extended: true })); // resolve form data into req.body
app.use(express.json());
app.use(cookieParser());

app.use("/", [
  homeRouter,
  userRouter,
  marketRouter,
  tradeRouter,
  walletRouter,
  gptRouter,
]);

export const socket = io("wss://localhost:8080", {
  rejectUnauthorized: false,
});

socket.on("connect", function () {
  console.log("Express connect to socket server...");
});

socket.on("connect_error", function (err) {
  console.log(err);
});

redisClient.connect();

app.listen(port, () => {
  console.log("Server is listening on port:3000...");
});

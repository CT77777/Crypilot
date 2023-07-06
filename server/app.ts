import express from "express";
import homeRouter from "./routes/homeRoute.js";
import userRouter from "./routes/userRoute.js";
import marketRouter from "./routes/marketRoute.js";
import tradeRouter from "./routes/tradeRoute.js";
import walletRouter from "./routes/walletRoute.js";
import gptRouter from "./routes/gptRoute.js";
import cookieParser from "cookie-parser";
import { io } from "socket.io-client";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

export const socket = io("ws://localhost:8080");

socket.on("connect", function () {
  console.log("express connect to socket server...");
});

socket.on("connect_error", function (err) {
  console.log(err);
});

app.listen(port, () => {
  console.log("Server is listening on port:3000...");
});

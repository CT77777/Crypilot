import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(
  //   {
  //     key: fs.readFileSync("../../ctceth_ssl/private.key"),
  //     cert: fs.readFileSync("../../ctceth_ssl/certificate.crt"),
  //   },
  app
);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
});

app.use(cors());

io.on("connection", (socket) => {
  console.log(`New connection connected... socket id is {${socket.id}}`);

  socket.on("join room", (room) => {
    try {
      socket.join(room.toString());
      console.log(
        `socket id {${socket.id}} joined the room {${room.toString()}}`
      );
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });

  socket.on("streaming", (content) => {
    try {
      console.log(content);
      socket.broadcast.emit("streaming", content); // send a message to specified room, room name must be the same type
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });

  socket.on("disconnect", () => {
    try {
      console.log(`one connection disconnected... socket id is ${socket.id}`);
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });
});

server.listen(8080, () => {
  console.log("Socket server is listening on port:8080");
});

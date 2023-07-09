import express from "express";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("../../ctceth_ssl/private.key"),
    cert: fs.readFileSync("../../ctceth_ssl/server_bundle.crt"),
  },
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

  socket.on("streaming", (content, room) => {
    try {
      console.log(content);
      socket.broadcast.to(room.toString()).emit("streaming", content); // send a message to specified room, room name must be the same type
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });

  socket.on("streamingContinue", (content, room) => {
    try {
      console.log(content);
      socket.broadcast.to(room.toString()).emit("streamingContinue", content); // send a message to specified room, room name must be the same type
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });

  socket.on("buyEthStatus", (txResult, room) => {
    try {
      console.log(txResult);
      socket.broadcast.to(room.toString()).emit("buyEthStatus", txResult);
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });

  socket.on("swapEthToStatus", (txResult, room) => {
    try {
      console.log(txResult);
      socket.broadcast.to(room.toString()).emit("swapEthToStatus", txResult);
    } catch (error: any) {
      const errorMessage = error.message;
      console.log(errorMessage);
    }
  });

  socket.on("swapTokenToStatus", (txResult, room) => {
    try {
      console.log(txResult);
      socket.broadcast.to(room.toString()).emit("swapTokenToStatus", txResult);
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
  console.log("Socket server is listening on port:8080...");
});

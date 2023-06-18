import express from "express";
import homeRouter from "./routes/homeRoute.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "../client/views");

app.use(express.static("../client"));

app.use("/", homeRouter);

app.listen(port, () => {
  console.log("Server is listening on port:3000...");
});

import express from "express";
import homeRouter from "./routes/homeRoute.js";
import userRouter from "./routes/userRoute.js";
import marketRouter from "./routes/marketRoute.js";
import tradeRouter from "./routes/tradeRoute.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "../client/views");

app.use(express.static("../client"));

app.use(express.urlencoded({ extended: true })); // resolve form data into req.body
app.use(express.json());
app.use(cookieParser());

app.use("/", [homeRouter, userRouter, marketRouter, tradeRouter]);

app.listen(port, () => {
  console.log("Server is listening on port:3000...");
});

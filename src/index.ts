import "reflect-metadata";
import { config } from "dotenv";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import { resolve } from "path";
import cookieParser from "cookie-parser";

config(); // load env variables
import { authRoute } from "./routes/auth";
import trim from "./middlewares/trim";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(resolve("./public")));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(trim);
app.use("/api/v1/auth", authRoute);

const port = process.env.PORT;

createConnection()
  .then(async (connection) => {
    app.listen(port, () => console.log("Server running on port:", port));
  })
  .catch((error) => console.log(error));

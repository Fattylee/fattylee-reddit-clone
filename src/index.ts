import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import { authRoute } from "./routes/auth";
import trim from "./middlewares/trim";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use("/api/v1/auth", authRoute);

const port = 4000;

createConnection()
  .then(async (connection) => {
    app.listen(port, () => console.log("Server running on port:", port));
  })
  .catch((error) => console.log(error));

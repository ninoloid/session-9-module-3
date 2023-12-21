import express from "express";
import dotenv from "dotenv";
import apiRouter from "./common/router/api.router";

if (process.env.NODE_ENV === "development") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log("Server is running on port", port);
});

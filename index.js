import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import router from "./routes/index.js";

const app = express();
dotenv.config();

try {
  await db.authenticate();
  console.log("Database is connected");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running at port : 5000"));

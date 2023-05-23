import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";
import routeAuth from "./routes/routeAuth.js";
import routeUser from "./routes/routeUser.js";

const app = express();
dotenv.config();

try {
  await db.authenticate();
  console.log("Database is connected");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(routeAuth);
app.use(routeUser);

app.listen(5000, () => console.log("Server running at port : 5000"));

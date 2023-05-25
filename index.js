import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import routeAuth from "./routes/routeAuth.js";
import routeUser from "./routes/routeUser.js";
import routeTaskStatus from "./routes/routeTaskStatus.js";

const app = express();
dotenv.config();

try {
  await db.authenticate();
  console.log("Database is connected");
} catch (error) {
  console.log(error);
}

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(routeAuth);
app.use(routeUser);
app.use(routeTaskStatus);

app.listen(process.env.APP_PORT, () =>
  console.log(`Server running at port : ${process.env.APP_PORT}`)
);

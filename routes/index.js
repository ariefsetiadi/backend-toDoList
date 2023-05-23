import express from "express";
import { getAllUser, saveUser } from "../controllers/User.js";

const router = express.Router();

router.get("/user", getAllUser);
router.post("/user", saveUser);

export default router;

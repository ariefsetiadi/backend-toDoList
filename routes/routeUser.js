import express from "express";
import { getAllUser, saveUser } from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/user", verifyToken, getAllUser);
router.post("/user", verifyToken, saveUser);

export default router;

import express from "express";
import {
  getAllUser,
  getUserById,
  saveUser,
  updateUser,
  resetPassword,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/user", verifyToken, getAllUser);
router.get("/user/:id", verifyToken, getUserById);
router.post("/user", verifyToken, saveUser);
router.patch("/user/:id", verifyToken, updateUser);
router.patch("/user/reset-password/:id", verifyToken, resetPassword);

export default router;

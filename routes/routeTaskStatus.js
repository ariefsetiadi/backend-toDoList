import express from "express";
import {
  getAllTaskStatus,
  saveAllTaskStatus,
  getTaskStatusById,
  updateTaskStatus,
} from "../controllers/TaskStatus.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/task-status", verifyToken, getAllTaskStatus);
router.get("/task-status/:id", verifyToken, getTaskStatusById);
router.post("/task-status", verifyToken, saveAllTaskStatus);
router.patch("/task-status/:id", verifyToken, updateTaskStatus);

export default router;

import express from "express";
import { Login, refreshToken, Logout } from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", Login);
router.get("/refresh-token", refreshToken);
router.delete("/logout", Logout);

export default router;

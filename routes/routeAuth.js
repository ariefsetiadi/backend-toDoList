import express from "express";
import { Login, refreshToken, Logout, register } from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", Login);
router.get("/refresh-token", refreshToken);
router.delete("/logout", Logout);
router.post("/register", register);

export default router;

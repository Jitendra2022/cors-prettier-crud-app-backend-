import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
const router = express.Router();

/* ---------------- AUTH ROUTES ---------------- */

// User registration
router.post("/register", register);
// User login
router.post("/login", login);
// User logout
router.post("/logout", logout);
// Refresh access token
router.get("/refresh", refreshToken);

export default router;

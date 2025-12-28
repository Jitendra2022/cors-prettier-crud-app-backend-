import express from "express";
import {
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/user.controller.js";
import { authenticateJWT, verifyRole } from "../middleware/auth.middleware.js";
const router = express.Router();

/* ---------------- USER MANAGEMENT ROUTES ---------------- */

// Get all users (Protected + Role-based)
router.get("/users", authenticateJWT, verifyRole("admin"), getUsers);
// Get single user by ID
router.get("/users/:id", authenticateJWT, getUserById);
// Delete user by ID (Protected)
router.delete("/users/:id", authenticateJWT, deleteUserById);
// Update user by ID (Protected)
router.put("/users/:id", authenticateJWT, updateUserById);

export default router;

import express from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  login,
  logout,
  refreshToken,
  register,
  updateById,
} from "../controllers/user.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", authenticateJWT, getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", authenticateJWT, deleteUserById);
router.put("/users/:id", authenticateJWT, updateById);
router.get("/refresh", refreshToken);
export default router;

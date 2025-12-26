import express from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  login,
  register,
} from "../controllers/user.controller.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUserById);
export default router;

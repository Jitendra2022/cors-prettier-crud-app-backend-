import express from "express";
import {
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/otpController.js";

const router = express.Router();
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);

export default router;

import express from "express";
import {
  sendOtpEmail,
  sendOtpPhone,
  verifyOtp,
} from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp-email", sendOtpEmail);
router.post("/send-otp-phone", sendOtpPhone);
router.post("/verify-otp", verifyOtp);

export default router;

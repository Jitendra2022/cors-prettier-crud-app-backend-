import User from "../models/user.model.js";
import { sendEmailOtp } from "../services/emailService.js";
import { sendSmsOtp } from "../services/smsService.js";
import generateOtp from "../utils/generateOtp.js";
import {
  sendOtpEmailValidation,
  sendOtpValidation,
  verifyOtpValidation,
} from "../validation/user.validation.js";

const sendOtpEmail = async (req, res) => {
  try {
    // 1️⃣ Validate incoming data
    const { error } = sendOtpEmailValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    await sendEmailOtp(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in sendOtpEmail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendOtpPhone = async (req, res) => {
  try {
    // 1️⃣ Validate incoming data
    const { error } = sendOtpValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    await sendSmsOtp(phone, otp);

    res.json({ message: "OTP sent to phone" });
  } catch (error) {
    console.error("Error in sendOtpPhone:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    // 1️⃣ Validate incoming data
    const { error } = verifyOtpValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // 2️⃣ Get email or phone from request
    const { email, phone, otp } = req.body;
    const emailOrPhone =
      (email && email.trim().toLowerCase()) || (phone && phone.trim());

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.email === emailOrPhone) user.isEmailVerified = true;
    if (user.phone === emailOrPhone) user.isPhoneVerified = true;

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export { sendOtpEmail, sendOtpPhone, verifyOtp };

import User from "../models/user.model.js";
import { sendEmailOtp } from "../services/emailService.js";
import { sendSmsOtp } from "../services/smsService.js";
import generateOtp from "../utils/generateOtp.js";
import { hashPassword } from "../utils/password.util.js";
import {
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyOtpValidation,
} from "../validation/user.validation.js";

/* --------------------------------------------
1️⃣ Forgot Password - Send OTP
--------------------------------------------- */
const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;
    // 1. Validate input (must provide email or phone)
    const { error } = forgotPasswordValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    // 2. Find user by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    // 3. Generate OTP
    const otp = generateOtp();
    user.otp = otp;
    // 5 minutes expiry
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    // 4. Send OTP via email or SMS
    if (email && user.email === email) await sendEmailOtp(email, otp);
    if (phone && user.phone === phone) await sendSmsOtp(phone, otp);
    // 5. Return success
    res.json({
      success: true,
      message: `OTP sent ${email ? "email" : "phone"} successfully!`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* --------------------------------------------
2️⃣ Verify OTP
--------------------------------------------- */
const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    // 1. Validate input (must provide email or phone)
    const { error } = verifyOtpValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    // 2. Find user by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // 3. Check OTP validity
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    // 4. Mark email or phone as verified
    if (user.email === email) user.isEmailVerified = true;
    if (user.phone === phone) user.isPhoneVerified = true;
    // 5. Mark OTP as VERIFIED
    user.otp = "VERIFIED";
    user.otpExpiry = null;
    await user.save();
    // 6. Return success
    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* --------------------------------------------
3️⃣ Reset Password
--------------------------------------------- */
const resetPassword = async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;
    // 1. Validate input (email/phone + newPassword)
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    // 2. Find user by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // 3. Check if OTP was VERIFIED
    if (user.otp !== "VERIFIED") {
      return res
        .status(403)
        .json({ success: false, message: "OTP verification required" });
    }
    // 4. Hash new password
    user.password = await hashPassword(newPassword);
    // 5. Clear OTP and expiry
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    // 6. Return success
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { forgotPassword, verifyOtp, resetPassword };

import twilio from "twilio";
import "dotenv/config";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSmsOtp = async (to, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
  } catch (error) {
    console.error("Error sending SMS OTP:", error);
    throw new Error("Failed to send SMS OTP"); // Propagate to controller
  }
};
export { sendSmsOtp };

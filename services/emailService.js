import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmailOtp = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email OTP:", error);
  }
};
export { sendEmailOtp };

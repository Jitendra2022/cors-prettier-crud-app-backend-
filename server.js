import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "dotenv/config";

import connectDB from "./database/db.js";
import userRoute from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------------- SECURITY MIDDLEWARE ---------------- */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

/* ---------------- LOGGING ---------------- */
app.use(morgan("dev"));

/* ---------------- BODY PARSERS ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- DATABASE ---------------- */
connectDB();

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/v1", userRoute);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "No routes matched",
  });
});

/* ---------------- SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

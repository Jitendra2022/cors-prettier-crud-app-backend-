import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/v1", userRoute);
// 404 handler (unmatched routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "No routes matched",
  });
});

app.listen(PORT, () => {
  console.log(`Server is listning at port:http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import connectDB from "./database/db.js";
const app = express();
const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(morgan("dev"));
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => {
  console.log(`Server is listning at port:http://localhost:${PORT}`);
});

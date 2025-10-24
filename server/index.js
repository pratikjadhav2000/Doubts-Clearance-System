import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userroutes.js";
import doubtRoutes from "./routes/doubtroutes.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.use("/api/users", userRoutes);
app.use("/api/doubts", doubtRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

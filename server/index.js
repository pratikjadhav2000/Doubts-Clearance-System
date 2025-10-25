import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Google OAuth strategy

// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import doubtRoutes from "./routes/doubtRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // 👈 NEW — User management routes

dotenv.config();

const app = express();

// ✅ CORS Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ JSON Parser
app.use(express.json());

// ✅ Sessions + Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "replace-with-strong-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/users", userRoutes); // 👈 NEW — Admin/User role management

// ✅ Root
app.get("/", (req, res) => {
  res.send("🚀 OAuth + Doubt backend running successfully!");
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

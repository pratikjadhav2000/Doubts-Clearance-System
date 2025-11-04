import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // ✅ Google OAuth strategy

// ✅ Import routes (ensure correct file names and paths)
import authRoutes from "./routes/authRoutes.js";
import doubtRoutes from "./routes/doubtroutes.js"; // ✅ fixed name casing
import userRoutes from "./routes/userRoutes.js"; // for future use
import adminRoutes from "./routes/adminRoutes.js"; 
dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "server", "uploads")));
/* -------------------------------
   ✅ CORS Setup
-------------------------------- */
app.use(
  cors({
    origin:"*",
    credentials: true,
  })
);

/* -------------------------------
   ✅ Body Parser
-------------------------------- */
app.use(express.json());

/* -------------------------------
   ✅ Session + Passport
-------------------------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/* -------------------------------
   ✅ MongoDB Connection
-------------------------------- */
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/doubts_clearance";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

/* -------------------------------
   ✅ Image
-------------------------------- */



/* -------------------------------
   ✅ Routes
-------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); 
/* -------------------------------
   ✅ Root Endpoint
-------------------------------- */
app.get("/", (req, res) => {
  res.send("🚀 Doubts Clearance System backend running successfully!");
});

/* -------------------------------
   ✅ Image Upload Endpoint (Test)
-------------------------------- */
app.use("/uploads", express.static("uploads"));

/* -------------------------------
   ✅ Start Server
-------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { fileURLToPath } from "url";

import "./config/passport.js"; // ✅ Google OAuth strategy

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import doubtRoutes from "./routes/doubtroutes.js";
import userRoutes from "./routes/userroutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/* -------------------------------
   ✅ File path helpers (ESM fix)
-------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------
   ✅ CORS Setup
-------------------------------- */
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

/* -------------------------------
   ✅ CORS Setup (Handles Dev + Prod)
-------------------------------- */
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://doubts-clearance-system.vercel.app", // ✅ your Vercel frontend
  "https://doubts-clearance-system-oc64.vercel.app", // ✅ your backend (for internal checks)
];

// Dynamic origin check
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* -------------------------------
   ✅ Body Parser
-------------------------------- */
app.use(express.json());

/* -------------------------------
   ✅ Serve static uploads (very important)
-------------------------------- */
app.use("/uploads", express.static(path.join(__dirname, "server/uploads")));

// Example: file stored as /uploads/1730834742345-note.png
// → Accessible at http://localhost:5000/uploads/1730834742345-note.png

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
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

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
   ✅ Start Server
-------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

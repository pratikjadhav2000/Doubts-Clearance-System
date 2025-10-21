import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";       // 👈 NEW
import passport from "passport";             // 👈 NEW
import "./config/passport.js";               // 👈 NEW (loads Google strategy)
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ allow cross-origin (frontend later)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ✅ add session & passport before routes
app.use(
  session({
    secret: "replace-with-strong-secret", // use env var in prod
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ connect to Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("OAuth server running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

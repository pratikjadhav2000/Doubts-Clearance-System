import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  googleAuthCallback,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ corrected path

const router = express.Router();

/* -------------------------------
   ✅ Google OAuth Routes
-------------------------------- */

// 1️⃣ Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2️⃣ Google callback (handled by controller)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/login/failed" }),
  googleAuthCallback
);

// 3️⃣ Google failure route
router.get("/login/failed", (_req, res) =>
  res.status(401).json({
    success: false,
    message: "Google login failed or not allowed",
  })
);

/* -------------------------------
   ✅ Local Auth Routes (optional)
-------------------------------- */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* -------------------------------
   ✅ Authenticated User
-------------------------------- */
router.get("/me", protect, getMe);

/* -------------------------------
   ✅ Default Export
-------------------------------- */
export default router;

import express from "express";
import passport from "passport";
import "../config/passport.js";
import { protect } from "../middlewares/authMiddleware.js"; // 👈 moved import to top

const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback (no frontend yet → return JSON)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/login/failed" }),
  (req, res) => {
    const { token, user } = req.user;

    // 🔁 redirect to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL}?token=${token}`;
    res.redirect(redirectUrl);
  }
);


// Failure route
router.get("/login/failed", (_req, res) =>
  res.status(401).json({ success: false, message: "Google login failed or not allowed" })
);

// ✅ protected route (test)
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router; // 👈 keep export last

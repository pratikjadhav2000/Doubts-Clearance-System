import express from "express";
import { googleLogin, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Google OAuth login
router.post("/google", googleLogin);

// Get logged-in user
router.get("/me", protect, getMe);

export default router;

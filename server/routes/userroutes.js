import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getCurrentUser,
  updateUserRole,
  getReputationHistory
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/:userId", getUserProfile);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/:userId", protect, updateUserProfile);

// Admin-only routes
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.put("/:userId/role", protect, authorizeRoles("admin"), updateUserRole);

// Reputation
router.get("/:userId/reputation", getReputationHistory);

export default router;

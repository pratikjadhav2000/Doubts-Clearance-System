import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  getAllDoubts,
  handleDoubtAction,
} from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // ensure correct middleware path

const router = express.Router();

/* -------------------------------
   👤 USER MANAGEMENT
-------------------------------- */
router.get("/users", protect, authorizeRoles("ADMIN"), getAllUsers);
router.put("/users/:id", protect, authorizeRoles("ADMIN"), updateUserStatus);

/* -------------------------------
   ❓ DOUBT MANAGEMENT
-------------------------------- */
router.get("/doubts", protect, authorizeRoles("ADMIN"), getAllDoubts);
router.put("/doubts/:id", protect, authorizeRoles("ADMIN"), handleDoubtAction);

export default router;

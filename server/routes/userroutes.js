import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";

const router = express.Router();

// ✅ Health check (optional)
router.get("/test", (req, res) => {
  res.json({ message: "User route working ✅" });
});

// ✅ Admin-only: Get all users
router.get("/", protect, authorizeRoles("ADMIN"), getAllUsers);

// ✅ Admin-only: Promote or demote user
router.put("/:id/role", protect, authorizeRoles("ADMIN"), updateUserRole);

export default router;

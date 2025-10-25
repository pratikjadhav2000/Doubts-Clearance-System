import express from "express";
import {
  createDoubt,
  checkDuplicateDoubt,
  getAllDoubts,
  getMyDoubts,
  voteDoubt,
  getDashboardStats,
  addReply,         // ✅ new controller
  approveReply,     // ✅ new controller
} from "../controllers/doubtController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js"; // ✅ added authorizeRoles

const router = express.Router();

// ✅ Route health check
router.get("/", (req, res) => {
  res.json({ message: "Doubt route working ✅" });
});

// ✅ Ask Doubt (AskDoubtPage)
router.post("/", protect, createDoubt);

// ✅ Check for duplicate doubts (AskDoubtPage)
router.post("/check-duplicate", protect, checkDuplicateDoubt);

// ✅ Get all doubts (AllDoubtsPage)
router.get("/all", protect, getAllDoubts);

// ✅ Get current user’s doubts (MyDoubtsPage)
router.get("/my", protect, getMyDoubts);

// ✅ Dashboard summary (DashboardPage)
router.get("/dashboard", protect, getDashboardStats);

// ✅ Upvote / Downvote a doubt
router.post("/:id/vote", protect, voteDoubt);

// ✅ Add reply to a doubt (AllDoubtsPage)
router.post("/:id/reply", protect, addReply);

// ✅ Admin-only route: Approve a reply and mark doubt as resolved
router.put(
  "/:doubtId/replies/:replyId/approve",
  protect,
  authorizeRoles("ADMIN"), // only admins can approve replies
  approveReply
);

export default router;

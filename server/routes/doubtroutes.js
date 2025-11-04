import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  createDoubt,
  checkDuplicateDoubt,
  getAllDoubts,
  getMyDoubts,
  voteDoubt,
  getDashboardStats,
  addReply,
  approveReply,
} from "../controllers/doubtController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* -------------------------------
   🧠 Health Check
-------------------------------- */
router.get("/", (req, res) => {
  res.json({ message: "🧠 Doubt routes working properly!" });
});

/* -------------------------------
   🎓 User Routes
-------------------------------- */
// ✅ Ask a new doubt (with attachments)
router.post("/", protect, upload.array("attachments", 5), createDoubt);

// ✅ Check for duplicate doubts
router.post("/check-duplicate", protect, checkDuplicateDoubt);

// ✅ Get all public doubts
router.get("/all", protect, getAllDoubts);

// ✅ Get doubts of the logged-in user
router.get("/my", protect, getMyDoubts);

// ✅ Add a reply (any user can reply)
router.post("/:id/reply", protect, upload.single("attachment"), addReply);

// ✅ Upvote or downvote a doubt
router.post("/:id/vote", protect, voteDoubt);

// ✅ Approve a reply — only the doubt owner can approve
router.patch("/:doubtId/replies/:replyId/approve", protect, approveReply);

// ✅ Dashboard stats
router.get("/dashboard", protect, getDashboardStats);

/* -------------------------------
   🧑‍💻 Admin Routes
-------------------------------- */
// Admin: View all doubts
router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      const { getAllDoubts } = await import("../controllers/doubtController.js");
      return getAllDoubts(req, res, next);
    } catch (err) {
      console.error("Admin fetch doubts error:", err.message);
      res.status(500).json({ message: "Failed to load doubts" });
    }
  }
);

export default router;

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
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // ✅ corrected path

const router = express.Router();
router.post("/", protect, upload.array("attachments", 5), createDoubt);
router.post("/:id/reply", protect, upload.single("attachment"), addReply);
/* -------------------------------
   ✅ Health Check
-------------------------------- */
router.get("/", (req, res) => {
  res.json({ message: "🧠 Doubt routes working properly!" });
});

/* -------------------------------
   🎓 User Routes
-------------------------------- */
// Ask a new doubt
router.post("/", protect, createDoubt);

// Check for duplicates before posting
router.post("/check-duplicate", protect, checkDuplicateDoubt);

// Fetch all doubts (for browsing/search)
router.get("/all", protect, getAllDoubts);

// Fetch doubts posted by the logged-in user
router.get("/my", protect, getMyDoubts);

// Dashboard summary stats
router.get("/dashboard", protect, getDashboardStats);

// ✅ Corrected path for vote (was /vote/:id → should be /:id/vote)
router.post("/:id/vote", protect, voteDoubt);

// Add reply (students or admin can reply)



/* -------------------------------
   🧑‍💻 Admin Routes
-------------------------------- */
// Approve a reply & mark doubt as resolved
router.put(
  "/:doubtId/replies/:replyId/approve",
  protect,
  authorizeRoles("ADMIN"),
  approveReply
);

// Fetch all doubts (for Admin Panel)
router.get(
  "/admin/all",
  protect,
  authorizeRoles("ADMIN"),
  async (req, res, next) => {
    try {
      // Lazy import controller to prevent circular import
      const { getAllDoubts } = await import("../controllers/doubtController.js");
      return getAllDoubts(req, res, next);
    } catch (err) {
      console.error("Admin fetch doubts error:", err.message);
      res.status(500).json({ message: "Failed to load doubts" });
    }
  }
);

export default router;

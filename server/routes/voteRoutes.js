// routes/voteRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upvoteAnswer, downvoteAnswer, getVotesByAnswer } from "../controllers/voteController.js";

const router = express.Router();

// Upvote an answer
router.post("/:answerId/upvote", protect, upvoteAnswer);

// Downvote an answer
router.post("/:answerId/downvote", protect, downvoteAnswer);

// Get votes for an answer
router.get("/:answerId", getVotesByAnswer);

export default router;

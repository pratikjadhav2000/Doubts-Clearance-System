import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAnswer,
  getAnswersByDoubt,
  updateAnswer,
  deleteAnswer,
  upvoteAnswer,
  downvoteAnswer,
  acceptAnswer,
  getAnswerById
} from "../controllers/answerController.js";

const router = express.Router();

// CRUD
router.post("/:doubtId", protect, createAnswer);
router.get("/doubt/:doubtId", getAnswersByDoubt);
router.get("/:answerId", getAnswerById);
router.put("/:answerId", protect, updateAnswer);
router.delete("/:answerId", protect, deleteAnswer);

// Voting
router.post("/:answerId/upvote", protect, upvoteAnswer);
router.post("/:answerId/downvote", protect, downvoteAnswer);

// Accept Answer
router.post("/:answerId/accept", protect, acceptAnswer);

export default router;

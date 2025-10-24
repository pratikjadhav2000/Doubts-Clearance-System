import express from "express";
import {
  createComment,
  getCommentsByAnswer,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD for comments
router.post("/:answerId", protect, createComment);
router.get("/answer/:answerId", getCommentsByAnswer);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

export default router;

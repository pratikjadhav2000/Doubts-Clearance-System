import express from "express";
import {
  createDoubt,
  getAllDoubts,
  getDoubtById,
  updateDoubt,
  deleteDoubt,
  searchDoubts
} from "../controllers/doubtController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CRUD
router.post("/", protect, createDoubt);
router.get("/", getAllDoubts);
router.get("/search", searchDoubts);
router.get("/:doubtId", getDoubtById);
router.put("/:doubtId", protect, updateDoubt);
router.delete("/:doubtId", protect, deleteDoubt);

export default router;

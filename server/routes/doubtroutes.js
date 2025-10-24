import express from "express";
export const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Doubt route working ✅" });
});

export default router;

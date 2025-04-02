import express from "express";
import Performance from "../models/Performance.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin adds a performance review
router.post("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
  const { employee, rating, feedback } = req.body;

  if (!employee || !rating || !feedback) return res.status(400).json({ message: "All fields are required" });

  try {
    const performance = new Performance({ employee, reviewer: req.user.id, rating, feedback });
    await performance.save();
    res.status(201).json({ message: "Performance review added successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error adding performance review" });
  }
});

// ✅ Employee views their performance reviews
router.get("/my-reviews", authMiddleware, async (req, res) => {
  const reviews = await Performance.find({ employee: req.user.id }).populate("reviewer", "name email");
  res.json(reviews);
});

// ✅ Admin views all performance reviews
router.get("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
  const reviews = await Performance.find().populate("employee", "name email").populate("reviewer", "name email");
  res.json(reviews);
});

export default router;

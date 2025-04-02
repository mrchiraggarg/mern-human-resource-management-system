import express from "express";
import Training from "../models/Training.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a training session (HR/Admin)
router.post("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
  const { title, description, date, trainer } = req.body;
  if (!title || !description || !date || !trainer) return res.status(400).json({ message: "All fields are required" });

  try {
    const training = new Training({ title, description, date, trainer });
    await training.save();
    res.status(201).json({ message: "Training session created" });
  } catch (error) {
    res.status(400).json({ message: "Error creating training session" });
  }
});

// ✅ Get all training sessions
router.get("/", authMiddleware, async (req, res) => {
  const trainings = await Training.find().populate("attendees", "name email");
  res.json(trainings);
});

// ✅ Employee enrolls in training
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  const training = await Training.findById(req.params.id);
  if (!training) return res.status(404).json({ message: "Training not found" });

  if (training.attendees.includes(req.user.id)) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  training.attendees.push(req.user.id);
  await training.save();
  res.json({ message: "Enrolled successfully" });
});

export default router;

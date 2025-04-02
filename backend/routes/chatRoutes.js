import express from "express";
import Chat from "../models/Chat.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Send a message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiver, message } = req.body;
    if (!receiver || !message) return res.status(400).json({ message: "Receiver and message are required" });

    const chat = new Chat({ sender: req.user.id, receiver, message });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
});

// ✅ Get chat history between two users
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Chat.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
});

export default router;
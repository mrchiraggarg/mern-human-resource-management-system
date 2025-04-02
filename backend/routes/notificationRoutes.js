import express from "express";
import Notification from "../models/Notification.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get notifications for logged-in user
router.get("/", authMiddleware, async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
});

// router.get("/api/notifications", authMiddleware, async (req, res) => {
//   const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
//   res.json(notifications);
// });

// ✅ Mark a notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();
    res.json({ message: "Notification marked as read" });
});

export default router;
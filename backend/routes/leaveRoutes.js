import express from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";
import sendNotification from "../utils/sendNotification.js";

const router = express.Router();

// ✅ Employee requests leave
router.post("/", authMiddleware, async (req, res) => {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) return res.status(400).json({ message: "All fields are required" });

    const newLeave = new Leave({
        employee: req.user.id,
        startDate,
        endDate,
        reason,
    });

    try {
        await newLeave.save();
        // ✅ Notify HR/Admin
        const hrAdmins = await User.find({ role: { $in: ["hr", "admin"] } });
        hrAdmins.forEach((admin) => sendNotification(admin._id, `New leave request from ${req.user.name}`));

        res.status(201).json({ message: "Leave request submitted" });

        // res.status(201).json({ message: "Leave request submitted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error submitting leave request" });
    }
});

// ✅ Employee views their leave requests
router.get("/my-leaves", authMiddleware, async (req, res) => {
    const leaves = await Leave.find({ employee: req.user.id });
    res.json(leaves);
});

// ✅ Admin views all leave requests
router.get("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
    const leaves = await Leave.find().populate("employee", "name email");
    res.json(leaves);
});

// ✅ Admin updates leave status
router.put("/:id", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    try {
        const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });

        // Notify employee about leave status update
        const leave = await Leave.findById(req.params.id).populate("employee");
        sendNotification(
            leave.employee._id,
            `Your leave request has been ${status}`
        );

        res.json({ message: "Leave status updated", updatedLeave });
    } catch (error) {
        res.status(500).json({ message: "Error updating leave status" });
    }
});

// Add missing export
export default router;

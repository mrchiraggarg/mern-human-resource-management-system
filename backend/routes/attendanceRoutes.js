import express from "express";
import Attendance from "../models/Attendance.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Employee marks attendance
router.post("/mark", authMiddleware, async (req, res) => {
    const { status } = req.body;

    if (!["present", "absent", "on leave"].includes(status))
        return res.status(400).json({ message: "Invalid status" });

    try {
        const existingAttendance = await Attendance.findOne({
            employee: req.user.id,
            date: new Date().toISOString().split("T")[0]
        });

        if (existingAttendance)
            return res.status(400).json({ message: "Attendance already marked for today" });

        const attendance = new Attendance({ employee: req.user.id, status });
        await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error marking attendance" });
    }
});

// ✅ Employee views their attendance
router.get("/my-attendance", authMiddleware, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ employee: req.user.id });
        res.json(attendanceRecords);
    } catch (error) {
        res.status(400).json({ message: "Error fetching your attendance records" });
    }
});

// ✅ Admin views all employees' attendance
router.get("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find().populate("employee", "name email");
        res.json(attendanceRecords);
    } catch (error) {
        res.status(400).json({ message: "Error fetching attendance" });
    }
});

export default router;
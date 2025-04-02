import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: "User registered successfully" });
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
});

// ✅ Create Employee (Admin Only)
router.post("/employees", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) return res.status(400).json({ message: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    try {
        await newUser.save();
        res.status(201).json({ message: "Employee added successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error adding employee" });
    }
});

// ✅ Get all employees (Only HR and Admin)
router.get("/employees", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).select("-password");
        res.json(employees);
    } catch (error) {
        res.status(400).json({ message: "Error fetching employees" });
    }
});

// ✅ Update Employee (Admin Only)
router.put("/employees/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const { name, email, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        );
        res.json({ message: "Employee updated successfully", updatedUser });
    } catch (error) {
        res.status(400).json({ message: "Error updating employee" });
    }
});

// ✅ Delete Employee (Admin Only)
router.delete("/employees/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting employee" });
    }
});

// Get current user profile
router.get("/profile", async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
});

// ✅ Get all users (Only Admin)
router.get("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

export default router;
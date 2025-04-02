import express from "express";
import Payroll from "../models/Payroll.js";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin adds payroll entry
router.post("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
  const { employee, basicSalary: basicSalaryStr, deductions: deductionsStr, bonuses: bonusesStr } = req.body;
  const basicSalary = parseFloat(basicSalaryStr) || 0;
  const deductions = parseFloat(deductionsStr) || 0;
  const bonuses = parseFloat(bonusesStr) || 0;
  const netSalary = basicSalary + bonuses - deductions;
  if (!employee || !basicSalary) return res.status(400).json({ message: "All fields are required" });

  try {
    const payroll = new Payroll({ employee, basicSalary, deductions, bonuses, netSalary });
    await payroll.save();
    res.status(201).json({ message: "Payroll added successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error adding payroll" });
  }
});

// ✅ Employee views their payroll
router.get("/my-payroll", authMiddleware, async (req, res) => {
  const payrollRecords = await Payroll.find({ employee: req.user.id });
  res.json(payrollRecords);
});

// ✅ Admin views all payrolls
router.get("/", authMiddleware, roleMiddleware(["admin", "hr"]), async (req, res) => {
  const payrollRecords = await Payroll.find().populate("employee", "name email");
  res.json(payrollRecords);
});

export default router;

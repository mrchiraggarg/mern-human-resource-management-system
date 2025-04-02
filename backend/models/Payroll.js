import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  basicSalary: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
});

const Payroll = mongoose.model("Payroll", payrollSchema);
export default Payroll;

import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewDate: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, required: true },
});

const Performance = mongoose.model("Performance", performanceSchema);
export default Performance;

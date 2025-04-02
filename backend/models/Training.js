import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  trainer: { type: String, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Training = mongoose.model("Training", trainingSchema);
export default Training;

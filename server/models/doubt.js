import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  status: { type: String, enum: ["Open", "Answered", "Resolved", "Reopened"], default: "Open" },
  askerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attachments: [String],
  views: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Doubt", doubtSchema);

import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  doubtId: { type: mongoose.Schema.Types.ObjectId, ref: "Doubt", required: true },
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  votes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Answer", answerSchema);

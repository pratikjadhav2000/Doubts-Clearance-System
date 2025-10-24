import mongoose from "mongoose";

const reputationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Reputation", reputationSchema);

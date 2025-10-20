import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["upvote", "downvote"], required: true },
}, { timestamps: true });

export default mongoose.model("Vote", voteSchema);

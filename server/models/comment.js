import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true },
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);

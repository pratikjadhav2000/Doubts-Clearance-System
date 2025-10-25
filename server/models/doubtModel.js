// server/models/doubtModel.js
import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    approved: { type: Boolean, default: false }, // ✅ added
  },
  { timestamps: true }
);

const doubtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    votes: { type: Number, default: 0 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    replies: [replySchema],

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "RESOLVED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doubt", doubtSchema);

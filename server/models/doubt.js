import mongoose from "mongoose";

/* -------------------------------
   📌 Sub-schema for replies
-------------------------------- */
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

/* -------------------------------
   📘 Main Doubt Schema
-------------------------------- */
const doubtSchema = new mongoose.Schema(
  {
    // 🧠 Doubt core info
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],

    // 👤 Doubt creator
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🗳️ Voting
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 💬 Replies
    replies: [replySchema],

    // 📈 Doubt status
    status: {
      type: String,
      enum: ["PENDING", "RESOLVED", "HIDDEN"],
      default: "PENDING",
    },

    // 📎 Attachments (optional)
    attachments: [{ type: String }],

    // 👁️ Views tracking
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/* -------------------------------
   🧹 Virtuals and Cleanup
-------------------------------- */
doubtSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

/* -------------------------------
   ⚡ Avoid OverwriteModelError
-------------------------------- */
const Doubt =
  mongoose.models.Doubt || mongoose.model("Doubt", doubtSchema);

export default Doubt;

// server/models/doubtModel.js
import mongoose from "mongoose";

/* -------------------------------
   💬 Reply Subschema
-------------------------------- */
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    image: { type: String }, // optional image for reply
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

/* -------------------------------
   🧠 Main Doubt Schema
-------------------------------- */
const doubtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    replies: [replySchema],

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "RESOLVED"],
      default: "PENDING",
    },

    attachments: [{ type: String }],

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Remove unnecessary mongoose metadata
doubtSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// Avoid recompile error
const Doubt = mongoose.models.Doubt || mongoose.model("Doubt", doubtSchema);
export default Doubt;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["asker", "responder", "moderator"], default: "asker" },
  reputation: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  institute: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

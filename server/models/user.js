import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },

    // ✅ new fields for OAuth
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "google",
    },
    googleId: { type: String },

    // ✅ password now optional (only for "local" users)
    password: { type: String, select: false },

    // roles & status (same as before)
    role: {
      type: String,
      enum: ["ASKER", "RESPONDER", "MODERATOR"],
      default: "ASKER",
    },
    reputation: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// ✅ hash password only if user signs up locally
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.authProvider === "google") return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ helper for local login
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },

    // ✅ OAuth provider info
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "google",
    },
    googleId: { type: String },

    // ✅ password (only for local users)
    password: { type: String, select: false },

    // ✅ Only two roles now
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // 👈 simplified
      default: "USER",
    },

    // ✅ other metadata
    reputation: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// ✅ Hash password only for local users
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.authProvider === "google") return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare entered password (for local login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

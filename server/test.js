import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://ashakumesh0460_db_user:H1nzdbEKklTjrBfa@cluster0.phbzipr.mongodb.net/doubts_clearance";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

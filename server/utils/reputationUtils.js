// utils/reputation.js
import User from "../models/user.js";

export const updateReputation = async (userId, points) => {
  const user = await User.findById(userId);
  if (!user) return;

  // ✅ Initialize reputation if missing
  user.reputation = (user.reputation || 0) + points;

  // ✅ Prevent negative reputation
  if (user.reputation < 0) user.reputation = 0;

  await user.save({ validateBeforeSave: false });
};

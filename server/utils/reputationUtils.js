export const updateReputation = async (userId, points) => {
  const user = await User.findById(userId);
  if (!user) return;
  user.reputation += points;
  await user.save();
};

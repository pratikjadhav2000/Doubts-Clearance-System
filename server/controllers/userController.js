import User from "../models/User.js";
import Reputation from "../models/Reputation.js";

// @desc    Get public user profile by ID
// @route   GET /api/users/:userId
// @access  Public
export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-_id name email role reputation institute profilePic");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get currently logged-in user
// @route   GET /api/users/me
// @access  Protected
export const getCurrentUser = async (req, res) => {
  res.json(req.user); // req.user populated by protect middleware
};

// @desc    Update user profile
// @route   PUT /api/users/:userId
// @access  Protected
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;

  if (userId !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized to update this profile" });

  const { name, institute, profilePic } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.institute = institute || user.institute;
    user.profilePic = profilePic || user.profilePic;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude sensitive info
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (admin only)
// @route   PUT /api/users/:userId/role
// @access  Admin
export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role || user.role;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reputation history of a user
// @route   GET /api/users/:userId/reputation
// @access  Public
export const getReputationHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await Reputation.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

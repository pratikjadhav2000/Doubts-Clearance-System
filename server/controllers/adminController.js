import User from "../models/user.js";
import Doubt from "../models/doubtModel.js";

/* ----------------------------------------------
   👥 Get All Users (Admin Dashboard)
----------------------------------------------- */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ----------------------------------------------
   🔄 Suspend / Activate User
----------------------------------------------- */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      message: `User ${user.isSuspended ? "suspended" : "activated"} successfully`,
      user,
    });
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

/* ----------------------------------------------
   ❓ Get All Doubts for Admin
----------------------------------------------- */
export const getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("user", "name email")
      .populate("replies.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ doubts });
  } catch (error) {
    console.error("❌ Error fetching doubts:", error);
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
};

/* ----------------------------------------------
   ⚙️ Handle Doubt Actions (Approve / Delete)
----------------------------------------------- */
export const handleDoubtAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, replyId } = req.body;

    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    if (action === "approve") {
      const reply = doubt.replies.id(replyId);
      if (!reply) return res.status(404).json({ message: "Reply not found" });

      doubt.replies.forEach((r) => (r.approved = false));
      reply.approved = true;
      doubt.status = "RESOLVED";
      await doubt.save();

      return res.status(200).json({ message: "✅ Doubt approved successfully", doubt });
    }

    if (action === "delete") {
      await Doubt.findByIdAndDelete(id);
      return res.status(200).json({ message: "🗑️ Doubt deleted successfully" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error("❌ Error handling doubt action:", error);
    res.status(500).json({ message: "Failed to process doubt action" });
  }
};

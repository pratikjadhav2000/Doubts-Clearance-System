import Doubt from "../models/doubtModel.js"; // Doubt model

// ✅ 1. Create new doubt (Ask Doubt Page)
export const createDoubt = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const doubt = await Doubt.create({
      title,
      description,
      tags,
      user: req.user._id,
    });

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 2. Check for duplicate doubts before posting
export const checkDuplicateDoubt = async (req, res) => {
  const { title } = req.body;
  try {
    const similar = await Doubt.find({
      title: { $regex: title, $options: "i" },
    })
      .populate("user", "name email")
      .limit(5);

    res.json({ similar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. Get all doubts (All Doubts Page)
export const getAllDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("user", "name email")
      .populate("replies.user", "name email")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4. Get only current user’s doubts (My Doubts Page)
export const getMyDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ user: req.user._id })
      .populate("user", "name email")
      .populate("replies.user", "name email")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 5. Dashboard stats (Dashboard Page)
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Doubt.countDocuments();
    const resolved = await Doubt.countDocuments({ status: "RESOLVED" });
    const pending = total - resolved;

    const recent = await Doubt.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: { total, resolved, pending },
      recent,
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading dashboard data" });
  }
};

// ✅ 6. Upvote / Downvote a doubt (one vote per user)
export const voteDoubt = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const userId = req.user._id;

  try {
    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    doubt.upvotes = doubt.upvotes || [];
    doubt.downvotes = doubt.downvotes || [];

    const hasUpvoted = doubt.upvotes.includes(userId);
    const hasDownvoted = doubt.downvotes.includes(userId);

    if (type === "upvote") {
      if (hasUpvoted) {
        doubt.upvotes = doubt.upvotes.filter(
          (uid) => uid.toString() !== userId.toString()
        );
      } else {
        doubt.upvotes.push(userId);
        doubt.downvotes = doubt.downvotes.filter(
          (uid) => uid.toString() !== userId.toString()
        );
      }
    } else if (type === "downvote") {
      if (hasDownvoted) {
        doubt.downvotes = doubt.downvotes.filter(
          (uid) => uid.toString() !== userId.toString()
        );
      } else {
        doubt.downvotes.push(userId);
        doubt.upvotes = doubt.upvotes.filter(
          (uid) => uid.toString() !== userId.toString()
        );
      }
    }

    await doubt.save();

    const totalVotes = doubt.upvotes.length - doubt.downvotes.length;

    res.json({
      message: "Vote updated successfully",
      votes: totalVotes,
      upvotes: doubt.upvotes.length,
      downvotes: doubt.downvotes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 7. Add a reply to a doubt
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    doubt.replies.push({ user: req.user._id, message });
    await doubt.save();

    const updated = await Doubt.findById(id)
      .populate("replies.user", "name email")
      .lean();

    res.status(201).json(updated.replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 8. Admin approves a reply (marks doubt as resolved)
export const approveReply = async (req, res) => {
  try {
    const { doubtId, replyId } = req.params;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    const reply = doubt.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    // Unapprove all first
    doubt.replies.forEach((r) => (r.approved = false));

    // Approve selected reply
    reply.approved = true;
    doubt.status = "RESOLVED";
    await doubt.save();

    res.json({ message: "✅ Reply approved successfully", doubt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

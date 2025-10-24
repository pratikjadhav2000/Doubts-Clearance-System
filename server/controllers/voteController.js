import Vote from "../models/Vote.js";
import Answer from "../models/Answer.js";
import { updateReputation } from "../utils/reputationUtils.js";

// @desc    Upvote an answer
// @route   POST /api/votes/:answerId/upvote
// @access  Protected
export const upvoteAnswer = async (req, res) => {
  const { answerId } = req.params;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // Check if user already voted
    const existingVote = await Vote.findOne({ answerId, userId: req.user._id });
    if (existingVote) return res.status(400).json({ message: "You have already voted" });

    // Create new vote
    await Vote.create({ answerId, userId: req.user._id, type: "upvote" });

    // Update answer votes
    answer.votes += 1;
    await answer.save();

    // Update reputation for answer creator
    await updateReputation(answer.createdBy, 10); // e.g., +10 points for upvote

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Downvote an answer
// @route   POST /api/votes/:answerId/downvote
// @access  Protected
export const downvoteAnswer = async (req, res) => {
  const { answerId } = req.params;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const existingVote = await Vote.findOne({ answerId, userId: req.user._id });
    if (existingVote) return res.status(400).json({ message: "You have already voted" });

    await Vote.create({ answerId, userId: req.user._id, type: "downvote" });

    answer.votes -= 1;
    await answer.save();

    // Optional: decrease reputation for downvote
    await updateReputation(answer.createdBy, -2);

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get votes for an answer (optional)
// @route   GET /api/votes/:answerId
// @access  Public
export const getVotesByAnswer = async (req, res) => {
  const { answerId } = req.params;

  try {
    const votes = await Vote.find({ answerId }).populate("userId", "name email");
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

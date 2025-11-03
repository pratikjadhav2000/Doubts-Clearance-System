import Answer from "../models/Answer.js";
import User from "../models/user.js";
import Vote from "../models/Vote.js"; // if using a separate votes collection
import { updateReputation } from "../utils/reputationUtils.js";

// @desc    Create new answer for a doubt
// @route   POST /api/answers/:doubtId
// @access  Protected
export const createAnswer = async (req, res) => {
  const { doubtId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Answer text is required" });

  try {
    const answer = await Answer.create({
      doubtId,
      text,
      createdBy: req.user._id,
      votes: 0,
      isAccepted: false,
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all answers for a doubt
// @route   GET /api/answers/doubt/:doubtId
// @access  Public
export const getAnswersByDoubt = async (req, res) => {
  const { doubtId } = req.params;
  try {
    const answers = await Answer.find({ doubtId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single answer
// @route   GET /api/answers/:answerId
// @access  Public
export const getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId).populate("createdBy", "name email");
    if (!answer) return res.status(404).json({ message: "Answer not found" });
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:answerId
// @access  Protected
export const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to update this answer" });

    answer.text = req.body.text || answer.text;
    await answer.save();
    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:answerId
// @access  Protected
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this answer" });

    await answer.remove();
    res.json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote answer
// @route   POST /api/answers/:answerId/upvote
// @access  Protected
export const upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // Optional: check if user already voted
    const existingVote = await Vote.findOne({ answerId: answer._id, userId: req.user._id });
    if (existingVote) return res.status(400).json({ message: "You have already voted" });

    // Create vote record
    await Vote.create({ answerId: answer._id, userId: req.user._id, type: "upvote" });

    // Increment answer votes
    answer.votes += 1;
    await answer.save();

    // Update reputation
    await updateReputation(answer.createdBy, 10); // e.g., +10 points for an upvote

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Downvote answer
// @route   POST /api/answers/:answerId/downvote
// @access  Protected
export const downvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const existingVote = await Vote.findOne({ answerId: answer._id, userId: req.user._id });
    if (existingVote) return res.status(400).json({ message: "You have already voted" });

    await Vote.create({ answerId: answer._id, userId: req.user._id, type: "downvote" });

    answer.votes -= 1;
    await answer.save();

    // Optional: decrease reputation
    await updateReputation(answer.createdBy, -2); // e.g., -2 points for a downvote

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept answer
// @route   POST /api/answers/:answerId/accept
// @access  Protected (only doubt asker)
export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // Only doubt asker can accept
    // Assume Answer model has doubtId; you can populate to check asker
    const doubt = await Doubt.findById(answer.doubtId);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });
    if (doubt.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only doubt asker can accept an answer" });

    answer.isAccepted = true;
    await answer.save();

    // Update reputation for accepted answer
    await updateReputation(answer.createdBy, 15); // e.g., +15 points

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

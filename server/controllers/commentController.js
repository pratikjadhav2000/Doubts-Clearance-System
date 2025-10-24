import Comment from "../models/Comment.js";
import Answer from "../models/Answer.js";

// @desc    Create a comment for an answer
// @route   POST /api/comments/:answerId
// @access  Protected
export const createComment = async (req, res) => {
  const { answerId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Comment text is required" });

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const comment = await Comment.create({
      answerId,
      text,
      createdBy: req.user._id,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for an answer
// @route   GET /api/comments/answer/:answerId
// @access  Public
export const getCommentsByAnswer = async (req, res) => {
  const { answerId } = req.params;

  try {
    const comments = await Comment.find({ answerId })
      .populate("createdBy", "name email")
      .sort({ createdAt: 1 }); // oldest first

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Protected
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to update this comment" });

    comment.text = text || comment.text;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Protected
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this comment" });

    await comment.remove();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

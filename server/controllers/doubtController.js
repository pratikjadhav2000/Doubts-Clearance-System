import Doubt from "../models/Doubt.js";
import Answer from "../models/Answer.js";
import User from "../models/User.js";

// @desc    Create a new doubt
// @route   POST /api/doubts
// @access  Protected
export const createDoubt = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description) return res.status(400).json({ message: "Title and description are required" });

  try {
    const doubt = await Doubt.create({
      title,
      description,
      tags,
      createdBy: req.user._id,
      userId: req.user._id, // same as createdBy
      status: "open",
      views: 0,
      askerCount: 0,
    });

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doubts (with optional filtering & pagination)
// @route   GET /api/doubts
// @access  Public
export const getAllDoubts = async (req, res) => {
  try {
    const { tag, status, institute, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (tag) filter.tags = { $in: [tag] };
    if (status) filter.status = status;
    if (institute) filter.institute = institute;

    const doubts = await Doubt.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Doubt.countDocuments(filter);

    res.json({ doubts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doubt by ID
// @route   GET /api/doubts/:doubtId
// @access  Public
export const getDoubtById = async (req, res) => {
  const { doubtId } = req.params;

  try {
    const doubt = await Doubt.findById(doubtId)
      .populate("createdBy", "name email");

    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    // Increment views
    doubt.views += 1;
    await doubt.save();

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a doubt
// @route   PUT /api/doubts/:doubtId
// @access  Protected
export const updateDoubt = async (req, res) => {
  const { doubtId } = req.params;
  const { title, description, tags, status } = req.body;

  try {
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    if (doubt.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to update this doubt" });

    doubt.title = title || doubt.title;
    doubt.description = description || doubt.description;
    doubt.tags = tags || doubt.tags;
    doubt.status = status || doubt.status;

    await doubt.save();

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a doubt
// @route   DELETE /api/doubts/:doubtId
// @access  Protected
export const deleteDoubt = async (req, res) => {
  const { doubtId } = req.params;

  try {
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    if (doubt.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this doubt" });

    await doubt.remove();
    res.json({ message: "Doubt deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search doubts
// @route   GET /api/doubts/search
// @access  Public
export const searchDoubts = async (req, res) => {
  const { query, tag, status, institute } = req.query;
  try {
    const filter = {};

    if (query) filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } }
    ];
    if (tag) filter.tags = { $in: [tag] };
    if (status) filter.status = status;
    if (institute) filter.institute = institute;

    const doubts = await Doubt.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

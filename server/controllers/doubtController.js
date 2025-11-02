import mongoose from "mongoose";
import Doubt from "../models/doubtModel.js";

/* -------------------------------
   1️⃣ Create new doubt (Ask Doubt Page)
-------------------------------- */
export const createDoubt = async (req, res) => {
  try {
    console.log("📦 Incoming body:", req.body);
    console.log("📁 Incoming files:", req.files);

    // ✅ Defensive fallback
    const body = req.body || {};
    const { title, description, tags } = body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // ✅ Extract uploaded file paths
    const attachments = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const doubt = await Doubt.create({
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      user: req.user._id,
      attachments,
    });

    res.status(201).json({ message: "Doubt created successfully", doubt });
  } catch (error) {
    console.error("Create doubt error:", error);
    res.status(500).json({ message: "Server error while creating doubt" });
  }
};


/* -------------------------------
   2️⃣ Check for duplicate doubts
-------------------------------- */
export const checkDuplicateDoubt = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const similar = await Doubt.find({
      title: { $regex: title, $options: "i" },
    })
      .populate("user", "name email")
      .limit(5);

    res.json({ similar });
  } catch (error) {
    console.error("Duplicate check error:", error);
    res.status(500).json({ message: "Error checking duplicates" });
  }
};

/* -------------------------------
   3️⃣ Get all doubts (All Doubts Page / Admin)
-------------------------------- */
export const getAllDoubts = async (req, res) => {
  try {
    const query = req.user?.role === "ADMIN" ? {} : { status: { $ne: "HIDDEN" } };
    const doubts = await Doubt.find(query)
      .populate("user", "name email")
      .populate("replies.user", "name email")
      .sort({ createdAt: -1 });

    res.json({ total: doubts.length, doubts });
  } catch (error) {
    console.error("Get all doubts error:", error);
    res.status(500).json({ message: "Failed to load doubts" });
  }
};

/* -------------------------------
   4️⃣ Get current user's doubts (My Doubts Page)
-------------------------------- */
export const getMyDoubts = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized. Missing user." });
    }

    const doubts = await Doubt.find({ user: req.user._id })
      .populate("replies.user", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: doubts.length, doubts });
  } catch (error) {
    console.error("My doubts error:", error);
    res.status(500).json({ message: "Failed to fetch user doubts" });
  }
};

/* -------------------------------
   5️⃣ Dashboard stats (Dashboard Page)
-------------------------------- */
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
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error loading dashboard data" });
  }
};

/* -------------------------------
   6️⃣ Upvote / Downvote
-------------------------------- */
export const voteDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user._id;

    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    doubt.upvotes = doubt.upvotes || [];
    doubt.downvotes = doubt.downvotes || [];

    const isUp = doubt.upvotes.includes(userId);
    const isDown = doubt.downvotes.includes(userId);

    if (type === "upvote") {
      if (isUp) doubt.upvotes.pull(userId);
      else {
        doubt.upvotes.push(userId);
        doubt.downvotes.pull(userId);
      }
    } else if (type === "downvote") {
      if (isDown) doubt.downvotes.pull(userId);
      else {
        doubt.downvotes.push(userId);
        doubt.upvotes.pull(userId);
      }
    }

    await doubt.save();

    res.json({
      message: "Vote updated successfully",
      votes: doubt.upvotes.length - doubt.downvotes.length,
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Error updating vote" });
  }
};

/* -------------------------------
   7️⃣ Add a reply
-------------------------------- */
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) return res.status(400).json({ message: "Message required" });

    const doubt = await Doubt.findById(id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    // ✅ Handle reply image
   
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    doubt.replies.push({
        user: req.user._id,
        message,
        image: imagePath, // ✅ store image path
      });

    await doubt.save();

    const updated = await Doubt.findById(id).populate("replies.user", "name email");

    res.status(201).json({
      message: "Reply added successfully",
      replies: updated.replies,
    });
  } catch (error) {
    console.error("Add reply error:", error);
    res.status(500).json({ message: "Error adding reply" });
  }
};

/* -------------------------------
   8️⃣ Admin approves a reply (resolve doubt)
-------------------------------- */
export const approveReply = async (req, res) => {
  try {
    const { doubtId, replyId } = req.params;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    const reply = doubt.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    // Mark only one reply as approved
    doubt.replies.forEach((r) => (r.approved = false));

    reply.approved = true;
    doubt.status = "RESOLVED";
    await doubt.save();

    res.json({ message: "✅ Reply approved successfully", doubt });
  } catch (error) {
    console.error("Approve reply error:", error);
    res.status(500).json({ message: "Error approving reply" });
  }
};


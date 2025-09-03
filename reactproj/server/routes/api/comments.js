import express from "express";
import Comment from "../../models/Comment.js";
import { authMiddleware } from "../../middleware/auth.js"; // Fixed: Changed to named import

const router = express.Router();

// @route   POST /api/comments
// @desc    Submit a new comment
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, website, comment, postId, pending } = req.body;
    const newComment = new Comment({
      name,
      email,
      website,
      comment,
      postId,
      pending: pending !== undefined ? pending : true,
      createdAt: new Date(),
    });
    await newComment.save();
    res.status(201).json({ message: "Comment submitted successfully" });
  } catch (err) {
    console.error("Error submitting comment:", err);
    res.status(500).json({ message: "Failed to submit comment" });
  }
});

// @route   GET /api/comments/:postId
// @desc    Get comments for a specific post
// @access  Public
router.get("/:postId", async (req, res) => {
  try {
    const { pending } = req.query;
    const filter = { postId: req.params.postId };
    if (pending !== undefined) {
      filter.pending = pending === "true";
    }
    const comments = await Comment.find(filter).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

// @route   PUT /api/comments/:id/approve
// @desc    Approve a comment (admin only)
// @access  Private
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    comment.pending = false;
    await comment.save();
    res.json({ message: "Comment approved successfully" });
  } catch (err) {
    console.error("Error approving comment:", err);
    res.status(500).json({ message: "Failed to approve comment" });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment (admin only)
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

export default router;

//const express = require("express");
import express from 'express';

const router = express.Router();
//const Post = require("../../models/Post");
import { Post } from "../../models/Post.js";

// @route   GET /api/posts
// @desc    Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/posts
// @desc    Add a new post
router.post("/", async (req, res) => {
  const { title, summary, content, author, imageUrl } = req.body; // Ensure imageUrl is destructured

  if (!title || !summary || !content || !author) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  const newPost = new Post({
    title,
    summary,
    content,
    author,
    imageUrl, // Pass imageUrl to the new Post
  });

  try {
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.remove();
    res.json({ message: "Post removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//module.exports = router;
export default router;

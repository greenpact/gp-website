//const mongoose = require("mongoose");
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String }, // Add this line
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
//module.exports = Post;
export { Post };

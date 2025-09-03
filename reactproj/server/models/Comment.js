import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  comment: { type: String, required: true },
  postId: { type: String, required: true },
  pending: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Comment", commentSchema);

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: String,
  pageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", CommentSchema);

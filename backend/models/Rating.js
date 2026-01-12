import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  rating: Number,
  pageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Rating", RatingSchema);

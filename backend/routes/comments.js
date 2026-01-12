import express from "express";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";

const router = express.Router();

// Save a comment
router.post("/comment", async (req, res) => {
  const { text, pageUrl } = req.body;
  const comment = new Comment({ text, pageUrl });
  await comment.save();
  res.json(comment);
});

// Save a rating
router.post("/rating", async (req, res) => {
  const { rating, pageUrl } = req.body;
  const r = new Rating({ rating, pageUrl });
  await r.save();
  res.json(r);
});

// Get all comments & ratings for a page
router.get("/", async (req, res) => {
  const { pageUrl } = req.query;
  const comments = await Comment.find({ pageUrl });
  const ratings = await Rating.find({ pageUrl });
  res.json({ comments, ratings });
});

export default router;

// backend/routes/comments.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Comment Schema
const commentSchema = new mongoose.Schema({
  text: String,
  rating: Number,
  author: String,
  url: String,
  timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 });
    const ratings = comments.map(c => c.rating).filter(r => r != null);
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : null;
    
    res.json({ 
      comments, 
      ratings,
      averageRating,
      total: comments.length,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      error: 'Failed to fetch comments',
      message: error.message 
    });
  }
});

// POST new comment
router.post('/', async (req, res) => {
  try {
    const { text, rating, author, url } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        error: 'Comment text is required' 
      });
    }
    
    const comment = new Comment({
      text: text.trim(),
      rating: rating || 5,
      author: author?.trim() || 'Anonymous',
      url: url?.trim() || 'http://example.com'
    });
    
    await comment.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ 
      error: 'Failed to save comment',
      message: error.message 
    });
  }
});

export default router;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://topherkiarie21:root@cluster0.fmmep.mongodb/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Comment Schema
const commentSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    url: String,
    timestamp: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.post('/api/comments', async (req, res) => {
    try {
        const { name, rating, comment, url } = req.body;
        const newComment = new Comment({ name, rating, comment, url });
        await newComment.save();
        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/comments', async (req, res) => {
    try {
        const { url } = req.query;
        const comments = await Comment.find({ url }).sort({ timestamp: -1 });
        res.json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
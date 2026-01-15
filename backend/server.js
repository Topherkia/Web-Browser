const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Schema
const Comment = require('./models/Comment');

// Updated MongoDB connection with better error handling
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected Successfully');
        
        // Create indexes
        await Comment.createIndexes();
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
    }
}

// Connect to DB
connectDB();

// POST endpoint - Save comment with validation
app.post('/save-comment', async (req, res) => {
    try {
        console.log('📥 Received comment data:', req.body);
        
        const { name, rating, comment, url } = req.body;
        
        // Validate input
        if (!name || !rating || !comment || !url) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }
        
        // Create and save new comment
        const newComment = new Comment({
            name: name.trim(),
            rating: Number(rating),
            comment: comment.trim(),
            url: url.trim()
        });
        
        const savedComment = await newComment.save();
        console.log('💾 Saved to MongoDB:', savedComment._id);
        
        res.status(201).json({ 
            success: true, 
            message: 'Comment saved successfully',
            data: savedComment
        });
    } catch (error) {
        console.error('❌ Error saving comment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error saving comment',
            error: error.message 
        });
    }
});

// GET endpoint - Retrieve comments for a URL
app.get('/get-comments', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ 
                success: false, 
                message: 'URL parameter required' 
            });
        }
        
        console.log('📋 Fetching comments for URL:', url);
        
        const comments = await Comment.find({ url: url })
            .sort({ timestamp: -1 })
            .limit(50);
        
        console.log(`📊 Found ${comments.length} comments`);
        
        res.json({ 
            success: true, 
            data: comments 
        });
    } catch (error) {
        console.error('❌ Error fetching comments:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching comments',
            error: error.message 
        });
    }
});

// Test endpoint to check DB connection
app.get('/test-db', async (req, res) => {
    try {
        const count = await Comment.countDocuments();
        res.json({ 
            success: true, 
            message: 'Database is connected',
            totalComments: count,
            dbName: mongoose.connection.db.databaseName
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
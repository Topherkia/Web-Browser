const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    url: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);

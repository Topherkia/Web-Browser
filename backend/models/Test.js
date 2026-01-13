import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Test || mongoose.model('Test', testSchema);
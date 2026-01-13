import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import searchRoutes from "./routes/search.js";
import commentsRoutes from "./routes/comments.js";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB failed:", err));

  app.get('/api/debug/comments', (req, res) => {
  res.json({
    message: 'Comments debug route works',
    timestamp: new Date().toISOString(),
    routes: ['GET /api/comments', 'POST /api/comments', 'DELETE /api/comments/:id']
  });
});

// Routes
app.use("/api/search", searchRoutes);
app.use("/api/comments", commentsRoutes);

// Test route
app.get('/api/test', async (req, res) => {
  try {
    const adminDb = mongoose.connection.db.admin();
    const serverStatus = await adminDb.serverStatus();
    
    res.json({
      status: 'success',
      message: 'MongoDB connected successfully!',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      serverStatus: {
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        connections: serverStatus.connections
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message
    });
  }
});

// Test document routes
import Test from './models/Test.js';

app.post('/api/test/create', async (req, res) => {
  try {
    const test = new Test({
      message: 'Test database connection'
    });
    
    await test.save();
    
    res.json({
      status: 'success',
      message: 'Test document created successfully!',
      data: test
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create test document',
      error: error.message
    });
  }
});

app.get('/api/test/all', async (req, res) => {
  try {
    const tests = await Test.find().sort({ timestamp: -1 });
    
    res.json({
      status: 'success',
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch test documents',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
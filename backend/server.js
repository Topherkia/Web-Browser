import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import searchRoutes from "./routes/search.js";
import commentsRoutes from "./routes/comments.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB failed:", err));

// Routes
app.use("/api/search", searchRoutes);
app.use("/api/comments", commentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

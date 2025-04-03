import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/file.js";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use("/api", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

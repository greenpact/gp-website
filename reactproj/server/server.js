import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import jwt from "jsonwebtoken";

// Import Routes
import vacancyRoutes from "./routes/api/vacancies.js";
import applicationRoutes from "./routes/api/applications.js";
import contactRoutes from "./routes/api/contact.js";
import userRoutes from "./routes/api/users.js";
import authRoutes from "./routes/api/auth.js";
import albumRoutes from "./routes/api/albums.js";
import photoRoutes from "./routes/api/photos.js";
import adminRoutes from "./routes/api/admin.js";
import commentRoutes from "./routes/api/comments.js";
import postRoutes from "./routes/api/posts.js";
//const postRoutes = require("./routes/api/posts.js");

import uploadRoutes from "./routes/api/Upload.js"; // Corrected casing to match file name

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- Critical Checks ---
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in your .env file!");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in your .env file!");
  process.exit(1);
}

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });



/*
// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);
*/

// --- Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      // The origin of the request, like http://<codespace-name>-<port>.app.github.dev
      const allowedOrigins = [
        "http://localhost:5173", // For local development
        "https://*.github.dev", // For Codespaces development
        "https://*.app.github.dev", // For Codespaces development
      ];
      if (!origin || allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin.replace("*", "")))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);



app.use(express.json());

// --- Logging middleware ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Serve static files from the client's build directory ---
// This middleware MUST be placed BEFORE any API routes
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// A catch-all route to serve the index.html for any client-side routes
// This is essential for React Router to work properly
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes); // Mount the dedicated upload router

// --- Serve static files for image uploads ---
// IMPORTANT: Ensure your folder name is consistently capitalized as "Uploads"
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// --- Root route ---
// This route is no longer needed as the catch-all '*' will handle it.
// If you uncomment it, it will take precedence and break your site.
// app.get("/", (req, res) => {
//   res.send("🌍 Your MERN Stack Backend Server is Running!");
// });

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    message: "Something went wrong on the server",
    error: err.message,
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
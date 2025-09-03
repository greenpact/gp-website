import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
import postRoutes from "./routes/posts.js"; // Add posts route

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// --- CRITICAL CHECKS ---
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in your .env file!");
  console.error('Please add MONGO_URI="YOUR_CONNECTION_STRING" to .env');
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in your .env file!");
  console.error('Please add JWT_SECRET="a_strong_random_secret_key" to .env');
  process.exit(1);
}
if (
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  process.env.EMAIL_SECURE === undefined
) {
  console.warn(
    "⚠️ Warning: Email sending credentials (EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE) are not fully defined in .env. OTP email sending might fail."
  );
  console.warn(
    "Please add these variables to .env: EMAIL_USER='your_email@example.com', EMAIL_PASS='your_password_or_app_password', EMAIL_HOST='smtp.yourprovider.com', EMAIL_PORT='587', EMAIL_SECURE='false' (or 'true' for port 465)"
  );
}

// --- Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    console.error(
      "Please check your MONGO_URI in .env and ensure MongoDB service is running."
    );
    process.exit(1);
  });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Serve static files from the 'Uploads' directory ---
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

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
app.use("/api/posts", postRoutes); // Add posts route

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

// Basic Root Route for Server Status Check
app.get("/", (req, res) => {
  res.send("🌍 Your MERN Stack Backend Server is Running!");
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

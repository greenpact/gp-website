// server/routes/api/users.js
import express from "express";
import User from "../../models/User.js"; // Adjust path as needed
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
// REMOVED: import 'dotenv/config'; // No longer needed here as middleware is external
// REMOVED: import jwt from 'jsonwebtoken'; // No longer needed here as middleware is external

// NEW: Import middleware from central file
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base directory for all uploads (e.g., 'server/uploads')
const UPLOADS_BASE_DIR = path.join(__dirname, "../../uploads");
// Define the specific directory for profile pictures (e.g., 'server/uploads/profile_pictures')
const PROFILE_PICTURES_UPLOADS_DIR = path.join(
  UPLOADS_BASE_DIR,
  "profile_pictures"
);

// Ensure the uploads directory exists
try {
  if (!fs.existsSync(PROFILE_PICTURES_UPLOADS_DIR)) {
    fs.mkdirSync(PROFILE_PICTURES_UPLOADS_DIR, { recursive: true });
    console.log(
      `Created profile pictures directory: ${PROFILE_PICTURES_UPLOADS_DIR}`
    );
  }
} catch (err) {
  console.error("Error creating profile pictures directory:", err);
}

// Set up storage for uploaded profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PROFILE_PICTURES_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Use user ID to name the file to ensure uniqueness per user
    // and overwrite previous profile pictures if a new one is uploaded
    const userId = req.user.id;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-profile${ext}`);
  },
});

// Configure multer upload middleware for a single image file
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF) are allowed!"));
  },
});

// @route   PUT /api/users/profile-picture
// @desc    Upload or update user profile picture
// @access  Private
router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded." });
      }

      // If an old profile picture exists, delete it to save space
      if (user.profilePicture) {
        const oldPath = path.join(UPLOADS_BASE_DIR, user.profilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // Save the relative path to the database
      user.profilePicture = path.relative(UPLOADS_BASE_DIR, req.file.path);
      await user.save();

      res.json({
        msg: "Profile picture updated successfully",
        profilePicture: user.profilePicture,
      });
    } catch (err) {
      console.error("Error uploading profile picture:", err.message);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ msg: err.message });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE /api/users/profile-picture
// @desc    Remove user profile picture
// @access  Private
router.delete("/profile-picture", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.profilePicture) {
      const filePath = path.join(UPLOADS_BASE_DIR, user.profilePicture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file from the server
      }
      user.profilePicture = undefined; // Remove the path from the database
      await user.save();
      res.json({ msg: "Profile picture removed successfully" });
    } else {
      res.status(400).json({ msg: "No profile picture to remove" });
    }
  } catch (err) {
    console.error("Error removing profile picture:", err.message);
    res.status(500).send("Server Error");
  }
});

export default router;

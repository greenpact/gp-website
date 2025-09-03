// server/routes/api/albums.js
import express from "express";
import Album from "../../models/Album.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_BASE_DIR = path.join(__dirname, "../../uploads");
const ALBUM_COVERS_UPLOADS_DIR = path.join(UPLOADS_BASE_DIR, "album_covers");

// Ensure the directory exists
try {
  if (!fs.existsSync(ALBUM_COVERS_UPLOADS_DIR)) {
    fs.mkdirSync(ALBUM_COVERS_UPLOADS_DIR, { recursive: true });
    console.log(`Created album covers directory: ${ALBUM_COVERS_UPLOADS_DIR}`);
  }
} catch (err) {
  console.error("Error creating album covers directory:", err);
}

// Multer storage for album covers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ALBUM_COVERS_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

// @route   GET /api/albums
// @desc    Get all active albums (for public gallery)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const albums = await Album.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    console.error("Error fetching public albums:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/albums/admin-all
// @desc    Get all albums (active and inactive, for admin dashboard)
// @access  Private (Admin only)
router.get("/admin-all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 });
    res.json(albums);
  } catch (err) {
    console.error("Error fetching all albums for admin:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/albums/:id
// @desc    Get a single album by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json(album);
  } catch (err) {
    console.error("Error fetching single album:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Album not found (invalid ID)" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/albums
// @desc    Create a new album
// @access  Private (Admin only)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("coverImage"),
  async (req, res) => {
    const { title, description, isActive } = req.body;
    const coverImageUrl = req.file
      ? path.relative(UPLOADS_BASE_DIR, req.file.path)
      : null;

    try {
      const newAlbum = new Album({
        title,
        description,
        coverImageUrl,
        isActive: isActive !== undefined ? isActive : true,
      });
      const album = await newAlbum.save();
      res.status(201).json({ message: "Album created successfully!", album });
    } catch (err) {
      console.error("Error creating album:", err.message);
      if (err.code === 11000) {
        // Duplicate key error for unique title
        return res
          .status(400)
          .json({ message: "Album with this title already exists." });
      }
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({ message: messages.join(". ") });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT /api/albums/:id
// @desc    Update an album
// @access  Private (Admin only)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("coverImage"),
  async (req, res) => {
    const { title, description, isActive } = req.body;
    let coverImageUrl = req.file
      ? path.relative(UPLOADS_BASE_DIR, req.file.path)
      : undefined;

    try {
      let album = await Album.findById(req.params.id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }

      // If a new file is uploaded, delete the old one
      if (req.file && album.coverImageUrl) {
        const oldPath = path.join(UPLOADS_BASE_DIR, album.coverImageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } else if (req.body.removeCoverImage === "true") {
        // Explicitly remove cover image
        if (album.coverImageUrl) {
          const oldPath = path.join(UPLOADS_BASE_DIR, album.coverImageUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        coverImageUrl = null; // Set to null in DB
      } else if (!req.file && !req.body.removeCoverImage) {
        coverImageUrl = album.coverImageUrl; // Keep existing if not updated or removed
      }

      album.title = title !== undefined ? title : album.title;
      album.description =
        description !== undefined ? description : album.description;
      album.isActive = isActive !== undefined ? isActive : album.isActive;
      album.coverImageUrl = coverImageUrl; // Update cover image path

      await album.save();
      res.json({ message: "Album updated successfully!", album });
    } catch (err) {
      console.error("Error updating album:", err.message);
      if (err.code === 11000) {
        return res
          .status(400)
          .json({ message: "Album with this title already exists." });
      }
      if (err.kind === "ObjectId") {
        return res.status(404).json({ message: "Album not found" });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE /api/albums/:id
// @desc    Delete an album and all associated photos
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Delete associated cover image
    if (album.coverImageUrl) {
      const coverPath = path.join(UPLOADS_BASE_DIR, album.coverImageUrl);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    // Delete all photos associated with this album
    // (You'll need to import the Photo model here and use it)
    const Photo = (await import("../../models/Photo.js")).default;
    const photosToDelete = await Photo.find({ albumId: req.params.id });
    for (const photo of photosToDelete) {
      const photoPath = path.join(UPLOADS_BASE_DIR, photo.imageUrl);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
      await Photo.findByIdAndDelete(photo._id);
    }

    await Album.findByIdAndDelete(req.params.id);
    res.json({ message: "Album and associated photos deleted successfully!" });
  } catch (err) {
    console.error("Error deleting album:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Album not found" });
    }
    res.status(500).send("Server Error");
  }
});

export default router;

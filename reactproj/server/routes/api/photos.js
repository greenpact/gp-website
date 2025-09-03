import express from "express";
import Photo from "../../models/Photo.js";
import Album from "../../models/Album.js"; // To check if album exists
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_BASE_DIR = path.join(__dirname, "../../Uploads");
const GALLERY_PHOTOS_UPLOADS_DIR = path.join(
  UPLOADS_BASE_DIR,
  "gallery_photos"
);

// Ensure the directory exists
try {
  if (!fs.existsSync(GALLERY_PHOTOS_UPLOADS_DIR)) {
    fs.mkdirSync(GALLERY_PHOTOS_UPLOADS_DIR, { recursive: true });
    console.log(
      `Created gallery photos directory: ${GALLERY_PHOTOS_UPLOADS_DIR}`
    );
  }
} catch (err) {
  console.error("Error creating gallery photos directory:", err);
}

// Multer storage for gallery photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, GALLERY_PHOTOS_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per photo
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

// @route   GET /api/photos/:albumId
// @desc    Get all photos for a specific album (publicly accessible)
// @access  Public
router.get("/:albumId", async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    if (!album || !album.isActive) {
      // Only show photos if album exists and is active
      return res
        .status(404)
        .json({ message: "Album not found or is not active." });
    }
    const photos = await Photo.find({ albumId: req.params.albumId }).sort({
      order: 1,
      createdAt: 1,
    });
    res.json(photos);
  } catch (err) {
    console.error("Error fetching photos for album:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Invalid Album ID" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/photos/:albumId
// @desc    Upload new photos to a specific album
// @access  Private (Admin only)
router.post(
  "/:albumId",
  authMiddleware,
  adminMiddleware,
  upload.array("photos", 50), // Allow up to 50 photos per upload
  async (req, res) => {
    const { albumId } = req.params;
    let captions = req.body.captions;

    try {
      const album = await Album.findById(albumId);
      if (!album) {
        return res.status(404).json({ message: "Album not found." });
      }

      // Check total photos in the album
      const existingPhotos = await Photo.countDocuments({ albumId });
      const newPhotoCount = req.files ? req.files.length : 0;
      if (existingPhotos + newPhotoCount > 50) {
        return res.status(400).json({
          message: `Cannot add ${newPhotoCount} photo(s). Album would exceed the limit of 50 photos.`,
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No photos uploaded." });
      }

      // Parse captions if they are a JSON string
      try {
        captions =
          typeof captions === "string" ? JSON.parse(captions) : captions;
      } catch (err) {
        console.error("Error parsing captions:", err.message);
        captions = []; // Fallback to empty array if parsing fails
      }

      const newPhotos = req.files.map((file, index) => ({
        albumId: albumId,
        imageUrl: path.relative(UPLOADS_BASE_DIR, file.path),
        caption:
          Array.isArray(captions) && captions[index]
            ? captions[index].trim()
            : "",
        order: existingPhotos + index, // Continue ordering from existing photos
      }));

      const savedPhotos = await Photo.insertMany(newPhotos);
      res.status(201).json({
        message: "Photos uploaded successfully!",
        photos: savedPhotos,
      });
    } catch (err) {
      console.error("Error uploading photos:", err.message);
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT /api/photos/:id
// @desc    Update a photo's caption or order
// @access  Private (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { caption, order } = req.body;
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found." });
    }

    photo.caption = caption !== undefined ? caption : photo.caption;
    photo.order = order !== undefined ? order : photo.order;

    await photo.save();
    res.json({ message: "Photo updated successfully!", photo });
  } catch (err) {
    console.error("Error updating photo:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Photo not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/photos/:id
// @desc    Delete a single photo
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    // Delete the photo file from the server
    const filePath = path.join(UPLOADS_BASE_DIR, photo.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Photo.findByIdAndDelete(req.params.id);
    res.json({ message: "Photo deleted successfully!" });
  } catch (err) {
    console.error("Error deleting photo:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Photo not found" });
    }
    res.status(500).send("Server Error");
  }
});

export default router;

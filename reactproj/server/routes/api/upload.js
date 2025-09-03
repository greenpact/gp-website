import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Navigate two levels up to the root directory, then into the 'Uploads' folder.
    const uploadPath = path.join(__dirname, "../../Uploads");
    console.log("[Upload] Destination path:", uploadPath); // Debug path
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique file name to avoid conflicts
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.originalname.replace(/\s/g, "-")}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// Middleware to verify JWT and admin role
const verifyAdmin = (req, res, next) => {
  const token =
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.header("x-auth-token");
  if (!token) {
    console.log("[Upload VerifyAdmin] No token provided");
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = decoded.role || decoded.user?.role;
    if (role !== "admin") {
      console.log(`[Upload VerifyAdmin] Access denied. Role: ${role}`);
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded;
    console.log("[Upload VerifyAdmin] Admin access granted:", req.user.id);
    next();
  } catch (error) {
    console.error("[Upload VerifyAdmin] Invalid token:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// POST route for file upload
router.post("/", verifyAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("[Upload] No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  console.log("[Upload] File uploaded:", fileUrl);
  res.json({ url: fileUrl });
});

export default router;

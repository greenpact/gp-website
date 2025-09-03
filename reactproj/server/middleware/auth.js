// server/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import the User model

const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is available via dotenv

// Middleware to verify JWT and attach user to request
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token"); // Reads 'x-auth-token' header
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user; // This attaches user info (id, role) to req.user
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to check if the user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ msg: "Authentication required for role check" });
    }
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: Not an admin" });
    }
    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    res.status(500).send("Server Error");
  }
};

export { authMiddleware, adminMiddleware };

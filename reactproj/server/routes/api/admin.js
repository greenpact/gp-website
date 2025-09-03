// server/routes/api/admin.js
import express from "express";
import User from "../../models/User.js"; // Ensure .js extension
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js"; // Ensure .js extension

const router = express.Router();

// @route   PUT /api/admin/users/:userId/role
// @desc    Update a user's role (e.g., to 'admin' or 'user')
// @access  Private (Admin only)
router.put(
  "/users/:userId/role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { newRole } = req.body;

      // Basic validation for newRole
      if (!newRole || !["admin", "user"].includes(newRole)) {
        return res
          .status(400)
          .json({
            message: 'Invalid new role provided. Must be "admin" or "user".',
          });
      }

      // Find the user to update
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Prevent an admin from changing their own role to non-admin (optional but recommended)
      // This check uses req.user.id which is set by authMiddleware
      if (req.user.id === userId && newRole !== "admin") {
        return res
          .status(403)
          .json({
            message:
              "Admins cannot demote themselves. Please use another admin account to change this role.",
          });
      }

      // Update the user's role
      user.role = newRole;
      await user.save();

      res.json({
        message: `User ${user.username}'s role updated to ${newRole}.`,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Error updating user role:", err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router; // IMPORTANT: Export as default for ES Modules

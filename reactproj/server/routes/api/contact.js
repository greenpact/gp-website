// server/routes/api/contact.js
import express from "express";
import ContactInquiry from "../../models/ContactInquiry.js"; // Adjust path as needed
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js"; // Import middleware

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a new contact inquiry
// @access  Public (NO AUTH REQUIRED)
router.post("/", async (req, res) => {
  const { name, email, subject, message, phone } = req.body;
  console.log("[Backend Contact POST] Received inquiry:", {
    name,
    email,
    subject,
    message,
    phone,
  });

  // Basic validation
  if (!name || !email || !subject || !message) {
    console.log(
      "[Backend Contact POST] Validation Error: Missing required fields."
    );
    return res
      .status(400)
      .json({
        message:
          "Please enter all required fields: Name, Email, Subject, and Message.",
      });
  }

  try {
    const newInquiry = new ContactInquiry({
      name,
      email,
      subject,
      message,
      phone: phone || undefined, // Use undefined for optional fields if not provided, so Mongoose doesn't save empty string
      read: false, // Explicitly set to false for new inquiries
    });

    const inquiry = await newInquiry.save();
    console.log("[Backend Contact POST] Inquiry saved successfully:", inquiry);
    res
      .status(201)
      .json({ message: "Your inquiry has been sent successfully!", inquiry });
  } catch (err) {
    console.error(
      "[Backend Contact POST] Error submitting contact inquiry:",
      err.message,
      err
    );
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      console.log(
        "[Backend Contact POST] Mongoose Validation Errors:",
        messages
      );
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/contact
// @desc    Get all contact inquiries (for admin dashboard)
// @access  Private (Admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  console.log(
    "[Backend Contact GET] Received request for all inquiries (Admin)."
  );
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    console.log(`[Backend Contact GET] Found ${inquiries.length} inquiries.`);
    res.json(inquiries);
  } catch (err) {
    console.error(
      "[Backend Contact GET] Error fetching contact inquiries:",
      err.message,
      err
    );
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/contact/:id
// @desc    Update a contact inquiry (e.g., mark as read)
// @access  Private (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { read, notes } = req.body;
  console.log(
    `[Backend Contact PUT] Received update request for ID: ${req.params.id}, Body:`,
    { read, notes }
  );

  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      console.log(
        `[Backend Contact PUT] Error: Inquiry with ID ${req.params.id} not found.`
      );
      return res.status(404).json({ message: "Contact inquiry not found" });
    }

    if (read !== undefined) {
      inquiry.read = read;
      console.log(
        `[Backend Contact PUT] Updating inquiry ID ${req.params.id} to read: ${read}`
      );
    }
    if (notes !== undefined) {
      inquiry.notes = notes;
      console.log(
        `[Backend Contact PUT] Updating inquiry ID ${req.params.id} notes.`
      );
    }

    await inquiry.save();
    console.log("[Backend Contact PUT] Inquiry updated successfully:", inquiry);
    res.json({ message: "Inquiry updated successfully!", inquiry });
  } catch (err) {
    console.error(
      `[Backend Contact PUT] Error updating contact inquiry ID ${req.params.id}:`,
      err.message,
      err
    );
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Contact inquiry not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact inquiry
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  console.log(
    `[Backend Contact DELETE] Received delete request for ID: ${req.params.id}`
  );
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      console.log(
        `[Backend Contact DELETE] Error: Inquiry with ID ${req.params.id} not found.`
      );
      return res.status(404).json({ message: "Contact inquiry not found" });
    }

    await ContactInquiry.findByIdAndDelete(req.params.id);
    console.log(
      `[Backend Contact DELETE] Inquiry ID ${req.params.id} deleted successfully.`
    );
    res.json({ message: "Contact inquiry deleted successfully!" });
  } catch (err) {
    console.error(
      `[Backend Contact DELETE] Error deleting contact inquiry ID ${req.params.id}:`,
      err.message,
      err
    );
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Contact inquiry not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

export default router;

// server/routes/api/applications.js
import express from "express";
import Application from "../../models/Application.js"; // Adjust path as needed
import multer from "multer"; // Import multer for file uploads
import path from "path"; // Node.js built-in path module for handling file paths
import { fileURLToPath } from "url"; // For ES Modules to get __dirname
import fs from "fs"; // Import the file system module
import nodemailer from "nodemailer"; // NEW: Import nodemailer

// Import middleware from central file
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base directory for all uploads (e.g., 'server/uploads')
const UPLOADS_BASE_DIR = path.join(__dirname, "../../uploads");
// Define the specific directory for application CVs (e.g., 'server/uploads/applications')
const APPLICATIONS_UPLOADS_DIR = path.join(UPLOADS_BASE_DIR, "applications");

// Ensure the uploads directory exists
try {
  if (!fs.existsSync(APPLICATIONS_UPLOADS_DIR)) {
    fs.mkdirSync(APPLICATIONS_UPLOADS_DIR, { recursive: true });
    console.log(`Created uploads directory: ${APPLICATIONS_UPLOADS_DIR}`);
  }
} catch (err) {
  console.error("Error creating uploads directory:", err);
}

// Set up storage for uploaded files using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, APPLICATIONS_UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to prevent issues with special characters
    const sanitizedOriginalname = file.originalname.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(sanitizedOriginalname)}`
    );
  },
});

// Configure multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .pdf, .doc, .docx files are allowed for CV/Resume!"));
  },
});

// Nodemailer transporter setup - CORRECTED FOR WEBMAIL
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Use host from .env
  port: process.env.EMAIL_PORT, // Use port from .env
  secure: process.env.EMAIL_SECURE === "true", // Use secure from .env (convert string to boolean)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add a logger for debugging transporter issues if needed
  // logger: true,
  // debug: true,
});

// @route   POST /api/applications
// @desc    Submit a new job application (from ApplicationForm page)
// @access  Private (Requires authentication to get userId)
router.post("/", authMiddleware, upload.single("cvFile"), async (req, res) => {
  console.log("\n--- Application Submission Attempt Started ---");
  console.log("1. Request Body (from Multer):", req.body);
  console.log("2. Uploaded File (from Multer):", req.file);
  console.log(
    "3. User ID from Auth:",
    req.user ? req.user.id : "Not available"
  );

  const { firstName, lastName, email, phone, message, vacancyId } = req.body;
  const cvFilePath = req.file
    ? path.relative(UPLOADS_BASE_DIR, req.file.path).replace(/\\/g, "/") // Ensure forward slashes
    : null;
  const userId = req.user.id; // Get userId from authenticated request

  console.log("4. Extracted data for Mongoose:", {
    firstName,
    lastName,
    email,
    phone,
    message,
    cvFilePath,
    userId,
    vacancyId,
  });

  try {
    if (!firstName || !lastName || !email || !message) {
      console.error("5. Missing required fields after Multer processing.");
      return res.status(400).json({
        message:
          "Missing required fields: First Name, Last Name, Email, and Message are mandatory.",
      });
    }

    if (!cvFilePath) {
      console.error("6. CV/Resume file is missing.");
      return res.status(400).json({ message: "CV/Resume file is required." });
    }

    const newApplication = new Application({
      firstName,
      lastName,
      email,
      phone,
      message,
      cvPath: cvFilePath,
      userId: userId,
      vacancyId: vacancyId || null,
      status: "Pending",
    });

    const application = await newApplication.save();
    console.log("7. Application saved successfully:", application);
    res
      .status(201)
      .json({ message: "Application submitted successfully!", application });
  } catch (err) {
    console.error(
      "8. Server-side error submitting application (catch block):",
      err.message
    );
    console.error("9. Full error details:", err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      console.log("10. Mongoose Validation Errors:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).send("Server Error");
  } finally {
    console.log("--- Application Submission Attempt Finished ---\n");
  }
});

// @route   GET /api/applications
// @desc    Get all applications (for admin dashboard)
// @access  Private (Admin only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("vacancyId", "title")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error("Error fetching all applications:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/applications/me
// @desc    Get applications for the logged-in user
// @access  Private (User only)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userApplications = await Application.find({ userId: req.user.id })
      .populate("vacancyId", "title")
      .sort({ createdAt: -1 });
    res.json(userApplications);
  } catch (err) {
    console.error("Error fetching user-specific applications:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status or details, send email if status is 'Contacted'
// @access  Private (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  console.log(
    `[Application PUT] Received update request for ID: ${req.params.id}, new status: ${status}`
  );

  try {
    let application = await Application.findById(req.params.id).populate(
      "vacancyId",
      "title"
    ); // Populate vacancyId to get title for email
    if (!application) {
      console.log(
        `[Application PUT] Application with ID ${req.params.id} not found.`
      );
      return res.status(404).json({ message: "Application not found" });
    }

    const previousStatus = application.status;

    // Only update status if it's provided and different
    if (status && application.status !== status) {
      application.status = status;
      console.log(
        `[Application PUT] Status changed from ${previousStatus} to ${status}`
      );

      // If status changes to 'Contacted', send an interview invitation email
      if (status === "Contacted") {
        const applicantName = `${application.firstName} ${application.lastName}`;
        const jobTitle = application.vacancyId
          ? application.vacancyId.title
          : "General Application";

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: application.email,
          subject: `Interview Invitation for ${jobTitle} - GreenPact Consulting`,
          html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">GreenPact Consulting - Interview Invitation</h2>
                    <p>Dear ${applicantName},</p>
                    <p>Thank you for your application for the position of <strong>${jobTitle}</strong> at GreenPact Consulting.</p>
                    <p>We were very impressed with your qualifications and would like to invite you for an interview to discuss your application further.</p>
                    <p>Please reply to this email to schedule a convenient time for your interview. We look forward to speaking with you!</p>
                    <p>Best regards,<br/>The GreenPact Consulting Team</p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(
              "[Application PUT] Error sending interview invitation email:",
              error
            );
          } else {
            console.log(
              "[Application PUT] Interview invitation email sent successfully:",
              info.response
            );
          }
        });
      }
    }

    await application.save();
    console.log(
      `[Application PUT] Application ${application._id} updated successfully.`
    );
    res.json({ message: "Application updated successfully!", application });
  } catch (err) {
    console.error("Error updating application:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Optional: Delete the associated CV file from the server
    if (application.cvPath) {
      const filePath = path.join(UPLOADS_BASE_DIR, application.cvPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted CV file: ${filePath}`);
      }
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted successfully!" });
  } catch (err) {
    console.error("Error deleting application:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(500).send("Server Error");
  }
});

export default router;

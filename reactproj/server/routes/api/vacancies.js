// server/routes/api/vacancies.js
import express from "express";
import Vacancy from "../../models/Vacancy.js"; // Assuming you have a Vacancy model
import { authMiddleware, adminMiddleware } from "../../middleware/auth.js";

const router = express.Router();

// @route   POST /api/vacancies
// @desc    Create a new vacancy
// @access  Private (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  // Destructure ALL fields from req.body that are part of the Vacancy model
  const {
    title,
    description,
    location,
    type,
    requirements,
    closingDate,
    isActive,
    numberOfEmployees,
  } = req.body;

  try {
    const newVacancy = new Vacancy({
      title,
      description,
      location,
      type,
      requirements: requirements
        .split(",")
        .map((req) => req.trim())
        .filter((req) => req.length > 0), // Split and trim requirements
      closingDate,
      isActive,
      numberOfEmployees: numberOfEmployees
        ? Number(numberOfEmployees)
        : undefined, // Convert to number, use undefined if empty/null
      // createdBy: req.user.id, // Uncomment if you track creator, ensure req.user.id is available from authMiddleware
    });

    const vacancy = await newVacancy.save();
    res.status(201).json({ message: "Vacancy created successfully!", vacancy });
  } catch (err) {
    console.error("Error creating vacancy:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/vacancies/admin-all
// @desc    Get all vacancies (for admin dashboard, including inactive)
// @access  Private (Admin only)
router.get("/admin-all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const vacancies = await Vacancy.find().sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (err) {
    console.error("Error fetching all vacancies for admin:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/vacancies
// @desc    Get all ACTIVE vacancies (for public display, e.g., Work With Us page)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const vacancies = await Vacancy.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(vacancies);
  } catch (err) {
    console.error("Error fetching active vacancies:", err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/vacancies/:id
// @desc    Get single vacancy by ID
// @access  Public (for users to view details)
router.get("/:id", async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }
    res.json(vacancy);
  } catch (err) {
    console.error("Error fetching single vacancy:", err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Vacancy not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/vacancies/:id
// @desc    Update a vacancy
// @access  Private (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const {
    title,
    description,
    location,
    type,
    requirements,
    closingDate,
    isActive,
    numberOfEmployees, // Ensure this is destructured
  } = req.body;

  try {
    let vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // Update fields only if they are provided in the request body
    // Use `!== undefined` to allow explicit `null` or empty string values to be set
    if (title !== undefined) vacancy.title = title;
    if (description !== undefined) vacancy.description = description;
    if (location !== undefined) vacancy.location = location;
    if (type !== undefined) vacancy.type = type;
    if (requirements !== undefined) {
      // Ensure requirements is always an array of strings
      vacancy.requirements = Array.isArray(requirements)
        ? requirements.map((req) => req.trim()).filter((req) => req.length > 0)
        : requirements
            .split(",")
            .map((req) => req.trim())
            .filter((req) => req.length > 0);
    }
    if (closingDate !== undefined) vacancy.closingDate = closingDate; // Date will be handled by Mongoose
    if (isActive !== undefined) vacancy.isActive = isActive;
    // Handle numberOfEmployees: convert to Number if provided, otherwise keep existing or set to null/undefined
    if (numberOfEmployees !== undefined) {
      vacancy.numberOfEmployees = numberOfEmployees
        ? Number(numberOfEmployees)
        : undefined;
    }

    await vacancy.save();
    res.json({ message: "Vacancy updated successfully!", vacancy });
  } catch (err) {
    console.error("Error updating vacancy:", err.message);
    if (err.name === "ValidationError") {
      // Log validation errors specifically
      const messages = Object.values(err.errors).map((val) => val.message);
      console.error("Mongoose Validation Error:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Vacancy not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/vacancies/:id
// @desc    Delete a vacancy
// @access  Private (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    await Vacancy.findByIdAndDelete(req.params.id);
    res.json({ message: "Vacancy deleted successfully!" });
  } catch (err) {
    console.error("Error deleting vacancy:", err.message);
    if (err.kind === "ObjectId") {
      return res
        .status(404)
        .json({ message: "Vacancy not found (Invalid ID format)" });
    }
    res.status(500).send("Server Error");
  }
});

export default router;

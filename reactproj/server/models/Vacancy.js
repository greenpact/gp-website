// server/models/Vacancy.js
import mongoose from "mongoose";

const vacancySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    requirements: {
      // New field for requirements (array of strings)
      type: [String],
      default: [],
    },
    closingDate: {
      // New field for closing date
      type: Date,
      required: false, // Optional, can be null
    },
    isActive: {
      // New field to manage visibility
      type: Boolean,
      default: true,
    },
    numberOfEmployees: {
      // NEW FIELD: Number of employees needed
      type: Number,
      required: false, // Will make required on frontend, but optional in schema for flexibility
      min: 1, // At least 1 employee
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Vacancy = mongoose.model("Vacancy", vacancySchema);

export default Vacancy;

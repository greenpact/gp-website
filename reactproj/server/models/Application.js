// server/models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: false, // Phone number can be optional
      trim: true,
    },
    message: {
      // This is now intended for the Motivational Letter
      type: String,
      required: true,
      trim: true,
    },
    cvPath: {
      // Path to the uploaded CV file
      type: String,
      required: false,
    },
    userId: {
      // To link application to a specific user
      type: mongoose.Schema.Types.ObjectId, // Stores MongoDB ObjectId
      ref: "User", // References the 'User' model
      required: true, // An application must be linked to a user
    },
    vacancyId: {
      // NEW FIELD: To link application to a specific vacancy
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vacancy", // References the 'Vacancy' model
      required: false, // Make it optional for general applications, or true if always required
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Contacted", "Archived"],
      default: "Pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;

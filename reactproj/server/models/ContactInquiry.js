// server/models/ContactInquiry.js
import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: false,
    },
    read: {
      type: Boolean,
      default: false, // Default status is unread
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const ContactInquiry = mongoose.model("ContactInquiry", contactInquirySchema);

export default ContactInquiry;

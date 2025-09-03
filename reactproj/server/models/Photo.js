// server/models/Photo.js
import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    albumId: {
      // Reference to the Album this photo belongs to
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album", // Links to the 'Album' model
      required: true,
    },
    imageUrl: {
      // Path to the actual photo file
      type: String,
      required: true,
    },
    caption: {
      // Optional caption for the photo
      type: String,
      required: false,
      trim: true,
    },
    order: {
      // Optional: for custom ordering of photos within an album
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;

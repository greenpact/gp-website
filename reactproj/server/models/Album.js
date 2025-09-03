// server/models/Album.js
import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Album titles should be unique
    },
    description: {
      type: String,
      required: false, // Description is optional
      trim: true,
    },
    coverImageUrl: {
      // Path to the album's cover image
      type: String,
      required: false, // Can be null if no cover is set
    },
    isActive: {
      // To control visibility on the public gallery page
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Album = mongoose.model("Album", albumSchema);

export default Album;

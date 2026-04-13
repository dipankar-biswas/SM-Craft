import mongoose, { Schema } from "mongoose";

const sizeSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
    },
    slug: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    
    // User tracking fields
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
      index: true,
    },
    updatedBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
    deleted_at: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export const Size = mongoose.models.Size || mongoose.model("Size", sizeSchema);

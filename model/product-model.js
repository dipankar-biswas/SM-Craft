import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
    },
    nameBn: {
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
    price: {
      required: true,
      type: Number,
      min: 0,
    },
    stockQuantity: {
      required: true,
      type: Number,
      min: 0,
      default: 0,
    },
    category: {
      type: Schema.ObjectId,
      ref: "Category",
      index: true,
    },
    brand: {
      type: Schema.ObjectId,
      ref: "Brand",
      index: true,
    },
    size: {
      type: Schema.ObjectId,
      ref: "Size",
      index: true,
    },
    color: {
      type: Schema.ObjectId,
      ref: "Color",
      index: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    video: {
      type: String,
      required: false,
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

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      default: "user",
    },
    profilePicture: { required: false, type: String },

    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// ✅ Prevent OverwriteModelError in hot-reloading (Next.js dev)
export const User = mongoose.models.User || mongoose.model("User", userSchema);

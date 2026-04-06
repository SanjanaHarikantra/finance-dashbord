const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required."],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false
    },
    role: {
      type: String,
      enum: ["viewer", "analyst", "admin"],
      default: "viewer"
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

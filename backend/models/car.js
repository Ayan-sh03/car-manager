const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [1000, "Description must not exceed 1000 characters"],
    },
    tags: {
      type: [String],
      required: [true, "Please add at least one tag"],
      index: true, // For efficient searching
    },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 10"],
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model("Car", carSchema);

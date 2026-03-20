const mongoose = require("mongoose");

const golferSchema = new mongoose.Schema(
  {
    sub: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    preferredUsername: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const GolferModel = mongoose.model("Golfer", golferSchema);

module.exports = { GolferModel };

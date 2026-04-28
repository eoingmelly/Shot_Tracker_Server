const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const HoleStatSchema = new mongoose.Schema(
  {
    roundStatId: {
      type: ObjectId,
      ref: "RoundStat",
      default: null,
      index: true,
    },
    golferId: { type: ObjectId, ref: "Golfer", required: true, index: true },
    holeNumber: { type: Number, required: true },
  },
  { timestamps: true },
);

const HoleStatModel =
  mongoose.models.HoleStat || mongoose.model("HoleStat", HoleStatSchema);

module.exports = { HoleStatModel };

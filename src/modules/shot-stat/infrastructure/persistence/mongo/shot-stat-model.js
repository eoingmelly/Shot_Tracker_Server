const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;
const ShotStatSchema = new mongoose.Schema(
  {
    golferId: { type: ObjectId, ref: "Golfer", required: true, index: true },

    holeStatId: { type: ObjectId, ref: "HoleStat" },
    // simple fields
    preStrokesGainedLie: { type: String, required: true },
    postStrokesGainedLie: { type: String, required: true },

    preStrokeDistanceToPin: { type: Number, required: true },
    postStrokeDistanceToPin: { type: Number, required: true },

    // shared/base
    datePlayed: { type: Date, required: true, index: true },
    pickedUp: { type: Boolean, default: false },

    //Set Values
    strokesGainedValue: { type: Number },
    strokesGainedShotType: {
      type: String,
      default: "Unknown",
      enum: [
        "Driving",
        "Approach",
        "Short_Game",
        "Putting",
        "Unknown",
        "Penalty",
      ],
    },

    // future enrichment (optional for now)
    // club: { type: String, default: null },
    // shotType: { type: String, default: null },
    // notes: { type: String, default: null },

    // lifecycle marker
    shotStatType: {
      type: String,
      enum: ["simple", "complex"],
      default: "simple",
      index: true,
    },
  },
  { timestamps: true },
);

const ShotStatModel =
  mongoose.models.ShotStat || mongoose.model("ShotStat", ShotStatSchema);

module.exports = { ShotStatModel };

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoundStatSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "GolfCourse" },
    date: { type: Date },
  },
  { timestamps: true },
);

const RoundStatModel =
  mongoose.models.RoundStat || mongoose.model("RoundStat", RoundStatSchema);

module.exports = { RoundStatModel };

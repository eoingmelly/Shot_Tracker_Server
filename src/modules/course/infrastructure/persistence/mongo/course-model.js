const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Golfer" },
  },
  { timestamps: true },
);

const CourseModel =
  mongoose.models.Course || mongoose.model("Course", CourseSchema);

module.exports = { CourseModel };

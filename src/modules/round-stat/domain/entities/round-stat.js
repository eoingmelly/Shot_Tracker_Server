class RoundStat {
  constructor({ id, courseId, golferId, datePlayed }) {
    this.id = id;
    this.courseId = courseId;
    this.golferId = golferId;
    this.datePlayed = datePlayed;
  }
}

module.exports = { RoundStat };

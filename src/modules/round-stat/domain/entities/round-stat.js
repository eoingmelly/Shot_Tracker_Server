class RoundStat {
  constructor({
    id,
    course,
    datePlayed,
    wind,
    windBearing,
    holeStats,
    isComplete,
  }) {
    this.id = id;
    this.course = course;
    this.datePlayed = datePlayed;
    this.wind = wind;
    this.windBearing = windBearing;
    this.holeStats = holeStats;
    this.isComplete = isComplete;
  }
}

module.exports = { RoundStat };

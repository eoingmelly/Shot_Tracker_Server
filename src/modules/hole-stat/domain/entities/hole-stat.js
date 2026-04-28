class HoleStat {
  constructor({ id, roundStatId, golferId, holeNumber }) {
    this.id = id;
    this.roundStatId = roundStatId;
    this.golferId = golferId;
    this.holeNumber = holeNumber;
  }
}

module.exports = { HoleStat };

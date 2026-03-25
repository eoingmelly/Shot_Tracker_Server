//modules/shot-stat/domain/entities
class ShotStat {
  constructor({
    id,
    golferId,
    preStrokesGainedLie,
    postStrokesGainedLie,
    preStrokeDistanceToPin,
    postStrokeDistanceToPin,
    strokesGainedValue,
    strokesGainedShotType,
    datePlayed,
    pickedUp,
    shotStatType,
  }) {
    this.id = id;
    this.golferId = golferId;
    this.preStrokesGainedLie = preStrokesGainedLie;
    this.postStrokesGainedLie = postStrokesGainedLie;
    this.preStrokeDistanceToPin = preStrokeDistanceToPin;
    this.postStrokeDistanceToPin = postStrokeDistanceToPin;
    this.strokesGainedValue = strokesGainedValue;
    this.strokesGainedShotType = strokesGainedShotType;
    this.datePlayed = datePlayed;
    this.pickedUp = pickedUp;
    this.shotStatType = shotStatType;
  }
}

module.exports = { ShotStat };

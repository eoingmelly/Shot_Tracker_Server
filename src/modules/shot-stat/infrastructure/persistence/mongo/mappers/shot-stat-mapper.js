const { ShotStat } = require("../../../../domain/entities/shot-stat");

class ShotStatMapper {
  toDomain({ shotStatDocument }) {
    if (!shotStatDocument) {
      throw new Error("ShotStatMapper.toDomain requires { shotStatDocument }");
    }

    return new ShotStat({
      id: shotStatDocument._id.toString(),
      golferId: shotStatDocument.golferId,
      preStrokesGainedLie: shotStatDocument.preStrokesGainedLie,
      postStrokesGainedLie: shotStatDocument.postStrokesGainedLie,
      preStrokeDistanceToPin: shotStatDocument.preStrokeDistanceToPin,
      postStrokeDistanceToPin: shotStatDocument.postStrokeDistanceToPin,
      strokesGainedValue: shotStatDocument.strokesGainedValue,
      strokesGainedShotType: shotStatDocument.strokesGainedShotType,
      datePlayed: shotStatDocument.datePlayed,
      pickedUp: shotStatDocument.pickedUp,
      shotStatType: shotStatDocument.shotStatType,
    });
  }

  toPersistence({ shotStat }) {
    if (!shotStat) {
      throw new Error("ShotStatMapper.toPersistence requires { shotStat }");
    }

    return {
      golferId: shotStat.golferId,
      preStrokesGainedLie: shotStat.preStrokesGainedLie,
      preStrokeDistanceToPin: shotStat.preStrokeDistanceToPin,
      postStrokesGainedLie: shotStat.postStrokesGainedLie,
      postStrokeDistanceToPin: shotStat.postStrokeDistanceToPin,
      strokesGainedValue: shotStat.strokesGainedValue,
      strokesGainedShotType: shotStat.strokesGainedShotType,
      datePlayed: shotStat.datePlayed,
      pickedUp: shotStat.pickedUp ?? false,
      shotStatType: shotStat.shotStatType ?? "simple",
    };
  }
}

module.exports = { ShotStatMapper };

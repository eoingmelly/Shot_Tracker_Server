const { ShotStat } = require("../../../../domain/entities/shot-stat");

const { ObjectId } = require("mongoose").Types;

class ShotStatMapper {
  toDomain({ shotStatDocument }) {
    if (!shotStatDocument) {
      throw new Error("ShotStatMapper.toDomain requires { shotStatDocument }");
    }

    return new ShotStat({
      id: shotStatDocument._id.toString(),
      golferId: shotStatDocument.golferId.toString(),
      holeStatId: shotStatDocument.holeStatId.toString(),
      roundStatId: shotStatDocument.roundStatId.toString(),
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
      golferId: new ObjectId(shotStat.golferId),
      holeStatId: new ObjectId(shotStat.holeStatId) ?? null,
      roundStatId: new ObjectId(shotStat.roundStatId) ?? null,
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

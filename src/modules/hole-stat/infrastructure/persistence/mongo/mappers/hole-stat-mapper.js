const { HoleStat } = require("../../../../domain/entities/hole-stat");

const { ObjectId } = require("mongoose").Types;

class HoleStatMapper {
  toDomain({ holeStatDocument }) {
    if (!holeStatDocument) {
      throw new Error("holeStatMapper.toDomain requires { holeStatDocument }");
    }

    return new HoleStat({
      id: holeStatDocument._id.toString(),
      roundStatId: holeStatDocument.roundStatId.toString(),
      golferId: holeStatDocument.golferId.toString(),
      holeNumber: holeStatDocument.holeNumber,
    });
  }

  toPersistence({ holeStat }) {
    if (!holeStat) {
      throw new Error("holeStatMapper.toPersistence requires { holeStat }");
    }

    return {
      roundStatId: new ObjectId(holeStat.roundStatId),
      golferId: new ObjectId(holeStat.golferId),
      holeNumber: holeStat.holeNumber,
    };
  }
}

module.exports = { HoleStatMapper };

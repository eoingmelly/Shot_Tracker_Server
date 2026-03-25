const { HoleStat } = require("../../../../domain/entities/hole-stat");

class HoleStatMapper {
  toDomain({ holeStatDocument }) {
    if (!holeStatDocument) {
      throw new Error("holeStatMapper.toDomain requires { holeStatDocument }");
    }

    return new HoleStat({
      id: holeStatDocument._id.toString(),
      roundStatId: holeStatDocument.roundStatId,
      golferId: holeStatDocument.golferId,
      holeNumber: holeStatDocument.holeNumber,
    });
  }

  toPersistence({ holeStat }) {
    if (!holeStat) {
      throw new Error("holeStatMapper.toPersistence requires { holeStat }");
    }

    return {
      id: holeStat.id,
      roundStatId: holeStat.roundStatId,
      golferId: holeStat.golferId,
      holeNumber: holeStat.holeNumber,
    };
  }
}

module.exports = { HoleStatMapper };

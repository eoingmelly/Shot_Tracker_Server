const { RoundStat } = require("../../../../domain/entities/round-stat");

const { ObjectId } = require("mongoose").Types;

class RoundStatMapper {
  toDomain({ roundStatDocument }) {
    if (!roundStatDocument) {
      throw new Error(
        "roundStatMapper.toDomain requires { roundStatDocument }",
      );
    }

    return new RoundStat({
      id: roundStatDocument._id.toString(),
      courseId: roundStatDocument.courseId.toString(),
      datePlayed: roundStatDocument.datePlayed,
      golferId: roundStatDocument.golferId.toString(),
    });
  }

  toPersistence({ roundStat }) {
    if (!roundStat) {
      throw new Error("roundStatMapper.toPersistence requires { roundStat }");
    }

    return {
      courseId: new ObjectId(roundStat.courseId),
      datePlayed: roundStat.datePlayed,
      golferId: new ObjectId(roundStat.golferId),
    };
  }
}

module.exports = { RoundStatMapper };

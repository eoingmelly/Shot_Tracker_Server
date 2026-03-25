const { RoundStat } = require("../../../../domain/entities/round-stat");

class RoundStatMapper {
  toDomain({ roundStatDocument }) {
    if (!roundStatDocument) {
      throw new Error(
        "roundStatMapper.toDomain requires { roundStatDocument }",
      );
    }

    return new RoundStat({
      id: roundStatDocument._id.toString(),
      course: roundStatDocument.course,
      datePlayed: roundStatDocument.datePlayed,
    });
  }

  toPersistence({ roundStat }) {
    if (!roundStat) {
      throw new Error("roundStatMapper.toPersistence requires { roundStat }");
    }

    return {
      id: roundStat.id,
      course: roundStat.course,
      datePlayed: roundStat.datePlayed,
    };
  }
}

module.exports = { RoundStatMapper };

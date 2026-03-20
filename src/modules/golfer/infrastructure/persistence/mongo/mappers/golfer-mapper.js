const { Golfer } = require("../../../../domain/entities/golfer");

class GolferMapper {
  constructor() {}

  toDomain({ golferDocument }) {
    if (!golferDocument) {
      throw new Error("GolferMapper.toDomain requires { golferDocument }");
    }

    return new Golfer({
      id: golferDocument._id.toString(),
      sub: golferDocument.sub,
      email: golferDocument.email,
      preferredUsername: golferDocument.preferredUsername || null,
    });
  }

  toPersistence({ golfer }) {
    if (!golfer) {
      throw new Error("GolferMapper.toPersistence requires { golfer }");
    }

    return {
      sub: golfer.sub,
      email: golfer.email,
      preferredUsername: golfer.preferredUsername || null,
    };
  }
}

module.exports = { GolferMapper };

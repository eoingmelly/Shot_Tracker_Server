const { Types } = require("mongoose");
const { HoleStatMapper } = require("../hole-stat-mapper");
const { HoleStat } = require("../../../../../domain/entities/hole-stat");

describe("HoleStatMapper", () => {
  let mapper;

  beforeEach(() => {
    mapper = new HoleStatMapper();
  });

  describe("toDomain", () => {
    test("throws when holeStatDocument is not provided", () => {
      expect(() => {
        mapper.toDomain({});
      }).toThrow("holeStatMapper.toDomain requires { holeStatDocument }");
    });

    test("maps persistence document to domain entity", () => {
      const holeStatDocument = {
        _id: new Types.ObjectId(),
        roundStatId: new Types.ObjectId(),
        golferId: new Types.ObjectId(),
        holeNumber: 4,
      };

      const result = mapper.toDomain({ holeStatDocument });

      expect(result).toBeInstanceOf(HoleStat);
      expect(result).toEqual({
        id: holeStatDocument._id.toString(),
        roundStatId: holeStatDocument.roundStatId.toString(),
        golferId: holeStatDocument.golferId.toString(),
        holeNumber: 4,
      });
    });
  });

  describe("toPersistence", () => {
    test("throws when holeStat is not provided", () => {
      expect(() => {
        mapper.toPersistence({});
      }).toThrow("holeStatMapper.toPersistence requires { holeStat }");
    });

    test("maps domain entity to persistence shape with ObjectIds", () => {
      const holeStat = new HoleStat({
        id: "507f1f77bcf86cd799439011",
        roundStatId: "507f1f77bcf86cd799439012",
        golferId: "507f1f77bcf86cd799439013",
        holeNumber: 5,
      });

      const result = mapper.toPersistence({ holeStat });

      expect(result.roundStatId).toBeInstanceOf(Types.ObjectId);
      expect(result.golferId).toBeInstanceOf(Types.ObjectId);

      expect(result).toEqual({
        roundStatId: new Types.ObjectId("507f1f77bcf86cd799439012"),
        golferId: new Types.ObjectId("507f1f77bcf86cd799439013"),
        holeNumber: 5,
      });
    });
  });
});

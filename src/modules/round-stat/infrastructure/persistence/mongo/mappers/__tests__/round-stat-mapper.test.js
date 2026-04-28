const { Types } = require("mongoose");
const { RoundStatMapper } = require("../round-stat-mapper");
const { RoundStat } = require("../../../../../domain/entities/round-stat");

describe("RoundStatMapper", () => {
  let mapper;

  beforeEach(() => {
    mapper = new RoundStatMapper();
  });

  describe("toDomain", () => {
    test("throws when roundStatDocument is not provided", () => {
      expect(() => {
        mapper.toDomain({});
      }).toThrow("roundStatMapper.toDomain requires { roundStatDocument }");
    });

    test("maps persistence document to domain entity", () => {
      const roundStatDocument = {
        _id: new Types.ObjectId(),
        courseId: new Types.ObjectId(),
        golferId: new Types.ObjectId(),
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
      };

      const result = mapper.toDomain({ roundStatDocument });

      expect(result).toBeInstanceOf(RoundStat);
      expect(result).toEqual({
        id: roundStatDocument._id.toString(),
        courseId: roundStatDocument.courseId.toString(),
        golferId: roundStatDocument.golferId.toString(),
        datePlayed: roundStatDocument.datePlayed,
      });
    });
  });

  describe("toPersistence", () => {
    test("throws when roundStat is not provided", () => {
      expect(() => {
        mapper.toPersistence({});
      }).toThrow("roundStatMapper.toPersistence requires { roundStat }");
    });

    test("maps domain entity to persistence shape with ObjectIds", () => {
      const datePlayed = new Date("2025-01-15T10:00:00.000Z");

      const roundStat = new RoundStat({
        id: "round-1",
        courseId: "507f1f77bcf86cd799439011",
        golferId: "507f1f77bcf86cd799439012",
        datePlayed,
      });

      const result = mapper.toPersistence({ roundStat });

      expect(result.courseId).toBeInstanceOf(Types.ObjectId);
      expect(result.golferId).toBeInstanceOf(Types.ObjectId);

      expect(result).toEqual({
        courseId: new Types.ObjectId("507f1f77bcf86cd799439011"),
        golferId: new Types.ObjectId("507f1f77bcf86cd799439012"),
        datePlayed,
      });
    });
  });
});

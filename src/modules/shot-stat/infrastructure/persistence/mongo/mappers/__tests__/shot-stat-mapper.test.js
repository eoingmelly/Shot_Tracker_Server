const { Types } = require("mongoose");
const { ShotStatMapper } = require("../shot-stat-mapper");
const { ShotStat } = require("../../../../../domain/entities/shot-stat");

describe("ShotStatMapper", () => {
  let shotStatMapper;

  beforeEach(() => {
    shotStatMapper = new ShotStatMapper();
  });

  describe("toDomain", () => {
    test("throws when shotStatDocument is not provided", () => {
      expect(() => {
        shotStatMapper.toDomain({});
      }).toThrow("ShotStatMapper.toDomain requires { shotStatDocument }");
    });

    test("maps persistence document to domain entity", () => {
      const shotStatDocument = {
        _id: new Types.ObjectId(),
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        strokesGainedValue: 0.42,
        strokesGainedShotType: "driving",
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
        pickedUp: false,
        shotStatType: "simple",
      };

      const result = shotStatMapper.toDomain({ shotStatDocument });

      expect(result).toBeInstanceOf(ShotStat);
      expect(result).toEqual({
        id: shotStatDocument._id.toString(),
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        strokesGainedValue: 0.42,
        strokesGainedShotType: "driving",
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
        pickedUp: false,
        shotStatType: "simple",
      });
    });
  });

  describe("toPersistence", () => {
    test("throws when shotStat is not provided", () => {
      expect(() => {
        shotStatMapper.toPersistence({});
      }).toThrow("ShotStatMapper.toPersistence requires { shotStat }");
    });

    test("maps domain entity to persistence shape", () => {
      const datePlayed = new Date("2025-01-15T10:00:00.000Z");

      const shotStat = new ShotStat({
        id: "shot-stat-1",
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        strokesGainedValue: 0.42,
        strokesGainedShotType: "driving",
        datePlayed,
        pickedUp: true,
        shotStatType: "simple",
      });

      const result = shotStatMapper.toPersistence({ shotStat });

      expect(result).toEqual({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        preStrokeDistanceToPin: 420,
        postStrokesGainedLie: "fairway",
        postStrokeDistanceToPin: 150,
        strokesGainedValue: 0.42,
        strokesGainedShotType: "driving",
        datePlayed,
        pickedUp: true,
        shotStatType: "simple",
      });
    });

    test("defaults pickedUp to false when omitted", () => {
      const shotStat = new ShotStat({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
      });

      const result = shotStatMapper.toPersistence({ shotStat });

      expect(result.pickedUp).toBe(false);
    });

    test('defaults shotStatType to "simple" when omitted', () => {
      const shotStat = new ShotStat({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
      });

      const result = shotStatMapper.toPersistence({ shotStat });

      expect(result.shotStatType).toBe("simple");
    });
  });
});

const { ObjectId } = require("mongoose").Types;
const { ShotStatMapper } = require("../shot-stat-mapper");
const { ShotStat } = require("../../../../../domain/entities/shot-stat");

describe("ShotStatMapper", () => {
  let shotStatMapper;
  let holeId;
  let roundStatId;
  let golferId;
  let holeIdSt;
  let roundStatIdSt;
  let golferIdSt;
  let shotId;
  let shotIdSt;

  beforeEach(() => {
    shotStatMapper = new ShotStatMapper();
    shotId = new ObjectId("69c44c385ad4f3562e03ebb5");
    golferId = new ObjectId("69c44c385ad4f3562e03ebb4");
    holeId = new ObjectId("69c44c385ad4f3562e03ebb3");
    roundStatId = new ObjectId("69c44c385ad4f3562e03ebb2");

    shotIdSt = "69c44c385ad4f3562e03ebb5";
    golferIdSt = "69c44c385ad4f3562e03ebb4";
    holeIdSt = "69c44c385ad4f3562e03ebb3";
    roundStatIdSt = "69c44c385ad4f3562e03ebb2";
  });

  describe("toDomain", () => {
    test("throws when shotStatDocument is not provided", () => {
      expect(() => {
        shotStatMapper.toDomain({});
      }).toThrow("ShotStatMapper.toDomain requires { shotStatDocument }");
    });

    test("maps persistence document to domain entity", () => {
      const shotStatDocument = {
        _id: shotId,
        golferId: golferId,
        roundStatId: roundStatId,
        holeStatId: holeId,
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

      console.log("result? ", result);
      expect(result).toBeInstanceOf(ShotStat);
      expect(result).toEqual({
        id: shotIdSt,
        golferId: golferIdSt,
        roundStatId: roundStatIdSt,
        holeStatId: holeIdSt,
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
        id: shotIdSt,
        golferId: golferIdSt,
        preStrokesGainedLie: "tee",
        holeStatId: holeIdSt,
        roundStatId: roundStatIdSt,
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
        golferId: golferId,
        preStrokesGainedLie: "tee",
        preStrokeDistanceToPin: 420,
        postStrokesGainedLie: "fairway",
        holeStatId: holeId,
        roundStatId: roundStatId,
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
        golferId: golferIdSt,
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
        golferId: golferIdSt,
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

const { ShotStat } = require("../shot-stat");

describe("ShotStat", () => {
  describe("constructor", () => {
    test("creates a shot stat with all provided properties", () => {
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
        pickedUp: false,
        shotStatType: "simple",
      });

      expect(shotStat).toEqual({
        id: "shot-stat-1",
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        strokesGainedValue: 0.42,
        strokesGainedShotType: "driving",
        datePlayed,
        pickedUp: false,
        shotStatType: "simple",
      });
    });

    test("assigns undefined to properties not provided", () => {
      const shotStat = new ShotStat({
        golferId: "golfer-1",
      });

      expect(shotStat.id).toBeUndefined();
      expect(shotStat.golferId).toBe("golfer-1");
      expect(shotStat.preStrokesGainedLie).toBeUndefined();
      expect(shotStat.postStrokesGainedLie).toBeUndefined();
      expect(shotStat.preStrokeDistanceToPin).toBeUndefined();
      expect(shotStat.postStrokeDistanceToPin).toBeUndefined();
      expect(shotStat.strokesGainedValue).toBeUndefined();
      expect(shotStat.strokesGainedShotType).toBeUndefined();
      expect(shotStat.datePlayed).toBeUndefined();
      expect(shotStat.pickedUp).toBeUndefined();
      expect(shotStat.shotStatType).toBeUndefined();
    });

    test("preserves null values when explicitly provided", () => {
      const shotStat = new ShotStat({
        id: null,
        golferId: "golfer-1",
        preStrokesGainedLie: null,
        postStrokesGainedLie: null,
        preStrokeDistanceToPin: null,
        postStrokeDistanceToPin: null,
        strokesGainedValue: null,
        strokesGainedShotType: null,
        datePlayed: null,
        pickedUp: null,
        shotStatType: null,
      });

      expect(shotStat).toEqual({
        id: null,
        golferId: "golfer-1",
        preStrokesGainedLie: null,
        postStrokesGainedLie: null,
        preStrokeDistanceToPin: null,
        postStrokeDistanceToPin: null,
        strokesGainedValue: null,
        strokesGainedShotType: null,
        datePlayed: null,
        pickedUp: null,
        shotStatType: null,
      });
    });
  });
});

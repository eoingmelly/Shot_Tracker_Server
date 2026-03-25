const { RoundStat } = require("../round-stat");

describe("RoundStat", () => {
  describe("constructor", () => {
    test("creates a round stat with all provided properties", () => {
      const datePlayed = new Date("2025-01-15T10:00:00.000Z");

      const roundStat = new RoundStat({
        id: "round-1",
        courseId: "Augusta National",
        golferId: "golfer-1",
        datePlayed,
      });

      expect(roundStat).toEqual({
        id: "round-1",
        courseId: "Augusta National",
        golferId: "golfer-1",
        datePlayed,
      });
    });

    test("assigns undefined to properties not provided", () => {
      const roundStat = new RoundStat({
        golferId: "golfer-1",
      });

      expect(roundStat.id).toBeUndefined();
      expect(roundStat.courseId).toBeUndefined();
      expect(roundStat.golferId).toBe("golfer-1");
      expect(roundStat.datePlayed).toBeUndefined();
    });

    test("preserves null values when explicitly provided", () => {
      const roundStat = new RoundStat({
        id: null,
        courseId: null,
        golferId: "golfer-1",
        datePlayed: null,
      });

      expect(roundStat).toEqual({
        id: null,
        courseId: null,
        golferId: "golfer-1",
        datePlayed: null,
      });
    });
  });
});

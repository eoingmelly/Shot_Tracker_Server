const { HoleStat } = require("../hole-stat");

describe("HoleStat", () => {
  describe("constructor", () => {
    test("creates a hole stat with all provided properties", () => {
      const holeStat = new HoleStat({
        id: "hole-stat-1",
        roundStatId: "round-1",
        golferId: "golfer-1",
        holeNumber: 3,
      });

      expect(holeStat).toEqual({
        id: "hole-stat-1",
        roundStatId: "round-1",
        golferId: "golfer-1",
        holeNumber: 3,
      });
    });

    test("assigns undefined to properties not provided", () => {
      const holeStat = new HoleStat({
        golferId: "golfer-1",
      });

      expect(holeStat.id).toBeUndefined();
      expect(holeStat.roundStatId).toBeUndefined();
      expect(holeStat.golferId).toBe("golfer-1");
      expect(holeStat.holeNumber).toBeUndefined();
    });

    test("preserves null values when explicitly provided", () => {
      const holeStat = new HoleStat({
        id: null,
        roundStatId: null,
        golferId: "golfer-1",
        holeNumber: null,
      });

      expect(holeStat).toEqual({
        id: null,
        roundStatId: null,
        golferId: "golfer-1",
        holeNumber: null,
      });
    });
  });
});

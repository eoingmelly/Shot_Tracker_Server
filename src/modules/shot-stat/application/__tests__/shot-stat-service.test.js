const { ShotStatService } = require("../shot-stat-service");

describe("ShotStatService", () => {
  describe("constructor", () => {
    test("throws when shotStatRepository is not provided", () => {
      expect(() => {
        new ShotStatService({});
      }).toThrow("ShotStatService requires { shotStatRepository }");
    });

    test("stores shotStatRepository when provided", () => {
      const mockShotStatRepository = {};

      const shotStatService = new ShotStatService({
        shotStatRepository: mockShotStatRepository,
      });

      expect(shotStatService._shotStatRepository).toBe(mockShotStatRepository);
    });
  });

  describe("createSimpleShotStat", () => {
    test("throws when golferId is not provided", async () => {
      const shotStatService = new ShotStatService({
        shotStatRepository: {
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      });

      await expect(
        shotStatService.createSimpleShotStat({
          preStrokesGainedLie: "tee",
          postStrokesGainedLie: "fairway",
          preStrokeDistanceToPin: 420,
          postStrokeDistanceToPin: 150,
          datePlayed: new Date("2025-01-15T10:00:00.000Z"),
        }),
      ).rejects.toThrow("createSimpleShotStat requires { golferId }");
    });

    test("creates and returns a simple shot stat", async () => {
      const datePlayed = new Date("2025-01-15T10:00:00.000Z");

      const createdShotStat = {
        id: "shot-stat-1",
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed,
        shotStatType: "simple",
      };

      const mockShotStatRepository = {
        create: jest.fn().mockResolvedValue(createdShotStat),
        update: jest.fn(),
        delete: jest.fn(),
      };

      const shotStatService = new ShotStatService({
        shotStatRepository: mockShotStatRepository,
      });

      const result = await shotStatService.createSimpleShotStat({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed,
      });

      expect(mockShotStatRepository.create).toHaveBeenCalledTimes(1);
      expect(mockShotStatRepository.create).toHaveBeenCalledWith({
        shotStat: {
          golferId: "golfer-1",
          preStrokesGainedLie: "tee",
          postStrokesGainedLie: "fairway",
          preStrokeDistanceToPin: 420,
          postStrokeDistanceToPin: 150,
          datePlayed,
          shotStatType: "simple",
        },
      });

      expect(result).toBe(createdShotStat);
    });
  });

  describe("updateShotStat", () => {
    test("passes id and updates to repository.update and returns result", async () => {
      const updatedShotStat = {
        id: "shot-stat-1",
        notes: "Updated note",
      };

      const updates = {
        notes: "Updated note",
      };

      const mockShotStatRepository = {
        create: jest.fn(),
        update: jest.fn().mockResolvedValue(updatedShotStat),
        delete: jest.fn(),
      };

      const shotStatService = new ShotStatService({
        shotStatRepository: mockShotStatRepository,
      });

      const result = await shotStatService.updateShotStat({
        id: "shot-stat-1",
        updates,
      });

      expect(mockShotStatRepository.update).toHaveBeenCalledTimes(1);
      expect(mockShotStatRepository.update).toHaveBeenCalledWith({
        id: "shot-stat-1",
        shotStat: updates,
      });

      expect(result).toBe(updatedShotStat);
    });
  });

  describe("deleteShotStat", () => {
    test("passes id to repository.delete and returns result", async () => {
      const mockShotStatRepository = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn().mockResolvedValue(undefined),
      };

      const shotStatService = new ShotStatService({
        shotStatRepository: mockShotStatRepository,
      });

      const result = await shotStatService.deleteShotStat({
        id: "shot-stat-1",
      });

      expect(mockShotStatRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockShotStatRepository.delete).toHaveBeenCalledWith({
        id: "shot-stat-1",
      });

      expect(result).toBeUndefined();
    });
  });
});

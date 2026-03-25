const { RoundStatService } = require("../round-stat-service");

describe("RoundStatService", () => {
  describe("constructor", () => {
    test("throws when roundStatRepository is not provided", () => {
      expect(() => {
        new RoundStatService({});
      }).toThrow("RoundStatService requires { roundStatRepository }");
    });

    test("stores roundStatRepository when provided", () => {
      const mockRepository = {};

      const service = new RoundStatService({
        roundStatRepository: mockRepository,
      });

      expect(service._roundStatRepository).toBe(mockRepository);
    });
  });

  describe("createRoundStat", () => {
    test("throws when datePlayed is not provided", async () => {
      const service = new RoundStatService({
        roundStatRepository: {
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      });

      await expect(
        service.createRoundStat({
          courseId: "Augusta",
        }),
      ).rejects.toThrow("createRoundStat requires { datePlayed }");
    });

    test("calls repository.create with correct payload", async () => {
      const datePlayed = new Date("2025-01-15T10:00:00.000Z");

      const createdRound = {
        id: "round-1",
        courseId: "Augusta",
        datePlayed,
      };

      const mockRepository = {
        create: jest.fn().mockResolvedValue(createdRound),
        update: jest.fn(),
        delete: jest.fn(),
      };

      const service = new RoundStatService({
        roundStatRepository: mockRepository,
      });

      const result = await service.createRoundStat({
        courseId: "Augusta",
        golferId: "golfer1",
        datePlayed,
      });

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith({
        roundStat: {
          courseId: "Augusta",
          golferId: "golfer1",
          datePlayed,
        },
      });

      expect(result).toBe(createdRound);
    });
  });

  describe("updateRoundStat", () => {
    test("passes id and updates to repository.update", async () => {
      const updated = { id: "round-1", course: "Pebble" };

      const mockRepository = {
        create: jest.fn(),
        update: jest.fn().mockResolvedValue(updated),
        delete: jest.fn(),
      };

      const service = new RoundStatService({
        roundStatRepository: mockRepository,
      });

      const result = await service.updateRoundStat({
        id: "round-1",
        updates: { course: "Pebble" },
      });

      expect(mockRepository.update).toHaveBeenCalledWith({
        id: "round-1",
        roundStat: { course: "Pebble" },
      });

      expect(result).toBe(updated);
    });
  });

  describe("deleteRoundStat", () => {
    test("passes id to repository.delete", async () => {
      const mockRepository = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn().mockResolvedValue(undefined),
      };

      const service = new RoundStatService({
        roundStatRepository: mockRepository,
      });

      const result = await service.deleteRoundStat({
        id: "round-1",
      });

      expect(mockRepository.delete).toHaveBeenCalledWith({
        id: "round-1",
      });

      expect(result).toBeUndefined();
    });
  });
});

jest.mock("../../domain/entities/golfer", () => {
  class Golfer {
    constructor({ sub, email, preferredUsername = null }) {
      this.sub = sub;
      this.email = email;
      this.preferredUsername = preferredUsername;
    }
  }

  return { Golfer };
});

const { GolferService } = require("../golfer-service");
const { Golfer } = require("../../domain/entities/golfer");

describe("GolferService", () => {
  describe("constructor", () => {
    test("throws when golferRepository is not provided", () => {
      expect(() => {
        new GolferService({});
      }).toThrow("GolferService requires { golferRepository }");
    });

    test("stores golferRepository when provided", () => {
      const mockGolferRepository = {};

      const golferService = new GolferService({
        golferRepository: mockGolferRepository,
      });

      expect(golferService._golferRepository).toBe(mockGolferRepository);
    });
  });

  describe("getOrCreateGolferFromIdentity", () => {
    test("throws when sub is not provided", async () => {
      const golferService = new GolferService({
        golferRepository: {
          findBySub: jest.fn(),
          create: jest.fn(),
        },
      });

      await expect(
        golferService.getOrCreateGolferFromIdentity({
          email: "test@example.com",
        }),
      ).rejects.toThrow(
        "GolferService.getOrCreateGolferFromIdentity requires { sub }",
      );
    });

    test("throws when email is not provided", async () => {
      const golferService = new GolferService({
        golferRepository: {
          findBySub: jest.fn(),
          create: jest.fn(),
        },
      });

      await expect(
        golferService.getOrCreateGolferFromIdentity({
          sub: "abc-123",
        }),
      ).rejects.toThrow(
        "GolferService.getOrCreateGolferFromIdentity requires { email }",
      );
    });

    test("returns existing golfer when repository finds one", async () => {
      const existingGolfer = { id: "golfer-1", sub: "abc-123" };

      const mockGolferRepository = {
        findBySub: jest.fn().mockResolvedValue(existingGolfer),
        create: jest.fn(),
      };

      const golferService = new GolferService({
        golferRepository: mockGolferRepository,
      });

      const result = await golferService.getOrCreateGolferFromIdentity({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      expect(mockGolferRepository.findBySub).toHaveBeenCalledWith({
        sub: "abc-123",
      });
      expect(mockGolferRepository.create).not.toHaveBeenCalled();
      expect(result).toBe(existingGolfer);
    });

    test("creates and returns a new golfer when repository does not find one", async () => {
      const createdGolfer = { id: "golfer-2", sub: "abc-123" };

      const mockGolferRepository = {
        findBySub: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(createdGolfer),
      };

      const golferService = new GolferService({
        golferRepository: mockGolferRepository,
      });

      const result = await golferService.getOrCreateGolferFromIdentity({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      expect(mockGolferRepository.findBySub).toHaveBeenCalledWith({
        sub: "abc-123",
      });

      expect(mockGolferRepository.create).toHaveBeenCalledTimes(1);

      const createCallArgs = mockGolferRepository.create.mock.calls[0][0];

      expect(createCallArgs.golfer).toBeInstanceOf(Golfer);
      expect(createCallArgs.golfer).toMatchObject({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      expect(result).toBe(createdGolfer);
    });

    test("defaults preferredUsername to null when omitted", async () => {
      const mockGolferRepository = {
        findBySub: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(async ({ golfer }) => golfer),
      };

      const golferService = new GolferService({
        golferRepository: mockGolferRepository,
      });

      const result = await golferService.getOrCreateGolferFromIdentity({
        sub: "abc-123",
        email: "test@example.com",
      });

      expect(mockGolferRepository.create).toHaveBeenCalledTimes(1);

      const createCallArgs = mockGolferRepository.create.mock.calls[0][0];

      expect(createCallArgs.golfer).toBeInstanceOf(Golfer);
      expect(createCallArgs.golfer.preferredUsername).toBeNull();
      expect(result.preferredUsername).toBeNull();
    });
  });
});

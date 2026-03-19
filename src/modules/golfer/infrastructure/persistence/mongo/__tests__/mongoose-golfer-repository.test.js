const { MongooseGolferRepository } = require("../mongoose-golfer-repository");
const {
  IGolferRepository,
} = require("../../../../domain/interfaces/i-golfer-repository");

describe("MongooseGolferRepository", () => {
  describe("constructor", () => {
    test("throws when golferModel is not provided", () => {
      expect(() => {
        new MongooseGolferRepository({
          golferMapper: {},
        });
      }).toThrow("MongooseGolferRepository requires { golferModel }");
    });

    test("throws when golferMapper is not provided", () => {
      expect(() => {
        new MongooseGolferRepository({
          golferModel: {},
        });
      }).toThrow("MongooseGolferRepository requires { golferMapper }");
    });

    test("stores dependencies when provided", () => {
      const mockGolferModel = {};
      const mockGolferMapper = {};

      const repository = new MongooseGolferRepository({
        golferModel: mockGolferModel,
        golferMapper: mockGolferMapper,
      });

      expect(repository._golferModel).toBe(mockGolferModel);
      expect(repository._golferMapper).toBe(mockGolferMapper);
    });

    test("extends IGolferRepository", () => {
      const repository = new MongooseGolferRepository({
        golferModel: {},
        golferMapper: {},
      });

      expect(repository).toBeInstanceOf(IGolferRepository);
    });
  });

  describe("findBySub", () => {
    test("calls golferModel.findOne with sub and returns null when no document is found", async () => {
      const mockGolferModel = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockGolferMapper = {
        toDomain: jest.fn(),
      };

      const repository = new MongooseGolferRepository({
        golferModel: mockGolferModel,
        golferMapper: mockGolferMapper,
      });

      const result = await repository.findBySub({ sub: "abc-123" });

      expect(mockGolferModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockGolferModel.findOne).toHaveBeenCalledWith({ sub: "abc-123" });
      expect(mockGolferMapper.toDomain).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test("maps found document to domain entity", async () => {
      const golferDocument = {
        _id: "mongo-1",
        sub: "abc-123",
        email: "test@example.com",
      };

      const domainGolfer = {
        id: "mongo-1",
        sub: "abc-123",
        email: "test@example.com",
      };

      const mockGolferModel = {
        findOne: jest.fn().mockResolvedValue(golferDocument),
      };

      const mockGolferMapper = {
        toDomain: jest.fn().mockReturnValue(domainGolfer),
      };

      const repository = new MongooseGolferRepository({
        golferModel: mockGolferModel,
        golferMapper: mockGolferMapper,
      });

      const result = await repository.findBySub({ sub: "abc-123" });

      expect(mockGolferModel.findOne).toHaveBeenCalledWith({ sub: "abc-123" });
      expect(mockGolferMapper.toDomain).toHaveBeenCalledTimes(1);
      expect(mockGolferMapper.toDomain).toHaveBeenCalledWith({
        golferDocument,
      });
      expect(result).toBe(domainGolfer);
    });
  });

  describe("create", () => {
    test("maps golfer to persistence, creates document, and maps created document to domain", async () => {
      const golfer = {
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      };

      const persistenceData = {
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      };

      const createdGolferDocument = {
        _id: "mongo-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      };

      const domainGolfer = {
        id: "mongo-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      };

      const mockGolferModel = {
        create: jest.fn().mockResolvedValue(createdGolferDocument),
      };

      const mockGolferMapper = {
        toPersistence: jest.fn().mockReturnValue(persistenceData),
        toDomain: jest.fn().mockReturnValue(domainGolfer),
      };

      const repository = new MongooseGolferRepository({
        golferModel: mockGolferModel,
        golferMapper: mockGolferMapper,
      });

      const result = await repository.create({ golfer });

      expect(mockGolferMapper.toPersistence).toHaveBeenCalledTimes(1);
      expect(mockGolferMapper.toPersistence).toHaveBeenCalledWith({ golfer });

      expect(mockGolferModel.create).toHaveBeenCalledTimes(1);
      expect(mockGolferModel.create).toHaveBeenCalledWith(persistenceData);

      expect(mockGolferMapper.toDomain).toHaveBeenCalledTimes(1);
      expect(mockGolferMapper.toDomain).toHaveBeenCalledWith({
        golferDocument: createdGolferDocument,
      });

      expect(result).toBe(domainGolfer);
    });
  });
});

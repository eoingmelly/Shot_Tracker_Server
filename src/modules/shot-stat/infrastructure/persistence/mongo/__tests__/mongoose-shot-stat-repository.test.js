const {
  MongooseShotStatRepository,
} = require("../mongoose-shot-stat-repository");
const {
  IShotStatRepository,
} = require("../../../../domain/interfaces/i-shot-stat-repository");

describe("MongooseShotStatRepository", () => {
  describe("constructor", () => {
    test("throws when shotStatModel is not provided", () => {
      expect(() => {
        new MongooseShotStatRepository({
          shotStatMapper: {},
        });
      }).toThrow("MongooseShotStatRepository requires { shotStatModel }");
    });

    test("throws when shotStatMapper is not provided", () => {
      expect(() => {
        new MongooseShotStatRepository({
          shotStatModel: {},
        });
      }).toThrow("MongooseShotStatRepository requires { shotStatMapper }");
    });

    test("stores dependencies when provided", () => {
      const mockShotStatModel = {};
      const mockShotStatMapper = {};

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: mockShotStatMapper,
      });

      expect(repository._shotStatModel).toBe(mockShotStatModel);
      expect(repository._shotStatMapper).toBe(mockShotStatMapper);
    });

    test("extends IShotStatRepository", () => {
      const repository = new MongooseShotStatRepository({
        shotStatModel: {},
        shotStatMapper: {},
      });

      expect(repository).toBeInstanceOf(IShotStatRepository);
    });
  });

  describe("create", () => {
    test("maps shot stat to persistence, creates document, and maps created document to domain", async () => {
      const shotStat = {
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

      const persistenceData = {
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

      const createdShotStatDocument = {
        _id: "mongo-1",
        ...persistenceData,
      };

      const domainShotStat = {
        id: "mongo-1",
        ...persistenceData,
      };

      const mockShotStatModel = {
        create: jest.fn().mockResolvedValue(createdShotStatDocument),
      };

      const mockShotStatMapper = {
        toPersistence: jest.fn().mockReturnValue(persistenceData),
        toDomain: jest.fn().mockReturnValue(domainShotStat),
      };

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: mockShotStatMapper,
      });

      const result = await repository.create({ shotStat });

      expect(mockShotStatMapper.toPersistence).toHaveBeenCalledTimes(1);
      expect(mockShotStatMapper.toPersistence).toHaveBeenCalledWith({
        shotStat,
      });

      expect(mockShotStatModel.create).toHaveBeenCalledTimes(1);
      expect(mockShotStatModel.create).toHaveBeenCalledWith(persistenceData);

      expect(mockShotStatMapper.toDomain).toHaveBeenCalledTimes(1);
      expect(mockShotStatMapper.toDomain).toHaveBeenCalledWith({
        shotStatDocument: createdShotStatDocument,
      });

      expect(result).toBe(domainShotStat);
    });
  });

  describe("findById", () => {
    test("calls shotStatModel.findById and returns null when no document is found", async () => {
      const mockShotStatModel = {
        findById: jest.fn().mockResolvedValue(null),
      };

      const mockShotStatMapper = {
        toDomain: jest.fn(),
      };

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: mockShotStatMapper,
      });

      const result = await repository.findById({ id: "shot-stat-1" });

      expect(mockShotStatModel.findById).toHaveBeenCalledTimes(1);
      expect(mockShotStatModel.findById).toHaveBeenCalledWith("shot-stat-1");
      expect(mockShotStatMapper.toDomain).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test("maps found document to domain entity", async () => {
      const shotStatDocument = {
        _id: "mongo-1",
        golferId: "golfer-1",
      };

      const domainShotStat = {
        id: "mongo-1",
        golferId: "golfer-1",
      };

      const mockShotStatModel = {
        findById: jest.fn().mockResolvedValue(shotStatDocument),
      };

      const mockShotStatMapper = {
        toDomain: jest.fn().mockReturnValue(domainShotStat),
      };

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: mockShotStatMapper,
      });

      const result = await repository.findById({ id: "shot-stat-1" });

      expect(mockShotStatModel.findById).toHaveBeenCalledWith("shot-stat-1");
      expect(mockShotStatMapper.toDomain).toHaveBeenCalledTimes(1);
      expect(mockShotStatMapper.toDomain).toHaveBeenCalledWith({
        shotStatDocument,
      });
      expect(result).toBe(domainShotStat);
    });
  });

  describe("update", () => {
    test("maps shot stat to persistence, updates document, and maps updated document to domain", async () => {
      const shotStat = {
        golferId: "golfer-1",
        notes: "Updated note",
      };

      const persistenceData = {
        golferId: "golfer-1",
        notes: "Updated note",
      };

      const updatedShotStatDocument = {
        _id: "mongo-1",
        golferId: "golfer-1",
        notes: "Updated note",
      };

      const domainShotStat = {
        id: "mongo-1",
        golferId: "golfer-1",
        notes: "Updated note",
      };

      const mockShotStatModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(updatedShotStatDocument),
      };

      const mockShotStatMapper = {
        toPersistence: jest.fn().mockReturnValue(persistenceData),
        toDomain: jest.fn().mockReturnValue(domainShotStat),
      };

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: mockShotStatMapper,
      });

      const result = await repository.update({
        id: "shot-stat-1",
        shotStat,
      });

      expect(mockShotStatMapper.toPersistence).toHaveBeenCalledTimes(1);
      expect(mockShotStatMapper.toPersistence).toHaveBeenCalledWith({
        shotStat,
      });

      expect(mockShotStatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(mockShotStatModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "shot-stat-1",
        persistenceData,
        { new: true },
      );

      expect(mockShotStatMapper.toDomain).toHaveBeenCalledTimes(1);
      expect(mockShotStatMapper.toDomain).toHaveBeenCalledWith({
        shotStatDocument: updatedShotStatDocument,
      });

      expect(result).toBe(domainShotStat);
    });

    test("returns null when no updated document is found", async () => {
      const mockShotStatModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      };

      const mockShotStatMapper = {
        toPersistence: jest.fn().mockReturnValue({ notes: "Updated note" }),
        toDomain: jest.fn(),
      };

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: mockShotStatMapper,
      });

      const result = await repository.update({
        id: "shot-stat-1",
        shotStat: { notes: "Updated note" },
      });

      expect(mockShotStatModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "shot-stat-1",
        { notes: "Updated note" },
        { new: true },
      );
      expect(mockShotStatMapper.toDomain).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    test("calls shotStatModel.findByIdAndDelete with id", async () => {
      const mockShotStatModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue(undefined),
      };

      const repository = new MongooseShotStatRepository({
        shotStatModel: mockShotStatModel,
        shotStatMapper: {},
      });

      const result = await repository.delete({ id: "shot-stat-1" });

      expect(mockShotStatModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(mockShotStatModel.findByIdAndDelete).toHaveBeenCalledWith(
        "shot-stat-1",
      );
      expect(result).toBeUndefined();
    });
  });
});

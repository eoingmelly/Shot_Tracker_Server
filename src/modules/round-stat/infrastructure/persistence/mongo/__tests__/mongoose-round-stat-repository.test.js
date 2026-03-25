const {
  MongooseRoundStatRepository,
} = require("../mongoose-round-stat-repository");
const {
  IRoundStatRepository,
} = require("../../../../domain/interfaces/i-round-stat-repository");

describe("MongooseRoundStatRepository", () => {
  describe("constructor", () => {
    test("throws when roundStatModel is not provided", () => {
      expect(() => {
        new MongooseRoundStatRepository({
          roundStatMapper: {},
        });
      }).toThrow("MongooseRoundStatRepository requires { roundStatModel }");
    });

    test("throws when roundStatMapper is not provided", () => {
      expect(() => {
        new MongooseRoundStatRepository({
          roundStatModel: {},
        });
      }).toThrow("MongooseRoundStatRepository requires { roundStatMapper }");
    });

    test("stores dependencies when provided", () => {
      const mockModel = {};
      const mockMapper = {};

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: mockMapper,
      });

      expect(repository._roundStatModel).toBe(mockModel);
      expect(repository._roundStatMapper).toBe(mockMapper);
    });

    test("extends IRoundStatRepository", () => {
      const repository = new MongooseRoundStatRepository({
        roundStatModel: {},
        roundStatMapper: {},
      });

      expect(repository).toBeInstanceOf(IRoundStatRepository);
    });
  });

  describe("create", () => {
    test("maps to persistence, creates, and maps back to domain", async () => {
      const roundStat = {
        courseId: "course-1",
        golferId: "golfer-1",
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
      };

      const persistence = {
        courseId: "mongo-course-1",
        golferId: "mongo-golfer-1",
        datePlayed: new Date("2025-01-15T10:00:00.000Z"),
      };

      const createdDoc = {
        _id: "mongo-id",
        ...persistence,
      };

      const domain = {
        id: "mongo-id",
        ...persistence,
      };

      const mockModel = {
        create: jest.fn().mockResolvedValue(createdDoc),
      };

      const mockMapper = {
        toPersistence: jest.fn().mockReturnValue(persistence),
        toDomain: jest.fn().mockReturnValue(domain),
      };

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: mockMapper,
      });

      const result = await repository.create({ roundStat });

      expect(mockMapper.toPersistence).toHaveBeenCalledWith({ roundStat });
      expect(mockModel.create).toHaveBeenCalledWith(persistence);
      expect(mockMapper.toDomain).toHaveBeenCalledWith({
        roundStatDocument: createdDoc,
      });

      expect(result).toBe(domain);
    });
  });

  describe("findById", () => {
    test("returns null when no document found", async () => {
      const mockModel = {
        findById: jest.fn().mockResolvedValue(null),
      };

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: {},
      });

      const result = await repository.findById({ id: "round-1" });

      expect(mockModel.findById).toHaveBeenCalledWith("round-1");
      expect(result).toBeNull();
    });

    test("maps found document to domain", async () => {
      const doc = { _id: "mongo-id" };
      const domain = { id: "mongo-id" };

      const mockModel = {
        findById: jest.fn().mockResolvedValue(doc),
      };

      const mockMapper = {
        toDomain: jest.fn().mockReturnValue(domain),
      };

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: mockMapper,
      });

      const result = await repository.findById({ id: "round-1" });

      expect(mockMapper.toDomain).toHaveBeenCalledWith({
        roundStatDocument: doc,
      });
      expect(result).toBe(domain);
    });
  });

  describe("update", () => {
    test("maps to persistence, updates, and maps back to domain", async () => {
      const updates = { courseId: "course-2" };

      const persistence = { courseId: "mongo-course-2" };

      const updatedDoc = {
        _id: "mongo-id",
        ...persistence,
      };

      const domain = {
        id: "mongo-id",
        ...persistence,
      };

      const mockModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(updatedDoc),
      };

      const mockMapper = {
        toPersistence: jest.fn().mockReturnValue(persistence),
        toDomain: jest.fn().mockReturnValue(domain),
      };

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: mockMapper,
      });

      const result = await repository.update({
        id: "round-1",
        roundStat: updates,
      });

      expect(mockMapper.toPersistence).toHaveBeenCalledWith({
        roundStat: updates,
      });

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "round-1",
        persistence,
        { new: true },
      );

      expect(mockMapper.toDomain).toHaveBeenCalledWith({
        roundStatDocument: updatedDoc,
      });

      expect(result).toBe(domain);
    });

    test("returns null when no document found", async () => {
      const mockModel = {
        findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      };

      const mockMapper = {
        toPersistence: jest.fn().mockReturnValue({}),
        toDomain: jest.fn(),
      };

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: mockMapper,
      });

      const result = await repository.update({
        id: "round-1",
        roundStat: {},
      });

      expect(result).toBeNull();
      expect(mockMapper.toDomain).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("calls findByIdAndDelete with id", async () => {
      const mockModel = {
        findByIdAndDelete: jest.fn().mockResolvedValue(undefined),
      };

      const repository = new MongooseRoundStatRepository({
        roundStatModel: mockModel,
        roundStatMapper: {},
      });

      const result = await repository.delete({ id: "round-1" });

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith("round-1");
      expect(result).toBeUndefined();
    });
  });
});

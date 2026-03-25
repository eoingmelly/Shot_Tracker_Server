const {
  MongooseHoleStatRepository,
} = require("../mongoose-hole-stat-repository");

const {
  IHoleStatRepository,
} = require("../../../../domain/interfaces/i-hole-stat-repository");

describe("MongooseHoleStatRepository", () => {
  describe("constructor", () => {
    test("throws when holeStatModel is not provided", () => {
      expect(() => {
        new MongooseHoleStatRepository({
          holeStatMapper: {},
        });
      }).toThrow("MongooseHoleStatRepository requires { holeStatModel }");
    });

    test("throws when holeStatMapper is not provided", () => {
      expect(() => {
        new MongooseHoleStatRepository({
          holeStatModel: {},
        });
      }).toThrow("MongooseHoleStatRepository requires { holeStatMapper }");
    });

    test("stores dependencies when provided", () => {
      const mockModel = {};
      const mockMapper = {};

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: mockMapper,
      });

      expect(repository._holeStatModel).toBe(mockModel);
      expect(repository._holeStatMapper).toBe(mockMapper);
    });

    test("extends IHoleStatRepository", () => {
      const repository = new MongooseHoleStatRepository({
        holeStatModel: {},
        holeStatMapper: {},
      });

      expect(repository).toBeInstanceOf(IHoleStatRepository);
    });
  });

  describe("create", () => {
    test("maps to persistence, creates, and maps back to domain", async () => {
      const holeStat = {
        golferId: "golfer-1",
        holeNumber: 1,
      };

      const persistence = {
        golferId: "mongo-golfer-1",
        holeNumber: 1,
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

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: mockMapper,
      });

      const result = await repository.create({ holeStat });

      expect(mockMapper.toPersistence).toHaveBeenCalledWith({ holeStat });
      expect(mockModel.create).toHaveBeenCalledWith(persistence);
      expect(mockMapper.toDomain).toHaveBeenCalledWith({
        holeStatDocument: createdDoc,
      });

      expect(result).toBe(domain);
    });
  });

  describe("findById", () => {
    test("returns null when no document found", async () => {
      const mockModel = {
        findById: jest.fn().mockResolvedValue(null),
      };

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: {},
      });

      const result = await repository.findById({ id: "hole-1" });

      expect(mockModel.findById).toHaveBeenCalledWith("hole-1");
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

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: mockMapper,
      });

      const result = await repository.findById({ id: "hole-1" });

      expect(mockMapper.toDomain).toHaveBeenCalledWith({
        holeStatDocument: doc,
      });
      expect(result).toBe(domain);
    });
  });

  describe("update", () => {
    test("maps to persistence, updates, and maps back to domain", async () => {
      const updates = { holeNumber: 2 };

      const persistence = { holeNumber: 2 };

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

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: mockMapper,
      });

      const result = await repository.update({
        id: "hole-1",
        holeStat: updates,
      });

      expect(mockMapper.toPersistence).toHaveBeenCalledWith({
        holeStat: updates,
      });

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "hole-1",
        persistence,
        { new: true },
      );

      expect(mockMapper.toDomain).toHaveBeenCalledWith({
        holeStatDocument: updatedDoc,
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

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: mockMapper,
      });

      const result = await repository.update({
        id: "hole-1",
        holeStat: {},
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

      const repository = new MongooseHoleStatRepository({
        holeStatModel: mockModel,
        holeStatMapper: {},
      });

      const result = await repository.delete({ id: "hole-1" });

      expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith("hole-1");
      expect(result).toBeUndefined();
    });
  });
});

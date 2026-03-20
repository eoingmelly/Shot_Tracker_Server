const { Types } = require("mongoose");
const { GolferMapper } = require("../golfer-mapper");
const { Golfer } = require("../../../../../domain/entities/golfer");

describe("GolferMapper", () => {
  let golferMapper;

  beforeEach(() => {
    golferMapper = new GolferMapper();
  });

  describe("toDomain", () => {
    test("throws when golferDocument is not provided", () => {
      expect(() => {
        golferMapper.toDomain({});
      }).toThrow("GolferMapper.toDomain requires { golferDocument }");
    });

    test("maps persistence document to domain entity", () => {
      const golferDocument = {
        _id: new Types.ObjectId(),
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      };

      const result = golferMapper.toDomain({ golferDocument });

      expect(result).toBeInstanceOf(Golfer);
      expect(result).toEqual({
        id: golferDocument._id.toString(),
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });
    });

    test("defaults preferredUsername to null when falsy on document", () => {
      const golferDocument = {
        _id: new Types.ObjectId(),
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: undefined,
      };

      const result = golferMapper.toDomain({ golferDocument });

      expect(result.preferredUsername).toBeNull();
    });
  });

  describe("toPersistence", () => {
    test("throws when golfer is not provided", () => {
      expect(() => {
        golferMapper.toPersistence({});
      }).toThrow("GolferMapper.toPersistence requires { golfer }");
    });

    test("maps domain entity to persistence shape", () => {
      const golfer = new Golfer({
        id: "golfer-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      const result = golferMapper.toPersistence({ golfer });

      expect(result).toEqual({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });
    });

    test("does not persist id", () => {
      const golfer = new Golfer({
        id: "golfer-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      const result = golferMapper.toPersistence({ golfer });

      expect(result.id).toBeUndefined();
    });

    test("defaults preferredUsername to null when falsy on golfer", () => {
      const golfer = new Golfer({
        sub: "abc-123",
        email: "test@example.com",
      });

      const result = golferMapper.toPersistence({ golfer });

      expect(result).toEqual({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: null,
      });
    });
  });
});

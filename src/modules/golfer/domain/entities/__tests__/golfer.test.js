const { Golfer } = require("../golfer");

describe("Golfer Entity", () => {
  describe("constructor", () => {
    test("creates a golfer with all provided properties", () => {
      const golfer = new Golfer({
        id: "golfer-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      expect(golfer).toEqual({
        id: "golfer-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });
    });

    test("defaults id to null when not provided", () => {
      const golfer = new Golfer({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      expect(golfer.id).toBeNull();
    });

    test("defaults preferredUsername to null when not provided", () => {
      const golfer = new Golfer({
        sub: "abc-123",
        email: "test@example.com",
      });

      expect(golfer.preferredUsername).toBeNull();
    });

    test("assigns required fields correctly", () => {
      const golfer = new Golfer({
        sub: "abc-123",
        email: "test@example.com",
      });

      expect(golfer.sub).toBe("abc-123");
      expect(golfer.email).toBe("test@example.com");
    });

    test("allows id to be explicitly set to null", () => {
      const golfer = new Golfer({
        id: null,
        sub: "abc-123",
        email: "test@example.com",
      });

      expect(golfer.id).toBeNull();
    });
  });
});

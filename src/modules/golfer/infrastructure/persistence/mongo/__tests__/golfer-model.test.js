const { GolferModel } = require("../golfer-model");

describe("GolferModel", () => {
  describe("model configuration", () => {
    test("uses the Golfer model name", () => {
      expect(GolferModel.modelName).toBe("Golfer");
    });

    test("defines required and indexed sub field", () => {
      const subPath = GolferModel.schema.path("sub");

      expect(subPath).toBeDefined();
      expect(subPath.instance).toBe("String");
      expect(subPath.isRequired).toBe(true);
      expect(subPath.options.unique).toBe(true);
      expect(subPath.options.index).toBe(true);
    });

    test("defines required and indexed email field", () => {
      const emailPath = GolferModel.schema.path("email");

      expect(emailPath).toBeDefined();
      expect(emailPath.instance).toBe("String");
      expect(emailPath.isRequired).toBe(true);
      expect(emailPath.options.index).toBe(true);
    });

    test("defines preferredUsername with default null", () => {
      const preferredUsernamePath =
        GolferModel.schema.path("preferredUsername");

      expect(preferredUsernamePath).toBeDefined();
      expect(preferredUsernamePath.instance).toBe("String");
      expect(preferredUsernamePath.defaultValue).toBeNull();
    });

    test("enables timestamps", () => {
      expect(GolferModel.schema.options.timestamps).toBe(true);
      expect(GolferModel.schema.path("createdAt")).toBeDefined();
      expect(GolferModel.schema.path("updatedAt")).toBeDefined();
    });
  });

  describe("document defaults", () => {
    test("applies preferredUsername default of null", () => {
      const golferDocument = new GolferModel({
        sub: "abc-123",
        email: "test@example.com",
      });

      expect(golferDocument.preferredUsername).toBeNull();
    });
  });

  describe("validation", () => {
    test("fails validation when sub is missing", () => {
      const golferDocument = new GolferModel({
        email: "test@example.com",
      });

      const error = golferDocument.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.sub).toBeDefined();
    });

    test("fails validation when email is missing", () => {
      const golferDocument = new GolferModel({
        sub: "abc-123",
      });

      const error = golferDocument.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    test("passes validation with required fields", () => {
      const golferDocument = new GolferModel({
        sub: "abc-123",
        email: "test@example.com",
      });

      const error = golferDocument.validateSync();

      expect(error).toBeUndefined();
    });
  });
});

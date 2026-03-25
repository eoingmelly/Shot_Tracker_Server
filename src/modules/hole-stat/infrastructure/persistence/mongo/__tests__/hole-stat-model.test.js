const { Types } = require("mongoose");
const { HoleStatModel } = require("../hole-stat-model");

describe("HoleStatModel", () => {
  describe("model configuration", () => {
    test("uses the HoleStat model name", () => {
      expect(HoleStatModel.modelName).toBe("HoleStat");
    });

    test("defines roundStatId as ObjectId with ref and index", () => {
      const path = HoleStatModel.schema.path("roundStatId");

      expect(path).toBeDefined();
      expect(path.instance).toBe("ObjectId");
      expect(path.options.ref).toBe("RoundStat");
      expect(path.options.index).toBe(true);
      expect(path.defaultValue).toBeNull();
    });

    test("defines golferId as required ObjectId with ref and index", () => {
      const path = HoleStatModel.schema.path("golferId");

      expect(path).toBeDefined();
      expect(path.instance).toBe("ObjectId");
      expect(path.options.ref).toBe("Golfer");
      expect(path.isRequired).toBe(true);
      expect(path.options.index).toBe(true);
    });

    test("defines holeNumber as required number", () => {
      const path = HoleStatModel.schema.path("holeNumber");

      expect(path).toBeDefined();
      expect(path.instance).toBe("Number");
      expect(path.isRequired).toBe(true);
    });

    test("enables timestamps", () => {
      expect(HoleStatModel.schema.options.timestamps).toBe(true);
      expect(HoleStatModel.schema.path("createdAt")).toBeDefined();
      expect(HoleStatModel.schema.path("updatedAt")).toBeDefined();
    });
  });

  describe("document defaults", () => {
    test("defaults roundStatId to null", () => {
      const doc = new HoleStatModel({
        golferId: new Types.ObjectId(),
        holeNumber: 1,
      });

      expect(doc.roundStatId).toBeNull();
    });
  });

  describe("validation", () => {
    test("fails validation when required fields are missing", () => {
      const doc = new HoleStatModel({});

      const error = doc.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.golferId).toBeDefined();
      expect(error.errors.holeNumber).toBeDefined();
    });

    test("passes validation with required fields", () => {
      const doc = new HoleStatModel({
        golferId: new Types.ObjectId(),
        holeNumber: 1,
      });

      const error = doc.validateSync();

      expect(error).toBeUndefined();
    });
  });
});

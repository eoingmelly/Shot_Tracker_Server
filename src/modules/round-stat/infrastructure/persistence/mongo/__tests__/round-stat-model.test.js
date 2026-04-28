const { Types } = require("mongoose");
const { RoundStatModel } = require("../round-stat-model");

describe("RoundStatModel", () => {
  describe("model configuration", () => {
    test("uses the RoundStat model name", () => {
      expect(RoundStatModel.modelName).toBe("RoundStat");
    });

    test("defines courseId as ObjectId with ref", () => {
      const path = RoundStatModel.schema.path("courseId");

      expect(path).toBeDefined();
      expect(path.instance).toBe("ObjectId");
      expect(path.options.ref).toBe("GolfCourse");
    });

    test("defines golferId as ObjectId with ref", () => {
      const path = RoundStatModel.schema.path("golferId");

      expect(path).toBeDefined();
      expect(path.instance).toBe("ObjectId");
      expect(path.options.ref).toBe("Golfer");
    });

    test("defines datePlayed as Date", () => {
      const path = RoundStatModel.schema.path("datePlayed");

      expect(path).toBeDefined();
      expect(path.instance).toBe("Date");
    });

    test("enables timestamps", () => {
      expect(RoundStatModel.schema.options.timestamps).toBe(true);
      expect(RoundStatModel.schema.path("createdAt")).toBeDefined();
      expect(RoundStatModel.schema.path("updatedAt")).toBeDefined();
    });
  });

  describe("validation", () => {
    test("passes validation with minimal valid document", () => {
      const doc = new RoundStatModel({
        golferId: new Types.ObjectId(),
        datePlayed: new Date(),
      });

      const error = doc.validateSync();

      expect(error).toBeUndefined();
    });

    test("allows missing optional fields", () => {
      const doc = new RoundStatModel({});

      const error = doc.validateSync();

      expect(error).toBeUndefined();
    });
  });
});

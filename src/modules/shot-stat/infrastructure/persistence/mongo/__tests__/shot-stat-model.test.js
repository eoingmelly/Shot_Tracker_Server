const { ShotStatModel } = require("../shot-stat-model");

describe("ShotStatModel", () => {
  describe("model configuration", () => {
    test("uses the ShotStat model name", () => {
      expect(ShotStatModel.modelName).toBe("ShotStat");
    });

    test("defines required golferId field", () => {
      const path = ShotStatModel.schema.path("golferId");

      expect(path).toBeDefined();
      expect(path.instance).toBe("String");
      expect(path.isRequired).toBe(true);
      expect(path.options.index).toBe(true);
    });

    test("defines required simple fields", () => {
      const fields = [
        "preStrokesGainedLie",
        "postStrokesGainedLie",
        "preStrokeDistanceToPin",
        "postStrokeDistanceToPin",
      ];

      fields.forEach((field) => {
        const path = ShotStatModel.schema.path(field);

        expect(path).toBeDefined();
        expect(path.isRequired).toBe(true);
      });
    });

    test("defines datePlayed as required and indexed", () => {
      const path = ShotStatModel.schema.path("datePlayed");

      expect(path).toBeDefined();
      expect(path.instance).toBe("Date");
      expect(path.isRequired).toBe(true);
      expect(path.options.index).toBe(true);
    });

    test("defines shotStatType enum with default", () => {
      const path = ShotStatModel.schema.path("shotStatType");

      expect(path).toBeDefined();
      expect(path.enumValues).toEqual(["simple", "complex"]);
      expect(path.defaultValue).toBe("simple");
    });

    test("defines strokesGainedShotType enum with default", () => {
      const path = ShotStatModel.schema.path("strokesGainedShotType");

      expect(path).toBeDefined();
      expect(path.defaultValue).toBe("Unknown");
      expect(path.enumValues).toEqual([
        "Driving",
        "Approach",
        "Short_Game",
        "Putting",
        "Unknown",
        "Penalty",
      ]);
    });

    test("enables timestamps", () => {
      expect(ShotStatModel.schema.options.timestamps).toBe(true);
      expect(ShotStatModel.schema.path("createdAt")).toBeDefined();
      expect(ShotStatModel.schema.path("updatedAt")).toBeDefined();
    });
  });

  describe("document defaults", () => {
    test("defaults pickedUp to false", () => {
      const doc = new ShotStatModel({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed: new Date(),
      });

      expect(doc.pickedUp).toBe(false);
    });

    test('defaults shotStatType to "simple"', () => {
      const doc = new ShotStatModel({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed: new Date(),
      });

      expect(doc.shotStatType).toBe("simple");
    });

    test('defaults strokesGainedShotType to "Unknown"', () => {
      const doc = new ShotStatModel({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed: new Date(),
      });

      expect(doc.strokesGainedShotType).toBe("Unknown");
    });
  });

  describe("validation", () => {
    test("fails validation when required fields are missing", () => {
      const doc = new ShotStatModel({});

      const error = doc.validateSync();

      expect(error).toBeDefined();
      expect(error.errors.golferId).toBeDefined();
      expect(error.errors.preStrokesGainedLie).toBeDefined();
      expect(error.errors.postStrokesGainedLie).toBeDefined();
      expect(error.errors.preStrokeDistanceToPin).toBeDefined();
      expect(error.errors.postStrokeDistanceToPin).toBeDefined();
      expect(error.errors.datePlayed).toBeDefined();
    });

    test("passes validation with required fields", () => {
      const doc = new ShotStatModel({
        golferId: "golfer-1",
        preStrokesGainedLie: "tee",
        postStrokesGainedLie: "fairway",
        preStrokeDistanceToPin: 420,
        postStrokeDistanceToPin: 150,
        datePlayed: new Date(),
      });

      const error = doc.validateSync();

      expect(error).toBeUndefined();
    });
  });
});

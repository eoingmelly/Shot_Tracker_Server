const { IHoleStatRepository } = require("../i-hole-stat-repository");

describe("IHoleStatRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new IHoleStatRepository();
  });

  describe("create", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.create({
          holeStat: {
            golferId: "golfer-1",
            holeNumber: 1,
          },
        }),
      ).rejects.toThrow("IHoleStatRepository.create must be implemented");
    });
  });

  describe("delete", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.delete({
          id: "hole-stat-1",
        }),
      ).rejects.toThrow("IHoleStatRepository.delete must be implemented");
    });
  });

  describe("findById", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.findById({
          id: "hole-stat-1",
        }),
      ).rejects.toThrow("IHoleStatRepository.findById must be implemented");
    });
  });

  describe("update", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.update({
          id: "hole-stat-1",
          holeStat: {
            holeNumber: 2,
          },
        }),
      ).rejects.toThrow("IHoleStatRepository.update must be implemented");
    });
  });
});

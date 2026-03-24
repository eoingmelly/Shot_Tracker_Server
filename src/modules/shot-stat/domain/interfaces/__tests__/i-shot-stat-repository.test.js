const { IShotStatRepository } = require("../i-shot-stat-repository");

describe("IShotStatRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new IShotStatRepository();
  });

  describe("create", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.create({
          shotStat: {
            golferId: "golfer-1",
          },
        }),
      ).rejects.toThrow("IShotStatRepository.create must be implemented");
    });
  });

  describe("delete", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.delete({
          id: "shot-stat-1",
        }),
      ).rejects.toThrow("IShotStatRepository.delete must be implemented");
    });
  });

  describe("findById", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.findById({
          id: "shot-stat-1",
        }),
      ).rejects.toThrow("IShotStatRepository.findById must be implemented");
    });
  });

  describe("update", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.update({
          id: "shot-stat-1",
          shotStat: {
            golferId: "golfer-1",
          },
        }),
      ).rejects.toThrow("IShotStatRepository.update must be implemented");
    });
  });
});

const { IRoundStatRepository } = require("../i-round-stat-repository");

describe("IRoundStatRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new IRoundStatRepository();
  });

  describe("create", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.create({
          roundStat: {
            golferId: "golfer-1",
          },
        }),
      ).rejects.toThrow("IRoundStatRepository.create must be implemented");
    });
  });

  describe("delete", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.delete({
          id: "round-1",
        }),
      ).rejects.toThrow("IRoundStatRepository.delete must be implemented");
    });
  });

  describe("findById", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.findById({
          id: "round-1",
        }),
      ).rejects.toThrow("IRoundStatRepository.findById must be implemented");
    });
  });

  describe("update", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.update({
          id: "round-1",
          roundStat: {
            notes: "test",
          },
        }),
      ).rejects.toThrow("IRoundStatRepository.update must be implemented");
    });
  });
});

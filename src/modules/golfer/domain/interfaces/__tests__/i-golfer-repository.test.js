const { IGolferRepository } = require("../i-golfer-repository");

describe("IGolferRepository", () => {
  let repository;

  beforeEach(() => {
    repository = new IGolferRepository();
  });

  describe("findBySub", () => {
    test("throws not implemented error", async () => {
      await expect(repository.findBySub({ sub: "abc-123" })).rejects.toThrow(
        "IGolferRepository.findBySub must be implemented",
      );
    });
  });

  describe("create", () => {
    test("throws not implemented error", async () => {
      await expect(
        repository.create({
          golfer: {
            sub: "abc-123",
            email: "test@example.com",
          },
        }),
      ).rejects.toThrow("IGolferRepository.create must be implemented");
    });
  });
});

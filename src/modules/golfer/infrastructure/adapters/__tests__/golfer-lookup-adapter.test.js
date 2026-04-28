const { GolferLookupAdapter } = require("../golfer-lookup-adapter");

describe("GolferLookupAdapter", () => {
  let adapter;
  let golferService;

  beforeEach(() => {
    golferService = {
      getGolferIdBySub: jest.fn(),
    };

    adapter = new GolferLookupAdapter({ golferService });
  });

  describe("constructor", () => {
    test("throws when GolferLookupAdapter is missing", () => {
      expect(() => new GolferLookupAdapter({ somethingElse: true })).toThrow(
        "GolferLookupAdapter requires { golferService }",
      );
    });
  });

  describe("getGolferId", () => {
    test("throws when sub is missing", async () => {
      await expect(adapter.getGolferId({ notASub: 1 })).rejects.toThrow(
        "GolferLookupAdapter.getGolferidBySub requires { sub }",
      );
    });

    test("returns id ", async () => {
      golferService.getGolferIdBySub.mockResolvedValue({ id: "id1" });

      const result = await adapter.getGolferId({ sub: "cogSub" });

      expect(result).toEqual("id1");
    });
  });
});

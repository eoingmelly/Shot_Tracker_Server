const { createGetRoundStatHandler } = require("../get-round-stat-handler");

describe("createGetRoundStatHandler", () => {
  test("throws when roundStatService is not provided", () => {
    expect(() => createGetRoundStatHandler({})).toThrow(
      "createGetRoundStatHandler requires { roundStatService }",
    );
  });

  test("gets round stat and returns 200", async () => {
    const roundStat = { id: "round-1" };

    const roundStatService = {
      getRoundStat: jest.fn().mockResolvedValue(roundStat),
    };

    const handler = createGetRoundStatHandler({ roundStatService });

    const req = {
      userData: { golferId: "golfer-1" },
      params: { id: "round-1" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await handler(req, res, next);

    expect(roundStatService.getRoundStat).toHaveBeenCalledWith({
      roundId: "round-1",
      golferId: "golfer-1",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ roundStat });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when req.userData is missing", async () => {
    const roundStatService = {
      getRoundStat: jest.fn(),
    };

    const handler = createGetRoundStatHandler({ roundStatService });

    const req = {
      params: { id: "round-1" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await handler(req, res, next);

    expect(roundStatService.getRoundStat).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].message).toBe(
      "getRoundStatHandler requires req.userData",
    );
  });

  test("calls next when service throws", async () => {
    const error = new Error("service failure");

    const roundStatService = {
      getRoundStat: jest.fn().mockRejectedValue(error),
    };

    const handler = createGetRoundStatHandler({ roundStatService });

    const req = {
      userData: { golferId: "golfer-1" },
      params: { id: "round-1" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

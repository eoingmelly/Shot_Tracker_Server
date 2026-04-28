const {
  createCreateRoundStatHandler,
} = require("../create-round-stat-handler");

describe("createCreateRoundStatHandler", () => {
  test("throws when roundStatService is not provided", () => {
    expect(() => createCreateRoundStatHandler({})).toThrow(
      "createCreateRoundStatHandler requires { roundStatService }",
    );
  });

  test("creates round stat and returns 201", async () => {
    const roundStat = { id: "round-1" };
    const datePlayed = new Date("2025-01-15T10:00:00.000Z");

    const roundStatService = {
      createRoundStat: jest.fn().mockResolvedValue(roundStat),
    };

    const handler = createCreateRoundStatHandler({ roundStatService });

    const req = {
      userData: { golferId: "golfer-1" },
      body: {
        courseId: "course-1",
        datePlayed,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await handler(req, res, next);

    expect(roundStatService.createRoundStat).toHaveBeenCalledWith({
      courseId: "course-1",
      datePlayed,
      golferId: "golfer-1",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ roundStat });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when req.userData is missing", async () => {
    const roundStatService = {
      createRoundStat: jest.fn(),
    };

    const handler = createCreateRoundStatHandler({ roundStatService });

    const req = {
      body: {
        courseId: "course-1",
        datePlayed: new Date(),
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await handler(req, res, next);

    expect(roundStatService.createRoundStat).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].message).toBe(
      "createRoundStatHandler requires req.userData",
    );
  });

  test("calls next when service throws", async () => {
    const error = new Error("service failure");

    const roundStatService = {
      createRoundStat: jest.fn().mockRejectedValue(error),
    };

    const handler = createCreateRoundStatHandler({ roundStatService });

    const req = {
      userData: { golferId: "golfer-1" },
      body: {
        courseId: "course-1",
        datePlayed: new Date(),
      },
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

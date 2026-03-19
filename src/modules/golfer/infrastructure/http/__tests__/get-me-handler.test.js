const { createGetMeHandler } = require("../get-me-handler");

describe("createGetMeHandler", () => {
  describe("factory", () => {
    test("throws when golferService is not provided", () => {
      expect(() => {
        createGetMeHandler({});
      }).toThrow("createGetMeHandler requires { golferService }");
    });

    test("returns a handler function when golferService is provided", () => {
      const handler = createGetMeHandler({
        golferService: {
          getOrCreateGolferFromIdentity: jest.fn(),
        },
      });

      expect(typeof handler).toBe("function");
    });
  });

  describe("getMeHandler", () => {
    let mockGolferService;
    let handler;
    let req;
    let res;
    let next;

    beforeEach(() => {
      mockGolferService = {
        getOrCreateGolferFromIdentity: jest.fn(),
      };

      handler = createGetMeHandler({
        golferService: mockGolferService,
      });

      req = {
        userData: {
          sub: "abc-123",
          email: "test@example.com",
          preferredUsername: "tester",
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      next = jest.fn();
    });

    test("calls golferService with req.userData and returns 200 response", async () => {
      const golfer = {
        id: "golfer-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      };

      mockGolferService.getOrCreateGolferFromIdentity.mockResolvedValue(golfer);

      await handler(req, res, next);

      expect(
        mockGolferService.getOrCreateGolferFromIdentity,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockGolferService.getOrCreateGolferFromIdentity,
      ).toHaveBeenCalledWith({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: "tester",
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ golfer });
      expect(next).not.toHaveBeenCalled();
    });

    test("defaults preferredUsername to null when omitted from req.userData", async () => {
      const golfer = {
        id: "golfer-1",
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: null,
      };

      req.userData = {
        sub: "abc-123",
        email: "test@example.com",
      };

      mockGolferService.getOrCreateGolferFromIdentity.mockResolvedValue(golfer);

      await handler(req, res, next);

      expect(
        mockGolferService.getOrCreateGolferFromIdentity,
      ).toHaveBeenCalledWith({
        sub: "abc-123",
        email: "test@example.com",
        preferredUsername: null,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ golfer });
    });

    test("calls next with error when req.userData is missing", async () => {
      req.userData = undefined;

      await handler(req, res, next);

      expect(
        mockGolferService.getOrCreateGolferFromIdentity,
      ).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(next.mock.calls[0][0].message).toBe(
        "getMeHandler requires req.userData",
      );
    });

    test("calls next when golferService throws", async () => {
      const error = new Error("service failure");

      mockGolferService.getOrCreateGolferFromIdentity.mockRejectedValue(error);

      await handler(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});

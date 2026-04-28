jest.mock("express", () => {
  const get = jest.fn();
  const post = jest.fn();

  return {
    Router: jest.fn(() => ({
      get,
      post,
    })),
    __mockedGet: get,
    __mockedPost: post,
  };
});

const express = require("express");
const { createRoundStatRoutes } = require("../round-stat-routes");

describe("createRoundStatRoutes", () => {
  let expressAuthMiddleware;
  let getRoundStatHandler;
  let getCreateRoundStatHandler;

  beforeEach(() => {
    expressAuthMiddleware = jest.fn();
    getRoundStatHandler = jest.fn();
    getCreateRoundStatHandler = jest.fn();

    express.Router.mockClear();
    express.__mockedGet.mockClear();
    express.__mockedPost.mockClear();
  });

  test("throws when expressAuthMiddleware is not provided", () => {
    expect(() => {
      createRoundStatRoutes({
        getRoundStatHandler,
        getCreateRoundStatHandler,
      });
    }).toThrow("createRoundStatRoutes requires { expressAuthMiddleware }");
  });

  test("throws when getRoundStatHandler is not provided", () => {
    expect(() => {
      createRoundStatRoutes({
        expressAuthMiddleware,
        getCreateRoundStatHandler,
      });
    }).toThrow("createRoundStatRoutes requires { getRoundStatHandler }");
  });

  test("throws when getCreateRoundStatHandler is not provided", () => {
    expect(() => {
      createRoundStatRoutes({
        expressAuthMiddleware,
        getRoundStatHandler,
      });
    }).toThrow("createRoundStatRoutes requires { getCreateRoundStatHandler }");
  });

  test("registers round-stat routes", () => {
    const result = createRoundStatRoutes({
      expressAuthMiddleware,
      getRoundStatHandler,
      getCreateRoundStatHandler,
    });

    expect(express.Router).toHaveBeenCalledTimes(1);

    expect(express.__mockedGet).toHaveBeenCalledWith(
      "/round-stats/:id",
      expressAuthMiddleware,
      getRoundStatHandler,
    );

    expect(express.__mockedPost).toHaveBeenCalledWith(
      "/round-stats",
      expressAuthMiddleware,
      getCreateRoundStatHandler,
    );

    expect(result).toEqual({
      roundStatRoutes: expect.any(Object),
    });
  });
});

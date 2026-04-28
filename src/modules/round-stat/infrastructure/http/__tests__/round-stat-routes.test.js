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
  let createRoundStatHandler;

  beforeEach(() => {
    expressAuthMiddleware = jest.fn();
    getRoundStatHandler = jest.fn();
    createRoundStatHandler = jest.fn();

    express.Router.mockClear();
    express.__mockedGet.mockClear();
    express.__mockedPost.mockClear();
  });

  test("throws when expressAuthMiddleware is not provided", () => {
    expect(() => {
      createRoundStatRoutes({
        getRoundStatHandler,
        createRoundStatHandler,
      });
    }).toThrow("createRoundStatRoutes requires { expressAuthMiddleware }");
  });

  test("throws when getRoundStatHandler is not provided", () => {
    expect(() => {
      createRoundStatRoutes({
        expressAuthMiddleware,
        createRoundStatHandler,
      });
    }).toThrow("createRoundStatRoutes requires { getRoundStatHandler }");
  });

  test("throws when createRoundStatHandler is not provided", () => {
    expect(() => {
      createRoundStatRoutes({
        expressAuthMiddleware,
        getRoundStatHandler,
      });
    }).toThrow("createRoundStatRoutes requires { createRoundStatHandler }");
  });

  test("registers round-stat routes", () => {
    const result = createRoundStatRoutes({
      expressAuthMiddleware,
      getRoundStatHandler,
      createRoundStatHandler,
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
      createRoundStatHandler,
    );

    expect(result).toEqual({
      roundStatRoutes: expect.any(Object),
    });
  });
});

jest.mock("express", () => {
  const get = jest.fn();

  return {
    Router: jest.fn(() => ({
      get,
    })),
    __mockedGet: get,
  };
});

const express = require("express");
const { createGolferRoutes } = require("../golfer-routes");

describe("createGolferRoutes", () => {
  let expressAuthMiddleware;
  let getMeHandler;

  beforeEach(() => {
    expressAuthMiddleware = jest.fn();
    getMeHandler = jest.fn();

    if (express.Router.mockClear) {
      express.Router.mockClear();
    }

    if (express.__mockedGet.mockClear) {
      express.__mockedGet.mockClear();
    }
  });

  test("throws when expressAuthMiddleware is not provided", () => {
    expect(() => {
      createGolferRoutes({
        getMeHandler,
      });
    }).toThrow("createGolferRoutes requires { expressAuthMiddleware }");
  });

  test("throws when getMeHandler is not provided", () => {
    expect(() => {
      createGolferRoutes({
        expressAuthMiddleware,
      });
    }).toThrow("createGolferRoutes requires { getMeHandler }");
  });

  test("creates router and registers GET /me route", () => {
    const result = createGolferRoutes({
      expressAuthMiddleware,
      getMeHandler,
    });

    expect(express.Router).toHaveBeenCalledTimes(1);
    expect(express.__mockedGet).toHaveBeenCalledTimes(1);
    expect(express.__mockedGet).toHaveBeenCalledWith(
      "/me",
      expressAuthMiddleware,
      getMeHandler,
    );

    expect(result).toEqual({
      golferRoutes: expect.any(Object),
    });
  });
});

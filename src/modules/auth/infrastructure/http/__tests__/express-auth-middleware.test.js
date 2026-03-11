const express = require("express");
const request = require("supertest");

const { createExpressAuthMiddleware } = require("../express-auth-middleware");
const {
  MissingTokenError,
} = require("../../../domain/errors/missing-token-error");
const {
  InvalidTokenError,
} = require("../../../domain/errors/invalid-token-error");
const {
  ExpiredTokenError,
} = require("../../../domain/errors/expired-token-error");

function createTestApp({ authenticationService }) {
  const app = express();

  const expressAuthMiddleware = createExpressAuthMiddleware({
    authenticationService,
  });

  app.get("/protected", expressAuthMiddleware, (req, res) => {
    return res.status(200).json({
      userData: req.userData,
    });
  });

  app.use((err, req, res, next) => {
    return res.status(500).json({
      error: err.message,
    });
  });

  return { app };
}

describe("createExpressAuthMiddleware", () => {
  test("returns 401 when authorization header is missing", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new MissingTokenError()),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "missing_token",
    });
    expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(null);
  });

  test("returns 401 when authorization header is not a string", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new MissingTokenError()),
    };

    const expressAuthMiddleware = createExpressAuthMiddleware({
      authenticationService,
    });

    const req = {
      headers: {
        authorization: 123,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await expressAuthMiddleware(req, res, next);

    expect(authenticationService.authenticate).toHaveBeenCalledWith(null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "missing_token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when authorization header is malformed", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new MissingTokenError()),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "not-a-bearer-header");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "missing_token",
    });
    expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(null);
  });

  test("returns 401 when authorization scheme is not bearer", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new MissingTokenError()),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Basic abc123");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "missing_token",
    });
    expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(null);
  });

  test("passes extracted bearer token to authentication service", async () => {
    const userData = {
      userId: "user-123",
    };

    const authenticationService = {
      authenticate: jest.fn().mockResolvedValue(userData),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer good-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userData: {
        userId: "user-123",
      },
    });
    expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(
      "good-token",
    );
  });

  test("accepts uppercase bearer scheme", async () => {
    const userData = {
      userId: "user-123",
    };

    const authenticationService = {
      authenticate: jest.fn().mockResolvedValue(userData),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "BEARER good-token");

    expect(response.status).toBe(200);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(
      "good-token",
    );
  });

  test("returns 401 when authentication service throws invalid token", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new InvalidTokenError()),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer bad-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "invalid_token",
    });
    expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(
      "bad-token",
    );
  });

  test("returns 401 when authentication service throws expired token", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new ExpiredTokenError()),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer expired-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: "token_expired",
    });
    expect(authenticationService.authenticate).toHaveBeenCalledTimes(1);
    expect(authenticationService.authenticate).toHaveBeenCalledWith(
      "expired-token",
    );
  });

  test("passes unexpected errors to next", async () => {
    const authenticationService = {
      authenticate: jest.fn().mockRejectedValue(new Error("boom")),
    };

    const { app } = createTestApp({ authenticationService });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer good-token");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "boom",
    });
    expect(authenticationService.authenticate).toHaveBeenCalledWith(
      "good-token",
    );
  });

  test("attaches userData to req and continues", async () => {
    const userData = {
      userId: "user-123",
    };

    const authenticationService = {
      authenticate: jest.fn().mockResolvedValue(userData),
    };

    const expressAuthMiddleware = createExpressAuthMiddleware({
      authenticationService,
    });

    const req = {
      headers: {
        authorization: "Bearer good-token",
      },
    };

    const res = {};
    const next = jest.fn();

    await expressAuthMiddleware(req, res, next);

    expect(req.userData).toEqual({
      userId: "user-123",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});

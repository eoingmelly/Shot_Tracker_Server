// src/modules/auth/infrastructure/http/express-auth-middleware.js
const {
  MissingTokenError,
} = require("../../domain/errors/missing-token-error");
const {
  InvalidTokenError,
} = require("../../domain/errors/invalid-token-error");
const {
  ExpiredTokenError,
} = require("../../domain/errors/expired-token-error");

function createExpressAuthMiddleware({ authenticationService }) {
  return async function expressAuthMiddleware(req, res, next) {
    try {
      const token = _extractToken(req);
      const userData = await authenticationService.authenticate(token);

      req.userData = userData;
      return next();
    } catch (err) {
      if (err instanceof MissingTokenError) {
        return res.status(401).json({ error: "missing_token" });
      }
      if (err instanceof ExpiredTokenError) {
        return res.status(401).json({ error: "token_expired" });
      }
      if (err instanceof InvalidTokenError) {
        return res.status(401).json({ error: "invalid_token" });
      }

      return next(err); // unexpected error => let global error handler deal with it
    }
  };
}

function _extractToken(req) {
  const header = req && req.headers ? req.headers.authorization : null;
  if (!header || typeof header !== "string") return null;

  const parts = header.split(" ");
  if (parts.length !== 2) return null;

  const scheme = parts[0].toLowerCase();
  const token = parts[1];

  if (scheme !== "bearer") return null;

  return token;
}

module.exports = { createExpressAuthMiddleware };

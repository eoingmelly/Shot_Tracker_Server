// src/modules/auth/infrastructure/http/express-auth-middleware.js
const {
  MissingTokenError,
} = require("../../domain/errors/missing-token-error");
const {
  InvalidTokenError,
} = require("../../domain/errors/invalid-token-error");

function createExpressAuthMiddleware({ authService }) {
  return async function expressAuthMiddleware(req, res, next) {
    try {
      const userData = await authService.authenticateFromBearerHeader(
        req.headers.authorization,
      );
      req.userData = userData;
      return next();
    } catch (err) {
      // Decide policy: “required auth” middleware => 401 on failure
      if (err instanceof MissingTokenError)
        return res.status(401).json({ error: "missing_token" });
      if (err instanceof InvalidTokenError)
        return res.status(401).json({ error: "invalid_token" });

      return next(err); // unexpected error => let global error handler deal with it
    }
  };
}

module.exports = { createExpressAuthMiddleware };

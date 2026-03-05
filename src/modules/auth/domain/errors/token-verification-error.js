const { AuthServiceError } = require("./auth-service-error");

class TokenVerificationError extends AuthServiceError {
  constructor(message = "Token verification failed", opts = {}) {
    super(message, { code: "TOKEN_VERIFICATION_FAILED", ...opts });
  }
}

module.exports = { TokenVerificationError };

const { AuthServiceError } = require('./auth-service-error');

class InvalidTokenError extends AuthServiceError {
  constructor(message = 'Invalid token', opts = {}) {
    super(message, { code: 'INVALID_TOKEN', ...opts });
  }
}

module.exports = { InvalidTokenError };

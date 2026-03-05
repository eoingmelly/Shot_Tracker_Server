const { AuthServiceError } = require('./auth-service-error');

class ExpiredTokenError extends AuthServiceError {
  constructor(message = 'Token expired', opts = {}) {
    super(message, { code: 'TOKEN_EXPIRED', ...opts });
  }
}

module.exports = { ExpiredTokenError };

const { AuthServiceError } = require('./auth-service-error');

class MissingTokenError extends AuthServiceError {
  constructor(message = 'Missing token', opts = {}) {
    super(message, { code: 'MISSING_TOKEN', ...opts });
  }
}

module.exports = { MissingTokenError };

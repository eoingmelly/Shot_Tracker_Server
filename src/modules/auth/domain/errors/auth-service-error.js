class AuthServiceError extends Error {
  constructor(message, { code, cause, details } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code || 'AUTH_ERROR';
    this.cause = cause;
    this.details = details || null;
  }
}

module.exports = { AuthServiceError };

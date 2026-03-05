// src/modules/auth/application/auth-service.js
const { MissingTokenError } = require("../domain/errors/missing-token-error");

class AuthService {
  constructor({ tokenVerifier }) {
    if (!tokenVerifier) {
      throw new Error("AuthService requires tokenVerifier ");
    }

    this._tokenVerifier = tokenVerifier;
  }

  async authenticate(token) {
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new MissingTokenError();
    }
    const trimmedToken = token.trim();
    try {
      return await this._tokenverifier.verify(trimmedToken);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = { AuthService };

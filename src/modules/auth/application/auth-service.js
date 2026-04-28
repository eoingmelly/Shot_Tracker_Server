// src/modules/auth/application/auth-service.js
const { MissingTokenError } = require("../domain/errors/missing-token-error");

class AuthService {
  constructor({ tokenVerifier }) {
    if (!tokenVerifier) {
      throw new Error("AuthService requires tokenVerifier ");
    }

    this._tokenVerifier = tokenVerifier;
    this._golferLookupAdapter = null;
  }

  async authenticate(token) {
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new MissingTokenError();
    }
    const trimmedToken = token.trim();
    try {
      const verifyResult = await this._tokenVerifier.verify(trimmedToken);

      if (verifyResult) {
        const { sub } = verifyResult;

        verifyResult.golferId = await this._golferLookupAdapter.getGolferId({
          sub,
        });
      }
      return verifyResult;
    } catch (err) {
      throw err;
    }
  }

  async lazyLoadGolferLookupAdapter({ golferLookupAdapter }) {
    if (!this._golferLookupAdapter)
      this._golferLookupAdapter = golferLookupAdapter;
  }
}

module.exports = { AuthService };

const { ITokenVerifier } = require("../domain/interfaces/i-token-verifier");

class CognitoTokenVerifier extends ITokenVerifier {
  constructor({ cognitoJwtVerifier }) {
    super();
    if (!cognitoJwtVerifier)
      throw new Error("CognitoTokenVerifier requires cognitoJwtVerifier");

    this._verifier = cognitoJwtVerifier;
  }

  async verify(token) {
    // CognitoJwtVerifier.verify(token) typically returns claims (or throws)
    return this._verifier.verify(token);
  }
}

module.exports = { CognitoTokenVerifier };

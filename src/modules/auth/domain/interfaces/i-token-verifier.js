class ITokenVerifier {
  async verify(token) {
    throw new Error('ISocketTokenVerifier.verify(token) must be implemented');
  }
}

module.exports = { ITokenVerifier };

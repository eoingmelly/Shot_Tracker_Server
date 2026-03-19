// modules/identity/application/identity-service.js
class IdentityService {
  /**
   * @param {Object} deps
   * @param {Object} deps.golferRepository - your existing golfer repo (domain interface)
   * @param {Object} deps.identityProvider - implements IIdentityProvider
   */
  constructor({
    //golferRepository,
    identityProvider,
  }) {
    // if (!golferRepository)
    //   throw new Error("IdentityService requires { golferRepository }");
    if (!identityProvider)
      throw new Error("IdentityService requires { identityProvider }");

    //this._golferRepository = golferRepository;
    this._identityProvider = identityProvider;
  }

  /**
   * Admin-driven create: create in Cognito and store linkage in DB.
   * (Assumes golfer already exists in DB and you’re provisioning, not creating your domain golfer here.)
   */
  async createUser({ userId }) {
    throw new Error("Unimplemented createUser");
  }

  async setEnabled({ userId, enabled }) {
    if (!userId) throw new Error("setEnabled requires { userId }");
    if (typeof enabled !== "boolean")
      throw new Error("setEnabled requires { enabled: boolean }");

    const golfer = await this._getUserOrThrow(userId);
    const email = this._getEmailOrThrow(golfer, userId);

    if (enabled) {
      await this._identityProvider.enableUser({ email });
    } else {
      await this._identityProvider.disableUser({ email });
    }
  }

  async confirmAccount({ userId }) {
    if (!userId) throw new Error("confirmAccount requires { userId }");

    const golfer = await this._getUserOrThrow(userId);
    const email = this._getEmailOrThrow(golfer, userId);

    await this._identityProvider.confirmUser({ email });
  }

  async addToGroup({ userId, groupName }) {
    if (!userId) throw new Error("addToGroup requires { userId }");
    if (!groupName) throw new Error("addToGroup requires { groupName }");

    const golfer = await this._getUserOrThrow(userId);
    const email = this._getEmailOrThrow(golfer, userId);

    await this._identityProvider.addUserToGroup({ email, groupName });
  }

  async forceSignOut({ userId }) {
    if (!userId) throw new Error("forceSignOut requires { userId }");

    const golfer = await this._getUserOrThrow(userId);
    const email = this._getEmailOrThrow(golfer, userId);
    await this._identityProvider.forceSignOut({ email });
  }

  async setPermanentPassword({ email, permanentPassword }) {
    const response = await this._identityProvider.setPassword({
      email,
      password: permanentPassword,
      makePermanent: true,
    });

    return response;
  }

  //Internal Helpers:
  async _getUserOrThrow(userId) {
    if (!userId) throw new Error("userId required");

    const golfer = await this._golferRepository.getById(userId);
    if (!golfer) throw new Error(`golfer not found for userId=${userId}`);

    return golfer;
  }

  _getEmailOrThrow(golfer, userId) {
    const email = golfer && golfer.email;
    if (!email) throw new Error(`golfer missing email for userId=${userId}`);
    return email;
  }
}

module.exports = { IdentityService };

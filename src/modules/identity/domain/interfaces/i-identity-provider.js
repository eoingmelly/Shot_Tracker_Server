// modules/identity/domain/interfaces/i-identity-provider.js

class IIdentityProvider {
  /**
   * Create a user in the identity provider.
   * Expected to be idempotent only if the concrete implementation chooses so;
   * callers should generally check existence first (e.g. getUserByEmail).
   *
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.userId
   * @param {string} [params.temporaryPassword]   // if using AdminCreateUser flows
   * @returns {Promise<{ sub: string, email: string }>}
   */
  async createUser(/* params */) {
    throw new Error("IIdentityProvider.createUser must be implemented");
  }

  /**
   * Lookup a user by email.
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<null|{ sub: string, email: string, enabled: boolean, status?: string, attributes?: Object }>}
   */
  async getUserByEmail(/* params */) {
    throw new Error("IIdentityProvider.getUserByEmail must be implemented");
  }

  /**
   * Enable a user (allow sign-in).
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<void>}
   */
  async enableUser(/* params */) {
    throw new Error("IIdentityProvider.enableUser must be implemented");
  }

  /**
   * Disable a user (prevent sign-in).
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<void>}
   */
  async disableUser(/* params */) {
    throw new Error("IIdentityProvider.disableUser must be implemented");
  }

  /**
   * Confirm a user's account (if the provider supports it).
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<void>}
   */
  async confirmUser(/* params */) {
    throw new Error("IIdentityProvider.confirmUser must be implemented");
  }

  /**
   * Add a user to a group.
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.groupName
   * @returns {Promise<void>}
   */
  async addUserToGroup(/* params */) {
    throw new Error("IIdentityProvider.addUserToGroup must be implemented");
  }

  /**
   * Force global sign-out (invalidate refresh tokens, etc. depending on provider).
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<void>}
   */
  async forceSignOut(/* params */) {
    throw new Error("IIdentityProvider.forceSignOut must be implemented");
  }

  /**
   * Force global sign-out (invalidate refresh tokens, etc. depending on provider).
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<void>}
   */
  async setPassword(/* params */) {
    throw new Error("IIdentityProvider.setPassword must be implemented");
  }

  /**
   * Force global sign-out (invalidate refresh tokens, etc. depending on provider).
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<void>}
   */
  async addCustomAttribute(/* params */) {
    throw new Error("IIdentityProvider.addCustomAttribute must be implemented");
  }
}

module.exports = IIdentityProvider;

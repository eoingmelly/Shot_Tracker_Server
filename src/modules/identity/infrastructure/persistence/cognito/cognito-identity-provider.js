// modules/identity/infrastructure/persistence/cognito/cognito-identity-provider.js
const IIdentityProvider = require("../../../domain/interfaces/i-identity-provider");

const {
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
  AdminConfirmSignUpCommand,
  AdminAddUserToGroupCommand,
  AdminUserGlobalSignOutCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

class CognitoIdentityProvider extends IIdentityProvider {
  /**
   * @param {Object} deps
   * @param {import('@aws-sdk/client-cognito-identity-provider').CognitoIdentityProviderClient} deps.client
   * @param {string} deps.userPoolId
   */
  constructor({ client, userPoolId }) {
    super();

    if (!client) throw new Error("CognitoIdentityProvider requires { client }");
    if (!userPoolId)
      throw new Error("CognitoIdentityProvider requires { userPoolId }");

    this._client = client;
    this._userPoolId = userPoolId;
  }

  async createUser(params) {
    const { email, userName, temporaryPassword } = params || {};

    if (!email) throw new Error("createUser requires { email }");
    if (!userName) throw new Error("createUser requires { userName }");

    // We use email as Username for admin operations for simplicity & consistency with your plan.
    // If your pool uses a different username scheme, adjust here.
    const command = new AdminCreateUserCommand({
      UserPoolId: this._userPoolId,
      Username: email,
      MessageAction: "SUPPRESS", // do not email invite by default (migration/admin controlled)
      TemporaryPassword: temporaryPassword,
    });

    let result = await this._client.send(command);

    const created = result && result.User ? result.User : null;

    const subAttr =
      created && Array.isArray(created.Attributes)
        ? created.Attributes.find((a) => a && a.Name === "sub")
        : null;

    const sub = subAttr ? subAttr.Value : undefined;
    if (!sub) {
      // Cognito should return sub; if not, caller can't store linkage reliably
      throw new Error("Cognito did not return sub for created user");
    }

    return { sub, email };
  }

  async getUserByEmail(params) {
    const { email } = params || {};
    if (!email) throw new Error("getUserByEmail requires { email }");

    try {
      const result = await this._client.send(
        new AdminGetUserCommand({
          UserPoolId: this._userPoolId,
          Username: email,
        }),
      );

      const attributesArr = Array.isArray(result.UserAttributes)
        ? result.UserAttributes
        : [];
      const attributes = attributesArr.reduce((acc, a) => {
        if (a && a.Name) acc[a.Name] = a.Value;
        return acc;
      }, {});

      return {
        sub: attributes.sub,
        email: attributes.email || email,
        enabled: Boolean(result.Enabled),
        status: result.UserStatus,
        attributes,
      };
    } catch (err) {
      // Cognito uses UsernameExistsException, UserNotFoundException, etc.
      // For AdminGetUser, missing user is typically UserNotFoundException.
      if (
        err &&
        (err.name === "UserNotFoundException" ||
          err.Code === "UserNotFoundException")
      ) {
        return null;
      }
      throw err;
    }
  }

  async enableUser(params) {
    const { email } = params || {};
    if (!email) throw new Error("enableUser requires { email }");

    await this._client.send(
      new AdminEnableUserCommand({
        UserPoolId: this._userPoolId,
        Username: email,
      }),
    );
  }

  async disableUser(params) {
    const { email } = params || {};
    if (!email) throw new Error("disableUser requires { email }");

    await this._client.send(
      new AdminDisableUserCommand({
        UserPoolId: this._userPoolId,
        Username: email,
      }),
    );
  }

  async confirmUser(params) {
    const { email } = params || {};
    if (!email) throw new Error("confirmUser requires { email }");

    const existing = await this.getUserByEmail({ email });
    if (!existing) throw new Error("User not found");

    if (existing.status === "CONFIRMED") return;

    await this._client.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: this._userPoolId,
        Username: email,
      }),
    );
  }

  async addUserToGroup(params) {
    const { email, groupName } = params || {};
    if (!email) throw new Error("addUserToGroup requires { email }");
    if (!groupName) throw new Error("addUserToGroup requires { groupName }");

    await this._client.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: this._userPoolId,
        Username: email,
        GroupName: groupName,
      }),
    );
  }

  async forceSignOut(params) {
    const { email } = params || {};
    if (!email) throw new Error("forceSignOut requires { email }");

    await this._client.send(
      new AdminUserGlobalSignOutCommand({
        UserPoolId: this._userPoolId,
        Username: email,
      }),
    );
  }

  async setPassword(params) {
    const { email, password, makePermanent } = params || {};
    if (!email) throw new Error("setPermanentPassword requires { email }");
    if (!password)
      throw new Error("setPermanentPassword requires { password }");

    const Permanent = makePermanent || false;

    return await this._client.send(
      new AdminSetUserPasswordCommand({
        Password: password,
        UserPoolId: this._userPoolId,
        Username: email,
        Permanent,
      }),
    );
  }

  async addCustomAttribute(params) {
    const { email, attributeName, value } = params || {};
    if (!attributeName)
      throw new Error("addCustomAttributes requires { attributeName }");
    if (!value) throw new Error("addCustomAttributes requires { value }");

    await this._client.send(
      new AdminUpdateUserAttributesCommand({
        Username: email,
        UserAttributes: [{ Name: `custom:${attributeName}`, Value: value }],
        UserPoolId: this._userPoolId,
      }),
    );
  }
}

module.exports = CognitoIdentityProvider;

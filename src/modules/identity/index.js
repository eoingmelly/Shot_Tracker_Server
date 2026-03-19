// modules/identity/index.js

const { IdentityService } = require("./application/identity-service");
const {
  createCognitoIdentityProvider,
} = require("./infrastructure/persistence/cognito/cognito-identity-provider-factory");

/**
 * Composition root for the identity bounded context.
 * Returns constructed services for use by the main app.
 *
 * @param {Object} deps
 * @param {Object} deps.golferRepository - required (your existing repo)
 * @param {Object} deps.config
 * @param {string} deps.config.region
 * @param {string} deps.config.userPoolId
 * @param {Object} [deps.config.clientConfig] - optional AWS SDK client config
 * @param {Object} [deps.identityProvider] - optional override (swap provider / tests)
 */
function createIdentityModule({ golferRepository, identityProvider } = {}) {
  if (!golferRepository)
    throw new Error("createIdentityModule requires { golferRepository }");

  //Default to cognito identity provider...
  const provider =
    identityProvider ||
    createCognitoIdentityProvider({
      region: process.env.AWS_REGION,
      userPoolId: process.env.USER_POOL_ID,
    });

  const identityService = new IdentityService({
    golferRepository,
    identityProvider: provider,
  });

  return {
    identityService,
  };
}

module.exports = { createIdentityModule };

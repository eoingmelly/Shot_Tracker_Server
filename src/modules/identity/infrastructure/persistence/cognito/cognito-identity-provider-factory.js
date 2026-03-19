// modules/identity/infrastructure/persistence/cognito/cognito-identity-provider-factory.js

const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');
const CognitoIdentityProvider = require('./cognito-identity-provider');

/**
 * Factory: builds a Cognito-backed IIdentityProvider implementation.
 * Keeps AWS SDK + config concerns isolated from application/domain layers.
 *
 * @param {Object} params
 * @param {string} params.region
 * @param {string} params.userPoolId
 * @param {import('@aws-sdk/client-cognito-identity-provider').CognitoIdentityProviderClient} [params.client]
 * @returns {CognitoIdentityProvider}
 */
function createCognitoIdentityProvider({ region, userPoolId, client } = {}) {
  if (!userPoolId) throw new Error('createCognitoIdentityProvider requires { userPoolId }');

  // region is required unless an injected client is provided (useful for tests)
  if (!client && !region) throw new Error('createCognitoIdentityProvider requires { region }');

  const resolvedClient =
    client ||
    new CognitoIdentityProviderClient({
      region,
      ...{}, //Potentially client config options to pass to aws sdk
    });

  return new CognitoIdentityProvider({
    client: resolvedClient,
    userPoolId,
  });
}

module.exports = { createCognitoIdentityProvider };

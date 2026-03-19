// modules/identity/infrastructure/persistence/cognito/__tests__/cognito-identity-provider.contract.test.js

const IIdentityProvider = require('../../../../domain/interfaces/i-identity-provider');
const CognitoIdentityProvider = require('../cognito-identity-provider');

describe('CognitoIdentityProvider contract', () => {
  const REQUIRED_METHODS = [
    'createUser',
    'getUserByEmail',
    'enableUser',
    'disableUser',
    'confirmUser',
    'addUserToGroup',
    'forceSignOut',
    'setPassword',
    'addCustomAttribute',
  ];

  test('extends IIdentityProvider', () => {
    // avoids needing to instantiate (constructor may require deps)
    const extendsInterface = IIdentityProvider.prototype.isPrototypeOf(CognitoIdentityProvider.prototype);

    expect(extendsInterface).toBe(true);
  });

  test('overrides all required methods (not inherited)', () => {
    REQUIRED_METHODS.forEach((methodName) => {
      const hasOwn = Object.prototype.hasOwnProperty.call(CognitoIdentityProvider.prototype, methodName);

      expect(hasOwn).toBe(true);
      expect(typeof CognitoIdentityProvider.prototype[methodName]).toBe('function');

      // extra safety: ensure it’s not the base method implementation
      expect(CognitoIdentityProvider.prototype[methodName]).not.toBe(IIdentityProvider.prototype[methodName]);
    });
  });
});

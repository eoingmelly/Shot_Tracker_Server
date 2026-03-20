// modules/identity/infrastructure/persistence/cognito/__tests__/cognito-identity-provider-factory.test.js

const { createCognitoIdentityProvider } = require('../cognito-identity-provider-factory');
const CognitoIdentityProvider = require('../cognito-identity-provider');

describe('createCognitoIdentityProvider Factory Method', () => {
  test('throws if userPoolId missing', () => {
    expect(() => createCognitoIdentityProvider({ region: 'eu-west-1' })).toThrow('userPoolId');
  });

  test('throws if region missing and no client injected', () => {
    expect(() => createCognitoIdentityProvider({ userPoolId: 'pool-123' })).toThrow('region');
  });

  test('returns CognitoIdentityProvider using injected client', () => {
    const fakeClient = { send: jest.fn() };

    const provider = createCognitoIdentityProvider({
      userPoolId: 'pool-123',
      client: fakeClient,
    });

    expect(provider).toBeInstanceOf(CognitoIdentityProvider);
  });
});

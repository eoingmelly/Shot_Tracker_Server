// src/modules/auth/index.js
const { AuthService } = require("./application/auth-service");

const {
  CognitoTokenVerifier,
} = require("./infrastructure/cognito-token-verifier");
const {
  createCognitoVerifierFromEnv,
} = require("./infrastructure/cognito-verifier-factory");

const {
  createExpressAuthMiddleware,
} = require("./infrastructure/http/express-auth-middleware");

async function createAuthenticationService() {
  const { cognitoJwtVerifier } = createCognitoVerifierFromEnv();

  const tokenVerifier = new CognitoTokenVerifier({
    cognitoJwtVerifier,
  });

  const authenticationService = new AuthService({ tokenVerifier });

  // Convention: return an object
  return { authenticationService };
}

function createAuthHttpMiddleware({
  authenticationService,
  //, userContextResolver
}) {
  return createExpressAuthMiddleware({
    authenticationService,
    //userContextResolver
  });
}

module.exports = {
  createAuthenticationService,
  createAuthHttpMiddleware,
};

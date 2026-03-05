const { CognitoJwtVerifier } = require("aws-jwt-verify");

function createCognitoVerifierFromEnv() {
  const userPoolId = process.env.USER_POOL_ID;
  const webClientId = process.env.CLIENT_ID_WEB;
  const cognitoJwtVerifier = webClientId
    ? CognitoJwtVerifier.create({
        userPoolId,
        clientId: webClientId,
        tokenUse: "access",
      })
    : null;

  return { cognitoJwtVerifier };
}

module.exports = { createCognitoVerifierFromEnv };

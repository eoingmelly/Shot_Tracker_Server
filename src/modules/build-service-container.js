// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

const { createIdentityModule } = require("./identity");

async function buildServiceContainer() {
  const { authenticationService } = await createAuthenticationService();
  const expressAuthMiddleware = await createAuthHttpMiddleware({
    authenticationService,
  });

  const identityService = await createIdentityModule();

  return {
    //modules: { auth },
    services: {
      authenticationService,
      identityService,
    },
    middleware: {
      // optional: flattened references later if you want
      expressAuthMiddleware,
    },
  };
}

module.exports = { buildServiceContainer };

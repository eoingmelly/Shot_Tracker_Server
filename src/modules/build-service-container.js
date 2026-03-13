// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

async function buildServiceContainer() {
  const { authenticationService } = await createAuthenticationService();
  const expressAuthMiddleware = await createAuthHttpMiddleware({
    authenticationService,
  });
  return {
    //modules: { auth },
    services: {
      authenticationService,
    },
    middleware: {
      // optional: flattened references later if you want
      expressAuthMiddleware,
    },
  };
}

module.exports = { buildServiceContainer };

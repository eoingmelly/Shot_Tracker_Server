// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

async function buildServiceContainer() {
  const { authenticationService } = await createAuthenticationService();
  return {
    //modules: { auth },
    services: {
      authenticationService,
    },
    middleware: {
      // optional: flattened references later if you want
      createAuthHttpMiddleware,
    },
  };
}

module.exports = { buildServiceContainer };

// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

const { createGolferService } = require("./golfer");
//const { createIdentityModule } = require("./identity");

async function buildServiceContainer() {
  const { authenticationService } = await createAuthenticationService();
  const expressAuthMiddleware = await createAuthHttpMiddleware({
    authenticationService,
  });

  const { golferService, golferRoutes } = await createGolferService({
    expressAuthMiddleware,
  });

  //const identityService = await createIdentityModule();

  return {
    //modules: { auth },
    services: {
      authenticationService,
      golferService,
      //  identityService,
    },
    middleware: {
      // optional: flattened references later if you want
      expressAuthMiddleware,
    },
    routes: {
      golferRoutes,
    },
  };
}

module.exports = { buildServiceContainer };

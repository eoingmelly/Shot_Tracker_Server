// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

const { createGolferModule } = require("./golfer");
//const { createIdentityModule } = require("./identity");

async function buildServiceContainer({ database }) {
  const { authenticationService } = await createAuthenticationService();
  const expressAuthMiddleware = await createAuthHttpMiddleware({
    authenticationService,
  });

  const { golferService, golferRoutes } = await createGolferModule({
    expressAuthMiddleware,
    database,
  });

  //const identityService = await createIdentityModule();

  return {
    services: {
      authenticationService,
      golferService,
    },
    middleware: {
      expressAuthMiddleware,
    },
    routes: {
      golferRoutes,
    },
  };
}

module.exports = { buildServiceContainer };

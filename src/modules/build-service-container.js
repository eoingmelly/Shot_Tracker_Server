// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

const { createGolferModule } = require("./golfer");
const { createHoleStatModule } = require("./hole-stat");
const { createRoundStatModule } = require("./round-stat");
const { createShotStatModule } = require("./shot-stat");

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

  const { holeStatService } = await createHoleStatModule({
    database,
  });

  const { roundStatService } = await createRoundStatModule({
    database,
  });
  const { shotStatService } = await createShotStatModule({
    database,
  });

  //const identityService = await createIdentityModule();

  return {
    services: {
      authenticationService,
      golferService,
      holeStatService,
      roundStatService,
      shotStatService,
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

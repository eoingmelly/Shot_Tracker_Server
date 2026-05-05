// src/modules/build-service-container.js
const {
  createAuthenticationService,
  createAuthHttpMiddleware,
} = require("./auth");

const { createGolferModule } = require("./golfer");
const { createHoleStatModule } = require("./hole-stat");
const { createRoundStatModule } = require("./round-stat");
const { createShotStatModule } = require("./shot-stat");
const { createCourseModule } = require("./course");

//const { createIdentityModule } = require("./identity");

async function buildServiceContainer({ database }) {
  const { authenticationService } = await createAuthenticationService();
  const expressAuthMiddleware = await createAuthHttpMiddleware({
    authenticationService,
  });

  const { golferService, golferRoutes, golferLookupAdapter } =
    await createGolferModule({
      expressAuthMiddleware,
      database,
    });

  authenticationService.lazyLoadGolferLookupAdapter({ golferLookupAdapter });

  const { holeStatService } = await createHoleStatModule({
    expressAuthMiddleware,
    database,
  });

  const { roundStatService, roundStatRoutes } = await createRoundStatModule({
    expressAuthMiddleware,
    database,
  });

  const { courseService, courseRoutes } = await createCourseModule({
    expressAuthMiddleware,
    database,
  });
  const { shotStatService } = await createShotStatModule({
    expressAuthMiddleware,
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
      roundStatRoutes,
      courseRoutes,
    },
  };
}

module.exports = { buildServiceContainer };

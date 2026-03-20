const { GolferService } = require("./application/golfer-service");
const {
  MongooseGolferRepository,
} = require("./infrastructure/persistence/mongo/mongoose-golfer-repository");
const {
  GolferMapper,
} = require("./infrastructure/persistence/mongo/mappers/golfer-mapper");
const {
  GolferModel,
} = require("./infrastructure/persistence/mongo/golfer-model");
const { createGetMeHandler } = require("./infrastructure/http/get-me-handler");
const { createGolferRoutes } = require("./infrastructure/http/golfer-routes");

function _createGolferRepository({ database }) {
  const databaseType = database?.type || "mongo";

  switch (databaseType) {
    case "mongo": {
      const golferMapper = new GolferMapper();

      return new MongooseGolferRepository({
        golferModel: GolferModel,
        golferMapper,
      });
    }

    case "in-memory":
      throw new Error(
        'createGolferRepository does not yet support database.type "in-memory"',
      );

    case "sql":
      throw new Error(
        'createGolferRepository does not yet support database.type "sql"',
      );

    default:
      throw new Error(
        `createGolferRepository received unsupported database.type "${databaseType}"`,
      );
  }
}

function createGolferModule({ expressAuthMiddleware, database } = {}) {
  if (!expressAuthMiddleware) {
    throw new Error("createGolferModule requires { expressAuthMiddleware }");
  }

  const golferRepository = _createGolferRepository({ database });

  const golferService = new GolferService({
    golferRepository,
  });

  const getMeHandler = createGetMeHandler({
    golferService,
  });

  const { golferRoutes } = createGolferRoutes({
    expressAuthMiddleware,
    getMeHandler,
  });

  return {
    golferService,
    golferRoutes,
  };
}

module.exports = {
  createGolferModule,
};

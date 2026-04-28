const { RoundStatService } = require("./application/round-stat-service");

const {
  MongooseRoundStatRepository,
} = require("./infrastructure/persistence/mongo/mongoose-round-stat-repository");

const {
  RoundStatMapper,
} = require("./infrastructure/persistence/mongo/mappers/round-stat-mapper");

const {
  RoundStatModel,
} = require("./infrastructure/persistence/mongo/round-stat-model");

const {
  createRoundStatRoutes,
} = require("./infrastructure/http/round-stat-routes");

const {
  createGetRoundStatHandler,
} = require("./infrastructure/http/get-round-stat-handler");
const {
  createCreateRoundStatHandler,
} = require("./infrastructure/http/create-round-stat-handler");

function createRoundStatRepository({ database }) {
  const databaseType = database?.type || "mongo";

  switch (databaseType) {
    case "mongo": {
      const roundStatMapper = new RoundStatMapper();

      return new MongooseRoundStatRepository({
        roundStatModel: RoundStatModel,
        roundStatMapper,
      });
    }

    case "in-memory":
      throw new Error(
        'createRoundStatRepository does not yet support database.type "in-memory"',
      );

    case "sql":
      throw new Error(
        'createRoundStatRepository does not yet support database.type "sql"',
      );

    default:
      throw new Error(
        `createRoundStatRepository received unsupported database.type "${databaseType}"`,
      );
  }
}

function createRoundStatModule({ expressAuthMiddleware, database } = {}) {
  const roundStatRepository = createRoundStatRepository({ database });

  const roundStatService = new RoundStatService({
    roundStatRepository,
  });

  const createRoundStatHandler = createCreateRoundStatHandler({
    roundStatService,
  });
  const getRoundStatHandler = createGetRoundStatHandler({ roundStatService });

  const roundStatRoutes = createRoundStatRoutes({
    expressAuthMiddleware,
    createRoundStatHandler,
    getRoundStatHandler,
  });

  return {
    roundStatService,
    roundStatRoutes,
  };
}

module.exports = {
  createRoundStatModule,
};

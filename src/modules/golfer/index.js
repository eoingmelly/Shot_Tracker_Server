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

function createGolferService({ expressAuthMiddleware }) {
  if (!expressAuthMiddleware)
    throw new Error("createGolferService requires { expressAuthMiddleware }");

  const golferMapper = new GolferMapper();

  const golferRepository = new MongooseGolferRepository({
    golferModel: GolferModel,
    golferMapper,
  });

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

module.exports = { createGolferService };

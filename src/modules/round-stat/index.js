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

function createRoundStatModule({ database } = {}) {
  const roundStatRepository = createRoundStatRepository({ database });

  const roundStatService = new RoundStatService({
    roundStatRepository,
  });

  return {
    roundStatService,
  };
}

module.exports = {
  createRoundStatModule,
};

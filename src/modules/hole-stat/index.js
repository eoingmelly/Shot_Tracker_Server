const { HoleStatService } = require("./application/hole-stat-service");

const {
  MongooseHoleStatRepository,
} = require("./infrastructure/persistence/mongo/mongoose-hole-stat-repository");

const {
  HoleStatMapper,
} = require("./infrastructure/persistence/mongo/mappers/hole-stat-mapper");

const {
  HoleStatModel,
} = require("./infrastructure/persistence/mongo/hole-stat-model");

function createHoleStatRepository({ database }) {
  const databaseType = database?.type || "mongo";

  switch (databaseType) {
    case "mongo": {
      const holeStatMapper = new HoleStatMapper();

      return new MongooseHoleStatRepository({
        holeStatModel: HoleStatModel,
        holeStatMapper,
      });
    }

    case "in-memory":
      throw new Error(
        'createHoleStatRepository does not yet support database.type "in-memory"',
      );

    case "sql":
      throw new Error(
        'createHoleStatRepository does not yet support database.type "sql"',
      );

    default:
      throw new Error(
        `createHoleStatRepository received unsupported database.type "${databaseType}"`,
      );
  }
}

function createHoleStatModule({ database } = {}) {
  const holeStatRepository = createHoleStatRepository({ database });

  const holeStatService = new HoleStatService({
    holeStatRepository,
  });

  return {
    holeStatService,
  };
}

module.exports = {
  createHoleStatModule,
};

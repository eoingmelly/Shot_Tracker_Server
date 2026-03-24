const { ShotStatService } = require("./application/shot-stat-service");
const {
  MongooseShotStatRepository,
} = require("./infrastructure/persistence/mongo/mongoose-shot-stat-repository");
const {
  ShotStatMapper,
} = require("./infrastructure/persistence/mongo/mappers/shot-stat-mapper");
const {
  ShotStatModel,
} = require("./infrastructure/persistence/mongo/shot-stat-model");

function createShotStatRepository({ database }) {
  const databaseType = database?.type || "mongo";

  switch (databaseType) {
    case "mongo": {
      const shotStatMapper = new ShotStatMapper();

      return new MongooseShotStatRepository({
        shotStatModel: ShotStatModel,
        shotStatMapper,
      });
    }

    case "in-memory":
      throw new Error(
        'createShotStatRepository does not yet support database.type "in-memory"',
      );

    case "sql":
      throw new Error(
        'createShotStatRepository does not yet support database.type "sql"',
      );

    default:
      throw new Error(
        `createShotStatRepository received unsupported database.type "${databaseType}"`,
      );
  }
}

function createShotStatModule({ database } = {}) {
  const shotStatRepository = createShotStatRepository({ database });

  const shotStatService = new ShotStatService({
    shotStatRepository,
  });

  return {
    shotStatService,
  };
}

module.exports = {
  createShotStatModule,
};

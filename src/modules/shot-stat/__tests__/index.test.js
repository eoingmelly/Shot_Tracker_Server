jest.mock("../application/shot-stat-service", () => {
  return {
    ShotStatService: jest.fn(),
  };
});

jest.mock(
  "../infrastructure/persistence/mongo/mongoose-shot-stat-repository",
  () => {
    return {
      MongooseShotStatRepository: jest.fn(),
    };
  },
);

jest.mock(
  "../infrastructure/persistence/mongo/mappers/shot-stat-mapper",
  () => {
    return {
      ShotStatMapper: jest.fn(),
    };
  },
);

jest.mock("../infrastructure/persistence/mongo/shot-stat-model", () => {
  return {
    ShotStatModel: { modelName: "ShotStat" },
  };
});

const { createShotStatModule } = require("../index");
const { ShotStatService } = require("../application/shot-stat-service");
const {
  MongooseShotStatRepository,
} = require("../infrastructure/persistence/mongo/mongoose-shot-stat-repository");
const {
  ShotStatMapper,
} = require("../infrastructure/persistence/mongo/mappers/shot-stat-mapper");
const {
  ShotStatModel,
} = require("../infrastructure/persistence/mongo/shot-stat-model");

describe("createShotStatModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("composes mongo dependencies and returns shotStatService", () => {
    const database = { type: "mongo", client: {} };

    const shotStatMapper = { kind: "shot-stat-mapper" };
    const shotStatRepository = { kind: "shot-stat-repository" };
    const shotStatService = { kind: "shot-stat-service" };

    ShotStatMapper.mockImplementation(() => shotStatMapper);
    MongooseShotStatRepository.mockImplementation(() => shotStatRepository);
    ShotStatService.mockImplementation(() => shotStatService);

    const result = createShotStatModule({ database });

    expect(ShotStatMapper).toHaveBeenCalledTimes(1);

    expect(MongooseShotStatRepository).toHaveBeenCalledTimes(1);
    expect(MongooseShotStatRepository).toHaveBeenCalledWith({
      shotStatModel: ShotStatModel,
      shotStatMapper,
    });

    expect(ShotStatService).toHaveBeenCalledTimes(1);
    expect(ShotStatService).toHaveBeenCalledWith({
      shotStatRepository,
    });

    expect(result).toEqual({
      shotStatService,
    });
  });

  test('defaults to "mongo" when database.type is not provided', () => {
    const shotStatMapper = { kind: "shot-stat-mapper" };
    const shotStatRepository = { kind: "shot-stat-repository" };
    const shotStatService = { kind: "shot-stat-service" };

    ShotStatMapper.mockImplementation(() => shotStatMapper);
    MongooseShotStatRepository.mockImplementation(() => shotStatRepository);
    ShotStatService.mockImplementation(() => shotStatService);

    const result = createShotStatModule({
      database: {},
    });

    expect(MongooseShotStatRepository).toHaveBeenCalledWith({
      shotStatModel: ShotStatModel,
      shotStatMapper,
    });

    expect(result).toEqual({
      shotStatService,
    });
  });

  test('throws when database.type is "in-memory"', () => {
    expect(() => {
      createShotStatModule({
        database: { type: "in-memory" },
      });
    }).toThrow(
      'createShotStatRepository does not yet support database.type "in-memory"',
    );
  });

  test('throws when database.type is "sql"', () => {
    expect(() => {
      createShotStatModule({
        database: { type: "sql" },
      });
    }).toThrow(
      'createShotStatRepository does not yet support database.type "sql"',
    );
  });

  test("throws when database.type is unsupported", () => {
    expect(() => {
      createShotStatModule({
        database: { type: "firebase" },
      });
    }).toThrow(
      'createShotStatRepository received unsupported database.type "firebase"',
    );
  });
});

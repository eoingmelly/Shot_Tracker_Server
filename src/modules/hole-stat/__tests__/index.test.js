jest.mock("../application/hole-stat-service", () => {
  return {
    HoleStatService: jest.fn(),
  };
});

jest.mock(
  "../infrastructure/persistence/mongo/mongoose-hole-stat-repository",
  () => {
    return {
      MongooseHoleStatRepository: jest.fn(),
    };
  },
);

jest.mock(
  "../infrastructure/persistence/mongo/mappers/hole-stat-mapper",
  () => {
    return {
      HoleStatMapper: jest.fn(),
    };
  },
);

jest.mock("../infrastructure/persistence/mongo/hole-stat-model", () => {
  return {
    HoleStatModel: { modelName: "HoleStat" },
  };
});

const { createHoleStatModule } = require("../index");

const { HoleStatService } = require("../application/hole-stat-service");

const {
  MongooseHoleStatRepository,
} = require("../infrastructure/persistence/mongo/mongoose-hole-stat-repository");

const {
  HoleStatMapper,
} = require("../infrastructure/persistence/mongo/mappers/hole-stat-mapper");

const {
  HoleStatModel,
} = require("../infrastructure/persistence/mongo/hole-stat-model");

describe("createHoleStatModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("composes mongo dependencies and returns holeStatService", () => {
    const database = { type: "mongo", client: {} };

    const holeStatMapper = { kind: "mapper" };
    const holeStatRepository = { kind: "repository" };
    const holeStatService = { kind: "service" };

    HoleStatMapper.mockImplementation(() => holeStatMapper);
    MongooseHoleStatRepository.mockImplementation(() => holeStatRepository);
    HoleStatService.mockImplementation(() => holeStatService);

    const result = createHoleStatModule({ database });

    expect(HoleStatMapper).toHaveBeenCalledTimes(1);

    expect(MongooseHoleStatRepository).toHaveBeenCalledWith({
      holeStatModel: HoleStatModel,
      holeStatMapper,
    });

    expect(HoleStatService).toHaveBeenCalledWith({
      holeStatRepository,
    });

    expect(result).toEqual({
      holeStatService,
    });
  });

  test('defaults to "mongo" when database.type is not provided', () => {
    const holeStatMapper = {};
    const holeStatRepository = {};
    const holeStatService = {};

    HoleStatMapper.mockImplementation(() => holeStatMapper);
    MongooseHoleStatRepository.mockImplementation(() => holeStatRepository);
    HoleStatService.mockImplementation(() => holeStatService);

    const result = createHoleStatModule({
      database: {},
    });

    expect(MongooseHoleStatRepository).toHaveBeenCalledWith({
      holeStatModel: HoleStatModel,
      holeStatMapper,
    });

    expect(result).toEqual({
      holeStatService,
    });
  });

  test('throws when database.type is "in-memory"', () => {
    expect(() => {
      createHoleStatModule({
        database: { type: "in-memory" },
      });
    }).toThrow(
      'createHoleStatRepository does not yet support database.type "in-memory"',
    );
  });

  test('throws when database.type is "sql"', () => {
    expect(() => {
      createHoleStatModule({
        database: { type: "sql" },
      });
    }).toThrow(
      'createHoleStatRepository does not yet support database.type "sql"',
    );
  });

  test("throws when database.type is unsupported", () => {
    expect(() => {
      createHoleStatModule({
        database: { type: "firebase" },
      });
    }).toThrow(
      'createHoleStatRepository received unsupported database.type "firebase"',
    );
  });
});

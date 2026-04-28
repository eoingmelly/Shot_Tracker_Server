jest.mock("../application/round-stat-service", () => {
  return {
    RoundStatService: jest.fn(),
  };
});

jest.mock(
  "../infrastructure/persistence/mongo/mongoose-round-stat-repository",
  () => {
    return {
      MongooseRoundStatRepository: jest.fn(),
    };
  },
);

jest.mock(
  "../infrastructure/persistence/mongo/mappers/round-stat-mapper",
  () => {
    return {
      RoundStatMapper: jest.fn(),
    };
  },
);

jest.mock("../infrastructure/persistence/mongo/round-stat-model", () => {
  return {
    RoundStatModel: { modelName: "RoundStat" },
  };
});

const { createRoundStatModule } = require("../index");

const { RoundStatService } = require("../application/round-stat-service");

const {
  MongooseRoundStatRepository,
} = require("../infrastructure/persistence/mongo/mongoose-round-stat-repository");

const {
  RoundStatMapper,
} = require("../infrastructure/persistence/mongo/mappers/round-stat-mapper");

const {
  RoundStatModel,
} = require("../infrastructure/persistence/mongo/round-stat-model");

describe("createRoundStatModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("composes mongo dependencies and returns roundStatService", () => {
    const database = { type: "mongo", client: {} };

    const roundStatMapper = { kind: "mapper" };
    const roundStatRepository = { kind: "repository" };
    const roundStatService = { kind: "service" };

    RoundStatMapper.mockImplementation(() => roundStatMapper);
    MongooseRoundStatRepository.mockImplementation(() => roundStatRepository);
    RoundStatService.mockImplementation(() => roundStatService);

    const result = createRoundStatModule({ database });

    expect(RoundStatMapper).toHaveBeenCalledTimes(1);

    expect(MongooseRoundStatRepository).toHaveBeenCalledWith({
      roundStatModel: RoundStatModel,
      roundStatMapper,
    });

    expect(RoundStatService).toHaveBeenCalledWith({
      roundStatRepository,
    });

    expect(result).toEqual({
      roundStatService,
    });
  });

  test('defaults to "mongo" when database.type is not provided', () => {
    const roundStatMapper = {};
    const roundStatRepository = {};
    const roundStatService = {};

    RoundStatMapper.mockImplementation(() => roundStatMapper);
    MongooseRoundStatRepository.mockImplementation(() => roundStatRepository);
    RoundStatService.mockImplementation(() => roundStatService);

    const result = createRoundStatModule({
      database: {},
    });

    expect(MongooseRoundStatRepository).toHaveBeenCalledWith({
      roundStatModel: RoundStatModel,
      roundStatMapper,
    });

    expect(result).toEqual({
      roundStatService,
    });
  });

  test('throws when database.type is "in-memory"', () => {
    expect(() => {
      createRoundStatModule({
        database: { type: "in-memory" },
      });
    }).toThrow(
      'createRoundStatRepository does not yet support database.type "in-memory"',
    );
  });

  test('throws when database.type is "sql"', () => {
    expect(() => {
      createRoundStatModule({
        database: { type: "sql" },
      });
    }).toThrow(
      'createRoundStatRepository does not yet support database.type "sql"',
    );
  });

  test("throws when database.type is unsupported", () => {
    expect(() => {
      createRoundStatModule({
        database: { type: "firebase" },
      });
    }).toThrow(
      'createRoundStatRepository received unsupported database.type "firebase"',
    );
  });
});

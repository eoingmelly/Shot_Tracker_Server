jest.mock("../application/round-stat-service", () => ({
  RoundStatService: jest.fn(),
}));

jest.mock(
  "../infrastructure/persistence/mongo/mongoose-round-stat-repository",
  () => ({ MongooseRoundStatRepository: jest.fn() }),
);

jest.mock(
  "../infrastructure/persistence/mongo/mappers/round-stat-mapper",
  () => ({
    RoundStatMapper: jest.fn(),
  }),
);

jest.mock("../infrastructure/persistence/mongo/round-stat-model", () => ({
  RoundStatModel: { modelName: "RoundStat" },
}));

jest.mock("../infrastructure/http/get-round-stat-handler", () => ({
  createGetRoundStatHandler: jest.fn(),
}));

jest.mock("../infrastructure/http/create-round-stat-handler", () => ({
  createCreateRoundStatHandler: jest.fn(),
}));

jest.mock("../infrastructure/http/round-stat-routes", () => ({
  createRoundStatRoutes: jest.fn(),
}));

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
const {
  createGetRoundStatHandler,
} = require("../infrastructure/http/get-round-stat-handler");
const {
  createCreateRoundStatHandler,
} = require("../infrastructure/http/create-round-stat-handler");
const {
  createRoundStatRoutes,
} = require("../infrastructure/http/round-stat-routes");

describe("createRoundStatModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("composes mongo dependencies and returns roundStatService and roundStatRoutes", () => {
    const expressAuthMiddleware = jest.fn();
    const database = { type: "mongo", client: {} };

    const roundStatMapper = { kind: "mapper" };
    const roundStatRepository = { kind: "repository" };
    const roundStatService = { kind: "service" };
    const getRoundStatHandler = jest.fn();
    const createRoundStatHandler = jest.fn();
    const roundStatRoutes = { kind: "routes" };

    RoundStatMapper.mockImplementation(() => roundStatMapper);
    MongooseRoundStatRepository.mockImplementation(() => roundStatRepository);
    RoundStatService.mockImplementation(() => roundStatService);
    createGetRoundStatHandler.mockReturnValue(getRoundStatHandler);
    createCreateRoundStatHandler.mockReturnValue(createRoundStatHandler);
    createRoundStatRoutes.mockReturnValue(roundStatRoutes);

    const result = createRoundStatModule({ expressAuthMiddleware, database });

    expect(RoundStatMapper).toHaveBeenCalledTimes(1);
    expect(MongooseRoundStatRepository).toHaveBeenCalledWith({
      roundStatModel: RoundStatModel,
      roundStatMapper,
    });

    expect(RoundStatService).toHaveBeenCalledWith({
      roundStatRepository,
    });

    expect(createCreateRoundStatHandler).toHaveBeenCalledWith({
      roundStatService,
    });

    expect(createGetRoundStatHandler).toHaveBeenCalledWith({
      roundStatService,
    });

    expect(createRoundStatRoutes).toHaveBeenCalledWith({
      expressAuthMiddleware,
      createRoundStatHandler,
      getRoundStatHandler,
    });

    expect(result).toEqual({
      roundStatService,
      roundStatRoutes,
    });
  });
});

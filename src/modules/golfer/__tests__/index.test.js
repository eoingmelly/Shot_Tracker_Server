jest.mock("../infrastructure/adapters/golfer-lookup-adapter", () => {
  return {
    GolferLookupAdapter: jest.fn(),
  };
});

jest.mock("../application/golfer-service", () => {
  return {
    GolferService: jest.fn(),
  };
});

jest.mock(
  "../infrastructure/persistence/mongo/mongoose-golfer-repository",
  () => {
    return {
      MongooseGolferRepository: jest.fn(),
    };
  },
);

jest.mock("../infrastructure/persistence/mongo/mappers/golfer-mapper", () => {
  return {
    GolferMapper: jest.fn(),
  };
});

jest.mock("../infrastructure/persistence/mongo/golfer-model", () => {
  return {
    GolferModel: { modelName: "Golfer" },
  };
});

jest.mock("../infrastructure/http/get-me-handler", () => {
  return {
    createGetMeHandler: jest.fn(),
  };
});

jest.mock("../infrastructure/http/golfer-routes", () => {
  return {
    createGolferRoutes: jest.fn(),
  };
});

const { createGolferModule } = require("../index");
const { GolferService } = require("../application/golfer-service");
const {
  MongooseGolferRepository,
} = require("../infrastructure/persistence/mongo/mongoose-golfer-repository");
const {
  GolferMapper,
} = require("../infrastructure/persistence/mongo/mappers/golfer-mapper");
const {
  GolferModel,
} = require("../infrastructure/persistence/mongo/golfer-model");
const { createGetMeHandler } = require("../infrastructure/http/get-me-handler");
const { createGolferRoutes } = require("../infrastructure/http/golfer-routes");

const {
  GolferLookupAdapter,
} = require("../infrastructure/adapters/golfer-lookup-adapter");

describe("createGolferModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws when expressAuthMiddleware is not provided", () => {
    expect(() => {
      createGolferModule({});
    }).toThrow("createGolferModule requires { expressAuthMiddleware }");
  });

  test("composes module dependencies and returns golferService and golferRoutes", () => {
    const expressAuthMiddleware = jest.fn();

    const golferMapper = { kind: "golfer-mapper" };
    const golferRepository = { kind: "golfer-repository" };
    const golferService = { kind: "golfer-service" };
    const getMeHandler = jest.fn();
    const golferRoutes = { kind: "golfer-routes" };
    const golferLookupAdapter = { kind: "golfer-lookup-adapter" };

    GolferLookupAdapter.mockImplementation(() => golferLookupAdapter);
    GolferMapper.mockImplementation(() => golferMapper);
    MongooseGolferRepository.mockImplementation(() => golferRepository);
    GolferService.mockImplementation(() => golferService);
    createGetMeHandler.mockReturnValue(getMeHandler);
    createGolferRoutes.mockReturnValue({ golferRoutes });

    const result = createGolferModule({
      expressAuthMiddleware,
    });

    expect(GolferMapper).toHaveBeenCalledTimes(1);

    expect(MongooseGolferRepository).toHaveBeenCalledTimes(1);
    expect(MongooseGolferRepository).toHaveBeenCalledWith({
      golferModel: GolferModel,
      golferMapper,
    });

    expect(GolferService).toHaveBeenCalledTimes(1);
    expect(GolferService).toHaveBeenCalledWith({
      golferRepository,
    });

    expect(createGetMeHandler).toHaveBeenCalledTimes(1);
    expect(createGetMeHandler).toHaveBeenCalledWith({
      golferService,
    });

    expect(createGolferRoutes).toHaveBeenCalledTimes(1);
    expect(createGolferRoutes).toHaveBeenCalledWith({
      expressAuthMiddleware,
      getMeHandler,
    });

    console.log("result? ", result);
    expect(result).toEqual({
      golferLookupAdapter,
      golferService,
      golferRoutes,
    });
  });
});

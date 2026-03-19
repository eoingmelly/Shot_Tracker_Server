const {
  IGolferRepository,
} = require("../../../domain/interfaces/i-golfer-repository");

class MongooseGolferRepository extends IGolferRepository {
  constructor({ golferModel, golferMapper }) {
    if (!golferModel)
      throw new Error("MongooseGolferRepository requires { golferModel }");
    if (!golferMapper)
      throw new Error("MongooseGolferRepository requires { golferMapper }");

    super();

    this._golferModel = golferModel;
    this._golferMapper = golferMapper;
  }

  async findBySub({ sub }) {
    const golferDocument = await this._golferModel.findOne({ sub });

    if (!golferDocument) {
      return null;
    }

    return this._golferMapper.toDomain({ golferDocument });
  }

  async create({ golfer }) {
    const persistenceData = this._golferMapper.toPersistence({ golfer });

    const createdGolferDocument =
      await this._golferModel.create(persistenceData);

    return this._golferMapper.toDomain({
      golferDocument: createdGolferDocument,
    });
  }
}

module.exports = { MongooseGolferRepository };

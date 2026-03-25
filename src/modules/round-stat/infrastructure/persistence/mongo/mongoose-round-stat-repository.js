const {
  IRoundStatRepository,
} = require("../../../domain/interfaces/i-round-stat-repository");

class MongooseRoundStatRepository extends IRoundStatRepository {
  constructor({ roundStatModel, roundStatMapper }) {
    if (!roundStatModel) {
      throw new Error(
        "MongooseRoundStatRepository requires { roundStatModel }",
      );
    }

    if (!roundStatMapper) {
      throw new Error(
        "MongooseRoundStatRepository requires { roundStatMapper }",
      );
    }

    super();

    this._roundStatModel = roundStatModel;
    this._roundStatMapper = roundStatMapper;
  }

  async create({ roundStat }) {
    const persistence = this._roundStatMapper.toPersistence({ roundStat });

    const created = await this._roundStatModel.create(persistence);

    return this._roundStatMapper.toDomain({
      roundStatDocument: created,
    });
  }

  async findById({ id }) {
    const doc = await this._roundStatModel.findById(id);

    if (!doc) return null;

    return this._roundStatMapper.toDomain({
      roundStatDocument: doc,
    });
  }

  async update({ id, roundStat }) {
    const persistence = this._roundStatMapper.toPersistence({ roundStat });

    const updated = await this._roundStatModel.findByIdAndUpdate(
      id,
      persistence,
      { new: true },
    );

    if (!updated) return null;

    return this._roundStatMapper.toDomain({
      roundStatDocument: updated,
    });
  }

  async delete({ id }) {
    await this._roundStatModel.findByIdAndDelete(id);
  }
}

module.exports = { MongooseRoundStatRepository };

const {
  IShotStatRepository,
} = require("../../../domain/interfaces/i-shot-stat-repository");

class MongooseShotStatRepository extends IShotStatRepository {
  constructor({ shotStatModel, shotStatMapper }) {
    if (!shotStatModel) {
      throw new Error("MongooseShotStatRepository requires { shotStatModel }");
    }

    if (!shotStatMapper) {
      throw new Error("MongooseShotStatRepository requires { shotStatMapper }");
    }

    super();

    this._shotStatModel = shotStatModel;
    this._shotStatMapper = shotStatMapper;
  }

  async create({ shotStat }) {
    const persistence = this._shotStatMapper.toPersistence({ shotStat });

    const created = await this._shotStatModel.create(persistence);

    return this._shotStatMapper.toDomain({
      shotStatDocument: created,
    });
  }

  async findById({ id }) {
    const doc = await this._shotStatModel.findById(id);

    if (!doc) return null;

    return this._shotStatMapper.toDomain({
      shotStatDocument: doc,
    });
  }

  async update({ id, shotStat }) {
    const persistence = this._shotStatMapper.toPersistence({ shotStat });

    const updated = await this._shotStatModel.findByIdAndUpdate(
      id,
      persistence,
      { new: true },
    );

    if (!updated) return null;

    return this._shotStatMapper.toDomain({
      shotStatDocument: updated,
    });
  }

  async delete({ id }) {
    await this._shotStatModel.findByIdAndDelete(id);
  }
}

module.exports = { MongooseShotStatRepository };

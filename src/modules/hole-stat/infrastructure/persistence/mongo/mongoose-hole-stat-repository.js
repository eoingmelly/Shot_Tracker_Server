const {
  IHoleStatRepository,
} = require("../../../domain/interfaces/i-hole-stat-repository");

class MongooseHoleStatRepository extends IHoleStatRepository {
  constructor({ holeStatModel, holeStatMapper }) {
    if (!holeStatModel) {
      throw new Error("MongooseHoleStatRepository requires { holeStatModel }");
    }

    if (!holeStatMapper) {
      throw new Error("MongooseHoleStatRepository requires { holeStatMapper }");
    }

    super();

    this._holeStatModel = holeStatModel;
    this._holeStatMapper = holeStatMapper;
  }

  async create({ holeStat }) {
    const persistence = this._holeStatMapper.toPersistence({ holeStat });

    const created = await this._holeStatModel.create(persistence);

    return this._holeStatMapper.toDomain({
      holeStatDocument: created,
    });
  }

  async findById({ id }) {
    const doc = await this._holeStatModel.findById(id);

    if (!doc) return null;

    return this._holeStatMapper.toDomain({
      holeStatDocument: doc,
    });
  }

  async update({ id, holeStat }) {
    const persistence = this._holeStatMapper.toPersistence({ holeStat });

    const updated = await this._holeStatModel.findByIdAndUpdate(
      id,
      persistence,
      { new: true },
    );

    if (!updated) return null;

    return this._holeStatMapper.toDomain({
      holeStatDocument: updated,
    });
  }

  async delete({ id }) {
    await this._holeStatModel.findByIdAndDelete(id);
  }
}

module.exports = { MongooseHoleStatRepository };

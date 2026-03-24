class ShotStatService {
  constructor({ shotStatRepository }) {
    if (!shotStatRepository) {
      throw new Error("ShotStatService requires { shotStatRepository }");
    }

    this._shotStatRepository = shotStatRepository;
  }

  async createSimpleShotStat({
    golferId,
    preStrokesGainedLie,
    postStrokesGainedLie,
    preStrokeDistanceToPin,
    postStrokeDistanceToPin,
    datePlayed,
  }) {
    if (!golferId) {
      throw new Error("createSimpleShotStat requires { golferId }");
    }

    const shotStat = {
      golferId,
      preStrokesGainedLie,
      postStrokesGainedLie,
      preStrokeDistanceToPin,
      postStrokeDistanceToPin,
      datePlayed,
      shotStatType: "simple",
    };

    return this._shotStatRepository.create({ shotStat });
  }

  async updateShotStat({ id, updates }) {
    return this._shotStatRepository.update({
      id,
      shotStat: updates,
    });
  }

  async deleteShotStat({ id }) {
    return this._shotStatRepository.delete({ id });
  }
}

module.exports = { ShotStatService };

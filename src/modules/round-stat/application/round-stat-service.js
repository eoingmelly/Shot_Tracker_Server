class RoundStatService {
  constructor({ roundStatRepository }) {
    if (!roundStatRepository) {
      throw new Error("RoundStatService requires { roundStatRepository }");
    }

    this._roundStatRepository = roundStatRepository;
  }

  async createRoundStat({
    course,
    datePlayed,
    wind,
    windBearing,
    holeStats,
    isComplete,
  }) {
    if (!datePlayed) {
      throw new Error("createRoundStat requires { datePlayed }");
    }

    const roundStat = {
      course,
      datePlayed,
      wind,
      windBearing,
      holeStats,
      isComplete,
    };

    return this._roundStatRepository.create({ roundStat });
  }

  async updateRoundStat({ id, updates }) {
    return this._roundStatRepository.update({
      id,
      roundStat: updates,
    });
  }

  async deleteRoundStat({ id }) {
    return this._roundStatRepository.delete({ id });
  }
}

module.exports = { RoundStatService };

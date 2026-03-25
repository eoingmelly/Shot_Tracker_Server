class RoundStatService {
  constructor({ roundStatRepository }) {
    if (!roundStatRepository) {
      throw new Error("RoundStatService requires { roundStatRepository }");
    }

    this._roundStatRepository = roundStatRepository;
  }

  async createRoundStat({ courseId, datePlayed, golferId }) {
    if (!datePlayed) {
      throw new Error("createRoundStat requires { datePlayed }");
    }

    const roundStat = {
      courseId,
      golferId,
      datePlayed,
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

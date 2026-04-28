class RoundStatService {
  constructor({ roundStatRepository }) {
    if (!roundStatRepository) {
      throw new Error("RoundStatService requires { roundStatRepository }");
    }

    this._roundStatRepository = roundStatRepository;
  }

  async getRoundStat({ roundId, golferId }) {
    if (!roundId) {
      throw new Error("getRoundStat requires { roundId }");
    }

    const roundStat = await this._roundStatRepository.findById({ id: roundId });

    if (!roundStat) return null;

    if (roundStat.golferId !== golferId) {
      throw new Error("Unauthorized access to roundStat");
    }

    return roundStat;
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

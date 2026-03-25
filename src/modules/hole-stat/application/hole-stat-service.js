class HoleStatService {
  constructor({ holeStatRepository }) {
    if (!holeStatRepository) {
      throw new Error("HoleStatService requires { holeStatRepository }");
    }

    this._holeStatRepository = holeStatRepository;
  }

  async createHoleStat({ roundStatId, golferId, holeNumber }) {
    if (!golferId) {
      throw new Error("createHoleStat requires { golferId }");
    }

    const holeStat = {
      roundStatId,
      golferId,
      holeNumber,
    };

    return this._holeStatRepository.create({ holeStat });
  }

  async updateHoleStat({ id, updates }) {
    return this._holeStatRepository.update({
      id,
      holeStat: updates,
    });
  }

  async deleteHoleStat({ id }) {
    return this._holeStatRepository.delete({ id });
  }
}

module.exports = { HoleStatService };

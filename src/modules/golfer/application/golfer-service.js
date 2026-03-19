const { Golfer } = require("../domain/entities/golfer");

class GolferService {
  constructor({ golferRepository }) {
    if (!golferRepository)
      throw new Error("GolferService requires { golferRepository }");

    this._golferRepository = golferRepository;
  }

  async getOrCreateGolferFromIdentity({
    sub,
    email,
    preferredUsername = null,
  }) {
    if (!sub)
      throw new Error(
        "GolferService.getOrCreateGolferFromIdentity requires { sub }",
      );

    if (!email)
      throw new Error(
        "GolferService.getOrCreateGolferFromIdentity requires { email }",
      );

    const existingGolfer = await this._golferRepository.findBySub({ sub });

    if (existingGolfer) {
      return existingGolfer;
    }

    const golfer = new Golfer({
      sub,
      email,
      preferredUsername,
    });

    return await this._golferRepository.create({ golfer });
  }
}

module.exports = { GolferService };

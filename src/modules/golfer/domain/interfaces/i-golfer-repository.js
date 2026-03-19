class IGolferRepository {
  async findBySub({ sub }) {
    throw new Error("IGolferRepository.findBySub must be implemented");
  }

  async create({ golfer }) {
    throw new Error("IGolferRepository.create must be implemented");
  }
}

module.exports = { IGolferRepository };

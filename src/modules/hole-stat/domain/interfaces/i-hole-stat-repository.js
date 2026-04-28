class IHoleStatRepository {
  async create(data) {
    throw new Error("IHoleStatRepository.create must be implemented");
  }
  async delete(data) {
    throw new Error("IHoleStatRepository.delete must be implemented");
  }
  async findById(data) {
    throw new Error("IHoleStatRepository.findById must be implemented");
  }
  async update(data) {
    throw new Error("IHoleStatRepository.update must be implemented");
  }
}

module.exports = { IHoleStatRepository };

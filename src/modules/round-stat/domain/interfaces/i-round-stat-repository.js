class IRoundStatRepository {
  async create(data) {
    throw new Error("IRoundStatRepository.create must be implemented");
  }
  async delete(data) {
    throw new Error("IRoundStatRepository.delete must be implemented");
  }
  async findById(data) {
    throw new Error("IRoundStatRepository.findById must be implemented");
  }
  async update(data) {
    throw new Error("IRoundStatRepository.update must be implemented");
  }
}

module.exports = { IRoundStatRepository };

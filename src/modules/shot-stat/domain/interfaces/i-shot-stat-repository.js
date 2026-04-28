class IShotStatRepository {
  async create(data) {
    throw new Error("IShotStatRepository.create must be implemented");
  }
  async delete(data) {
    throw new Error("IShotStatRepository.delete must be implemented");
  }
  async findById(data) {
    throw new Error("IShotStatRepository.findById must be implemented");
  }
  async update(data) {
    throw new Error("IShotStatRepository.update must be implemented");
  }
}

module.exports = { IShotStatRepository };

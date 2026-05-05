class ICourseRepository {
  async find({ data }) {
    throw new Error("ICourseRepository.find must be implemented");
  }

  async findById({ id }) {
    throw new Error("ICourseRepository.findById must be implemented");
  }

  async create({ course }) {
    throw new Error("ICourseRepository.create must be implemented");
  }
  async update({ id, courseUpdates }) {
    throw new Error("ICourseRepository.update must be implemented");
  }

  async delete({ id }) {
    throw new Error("ICourseRepository.delete must be implemented");
  }
}

module.exports = { ICourseRepository };

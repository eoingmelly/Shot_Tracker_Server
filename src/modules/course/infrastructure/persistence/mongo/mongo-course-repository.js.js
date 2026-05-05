const {
  ICourseRepository,
} = require("../../../domain/interfaces/i-course-repository");

class MongoCourseRepository extends ICourseRepository {
  /**
   *
   */
  constructor({ courseModel, mongoCourseMapper }) {
    super();

    this._mongoCourseMapper = mongoCourseMapper;
    this._courseModel = courseModel;
  }

  async find({}) {
    if (!this._courseModel)
      throw new Error("Course Model required for mongoCourseRepo");

    const courseDocs = await this._courseModel.find({}).lean();
    return Promise.all(
      courseDocs.map((c) =>
        this._mongoCourseMapper.toDomain({ courseDocument: c }),
      ),
    );
  }

  async findById({ id }) {
    if (!this._courseModel)
      throw new Error("Course Model required for mongoCourseRepo");

    const courseDocument = await this._courseModel.findById(id).lean();
    return this._mongoCourseMapper.toDomain({ courseDocument });
  }

  async create({ course }) {
    if (!this._courseModel)
      throw new Error("Course Model required for mongoCourseRepo");
    const persistenceData = this._mongoCourseMapper.toPersistence({ course });

    const courseDocument = await this._courseModel.create(persistenceData);

    return this._mongoCourseMapper.toDomain({
      courseDocument,
    });
  }

  async update({ id, courseUpdates }) {
    throw new Error("ICourseRepository.update must be implemented");
  }

  async delete({ id }) {
    throw new Error("ICourseRepository.delete must be implemented");
    if (!this._courseModel)
      throw new Error("Course Model required for mongoCourseRepo");

    const courseDocument = await this._courseModel.findByIdAndDelete(id).lean();
    return this._mongoCourseMapper.toDomain({ courseDocument });
  }
}

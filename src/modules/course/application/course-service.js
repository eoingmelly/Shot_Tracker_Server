const { Course } = require("../domain/entities/course");

class CourseService {
  constructor({ courseRepository, golferlookupAdapter }) {
    if (!courseRepository)
      throw new Error("CourseService requires { courseRepository }");

    this._courseRepository = courseRepository;
  }

  async getCourseById({ id }) {
    if (!id) throw new Error("CourseService.getCourseById requires { id }");

    const existingCourse = await this._courseRepository.findById({ id });

    return existingCourse;
  }

  async getCourses() {
    return await this._courseRepository.find({ includeInactive: false });
  }

  async createCourse({ course }) {
    return await this._courseRepository.create({ course });
  }

  async deleteCourse({ id }) {
    return await this._courseRepository.delete({ id });
  }
}

module.exports = { CourseService };

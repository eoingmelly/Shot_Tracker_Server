const { Course } = require("../domain/entities/course");

class CourseService {
  constructor({ courseRepository }) {
    if (!courseRepository)
      throw new Error("CourseService requires { courseRepository }");

    this._courseRepository = courseRepository;
  }

  async getCourseById({ id }) {
    if (!id) throw new Error("CourseService.getCourseById requires { id }");

    const existingCourse = await this._courseRepository.findbyId({ id });
    return existingCourse;
  }

  async getCourses() {
    return await this._courseRepository.find();
  }
}

module.exports = { CourseService };

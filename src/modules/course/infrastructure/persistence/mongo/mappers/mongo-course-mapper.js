const { Course } = require("../../../../domain/entities/course");

class MongoCourseMapper {
  constructor() {}

  toDomain({ courseDocument }) {
    if (!courseDocument) {
      throw new Error("CourseMapper.toDomain requires { courseDocument }");
    }

    return new Course({
      id: courseDocument._id.toString(),
      name: courseDocument.name,
      createdBy: courseDocument.createdBy,
      active: courseDocument.active,
    });
  }

  toPersistence({ course }) {
    if (!course) {
      throw new Error("CourseMapper.toPersistence requires { course }");
    }

    return {
      _id: course.id,
      name: course.name,
      active: course.active,
    };
  }
}

module.exports = { MongoCourseMapper };
